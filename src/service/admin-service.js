import { validate } from '../validation/validation.js'
import {
    deleteUserValidationSchema,
    searchUserValidationSchema,
} from '../validation/user-validation.js'
import { prismaClient } from '../application/database.js'
import { ResponseError } from '../utils/response-error.js'

const deleteUser = async (user, userId) => {
    userId = validate(deleteUserValidationSchema, userId)

    const totalUserInDatabase = await prismaClient.user.count({
        where: {
            username: user.username,
            id: userId,
        },
    })

    if (totalUserInDatabase !== 1) {
        throw new ResponseError(404, 'Not Found', 'user is not found')
    }

    return prismaClient.user.delete({
        where: {
            username: user.username,
            id: userId,
        },
        select: {
            username: true,
        },
    })
}

const searchUser = async (user, request) => {
    request = validate(searchUserValidationSchema, request)

    const skip = (request.page - 1) * request.size

    const filters = []

    if (request.name) {
        filters.push({
            OR: [
                {
                    firstName: {
                        contains: request.name,
                    },
                },
                {
                    lastName: {
                        contains: request.name,
                    },
                },
            ],
        })
    }

    if (request.email) {
        filters.push({
            email: {
                contains: request.email,
            },
        })
    }

    if (request.username) {
        filters.push({
            username: {
                contains: request.username,
            },
        })
    }

    if (request.role) {
        filters.push({
            role: {
                name: {
                    contains: request.role,
                },
            },
        })
    }

    const users = await prismaClient.user.findMany({
        where: {
            AND: filters,
        },
        take: request.size,
        skip: skip,
    })

    const totalItems = await prismaClient.user.count({
        where: {
            AND: filters,
        },
    })

    return {
        data: users,
        pagination: {
            page: request.page,
            total_item: totalItems,
            total_page: Math.ceil(totalItems / request.size),
        },
    }
}

export default { deleteUser, searchUser }
