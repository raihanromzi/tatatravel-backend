import { validate } from '../validation/validation.js'
import { prismaClient } from '../application/database.js'
import { ResponseError } from '../utils/response-error.js'
import {
    addAreaValidationSchema,
    getAreaValidationSchema,
    updateAreaValidationSchema,
} from '../validation/area-validation.js'

const add = async (request) => {
    const area = validate(addAreaValidationSchema, request)

    const countArea = await prismaClient.area.count({
        where: {
            name: area.name,
        },
    })

    if (countArea === 1) {
        throw new ResponseError(400, 'Bad Request', 'Area already exists')
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

const update = async (request) => {
    const area = validate(updateAreaValidationSchema, request)

    const countArea = await prismaClient.area.count({
        where: {
            name: area.name,
        },
    })

    if (countArea === 1) {
        throw new ResponseError(400, 'Bad Request', 'Area already exists')
    }

    const result = prismaClient.area.update({
        where: {
            id: request.id,
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

const get = async (request) => {
    const result = validate(getAreaValidationSchema, request)

    const area = await prismaClient.area.findUnique({
        where: {
            id: result.id,
        },
        select: {
            name: true,
            description: true,
        },
    })

    if (!area) {
        throw new ResponseError(404, 'Not Found', 'Area not found')
    }

    return area
}

const getAll = async (request) => {
    const { page, size } = request

    const result = await prismaClient.area.findMany({
        skip: (page - 1) * size,
        take: size,
        select: {
            name: true,
            description: true,
        },
    })

    return result
}

const remove = async (request) => {
    const result = await prismaClient.area.delete({
        where: {
            id: request.id,
        },
    })

    if (!result) {
        throw new ResponseError(500, 'Internal Server Error', 'Failed to delete area')
    }

    return result
}

export default { add, update, get, getAll, remove }
