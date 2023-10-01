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
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.AREA.ALREADY_EXISTS
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
            errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
            errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
            errors.AREA.FAILED_TO_ADD
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
            errors.HTTP.CODE.NOT_FOUND,
            errors.HTTP.STATUS.NOT_FOUND,
            errors.AREA.NOT_FOUND
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
            errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
            errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
            errors.AREA.FAILED_TO_UPDATE
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
            errors.HTTP.CODE.NOT_FOUND,
            errors.HTTP.STATUS.NOT_FOUND,
            errors.AREA.NOT_FOUND
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
            errors.HTTP.CODE.NOT_FOUND,
            errors.HTTP.STATUS.NOT_FOUND,
            errors.AREA.NOT_FOUND
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
            errors.HTTP.CODE.NOT_FOUND,
            errors.HTTP.STATUS.NOT_FOUND,
            errors.AREA.NOT_FOUND
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
            errors.HTTP.CODE.NOT_FOUND,
            errors.HTTP.STATUS.NOT_FOUND,
            errors.AREA.NOT_FOUND
        )
    }

    const result = await prismaClient.area.delete({
        where: {
            id: params.id,
        },
    })

    if (!result) {
        throw new ResponseError(
            errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
            errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
            errors.AREA.FAILED_TO_DELETE
        )
    }

    return result
}

export default { add, update, get, getById, remove }
