import { ResponseError } from '../utils/response-error.js'
import { validate } from '../validation/validation.js'
import {
    categoryIdValidationSchema,
    categoryNameValidationSchema,
    getCategoryValidationSchema,
    updateCategoryValidationSchema,
} from '../validation/category-validation.js'
import { prismaClient } from '../application/database.js'
import { errors } from '../utils/message-error.js'

const add = async (req) => {
    const { name } = validate(categoryNameValidationSchema, req.body)

    return prismaClient.$transaction(async (prisma) => {
        const countCategory = await prisma.category.count({
            where: {
                name: name,
            },
        })

        if (countCategory > 0) {
            throw new ResponseError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.CATEGORY.ALREADY_EXISTS
            )
        }

        return prisma.category.create({
            data: {
                name: name,
            },
            select: {
                name: true,
            },
        })
    })
}

const get = async (req) => {
    const { name, page, size, sortBy, orderBy } = validate(getCategoryValidationSchema, req.query)
    const skip = (page - 1) * size
    const filters = []

    if (sortBy) {
        if (sortBy !== 'id' && sortBy !== 'name') {
            throw new ResponseError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.SORT_BY.MUST_BE_VALID
            )
        }
    }

    if (name) {
        filters.push({
            name: {
                contains: name,
            },
        })
    }

    return prismaClient.$transaction(async (prisma) => {
        const categories = await prisma.category.findMany({
            where: {
                AND: filters,
            },
            select: {
                id: true,
                name: true,
                _count: {
                    select: {
                        blog: true,
                    },
                },
            },
            skip: skip,
            take: size,
            orderBy: {
                [sortBy]: orderBy,
            },
        })

        const totalItems = await prisma.category.count({
            where: {
                AND: filters,
            },
        })

        const result = categories.map((category) => {
            const { id, name, _count } = category
            return {
                id: id,
                name: name,
                totalBlog: _count.blog,
            }
        })

        return {
            data: result,
            pagination: {
                page: page,
                total_item: totalItems,
                total_page: Math.ceil(totalItems / size),
            },
        }
    })
}

const getById = async (req) => {
    const { id: categoryId } = validate(categoryIdValidationSchema, req.params)

    if (!parseInt(categoryId)) {
        throw new ResponseError(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.CATEGORY.ID.MUST_VALID
        )
    }

    return prismaClient.$transaction(async (prisma) => {
        const foundCategory = await prisma.category.findFirst({
            where: {
                id: parseInt(categoryId),
            },
            select: {
                id: true,
                name: true,
                isActive: true,
            },
        })

        if (!foundCategory) {
            throw new ResponseError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.CATEGORY.NOT_FOUND
            )
        }

        return foundCategory
    })
}

const update = async (req) => {
    const { name, isActive } = validate(updateCategoryValidationSchema, req.body)
    const { id: categoryId } = validate(categoryIdValidationSchema, req.params)

    if (!parseInt(categoryId)) {
        throw new ResponseError(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.CATEGORY.ID.MUST_VALID
        )
    }

    return prismaClient.$transaction(async (prisma) => {
        const findCategory = await prisma.category.findUnique({
            where: {
                id: parseInt(categoryId),
            },
        })

        if (!findCategory) {
            throw new ResponseError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.CATEGORY.NOT_FOUND
            )
        }

        const findCategoryByName = await prisma.category.findUnique({
            where: {
                name: name || '',
            },
        })

        if (findCategoryByName) {
            throw new ResponseError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.CATEGORY.ALREADY_EXISTS
            )
        }

        return prisma.category.update({
            where: {
                id: parseInt(categoryId),
            },
            data: {
                name: name,
                isActive: isActive,
            },
            select: {
                id: true,
                name: true,
                isActive: true,
            },
        })
    })
}

const remove = async (req) => {
    const { id: categoryId } = validate(categoryIdValidationSchema, req.params)

    if (!parseInt(categoryId)) {
        throw new ResponseError(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.CATEGORY.ID.MUST_VALID
        )
    }

    return prismaClient.$transaction(async (prisma) => {
        const countCategory = await prisma.category.count({
            where: {
                id: parseInt(categoryId),
            },
        })

        if (countCategory === 0) {
            throw new ResponseError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.CATEGORY.NOT_FOUND
            )
        }

        await prisma.category.delete({
            where: {
                id: parseInt(categoryId),
            },
        })
    })
}

export default { add, get, getById, update, remove }
