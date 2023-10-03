import { validate } from '../validation/validation.js'
import { prismaClient } from '../application/database.js'
import { ResponseError } from '../utils/response-error.js'
import {
    addCountryValidationSchema,
    deleteCountryValidationSchema,
    getCountryByIdValidationSchema,
    updateCountryValidationSchema,
} from '../validation/country-validation.js'
import { getAreaValidationSchema } from '../validation/area-validation.js'
import { errors } from '../utils/message-error.js'

const add = async (req) => {
    const country = validate(addCountryValidationSchema, req.body)

    const [countCountry, result] = await prismaClient.$transaction([
        prismaClient.country.count({
            where: {
                name: country.name,
            },
        }),
        prismaClient.country.create({
            data: {
                name: country.name,
                areaId: country.areaId,
            },
            select: {
                id: true,
                name: true,
            },
        }),
    ])

    if (countCountry === 1) {
        throw new ResponseError(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.COUNTRY.ALREADY_EXISTS
        )
    }

    if (!result) {
        throw new ResponseError(
            errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
            errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
            errors.COUNTRY.FAILED_TO_ADD
        )
    }

    return result
}

const update = async (req) => {
    const country = validate(updateCountryValidationSchema, req.body)

    const params = validate(getCountryByIdValidationSchema, req.params)

    const { name, areaId } = country

    const countryId = params.id

    const [, , result] = await prismaClient.$transaction([
        prismaClient.country.findUniqueOrThrow({
            where: {
                id: countryId,
            },
        }),
        prismaClient.area.findUniqueOrThrow({
            where: {
                id: areaId,
            },
        }),
        prismaClient.country.update({
            where: {
                id: countryId,
            },
            data: {
                name: name,
                areaId: areaId,
            },
            select: {
                id: true,
                name: true,
                area: {
                    select: {
                        name: true,
                    },
                },
            },
        }),
    ])

    if (!result) {
        throw new ResponseError(
            errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
            errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
            errors.COUNTRY.FAILED_TO_UPDATE
        )
    }

    return result
}

const remove = async (req) => {
    const country = validate(deleteCountryValidationSchema, req.params)

    const countryId = country.id

    const [, result] = await prismaClient.$transaction([
        prismaClient.country.findUniqueOrThrow({
            where: {
                id: countryId,
            },
        }),
        prismaClient.country.delete({
            where: {
                id: countryId,
            },
        }),
    ])

    if (!result) {
        throw new ResponseError(
            errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
            errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
            errors.COUNTRY.FAILED_TO_DELETE
        )
    }

    return result
}

const get = async (req) => {
    const query = validate(getAreaValidationSchema, req.query)

    const { name, page, size } = query

    const skip = (page - 1) * size

    const filters = []

    if (query.name) {
        filters.push({
            name: {
                contains: name,
            },
        })
    }

    const [countries, totalItems] = await prismaClient.$transaction([
        prismaClient.country.findMany({
            where: {
                AND: filters,
            },
            select: {
                id: true,
                name: true,
                area: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            take: size,
            skip: skip,
        }),
        prismaClient.country.count({
            where: {
                AND: filters,
            },
        }),
    ])

    const result = countries.map((country) => {
        const { id, name, area } = country

        return {
            id: id,
            name: name,
            areaId: area.id,
            area: area.name,
        }
    })

    return {
        data: result,
        pagination: {
            page: page,
            total_item: totalItems,
            total_page: Math.ceil(totalItems / size),
        },
    }
}

const getById = async (req) => {
    const params = validate(getCountryByIdValidationSchema, req.params)

    const id = params.id

    const country = await prismaClient.country.findUniqueOrThrow({
        where: {
            id: id,
        },
        select: {
            id: true,
            name: true,
            area: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    })

    const { countryId, name, area } = country

    return {
        id: countryId,
        name: name,
        areaId: area.id,
        area: area.name,
    }
}
export default { add, get, getById, update, remove }
