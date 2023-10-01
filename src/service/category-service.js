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
    const newCategory = validate(addOrUpdateCategoryValidationSchema, req.body)

    const { name, isActive } = newCategory

    const countCategory = await prismaClient.category.count({
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

    const result = await prismaClient.category.create({
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
}

const update = async (req) => {
    const updatedCategory = validate(addOrUpdateCategoryValidationSchema, req.body)

    const params = validate(idCategoryValidationSchema, req.params)

    const { name, isActive } = updatedCategory

    const categoryId = params.id

    const findCategory = await prismaClient.category.findUnique({
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

    const result = await prismaClient.category.update({
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
}

const remove = async (req) => {
    const params = validate(idCategoryValidationSchema, req.params)

    const categoryId = params.id

    const findCategory = await prismaClient.category.findUnique({
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

    const result = await prismaClient.category.delete({
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
}

const get = async (req) => {
    const query = validate(getCategoryValidationSchema, req.query)

    const skip = (query.page - 1) * query.size

    const filters = []

    if (query.name) {
        filters.push({
            name: {
                contains: query.name,
            },
        })
    }

    const categories = await prismaClient.category.findMany({
        where: {
            AND: filters,
        },
        select: {
            id: true,
            name: true,
            isActive: true,
        },
        skip: skip,
        take: query.size,
    })

    if (!categories) {
        throw new ResponseError(
            errors.HTTP.CODE.NOT_FOUND,
            errors.HTTP.STATUS.NOT_FOUND,
            errors.CATEGORY.NOT_FOUND
        )
    }

    const totalItems = await prismaClient.category.count({
        where: {
            AND: filters,
        },
    })

    if (!totalItems) {
        return {
            data: [],
            pagination: {
                page: query.page,
                total_item: totalItems,
                total_page: Math.ceil(totalItems / query.size),
            },
        }
    }

    return {
        data: categories,
        pagination: {
            page: query.page,
            total_item: totalItems,
            total_page: Math.ceil(totalItems / query.size),
        },
    }
}

const getById = async (req) => {
    const params = validate(idCategoryValidationSchema, req.params)

    const categoryId = params.id

    const findCategory = await prismaClient.category.findUnique({
        where: {
            id: categoryId,
        },
        select: {
            id: true,
            name: true,
            isActive: true,
        },
    })

    if (!findCategory) {
        throw new ResponseError(
            errors.HTTP.CODE.NOT_FOUND,
            errors.HTTP.STATUS.NOT_FOUND,
            errors.CATEGORY.NOT_FOUND
        )
    }

    return findCategory
}

export default { add, update, remove, get, getById }
