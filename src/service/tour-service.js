import { prismaClient } from '../application/database.js'
import { ResponseError } from '../utils/response-error.js'
import { validate } from '../validation/validation.js'
import {
    addTourValidationSchema,
    deleteTourValidationSchema,
    getTourValidationSchema,
    updateTourValidationSchema,
} from '../validation/tour-validation.js'

const add = async (req) => {
    const tour = validate(addTourValidationSchema, req)

    const result = prismaClient.tour.create({
        data: {
            name: tour.name,
            price: tour.price,
            dateStart: tour.dateStart,
            dateEnd: tour.dateEnd,
            description: tour.description,
        },
        select: {
            id: true,
            name: true,
            price: true,
            dateStart: true,
            dateEnd: true,
            description: true,
        },
    })

    if (!result) {
        throw new ResponseError(500, 'Internal Server Error', 'Failed to add tour')
    }

    return result
}

const update = async (req) => {
    const tour = validate(updateTourValidationSchema, req)

    const result = prismaClient.tour.update({
        where: {
            id: tour.id,
        },
        data: {
            name: tour.name,
            price: tour.price,
            dateStart: tour.dateStart,
            dateEnd: tour.dateEnd,
            description: tour.description,
        },
        select: {
            id: true,
            name: true,
            price: true,
            dateStart: true,
            dateEnd: true,
            description: true,
        },
    })

    if (!result) {
        throw new ResponseError(500, 'Internal Server Error', 'Failed to update tour')
    }

    return result
}

const get = async (req) => {
    const tourId = validate(getTourValidationSchema, req)

    const result = prismaClient.tour.findUnique({
        where: {
            id: tourId,
        },
        select: {
            id: true,
            name: true,
            price: true,
            dateStart: true,
            dateEnd: true,
            description: true,
        },
    })

    if (!result) {
        throw new ResponseError(404, 'Not Found', 'Tour not found')
    }

    return result
}

const remove = async (req) => {
    const tourId = validate(deleteTourValidationSchema, req)

    const result = prismaClient.tour.delete({
        where: {
            id: tourId,
        },
    })

    if (!result) {
        throw new ResponseError(500, 'Internal Server Error', 'Failed to delete tour')
    }

    return result
}

export default { add, update, get, remove }
