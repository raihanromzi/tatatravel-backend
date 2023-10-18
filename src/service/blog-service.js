import { validate } from '../validation/validation.js'
import {
    addBlogValidationSchema,
    idBlogValidationSchema,
    imagesValidationSchema,
    searchBlogValidationSchema,
} from '../validation/blog-validation.js'
import { MulterError, MulterErrorMultipleImages, ResponseError } from '../utils/response-error.js'
import { prismaClient } from '../application/database.js'
import { errors } from '../utils/message-error.js'
import fs from 'fs/promises'
import { userIdValidationSchema } from '../validation/user-validation.js'

const add = async (req) => {
    const {
        categoryId: categoryIdExist,
        title: titleExist,
        slug: slugExist,
        desc: descExist,
        content: contentExist,
    } = req.body

    if (!categoryIdExist || !titleExist || !slugExist || !descExist || !contentExist) {
        throw new MulterError(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.BLOG.FAILED_ADD,
            req.files
        )
    }

    const { categoryId, title, slug, desc, content } = validate(addBlogValidationSchema, req.body)
    const { id: userId } = validate(userIdValidationSchema, { id: req.user.id })
    const images = validate(imagesValidationSchema, req.files)

    const imgDetail = images
        .filter((image) => image.fieldname === 'imgDetail')
        .map((image) => ({
            id: null,
            filename: image.filename,
            path: image.path,
        }))
    const imgHead = images
        .filter((image) => image.fieldname === 'imgHead')
        .map((image) => ({
            filename: image.filename,
            path: image.path,
        }))

    if (imgDetail.length === 0 || imgHead.length === 0) {
        throw new MulterError(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.BLOG.IMAGES.IS_REQUIRED,
            req.files
        )
    }

    return prismaClient.$transaction(async (prisma) => {
        const findUser = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        })

        if (!findUser) {
            throw new MulterErrorMultipleImages(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.USER.NOT_FOUND,
                [imgDetail, imgHead]
            )
        }

        const findCategory = await prisma.category.findUnique({
            where: {
                id: categoryId,
            },
            select: {
                isActive: true,
            },
        })

        if (!findCategory) {
            throw new MulterErrorMultipleImages(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.CATEGORY.NOT_FOUND,
                [imgDetail, imgHead]
            )
        }

        const { isActive } = findCategory

        if (isActive === false) {
            throw new MulterErrorMultipleImages(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.CATEGORY.NOT_ACTIVE,
                [imgDetail, imgHead]
            )
        }

        const validSlug = slug.split(' ').join('-')

        const findSlug = await prisma.blog.findUnique({
            where: {
                slug: validSlug,
            },
        })

        if (findSlug) {
            throw new MulterErrorMultipleImages(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.BLOG.SLUG.ALREADY_EXISTS,
                [imgDetail, imgHead]
            )
        }

        const newBlog = await prisma.blog.create({
            data: {
                user: {
                    connect: {
                        id: userId,
                    },
                },
                category: {
                    connect: {
                        id: categoryId,
                    },
                },
                title: title,
                imgHead: imgHead[0].path,
                slug: validSlug,
                desc: desc,
                content: content,
                imgDetail: {
                    createMany: {
                        data: imgDetail.map((image) => {
                            const { path } = image
                            return {
                                image: path,
                            }
                        }),
                    },
                },
            },
            select: {
                id: true,
                imgDetail: {
                    select: {
                        id: true,
                        image: true,
                    },
                },
                title: true,
                imgHead: true,
                slug: true,
                desc: true,
            },
        })

        if (!newBlog) {
            throw new MulterErrorMultipleImages(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.BLOG.FAILED_ADD,
                [imgDetail, imgHead]
            )
        }

        const { id: newBlogId, imgDetail: newBlogImagesDetail } = newBlog

        for (const newBlogImageDetail in newBlogImagesDetail) {
            const { id, image: path } = newBlogImagesDetail[newBlogImageDetail]
            for (const oldBlogImageDetail of imgDetail) {
                if (id === null) {
                    if (oldBlogImageDetail.path === path) {
                        oldBlogImageDetail.id = id
                    }
                }
            }
        }

        try {
            await fs.mkdir(`public/images/blog/${newBlogId}/details`, { recursive: true })
            await fs.mkdir(`public/images/blog/${newBlogId}/header`, { recursive: true })
        } catch (error) {
            throw new MulterErrorMultipleImages(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.BLOG.FAILED_TO_CREATE_DIRECTORY,
                [imgDetail, imgHead]
            )
        }

        await Promise.all(
            imgHead.map(async (image) => {
                const { path, filename } = image
                const oldPath = path
                const newPath = `public/images/blog/${newBlogId}/header/${filename}`

                try {
                    await prisma.blog.update({
                        where: {
                            id: newBlogId,
                        },
                        data: {
                            imgHead: newPath,
                        },
                    })
                    await fs.rename(oldPath, newPath)
                    return newPath
                } catch (e) {
                    const deleteBlogAndImages = async () => {
                        await fs.rm(`public/images/blog/${newBlogId}/header`, {
                            recursive: true,
                            force: true,
                        })
                        await prisma.blog.delete({
                            where: {
                                id: newBlogId,
                            },
                        })
                        await fs.rm(oldPath, { recursive: true, force: true })
                    }

                    return deleteBlogAndImages().catch(() => {
                        throw new ResponseError(
                            errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                            errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                            errors.BLOG.FAILED_ADD
                        )
                    })
                }
            })
        )

        await Promise.all(
            imgDetail.map(async (image) => {
                const { path, filename, id: IdDetailImage } = image
                const oldPath = path
                const newPath = `public/images/blog/${newBlogId}/details/${filename}`

                try {
                    await prisma.blogImage.updateMany({
                        where: {
                            blogId: newBlogId,
                        },
                        data: {
                            image: newPath,
                        },
                    })
                    await fs.rename(oldPath, newPath)
                    return newPath
                } catch (e) {
                    const deleteBlogAndImages = async () => {
                        await fs.rm(`public/images/blog/${newBlogId}/details`, {
                            recursive: true,
                            force: true,
                        })
                        await prisma.blog.deleteMany({
                            where: {
                                id: IdDetailImage,
                            },
                        })
                        await fs.rm(oldPath, { recursive: true, force: true })
                    }

                    return deleteBlogAndImages().catch((error) => {
                        throw new MulterErrorMultipleImages(
                            errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                            errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                            error,
                            [imgDetail, imgHead]
                        )
                    })
                }
            })
        )

        const result = await prisma.blog.findUnique({
            where: {
                id: newBlogId,
            },
            select: {
                id: true,
                title: true,
                desc: true,
                slug: true,
                imgHead: true,
                imgDetail: {
                    select: {
                        image: true,
                    },
                },
            },
        })

        const {
            id: resultId,
            title: resultTitle,
            desc: resultDesc,
            slug: resultSlug,
            imgHead: imgHeadPath,
            imgDetail: imgDetailPath,
        } = result

        return {
            id: resultId,
            title: resultTitle,
            desc: resultDesc,
            slug: resultSlug,
            imgHead: imgHeadPath,
            imgDetail: imgDetailPath.map((image) => image.image),
        }
    })
}

const getById = async (req) => {
    const { id } = validate(idBlogValidationSchema, req.params)

    return prismaClient.$transaction(async (prisma) => {
        const result = await prisma.blog.findMany({
            where: {
                id: parseInt(id),
            },
            select: {
                title: true,
                slug: true,
                desc: true,
                content: true,
                imgDetail: {
                    select: {
                        image: true,
                    },
                },
                user: {
                    select: {
                        fullName: true,
                        userName: true,
                        avatar: true,
                    },
                },
                category: {
                    select: {
                        name: true,
                    },
                },
            },
        })

        if (result.length === 0) {
            throw new ResponseError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.BLOG.NOT_FOUND
            )
        }

        return result
    })
}

const get = async (req) => {
    const query = validate(searchBlogValidationSchema, req.query)
    const { page, size, sortBy, orderBy, title, description } = query
    const skip = (page - 1) * size
    const filters = []

    if (sortBy) {
        if (
            sortBy !== 'id' &&
            sortBy !== 'title' &&
            sortBy !== 'slug' &&
            sortBy !== 'description' &&
            sortBy !== 'content'
        ) {
            throw new ResponseError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.SORT_BY.MUST_VALID
            )
        }
    }

    if (title) {
        filters.push({
            title: {
                contains: title,
            },
        })
    }

    if (description) {
        filters.push({
            description: {
                contains: description,
            },
        })
    }

    return prismaClient.$transaction(async (prisma) => {
        const blogs = await prisma.blog.findMany({
            where: {
                AND: filters,
            },
            select: {
                title: true,
                desc: true,
                imgDetail: {
                    select: {
                        image: true,
                    },
                },
                user: {
                    select: {
                        fullName: true,
                        userName: true,
                        avatar: true,
                    },
                },
                category: {
                    select: {
                        name: true,
                    },
                },
            },
            take: size,
            skip: skip,
            orderBy: {
                [sortBy]: orderBy,
            },
        })

        const totalItems = await prisma.blog.count({
            where: {
                AND: filters,
            },
        })

        return {
            data: blogs,
            pagination: {
                page: page,
                total_item: totalItems,
                total_page: Math.ceil(totalItems / size),
            },
        }
    })
}

const remove = async (req) => {
    const { id } = validate(idBlogValidationSchema, req.params)

    return prismaClient.$transaction(async (prisma) => {
        const findBlog = await prisma.blog.findUnique({
            where: {
                id: parseInt(id),
            },
            select: {
                id: true,
                BlogImage: {
                    select: {
                        id: true,
                        image: true,
                    },
                },
            },
        })

        if (!findBlog) {
            throw new ResponseError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.BLOG.NOT_FOUND
            )
        }

        await prisma.blog.delete({
            where: {
                id: parseInt(id),
            },
        })

        try {
            await fs.rm(`public/images/blog/${id}`, { recursive: true, force: true })
        } catch (error) {
            throw new ResponseError(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.BLOG.FAILED_TO_DELETE_DIRECTORY
            )
        }
    })
}

const update = async (req) => {
    const params = validate(idBlogValidationSchema, req.params)
    const blog = validate(addBlogValidationSchema, req.body)
    const images = validate(imagesValidationSchema, req.files)
    const blogImages = images.map((image) => {
        return {
            id: null,
            filename: image.filename,
            path: image.path,
        }
    })
    const { categoryId, title, slug, description, content } = blog
    const { id: blogId } = params
    const data = {}

    if (title) {
        data.title = title
    }

    if (description) {
        data.description = description
    }

    if (content) {
        data.content = content
    }

    if (slug) {
        data.slug = slug
    }

    if (images) {
        data.BlogImage = {
            createMany: {
                data: blogImages.map((image) => {
                    const { path } = image
                    return {
                        image: path,
                    }
                }),
            },
        }
    }

    return prismaClient.$transaction(async (prisma) => {
        const findBlog = await prisma.blog.findUnique({
            where: {
                id: parseInt(blogId),
            },
        })

        if (!findBlog) {
            throw new MulterError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.BLOG.NOT_FOUND,
                blogImages
            )
        }

        const findCategory = await prisma.category.findUnique({
            where: {
                id: categoryId,
            },
        })

        if (!findCategory) {
            throw new MulterError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.CATEGORY.NOT_FOUND,
                blogImages
            )
        }

        const { isActive } = findCategory

        if (isActive === false) {
            throw new MulterError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.CATEGORY.NOT_ACTIVE,
                blogImages
            )
        }

        const validSlug = slug.split(' ').join('-')

        const findSlug = await prisma.blog.findUnique({
            where: {
                slug: validSlug,
                NOT: {
                    id: parseInt(blogId),
                },
            },
        })

        if (findSlug) {
            throw new MulterError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.BLOG.SLUG.ALREADY_EXISTS,
                blogImages
            )
        }

        try {
            await fs.access(`public/images/blog/${blogId}`)
        } catch (error) {
            throw new MulterError(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.BLOG.FAILED_TO_FIND_DIRECTORY,
                blogImages
            )
        }

        const updatedBlog = await prisma.blog.update({
            where: {
                id: parseInt(blogId),
            },
            data: data,
            select: {
                id: true,
                imgDetail: {
                    select: {
                        id: true,
                        image: true,
                    },
                },
                title: true,
                slug: true,
                desc: true,
            },
        })

        if (!updatedBlog) {
            throw new MulterError(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.BLOG.FAILED_UPDATE,
                blogImages
            )
        }

        for (const image in updatedBlog.imgDetail) {
            const { id, image: path } = updatedBlog.imgDetail[image]
            for (const image of blogImages) {
                if (image.id === null) {
                    if (image.path === path) {
                        image.id = id
                    }
                }
            }
        }

        await Promise.all(
            blogImages.map(async (image) => {
                const { path, filename, id: imageBlogId } = image
                const oldPath = path
                const newPath = `public/images/blog/${blogId}/${filename}`

                try {
                    await fs.rename(oldPath, newPath)
                    await prisma.blogImage.update({
                        where: {
                            id: imageBlogId,
                        },
                        data: {
                            image: newPath,
                        },
                    })

                    return newPath
                } catch (e) {
                    throw new ResponseError(
                        errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                        errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                        errors.BLOG.FAILED_UPDATE
                    )
                }
            })
        )

        return updatedBlog
    })
}

export default { add, getById, get, remove, update }
