import { validate } from '../validation/validation.js'
import { prismaClient } from '../application/database.js'
import { ResponseError } from '../utils/response-error.js'
import {
    addAreaValidationSchema,
    getAreaByIdValidationSchema,
    getAreaValidationSchema,
    updateAreaValidationSchema,
} from '../validation/area-validation.js'
import { errors } from '../utils/message-error.js'

const add = async (req) => {
    const area = validate(addAreaValidationSchema, req)

    const countArea = await prismaClient.area.count({
        where: {
            name: area.name,
        },
    })

    if (countArea === 1) {
        throw new ResponseError(400, 'Bad req', 'Area already exists')
    }

    const result = prismaClient.area.create({
        data: {
            name: area.name,
            description: area.description,
        },
        select: {
            name: true,
            description: true,
        },
    })

    if (!result) {
        throw new ResponseError(500, 'Internal Server Error', 'Failed to add area')
    }

    return result
}

const update = async (req) => {
    const area = validate(updateAreaValidationSchema, req)

    const countArea = await prismaClient.area.count({
        where: {
            name: area.name,
        },
    })

    if (countArea === 1) {
        throw new ResponseError(400, 'Bad req', 'Area already exists')
    }

    const result = prismaClient.area.update({
        where: {
            id: req.id,
        },
        data: {
            name: area.name,
            description: area.description,
        },
        select: {
            name: true,
            description: true,
        },
    })

    if (!result) {
        throw new ResponseError(500, 'Internal Server Error', 'Failed to update area')
    }

    return result
}

const get = async (req) => {
    const query = validate(getAreaValidationSchema, req)

    const skip = (query.page - 1) * query.size

    const filters = []

    if (query.name) {
        filters.push({
            name: {
                contains: query.name,
            },
        })
    }

    const area = await prismaClient.area.findMany({
        where: {
            AND: filters,
        },
        select: {
            name: true,
        },
        take: query.size,
        skip: skip,
    })

    if (!area) {
        throw new ResponseError(
            errors.HTTP_CODE_NOT_FOUND,
            errors.HTTP_STATUS_NOT_FOUND,
            errors.ERROR_AREA_NOT_FOUND
        )
    }

    const totalItems = await prismaClient.area.count({
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
        data: area,
        pagination: {
            page: query.page,
            total_item: totalItems,
            total_page: Math.ceil(totalItems / query.size),
        },
    }
}

const getById = async (params) => {
    params = validate(getAreaByIdValidationSchema, params)

    const result = await prismaClient.area.findUnique({
        where: {
            id: params.id,
        },
        select: {
            name: true,
        },
    })

    if (!result) {
        throw new ResponseError(
            errors.HTTP_CODE_NOT_FOUND,
            errors.HTTP_STATUS_NOT_FOUND,
            errors.ERROR_AREA_NOT_FOUND
        )
    }

    return result
}

const remove = async (req) => {
    const result = await prismaClient.area.delete({
        where: {
            id: req.id,
        },
    })

    if (!result) {
        throw new ResponseError(500, 'Internal Server Error', 'Failed to delete area')
    }

    return result
}

export default { add, update, get, getById, remove }
