import { validate } from '../validation/validation.js'
import {
    addBlogValidationSchema,
    getBlogValidationSchema,
    idBlogValidationSchema,
    imagesValidationSchema,
    updateBlogValidationSchema,
} from '../validation/blog-validation.js'
import { MulterError, MulterErrorMultipleImages, ResponseError } from '../utils/response-error.js'
import { prismaClient } from '../application/database.js'
import { errors } from '../utils/message-error.js'
import fs from 'fs/promises'
import { clearDirectory } from '../utils/clear-directory.js'

const add = async (req) => {
    // validate request body, should exist
    const {
        categoryId: categoryIdExist,
        title: titleExist,
        slug: slugExist,
        desc: descExist,
        content: contentExist,
        imgHead: imgHeadExist,
        imgDetail: imgDetailExist,
    } = req.body

    if (
        (!categoryIdExist || !titleExist || !slugExist || !descExist || !contentExist) &&
        req.files
    ) {
        throw new MulterError(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.BLOG.BAD_REQUEST,
            req.files
        )
    }

    // imgHead and imgDetail should exist
    if (imgDetailExist === '' || imgHeadExist === '') {
        if (req.files) {
            throw new MulterError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.BLOG.IMAGES.IS_REQUIRED,
                req.files
            )
        } else {
            throw new ResponseError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.BLOG.IMAGES.IS_REQUIRED
            )
        }
    }

    const { categoryId, title, slug, desc, content } = validate(addBlogValidationSchema, req.body)
    const images = validate(imagesValidationSchema, req.files)
    const { id: userId } = req.user

    if (!parseInt(categoryId)) {
        throw new ResponseError(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.CATEGORY.ID.MUST_VALID
        )
    }

    if (
        !images.every((image) => image.fieldname === 'imgDetail' || image.fieldname === 'imgHead')
    ) {
        throw new MulterError(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.BLOG.IMAGES.IS_REQUIRED,
            req.files
        )
    }

    const { imgDetail, imgHead } = images.reduce(
        (result, image) => {
            if (image.fieldname === 'imgDetail') {
                result.imgDetail.push({
                    id: null,
                    filename: image.filename,
                    path: image.path,
                })
            } else if (image.fieldname === 'imgHead') {
                result.imgHead.push({
                    filename: image.filename,
                    path: image.path,
                })
            }
            return result
        },
        { imgDetail: [], imgHead: [] }
    )

    if (imgDetail.length === 0 || imgHead.length === 0) {
        throw new MulterError(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.BLOG.IMAGES.IS_REQUIRED,
            req.files
        )
    }

    if (imgHead && imgHead.length > 1) {
        throw new MulterErrorMultipleImages(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.BLOG.IMAGES.HEADER_IMAGE_MUST_BE_ONE,
            [imgDetail, imgHead]
        )
    }

    return prismaClient.$transaction(async (prisma) => {
        const findUser = await prisma.user.findUnique({
            where: {
                id: parseInt(userId),
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
                id: parseInt(categoryId),
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

        let newBlog = null

        try {
            newBlog = await prisma.blog.create({
                data: {
                    user: {
                        connect: {
                            id: parseInt(userId),
                        },
                    },
                    category: {
                        connect: {
                            id: parseInt(categoryId),
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
        } catch (error) {
            throw new MulterErrorMultipleImages(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.BLOG.FAILED_ADD,
                [imgDetail, imgHead]
            )
        }

        const { id: newBlogId, imgDetail: newBlogImagesDetail } = newBlog

        // update id for imgDetail
        newBlogImagesDetail.forEach(({ id, image: path }) => {
            const matchingOldImage = imgDetail.find(
                (oldBlogImageDetail) =>
                    oldBlogImageDetail.id === null && oldBlogImageDetail.path === path
            )

            if (matchingOldImage) {
                matchingOldImage.id = id
            }
        })

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
                const urlSavedToDB = `images/blog/${newBlogId}/header/${filename}`

                try {
                    await prisma.blog.update({
                        where: {
                            id: newBlogId,
                        },
                        data: {
                            imgHead: urlSavedToDB,
                        },
                    })
                    await fs.rename(oldPath, newPath)
                } catch (e) {
                    const deleteBlogAndImages = async () => {
                        await fs.rm(`public/images/blog/${newBlogId}/header`, {
                            recursive: true,
                            force: true,
                        })
                        await fs.unlink(oldPath)
                        await prisma.blog.delete({
                            where: {
                                id: newBlogId,
                            },
                        })
                    }

                    return deleteBlogAndImages().then(() => {
                        throw new MulterErrorMultipleImages(
                            errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                            errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                            errors.BLOG.FAILED_ADD,
                            [imgDetail, imgHead]
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
                const urlSavedToDB = `images/blog/${newBlogId}/details/${filename}`

                try {
                    await prisma.blogImage.update({
                        where: {
                            id: IdDetailImage,
                        },
                        data: {
                            image: urlSavedToDB,
                        },
                    })
                    await fs.rename(oldPath, newPath)
                } catch (e) {
                    const deleteBlogAndImages = async () => {
                        await fs.rm(`public/images/blog/${newBlogId}/details`, {
                            recursive: true,
                            force: true,
                        })
                        await fs.unlink(oldPath)
                        await prisma.blog.deleteMany({
                            where: {
                                id: IdDetailImage,
                            },
                        })
                    }

                    return deleteBlogAndImages().then(() => {
                        throw new MulterErrorMultipleImages(
                            errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                            errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                            errors.BLOG.FAILED_ADD,
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

    if (!parseInt(id)) {
        throw new ResponseError(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.BLOG.ID.MUST_VALID
        )
    }

    return prismaClient.$transaction(async (prisma) => {
        const result = await prisma.blog.findUnique({
            where: {
                id: parseInt(id),
            },
            select: {
                id: true,
                title: true,
                slug: true,
                desc: true,
                isActive: true,
                content: true,
                imgHead: true,
                imgDetail: {
                    select: {
                        image: true,
                    },
                },
                user: {
                    select: {
                        userName: true,
                        avatar: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                createdAt: true,
            },
        })

        if (!result) {
            throw new ResponseError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.BLOG.NOT_FOUND
            )
        }

        const {
            id: resultId,
            title,
            slug,
            desc,
            isActive,
            content,
            imgHead,
            imgDetail,
            user,
            category,
            createdAt,
        } = result

        return {
            id: resultId,
            title: title,
            author: user,
            slug: slug,
            category: category.name,
            desc: desc,
            isActive: isActive,
            content: content,
            imgHead: imgHead,
            imgDetail: imgDetail.map((image) => image.image),
            createdAt: createdAt,
        }
    })
}

const get = async (req) => {
    const { page, size, sortBy, orderBy } = validate(getBlogValidationSchema, req.query)
    const { sl, s, c } = req.query
    const skip = (page - 1) * size
    const filters = []

    if (sortBy) {
        if (sortBy !== 'sl' && sortBy !== 's' && sortBy !== 'c' && sortBy !== 'createdAt') {
            throw new ResponseError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.SORT_BY.MUST_BE_VALID
            )
        }
    }

    if (sl) {
        filters.push({
            slug: sl,
        })
    }

    if (c) {
        filters.push({
            category: {
                name: {
                    contains: c,
                },
            },
        })
    }

    if (s) {
        filters.push({
            OR: [
                {
                    title: {
                        contains: s,
                    },
                },
                {
                    desc: {
                        contains: s,
                    },
                },
            ],
        })
    }

    return prismaClient.$transaction(async (prisma) => {
        const blogs = await prisma.blog.findMany({
            where: {
                isActive: true,
                AND: filters,
            },
            select: {
                id: true,
                title: true,
                desc: true,
                isActive: true,
                content: true,
                imgHead: true,
                imgDetail: {
                    select: {
                        image: true,
                    },
                },
                user: {
                    select: {
                        userName: true,
                        avatar: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                createdAt: true,
            },
            take: size,
            skip: skip,
            orderBy: {
                [sortBy]: orderBy,
            },
        })

        const totalItems = await prisma.blog.count({
            where: {
                isActive: true,
            },
        })

        for (let i = 0; i <= blogs.length - 1; i++) {
            const {
                id,
                title,
                desc,
                isActive,
                content,
                imgHead,
                imgDetail,
                user,
                category,
                createdAt,
            } = blogs[i]
            blogs[i] = {
                id: id,
                title: title,
                author: user,
                slug: slug,
                category: category.name,
                desc: desc,
                isActive: isActive,
                content: content,
                imgHead: imgHead,
                imgDetail: imgDetail.map((image) => image.image),
                createdAt: createdAt,
            }
        }

        return {
            data: blogs,
            pagination: {
                page: page,
                skip: skip,
                total_item: totalItems,
                total_page: Math.ceil(totalItems / size),
            },
        }
    })
}

const update = async (req) => {
    const { id: blogId } = validate(idBlogValidationSchema, req.params)

    const { categoryId, title, desc, content, isActive } = validate(
        updateBlogValidationSchema,
        req.body
    )
    const images = validate(imagesValidationSchema, req.files)
    const data = {}
    let imgHead = []
    let imgDetail = []

    console.log(req.body)

    if (!parseInt(blogId)) {
        throw new ResponseError(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.BLOG.ID.MUST_BE_VALID
        )
    }

    if (images && images.length > 0) {
        const { imgDetailVal, imgHeadVal } = images.reduce(
            (result, image) => {
                if (image.fieldname === 'imgDetail') {
                    result.imgDetailVal.push({
                        id: null,
                        filename: image.filename,
                        path: image.path,
                    })
                } else if (image.fieldname === 'imgHead') {
                    result.imgHeadVal.push({
                        filename: image.filename,
                        path: image.path,
                    })
                }
                return result
            },
            { imgDetailVal: [], imgHeadVal: [] }
        )

        imgHead = [...imgHeadVal]
        imgDetail = [...imgDetailVal]
    }

    if (imgHead.length > 1) {
        throw new MulterErrorMultipleImages(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.BLOG.IMAGES.HEADER_IMAGE_MUST_BE_ONE,
            [imgDetail, imgHead]
        )
    }

    if (imgHead?.length > 0) {
        data.imgHead = imgHead[0].path
    }

    if (imgDetail?.length > 0) {
        data.imgDetail = {
            createMany: {
                data: imgDetail.map((image) => {
                    const { path } = image
                    return {
                        image: path,
                    }
                }),
            },
        }
    }

    if (title) {
        data.title = title
    }

    if (desc) {
        data.desc = desc
    }

    if (content) {
        data.content = content
    }

    if (categoryId) {
        data.category = {
            connect: {
                id: parseInt(categoryId),
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
            throw new MulterErrorMultipleImages(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.BLOG.NOT_FOUND,
                [imgDetail, imgHead]
            )
        }

        // category check
        if (categoryId) {
            const findCategory = await prisma.category.findUnique({
                where: {
                    id: parseInt(categoryId),
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
        }

        if (imgHead.length > 0 || imgDetail.length > 0) {
            try {
                await fs.access(`public/images/blog/${blogId}/details`)
                await fs.access(`public/images/blog/${blogId}/header`)
            } catch (error) {
                throw new MulterErrorMultipleImages(
                    errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                    errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                    errors.BLOG.FAILED_TO_FIND_DIRECTORY,
                    [imgDetail, imgHead]
                )
            }
        }
        let updatedBlog = null

        console.log()

        try {
            if (imgDetail.length > 0) {
                await prisma.blogImage.deleteMany({
                    where: {
                        blogId: parseInt(blogId),
                    },
                })
            }

            console.log('run this code')
            updatedBlog = await prisma.blog.update({
                where: {
                    id: parseInt(blogId),
                },
                data: {
                    ...data,
                    isActive: isActive,
                    updatedAt: new Date(),
                },
                select: {
                    imgDetail: true,
                },
            })
        } catch (error) {
            if (error) {
                throw new MulterErrorMultipleImages(
                    errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                    errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                    errors.BLOG.FAILED_UPDATE,
                    [imgDetail, imgHead]
                )
            }
        }

        const { imgDetail: updatedBlogImageDetail } = updatedBlog

        // update id for imgDetail
        if (imgDetail.length > 0) {
            updatedBlogImageDetail.forEach(({ id, image: path }) => {
                const matchingOldImage = imgDetail.find(
                    (oldBlogImageDetail) =>
                        oldBlogImageDetail.id === null && oldBlogImageDetail.path === path
                )

                if (matchingOldImage) {
                    matchingOldImage.id = id
                }
            })

            try {
                await clearDirectory(`public/images/blog/${blogId}/details`)
                await Promise.all(
                    imgDetail.map(async (image) => {
                        const { path, filename, id: IdDetailImage } = image
                        const oldPath = path
                        const newPath = `public/images/blog/${blogId}/details/${filename}`
                        const urlSavedToDB = `images/blog/${blogId}/details/${filename}`

                        await prisma.blogImage.update({
                            where: {
                                id: IdDetailImage,
                            },
                            data: {
                                image: urlSavedToDB,
                            },
                        })
                        await fs.rename(oldPath, newPath)
                    })
                )
            } catch (e) {
                throw new MulterError(
                    errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                    errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                    errors.BLOG.FAILED_ADD,
                    imgDetail
                )
            }
        }
        // imgHead
        if (imgHead.length > 0) {
            try {
                await clearDirectory(`public/images/blog/${blogId}/header`)
                await Promise.all(
                    imgHead.map(async (image) => {
                        const { path, filename } = image
                        const oldPath = path
                        const newPath = `public/images/blog/${blogId}/header/${filename}`
                        const urlSavedToDB = `images/blog/${blogId}/header/${filename}`

                        await prisma.blog.update({
                            where: {
                                id: parseInt(blogId),
                            },
                            data: {
                                imgHead: urlSavedToDB,
                            },
                        })

                        await fs.rename(oldPath, newPath)
                    })
                )
            } catch (e) {
                throw new MulterError(
                    errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                    errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                    errors.BLOG.FAILED_UPDATE,
                    imgHead
                )
            }
        }

        const result = await prisma.blog.findUnique({
            where: {
                id: parseInt(blogId),
            },
            select: {
                id: true,
                title: true,
                desc: true,
                isActive: true,
                slug: true,
                category: {
                    select: {
                        name: true,
                    },
                },
                imgHead: true,
                imgDetail: {
                    select: {
                        image: true,
                    },
                },
                createdAt: true,
                updatedAt: true,
            },
        })

        const {
            id: resultId,
            title: resultTitle,
            desc: resultDesc,
            isActive: resultIsActive,
            slug: resultSlug,
            category: { name: resultCategory },
            imgHead: resultImgHead,
            imgDetail: resultImgDetail,
            createdAt: resultCreatedAt,
            updatedAt: resultUpdatedAt,
        } = result

        return {
            id: resultId,
            title: resultTitle,
            desc: resultDesc,
            isActive: resultIsActive,
            slug: resultSlug,
            category: resultCategory,
            imgHead: resultImgHead,
            imgDetail: resultImgDetail.map((image) => image.image),
            createdAt: resultCreatedAt,
            updatedAt: resultUpdatedAt,
        }
    })
}

const remove = async (req) => {
    const { id } = validate(idBlogValidationSchema, req.params)

    if (!parseInt(id)) {
        throw new ResponseError(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.BLOG.ID.MUST_VALID
        )
    }

    return prismaClient.$transaction(async (prisma) => {
        const findBlog = await prisma.blog.findUnique({
            where: {
                id: parseInt(id),
            },
            select: {
                id: true,
                imgDetail: {
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

        await prisma.blogImage.deleteMany({
            where: {
                blogId: parseInt(id),
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

const removeImg = async (req) => {
    const { id } = validate(idBlogValidationSchema, req.params)
    const { imgDetailURL } = req.body

    if (!parseInt(id)) {
        throw new ResponseError(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.BLOG.ID.MUST_VALID
        )
    }

    return prismaClient.$transaction(async (prisma) => {
        const findBlog = await prisma.blog.findUnique({
            where: {
                id: parseInt(id),
            },
            select: {
                id: true,
                imgDetail: {
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

        await prisma.blogImage.deleteMany({
            where: {
                AND: [{ blogId: parseInt(id) }, { name: imgDetailURL }],
            },
        })

        try {
            await fs.rm(`public/images/blog/${id}/${imgDetailURL}`, {
                recursive: true,
                force: true,
            })
        } catch (error) {
            throw new ResponseError(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.BLOG.FAILED_TO_DELETE_DIRECTORY
            )
        }
    })
}

export default { add, getById, get, update, remove, removeImg }
