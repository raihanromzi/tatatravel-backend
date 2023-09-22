import { validate } from '../validation/validation.js'
import { prismaClient } from '../application/database.js'
import { ResponseError } from '../utils/response-error.js'
import { addCountryValidationSchema } from '../validation/country-validation.js'

const add = async (request) => {
    const country = validate(addCountryValidationSchema, request)

    const countCountry = await prismaClient.country.count({
        where: {
            name: country.name,
        },
    })

    if (countCountry === 1) {
        throw new ResponseError(400, 'Bad Request', 'Country already exists')
    }

    const result = prismaClient.country.create({
        data: {
            name: country.name,
            areaId: country.areaId,
        },
        select: {
            id: true,
            name: true,
            areaId: true,
        },
    })

    if (!result) {
        throw new ResponseError(500, 'Internal Server Error', 'Failed to add country')
    }

    return result
}

const update = async (request) => {
    const country = validate(addCountryValidationSchema, request)

    const result = prismaClient.country.update({
        where: {
            id: country.id,
        },
        data: {
            name: country.name,
            areaId: country.areaId,
        },
        select: {
            id: true,
            name: true,
            areaId: true,
        },
    })

    if (!result) {
        throw new ResponseError(500, 'Internal Server Error', 'Failed to update country')
    }

    return result
}

// const search = async (request) => {}

const deleteCountry = async (id) => {
    const countryId = validate(deleteCountryValidationSchema, id)

    const result = prismaClient.country.delete({
        where: {
            id: countryId,
        },
    })

    if (!result) {
        throw new ResponseError(500, 'Internal Server Error', 'Failed to delete country')
    }

    return result
}

export default { add, update, deleteCountry }
