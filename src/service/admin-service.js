import { validate } from '../validation/validation.js'
import {
    deleteUserValidationSchema,
    searchUserValidationSchema,
} from '../validation/user-validation.js'
import { prismaClient } from '../application/database.js'
import { ResponseError } from '../utils/response-error.js'
import { errors } from '../utils/message-error.js'

const deleteUser = async (user, userId) => {
    const id = validate(deleteUserValidationSchema, userId)

    const totalUserInDatabase = await prismaClient.user.count({
        where: {
            username: user.username,
            id: id,
        },
    })

    if (totalUserInDatabase !== 1) {
        throw new ResponseError(
            errors.HTTP.CODE.NOT_FOUND,
            errors.HTTP.STATUS.NOT_FOUND,
            errors.USER.NOT_FOUND
        )
    }

    return prismaClient.user.delete({
        where: {
            username: user.username,
            id: id,
        },
    })
}

const searchUser = async (req) => {
    const query = validate(searchUserValidationSchema, req)

    const skip = (query.page - 1) * query.size

    const filters = []

    if (query.name) {
        filters.push({
            fullName: {
                contains: query.name,
            },
        })
    }

    if (query.email) {
        filters.push({
            email: {
                contains: query.email,
            },
        })
    }

    if (query.username) {
        filters.push({
            username: {
                contains: query.username,
            },
        })
    }

    if (query.role) {
        filters.push({
            role: {
                name: {
                    contains: query.role,
                },
            },
        })
    }

    const users = await prismaClient.user.findMany({
        where: {
            AND: filters,
        },
        select: {
            id: true,
            fullName: true,
            username: true,
            email: true,
            role: {
                select: {
                    name: true,
                },
            },
        },
        take: query.size,
        skip: skip,
    })

    if (users.length === 0) {
        throw new ResponseError(
            errors.HTTP.CODE.NOT_FOUND,
            errors.HTTP.STATUS.NOT_FOUND,
            errors.USER.NOT_FOUND
        )
    }

    const totalItems = await prismaClient.user.count({
        where: {
            AND: filters,
        },
    })

    if (totalItems === 0) {
        return {
            data: [],
            pagination: {
                page: query.page,
                total_item: totalItems,
                total_page: Math.ceil(totalItems / query.size),
            },
        }
    }

    // convert role object to role name
    users.forEach((user) => {
        user.role = user.role.name
    })

    return {
        data: users,
        pagination: {
            page: query.page,
            total_item: totalItems,
            total_page: Math.ceil(totalItems / query.size),
        },
    }
}

export default { deleteUser, searchUser }
