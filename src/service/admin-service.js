import { validate } from '../validation/validation.js'
import {
    addUserValidationSchema,
    deleteUserValidationSchema,
    searchUserValidationSchema,
} from '../validation/user-validation.js'
import { prismaClient } from '../application/database.js'
import { ResponseError } from '../utils/response-error.js'
import { errors } from '../utils/message-error.js'
import * as bcrypt from 'bcrypt'

const add = async (req) => {
    const user = validate(addUserValidationSchema, req)

    const countUser = await prismaClient.user.count({
        where: {
            email: user.email,
            username: user.username,
        },
    })

    if (countUser === 1) {
        throw new ResponseError(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.USER.ALREADY_EXISTS
        )
    }

    const hashedPassword = await bcrypt.hash(user.password, 10)

    const result = prismaClient.user.create({
        data: {
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            password: hashedPassword,
            role: {
                connect: {
                    id: user.role,
                },
            },
        },
        select: {
            username: true,
            email: true,
        },
    })

    if (!result) {
        throw new ResponseError(
            errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
            errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
            errors.USER.FAILED_TO_ADD
        )
    }

    return result
}
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

export default { add, deleteUser, searchUser }
