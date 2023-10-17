import { validate } from '../validation/validation.js'
import { prismaClient } from '../application/database.js'
import { ResponseError } from '../utils/response-error.js'
import {
    addCountryValidationSchema,
    deleteCountryValidationSchema,
    getCountryByIdValidationSchema,
    updateCountryValidationSchema,
} from '../validation/country-validation.js'
import { areaValidationSchema } from '../validation/area-validation.js'
import { errors } from '../utils/message-error.js'

const add = async (req) => {
    const country = validate(addCountryValidationSchema, req.body)
    const { name, areaId } = country

    return prismaClient.$transaction(async (prisma) => {
        const countCountry = await prisma.country.count({
            where: {
                name: name,
            },
        })

        if (countCountry === 1) {
            throw new ResponseError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.COUNTRY.ALREADY_EXISTS
            )
        }

        const result = await prisma.country.create({
            data: {
                name: name,
                areaId: areaId,
            },
            select: {
                id: true,
                name: true,
            },
        })

        if (!result) {
            throw new ResponseError(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.COUNTRY.FAILED_TO_ADD
            )
        }

        return result
    })
}

const update = async (req) => {
    const country = validate(updateCountryValidationSchema, req.body)
    const params = validate(getCountryByIdValidationSchema, req.params)
    const { name, areaId } = country
    const { id: countryId } = params

    return prismaClient.$transaction(async (prisma) => {
        const findCountry = await prisma.country.findUnique({
            where: {
                id: countryId,
            },
        })

        if (!findCountry) {
            throw new ResponseError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.COUNTRY.NOT_FOUND
            )
        }

        const findArea = await prisma.area.findUnique({
            where: {
                id: areaId,
            },
        })

        if (!findArea) {
            throw new ResponseError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.AREA.NOT_FOUND
            )
        }

        const result = await prisma.country.update({
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
        })

        if (!result) {
            throw new ResponseError(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.COUNTRY.FAILED_TO_UPDATE
            )
        }

        return result
    })
}

const remove = async (req) => {
    const country = validate(deleteCountryValidationSchema, req.params)
    const { id: countryId } = country

    return prismaClient.$transaction(async (prisma) => {
        const findCountry = await prisma.country.findUnique({
            where: {
                id: countryId,
            },
        })

        if (!findCountry) {
            throw new ResponseError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.COUNTRY.NOT_FOUND
            )
        }

        const result = await prisma.country.delete({
            where: {
                id: countryId,
            },
        })

        if (!result) {
            throw new ResponseError(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.COUNTRY.FAILED_TO_DELETE
            )
        }

        return result
    })
}

const get = async (req) => {
    const query = validate(areaValidationSchema, req.query)
    const { name, page, size } = query
    const skip = (page - 1) * size
    const filters = []

    if (name) {
        filters.push({
            name: {
                contains: name,
            },
        })
    }

    return prismaClient.$transaction(async (prisma) => {
        const countries = await prisma.country.findMany({
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
        })

        const totalItems = await prisma.country.count({
            where: {
                AND: filters,
            },
        })

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
    })
}

const getById = async (req) => {
    const params = validate(getCountryByIdValidationSchema, req.params)
    const { id } = params

    return prismaClient.$transaction(async (prisma) => {
        const country = await prisma.country.findUnique({
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

        if (!country) {
            throw new ResponseError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.COUNTRY.NOT_FOUND
            )
        }

        const { countryId, name, area } = country

        return {
            id: countryId,
            name: name,
            areaId: area.id,
            area: area.name,
        }
    })
}
export default { add, get, getById, update, remove }
