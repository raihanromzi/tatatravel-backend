import { ResponseError } from '../utils/response-error.js'
import { validate } from '../validation/validation.js'
import {
    addCategoryValidationSchema,
    updateActiveCategoryValidationSchema,
} from '../validation/category-validation.js'
import { prismaClient } from '../application/database.js'
import { errors } from '../utils/message-error.js'

const add = async (req) => {
    const newCategory = validate(addCategoryValidationSchema, req.body)

    const countCategory = await prismaClient.category.count({
        where: {
            name: newCategory.name,
        },
    })

    if (countCategory === 1) {
        throw new ResponseError(
            errors.HTTP_CODE_BAD_REQUEST,
            errors.HTTP_STATUS_BAD_REQUEST,
            errors.ERROR_CATEGORY_ALREADY_EXISTS
        )
    }

    const result = await prismaClient.category.create({
        data: {
            name: newCategory.name,
            isActive: newCategory.isActive,
        },
        select: {
            name: true,
            isActive: true,
        },
    })

    if (!result) {
        throw new ResponseError(
            errors.HTTP_CODE_INTERNAL_SERVER_ERROR,
            errors.HTTP_STATUS_INTERNAL_SERVER_ERROR,
            errors.ERROR_FAILED_TO_ADD_CATEGORY
        )
    }

    return result
}

const update = async (req) => {
    const updatereq = validate(updateActiveCategoryValidationSchema, req)

    const result = await prismaClient.category.update({
        where: {
            id: updatereq.id,
        },
        data: {
            status: updatereq.status,
        },
    })

    if (!result) {
        throw new ResponseError(500, 'Internal Server Error', 'Failed to update category')
    }

    return result
}

const remove = async (req) => {
    const result = await prismaClient.category.delete({
        where: {
            id: req.id,
        },
    })

    if (!result) {
        throw new ResponseError(500, 'Internal Server Error', 'Failed to delete category')
    }

    return result
}

const get = async () => {
    const result = await prismaClient.category.findMany({
        select: {
            id: true,
            name: true,
            status: true,
        },
    })

    if (!result) {
        throw new ResponseError(500, 'Internal Server Error', 'Failed to get all category')
    }

    return result
}

const getById = async (req) => {}

export default { add, update, remove, get, getById }
