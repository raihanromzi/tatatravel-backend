import { validate } from '../validation/validation.js'
import {
    addBlogValidationSchema,
    idBlogValidationSchema,
    imagesValidationSchema,
    searchBlogValidationSchema,
} from '../validation/blog-validation.js'
import { MulterError, ResponseError } from '../utils/response-error.js'
import { prismaClient } from '../application/database.js'
import { errors } from '../utils/message-error.js'
import fs from 'fs/promises'
import { logger } from '../application/logging.js'

const add = async (req) => {
    const blog = validate(addBlogValidationSchema, req.body)
    const images = validate(imagesValidationSchema, req.files)
    const blogImages = images.map((image) => {
        return {
            id: null,
            filename: image.filename,
            path: image.path,
        }
    })
    const { id: userId } = req.user
    const { categoryId, title, slug, description, content } = blog

    return prismaClient.$transaction(async (prisma) => {
        const findUser = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        })

        if (!findUser) {
            throw new MulterError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.USER.NOT_FOUND,
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
                slug: validSlug,
                description: description,
                content: content,
                BlogImage: {
                    createMany: {
                        data: blogImages.map((image) => {
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
                BlogImage: {
                    select: {
                        id: true,
                        image: true,
                    },
                },
                title: true,
                slug: true,
                description: true,
            },
        })

        if (!newBlog) {
            throw new MulterError(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.BLOG.FAILED_ADD,
                blogImages
            )
        }

        for (const image in newBlog.BlogImage) {
            const { id, image: path } = newBlog.BlogImage[image]
            for (const image of blogImages) {
                if (image.id === null) {
                    if (image.path === path) {
                        image.id = id
                    }
                }
            }
        }

        const { id } = newBlog

        try {
            await fs.mkdir(`public/images/blog/${id}`, { recursive: true })
        } catch (error) {
            throw new MulterError(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.BLOG.FAILED_TO_CREATE_DIRECTORY,
                blogImages
            )
        }

        await Promise.all(
            blogImages.map(async (image) => {
                const { path, filename, id: imageBlogId } = image
                const oldPath = path
                const newPath = `public/images/blog/${id}/${filename}`

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
                    const deleteBlogAndImages = async () => {
                        await fs.rm(`public/images/blog/${id}`, { recursive: true, force: true })
                        await prisma.blog.deleteMany({
                            where: {
                                id: id,
                            },
                        })
                        await fs.rm(oldPath, { recursive: true, force: true })
                    }

                    return deleteBlogAndImages()
                        .then(() => {
                            throw new MulterError(
                                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                                errors.BLOG.FAILED_ADD,
                                blogImages
                            )
                        })
                        .catch((error) => {
                            throw new MulterError(
                                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                                error,
                                blogImages
                            )
                        })
                }
            })
        )

        return newBlog
    })
}

const getById = async (req) => {
    const params = validate(idBlogValidationSchema, req.params)

    const { id } = params

    return prismaClient.$transaction(async (prisma) => {
        const result = await prisma.blog.findMany({
            where: {
                id: parseInt(id),
            },
            select: {
                title: true,
                slug: true,
                description: true,
                content: true,
                BlogImage: {
                    select: {
                        image: true,
                    },
                },
                user: {
                    select: {
                        fullName: true,
                        username: true,
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
                description: true,
                BlogImage: {
                    select: {
                        image: true,
                    },
                },
                user: {
                    select: {
                        fullName: true,
                        username: true,
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
    const params = validate(idBlogValidationSchema, req.params)
    const { id } = params

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
                BlogImage: {
                    select: {
                        id: true,
                        image: true,
                    },
                },
                title: true,
                slug: true,
                description: true,
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

        for (const image in updatedBlog.BlogImage) {
            logger.info(`masuk pak eko 1`)
            logger.info(updatedBlog.BlogImage[image])
        }

        for (const image of blogImages) {
            logger.info(`masuk pak eko 2`)
            logger.info(image)
        }

        for (const image in updatedBlog.BlogImage) {
            const { id, image: path } = updatedBlog.BlogImage[image]
            for (const image of blogImages) {
                if (image.id === null) {
                    if (image.path === path) {
                        image.id = id
                    }
                }
            }
        }

        for (const image of blogImages) {
            logger.info(`masuk pak eko 3`)
            logger.info(image)
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
