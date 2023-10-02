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

    const [countArea, result] = await prismaClient.$transaction([
        prismaClient.area.count({
            where: {
                name: area.name,
            },
        }),
        prismaClient.area.create({
            data: {
                name: area.name,
            },
            select: {
                name: true,
            },
        }),
    ])

    if (countArea === 1) {
        throw new ResponseError(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.AREA.ALREADY_EXISTS
        )
    }

    if (!result) {
        throw new ResponseError(
            errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
            errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
            errors.AREA.FAILED_TO_ADD
        )
    }

    return result
}

const update = async (req) => {
    const area = validate(updateAreaValidationSchema, req.body)

    const params = validate(getAreaByIdValidationSchema, req.params)

    const areaId = params.id

    const [, result] = await prismaClient.$transaction([
        prismaClient.area.findUniqueOrThrow({
            where: {
                id: areaId,
            },
        }),
        prismaClient.area.update({
            where: {
                id: areaId,
            },
            data: {
                name: area.name,
            },
            select: {
                name: true,
            },
        }),
    ])

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
    const query = validate(getAreaValidationSchema, req.query)

    const { name, page, size, sortBy } = query

    // validation for sortBy and orderBy
    if (sortBy) {
        if (sortBy !== 'id' && sortBy !== 'name') {
            throw new ResponseError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.SORT_BY.MUST_VALID
            )
        }
    }

    const skip = (page - 1) * size

    const filters = []

    if (name) {
        filters.push({
            name: {
                contains: name,
            },
        })
    }

    const [area, totalItems] = await prismaClient.$transaction([
        prismaClient.area.findMany({
            where: {
                AND: filters,
            },
            select: {
                id: true,
                name: true,
            },
            take: size,
            skip: skip,
        }),
        prismaClient.area.count({
            where: {
                AND: filters,
            },
        }),
    ])

    return {
        data: area,
        pagination: {
            page: query.page,
            total_item: totalItems,
            total_page: Math.ceil(totalItems / query.size),
        },
    }
}

const getById = async (req) => {
    const params = validate(getAreaByIdValidationSchema, req.params)

    const areaId = params.id

    const [, result] = await prismaClient.$transaction([
        prismaClient.area.findUniqueOrThrow({
            where: {
                id: areaId,
            },
        }),
        prismaClient.area.findUniqueOrThrow({
            where: {
                id: areaId,
            },
            select: {
                name: true,
            },
        }),
    ])

    return result
}

const remove = async (req) => {
    const params = validate(getAreaByIdValidationSchema, req.params)

    const areaId = params.id

    const [, result] = await prismaClient.$transaction([
        prismaClient.area.findUniqueOrThrow({
            where: {
                id: areaId,
            },
        }),
        prismaClient.area.delete({
            where: {
                id: areaId,
            },
        }),
    ])

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
