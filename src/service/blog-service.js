import { validate } from '../validation/validation.js'
import {
    addBlogValidationSchema,
    deleteBlogValidationSchema,
    imagesValidationSchema,
    updateBlogValidationSchema,
} from '../validation/blog-validation.js'
import { ResponseError } from '../utils/response-error.js'
import { prismaClient } from '../application/database.js'
import { errors } from '../utils/message-error.js'

const add = async (req) => {
    const blog = validate(addBlogValidationSchema, req.body)

    const images = validate(imagesValidationSchema, req.files)

    const { id: userId } = req.user

    const { categoryId, title, slug, description, content } = blog

    const { path } = images

    return prismaClient.$transaction(async (prisma) => {
        const findUser = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        })

        if (!findUser) {
            throw new ResponseError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.USER.NOT_FOUND
            )
        }

        const findCategory = await prisma.category.findUnique({
            where: {
                id: categoryId,
            },
        })

        if (!findCategory) {
            throw new ResponseError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.CATEGORY.NOT_FOUND
            )
        }

        const validSlug = slug.split(' ').join('-')

        const findSlug = await prisma.blog.findUnique({
            where: {
                slug: validSlug,
            },
        })

        if (findSlug) {
            throw new ResponseError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.BLOG.SLUG.ALREADY_EXISTS
            )
        }

        const result = await prisma.blog.create({
            data: {
                category: {
                    connect: {
                        id: categoryId,
                    },
                },
                user: {
                    connect: {
                        id: userId,
                    },
                },
                title: title,
                slug: validSlug,
                description: description,
                content: content,
            },
            select: {
                id: true,
                title: true,
                slug: true,
            },
            include: {
                category: {
                    select: {
                        name: true,
                    },
                },
                user: {
                    select: {
                        username: true,
                    },
                },
            },
        })

        if (!result) {
            throw new ResponseError(500, 'Internal Server Error', 'Failed to add blog')
        }

        return result
    })
}

const update = async (reqm) => {
    const blog = validate(updateBlogValidationSchema, req)

    const blogData = await prismaClient.blog.findUnique({
        where: {
            id: blog.id,
        },
        select: {
            id: true,
            title: true,
            slug: true,
        },
    })

    if (!blogData) {
        throw new ResponseError(404, 'Not Found', 'Blog not found')
    }

    const result = await prismaClient.blog.update({
        where: {
            id: blog.id,
        },
        data: {
            category: {
                connect: {
                    id: blog.categoryId,
                },
            },
            user: {
                connect: {
                    id: blog.authorId,
                },
            },
            title: blog.title,
            slug: blog.slug,
            description: blog.description,
            content: blog.content,
        },
        select: {
            id: true,
            title: true,
            slug: true,
        },
    })

    if (!result) {
        throw new ResponseError(500, 'Internal Server Error', 'Failed to update blog')
    }

    return result
}

const remove = async (id) => {
    id = validate(deleteBlogValidationSchema, id)

    const blog = await prismaClient.blog.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
        },
    })

    if (!blog) {
        throw new ResponseError(404, 'Not Found', 'Blog not found')
    }

    const result = await prismaClient.blog.delete({
        where: {
            id: id,
        },
    })

    if (!result) {
        throw new ResponseError(500, 'Internal Server Error', 'Failed to delete blog')
    }

    return result
}

const get = async (id) => {
    id = validate(deleteBlogValidationSchema, id)

    const blog = await prismaClient.blog.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            user: {
                select: {
                    username: true,
                },
            },
            category: {
                select: {
                    name: true,
                },
            },
        },
    })

    if (!blog) {
        throw new ResponseError(404, 'Not Found', 'Blog not found')
    }

    return blog
}

// const search = async (request) => {}

const getAll = async (request) => {
    const page = request.page
    const size = request.size

    const blogs = await prismaClient.blog.findMany({
        skip: (page - 1) * size,
        take: size,
        select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            user: {
                select: {
                    username: true,
                },
            },
            category: {
                select: {
                    name: true,
                },
            },
        },
    })

    return blogs
}

export default { add, update, remove, get, getAll }
