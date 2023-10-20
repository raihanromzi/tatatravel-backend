import { validate } from '../validation/validation.js'
import { prismaClient } from '../application/database.js'
import { ResponseError } from '../utils/response-error.js'
import {
    addCountryValidationSchema,
    countryIdValidationSchema,
    getCountryValidationSchema,
    updateCountryValidationSchema,
} from '../validation/country-validation.js'
import { errors } from '../utils/message-error.js'

const add = async (req) => {
    const { name, areaId } = validate(addCountryValidationSchema, req.body)

    return prismaClient.$transaction(async (prisma) => {
        const countCountry = await prisma.country.count({
            where: {
                name: name,
            },
        })

        if (countCountry > 0) {
            throw new ResponseError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.COUNTRY.ALREADY_EXISTS
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

        return prisma.country.create({
            data: {
                name: name,
                areaId: areaId,
            },
            select: {
                id: true,
                name: true,
            },
        })
    })
}

const get = async (req) => {
    const { name, page, size, sortBy, orderBy } = validate(getCountryValidationSchema, req.query)
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
            orderBy: {
                [sortBy]: orderBy,
            },
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
    const { id } = validate(countryIdValidationSchema, req.params)

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
            area: area.name,
        }
    })
}

const update = async (req) => {
    const { name, areaId } = validate(updateCountryValidationSchema, req.body)
    const { id: countryId } = validate(countryIdValidationSchema, req.params)

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

        const { id, name: countryName, area } = result

        return {
            id: id,
            name: countryName,
            area: area.name,
        }
    })
}

const remove = async (req) => {
    const { id: countryId } = validate(countryIdValidationSchema, req.params)

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

        await prisma.country.delete({
            where: {
                id: countryId,
            },
        })
    })
}
export default { add, get, getById, update, remove }
