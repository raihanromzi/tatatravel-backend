import { validate } from '../validation/validation.js'
import {
    addBlogValidationSchema,
    deleteBlogValidationSchema,
    updateBlogValidationSchema,
} from '../validation/blog-validation.js'
import { ResponseError } from '../utils/response-error.js'
import { prismaClient } from '../application/database.js'

const add = async (request) => {
    request = validate(addBlogValidationSchema, request)

    const countTitle = await prismaClient.blog.count({
        where: {
            title: request.title,
        },
    })

    if (countTitle > 0) {
        throw new ResponseError(400, 'Bad Request', 'title already exist')
    }

    const result = await prismaClient.blog.create({
        data: {
            category: {
                connect: {
                    id: request.categoryId,
                },
            },
            user: {
                connect: {
                    id: request.authorId,
                },
            },
            title: request.title,
            slug: request.slug,
            description: request.description,
            content: request.content,
        },
        select: {
            id: true,
            title: true,
            slug: true,
        },
    })

    if (!result) {
        throw new ResponseError(500, 'Internal Server Error', 'Failed to add blog')
    }

    return result
}

const update = async (request) => {
    const blog = validate(updateBlogValidationSchema, request)

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
