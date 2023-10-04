import { ResponseError } from '../utils/response-error.js'
import { validate } from '../validation/validation.js'
import {
    addOrUpdateCategoryValidationSchema,
    getCategoryValidationSchema,
    idCategoryValidationSchema,
} from '../validation/category-validation.js'
import { prismaClient } from '../application/database.js'
import { errors } from '../utils/message-error.js'

const add = async (req) => {
    const category = validate(addOrUpdateCategoryValidationSchema, req.body)
    const { name, isActive } = category

    return prismaClient.$transaction(async (prisma) => {
        const countCategory = await prisma.category.count({
            where: {
                name: name,
            },
        })

        if (countCategory === 1) {
            throw new ResponseError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.CATEGORY.ALREADY_EXISTS
            )
        }

        const result = await prisma.category.create({
            data: {
                name: name,
                isActive: isActive,
            },
            select: {
                name: true,
                isActive: true,
            },
        })

        if (!result) {
            throw new ResponseError(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.CATEGORY.FAILED_TO_ADD
            )
        }

        return result
    })
}

const update = async (req) => {
    const category = validate(addOrUpdateCategoryValidationSchema, req.body)
    const params = validate(idCategoryValidationSchema, req.params)
    const { name, isActive } = category
    const { id: categoryId } = params

    return prismaClient.$transaction(async (prisma) => {
        const foundCategory = await prisma.category.findUnique({
            where: {
                id: categoryId,
            },
        })

        if (!foundCategory) {
            throw new ResponseError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.CATEGORY.NOT_FOUND
            )
        }

        const result = await prisma.category.update({
            where: {
                id: categoryId,
            },
            data: {
                name: name,
                isActive: isActive,
            },
            select: {
                name: true,
                isActive: true,
            },
        })

        if (!result) {
            throw new ResponseError(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.CATEGORY.FAILED_TO_UPDATE
            )
        }

        return result
    })
}

const remove = async (req) => {
    const params = validate(idCategoryValidationSchema, req.params)
    const { id: categoryId } = params

    return prismaClient.$transaction(async (prisma) => {
        const countCategory = await prisma.category.count({
            where: {
                id: categoryId,
            },
        })

        if (countCategory === 0) {
            throw new ResponseError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.CATEGORY.NOT_FOUND
            )
        }

        const result = await prisma.category.delete({
            where: {
                id: categoryId,
            },
        })

        if (!result) {
            throw new ResponseError(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.CATEGORY.FAILED_TO_DELETE
            )
        }
    })
}

const get = async (req) => {
    const query = validate(getCategoryValidationSchema, req.query)
    const { name, page, size } = query
    const skip = (page - 1) * size
    const filters = []

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
                isActive: true,
            },
            skip: skip,
            take: size,
        })

        const totalItems = await prisma.category.count({
            where: {
                AND: filters,
            },
        })

        return {
            data: categories,
            pagination: {
                page: page,
                total_item: totalItems,
                total_page: Math.ceil(totalItems / size),
            },
        }
    })
}

const getById = async (req) => {
    const params = validate(idCategoryValidationSchema, req.params)
    const { id: categoryId } = params

    return prismaClient.$transaction(async (prisma) => {
        const foundCategory = await prisma.category.findFirst({
            where: {
                id: categoryId,
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

export default { add, update, remove, get, getById }
