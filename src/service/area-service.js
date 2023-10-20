import { validate } from '../validation/validation.js'
import { prismaClient } from '../application/database.js'
import { ResponseError } from '../utils/response-error.js'
import {
    areaIdValidationSchema,
    areaNameValidationSchema,
    getAreaValidationSchema,
} from '../validation/area-validation.js'
import { errors } from '../utils/message-error.js'

const add = async (req) => {
    const { name } = validate(areaNameValidationSchema, req.body)

    return prismaClient.$transaction(async (prisma) => {
        const countArea = await prisma.area.count({
            where: {
                name: name,
            },
        })

        if (countArea > 0) {
            throw new ResponseError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.AREA.ALREADY_EXISTS
            )
        }

        return prisma.area.create({
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
    const { name, page, size, sortBy, orderBy } = validate(getAreaValidationSchema, req.query)
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
        const areas = await prisma.area.findMany({
            where: {
                AND: filters,
            },
            select: {
                id: true,
                name: true,
            },
            take: size,
            skip: skip,
            orderBy: {
                [sortBy]: orderBy,
            },
        })

        const totalItems = await prisma.area.count({
            where: {
                AND: filters,
            },
        })

        return {
            data: areas,
            pagination: {
                page: page,
                total_item: totalItems,
                total_page: Math.ceil(totalItems / size),
            },
        }
    })
}

const getById = async (req) => {
    const { id: areaId } = validate(areaIdValidationSchema, req.params)

    return prismaClient.$transaction(async (prisma) => {
        const area = await prisma.area.findUnique({
            where: {
                id: areaId,
            },
            select: {
                name: true,
            },
        })

        if (!area) {
            throw new ResponseError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.AREA.NOT_FOUND
            )
        }

        return area
    })
}

const update = async (req) => {
    const { name } = validate(areaNameValidationSchema, req.body)
    const { id: areaId } = validate(areaIdValidationSchema, req.params)

    return prismaClient.$transaction(async (prisma) => {
        const findArea = await prisma.area.findUnique({
            where: {
                id: areaId,
            },
        })

        if (!findArea) {
            throw new ResponseError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.AREA.ALREADY_EXISTS
            )
        }

        return prisma.area.update({
            where: {
                id: areaId,
            },
            data: {
                name: name,
            },
            select: {
                name: true,
            },
        })
    })
}

const remove = async (req) => {
    const { id: areaId } = validate(areaIdValidationSchema, req.params)

    return prismaClient.$transaction(async (prisma) => {
        const findArea = await prisma.area.findUnique({
            where: {
                id: areaId,
            },
        })

        if (!findArea) {
            throw new ResponseError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.AREA.NOT_FOUND
            )
        }

        return prisma.area.delete({
            where: {
                id: areaId,
            },
        })
    })
}

export default { add, update, get, getById, remove }
