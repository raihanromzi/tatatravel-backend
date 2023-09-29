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
    const area = validate(addAreaValidationSchema, req.body)

    const countArea = await prismaClient.area.count({
        where: {
            name: area.name,
        },
    })

    if (countArea === 1) {
        throw new ResponseError(
            errors.HTTP_CODE_BAD_REQUEST,
            errors.HTTP_STATUS_BAD_REQUEST,
            errors.ERROR_AREA_ALREADY_EXISTS
        )
    }

    const result = prismaClient.area.create({
        data: {
            name: area.name,
        },
        select: {
            name: true,
        },
    })

    if (!result) {
        throw new ResponseError(
            errors.HTTP_CODE_INTERNAL_SERVER_ERROR,
            errors.HTTP_STATUS_INTERNAL_SERVER_ERROR,
            errors.ERROR_FAILED_TO_ADD_AREA
        )
    }

    return result
}

const update = async (req, params) => {
    const area = validate(updateAreaValidationSchema, req.body)
    params = validate(getAreaByIdValidationSchema, params)

    const findArea = await prismaClient.area.findUnique({
        where: {
            id: params.id,
        },
    })

    if (!findArea) {
        throw new ResponseError(
            errors.HTTP_CODE_NOT_FOUND,
            errors.HTTP_STATUS_NOT_FOUND,
            errors.ERROR_AREA_NOT_FOUND
        )
    }

    const result = prismaClient.area.update({
        where: {
            id: params.id,
        },
        data: {
            name: area.name,
        },
        select: {
            name: true,
        },
    })

    if (!result) {
        throw new ResponseError(
            errors.HTTP_CODE_INTERNAL_SERVER_ERROR,
            errors.HTTP_STATUS_INTERNAL_SERVER_ERROR,
            errors.ERROR_FAILED_TO_UPDATE_AREA
        )
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
            id: true,
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

    const findArea = await prismaClient.area.findUnique({
        where: {
            id: params.id,
        },
    })

    if (!findArea) {
        throw new ResponseError(
            errors.HTTP_CODE_NOT_FOUND,
            errors.HTTP_STATUS_NOT_FOUND,
            errors.ERROR_AREA_NOT_FOUND
        )
    }

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

const remove = async (params) => {
    params = validate(getAreaByIdValidationSchema, params)

    const findArea = await prismaClient.area.findUnique({
        where: {
            id: params.id,
        },
    })

    if (!findArea) {
        throw new ResponseError(
            errors.HTTP_CODE_NOT_FOUND,
            errors.HTTP_STATUS_NOT_FOUND,
            errors.ERROR_AREA_NOT_FOUND
        )
    }

    const result = await prismaClient.area.delete({
        where: {
            id: params.id,
        },
    })

    if (!result) {
        throw new ResponseError(
            errors.HTTP_CODE_INTERNAL_SERVER_ERROR,
            errors.HTTP_STATUS_INTERNAL_SERVER_ERROR,
            errors.ERROR_FAILED_TO_DELETE_AREA
        )
    }

    return result
}

export default { add, update, get, getById, remove }
