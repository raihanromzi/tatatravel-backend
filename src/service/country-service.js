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
    const country = validate(addCountryValidationSchema, req)

    const countCountry = await prismaClient.country.count({
        where: {
            name: country.name,
        },
    })

    if (countCountry === 1) {
        throw new ResponseError(
            errors.HTTP_CODE_BAD_REQUEST,
            errors.HTTP_STATUS_BAD_REQUEST,
            errors.ERROR_COUNTRY_ALREADY_EXISTS
        )
    }

    const result = prismaClient.country.create({
        data: {
            name: country.name,
            areaId: country.areaId,
        },
        select: {
            id: true,
            name: true,
        },
    })

    if (!result) {
        throw new ResponseError(
            errors.HTTP_CODE_INTERNAL_SERVER_ERROR,
            errors.HTTP_STATUS_INTERNAL_SERVER_ERROR,
            errors.ERROR_FAILED_TO_ADD_COUNTRY
        )
    }

    return result
}

const update = async (req, params) => {
    const country = validate(updateCountryValidationSchema, req)
    const countryId = validate(getCountryByIdValidationSchema, params)

    const findCountry = await prismaClient.country.findUnique({
        where: {
            id: countryId.id,
        },
    })

    if (!findCountry) {
        throw new ResponseError(
            errors.HTTP_CODE_NOT_FOUND,
            errors.HTTP_STATUS_NOT_FOUND,
            errors.ERROR_COUNTRY_NOT_FOUND
        )
    }

    const findArea = await prismaClient.area.findUnique({
        where: {
            id: country.areaId,
        },
    })

    if (!findArea) {
        throw new ResponseError(
            errors.HTTP_CODE_NOT_FOUND,
            errors.HTTP_STATUS_NOT_FOUND,
            errors.ERROR_AREA_NOT_FOUND
        )
    }

    const result = prismaClient.country.update({
        where: {
            id: countryId.id,
        },
        data: {
            name: country.name,
            areaId: country.areaId,
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
            errors.HTTP_CODE_INTERNAL_SERVER_ERROR,
            errors.HTTP_STATUS_INTERNAL_SERVER_ERROR,
            errors.ERROR_FAILED_TO_UPDATE_COUNTRY
        )
    }

    return result
}

const remove = async (params) => {
    const countryId = validate(deleteCountryValidationSchema, params)

    const findCountry = await prismaClient.country.findUnique({
        where: {
            id: countryId.id,
        },
    })

    if (!findCountry) {
        throw new ResponseError(
            errors.HTTP_CODE_NOT_FOUND,
            errors.HTTP_STATUS_NOT_FOUND,
            errors.ERROR_COUNTRY_NOT_FOUND
        )
    }

    const result = prismaClient.country.delete({
        where: {
            id: countryId.id,
        },
    })

    if (!result) {
        throw new ResponseError(
            errors.HTTP_CODE_INTERNAL_SERVER_ERROR,
            errors.HTTP_STATUS_INTERNAL_SERVER_ERROR,
            errors.ERROR_FAILED_TO_DELETE_COUNTRY
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

    if (query.areaId) {
        filters.push({
            area: {
                id: query.areaId,
            },
        })
    }

    const countries = await prismaClient.country.findMany({
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
        take: query.size,
        skip: skip,
    })

    if (!countries) {
        throw new ResponseError(
            errors.HTTP_CODE_NOT_FOUND,
            errors.HTTP_STATUS_NOT_FOUND,
            errors.ERROR_COUNTRY_NOT_FOUND
        )
    }

    const totalItems = await prismaClient.country.count({
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

    const result = countries.map((country) => {
        return {
            id: country.id,
            name: country.name,
            areaId: country.area.id,
            area: country.area.name,
        }
    })

    return {
        data: result,
        pagination: {
            page: query.page,
            total_item: totalItems,
            total_page: Math.ceil(totalItems / query.size),
        },
    }
}

const getById = async (req) => {
    const params = validate(getCountryByIdValidationSchema, req)

    const country = await prismaClient.country.findUnique({
        where: {
            id: params.id,
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
            errors.HTTP_CODE_NOT_FOUND,
            errors.HTTP_STATUS_NOT_FOUND,
            errors.ERROR_COUNTRY_NOT_FOUND
        )
    }

    return {
        id: country.id,
        name: country.name,
        areaId: country.area.id,
        area: country.area.name,
    }
}
export default { add, get, getById, update, remove }
