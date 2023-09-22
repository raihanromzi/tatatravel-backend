import { ResponseError } from '../utils/response-error.js'
import { validate } from '../validation/validation.js'
import {
    addCategoryValidationSchema,
    updateActiveCategoryValidationSchema,
} from '../validation/category-validation.js'
import { prismaClient } from '../application/database.js'

const add = async (request) => {
    const addRequest = validate(addCategoryValidationSchema, request)

    const result = await prismaClient.category.create({
        data: {
            name: addRequest.name,
        },
    })

    if (!result) {
        throw new ResponseError(500, 'Internal Server Error', 'Failed to add category')
    }

    return result
}

const updateActive = async (request) => {
    const updateRequest = validate(updateActiveCategoryValidationSchema, request)

    const result = await prismaClient.category.update({
        where: {
            id: updateRequest.id,
        },
        data: {
            status: updateRequest.status,
        },
    })

    if (!result) {
        throw new ResponseError(500, 'Internal Server Error', 'Failed to update category')
    }

    return result
}

const deleteCategory = async (request) => {
    const result = await prismaClient.category.delete({
        where: {
            id: request.id,
        },
    })

    if (!result) {
        throw new ResponseError(500, 'Internal Server Error', 'Failed to delete category')
    }

    return result
}

const getAll = async () => {
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

export default { add, updateActive, deleteCategory, getAll }
