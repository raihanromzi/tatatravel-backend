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
import fs from 'fs'

const add = async (req) => {
    const user = validate(addUserValidationSchema, req.body)

    const { fullName, username, email, password, role } = user

    const [, countUser, result] = await prismaClient.$transaction([
        prismaClient.role.findFirstOrThrow({
            where: {
                id: role,
            },
        }),
        prismaClient.user.count({
            where: {
                OR: [
                    {
                        email: user.email,
                    },
                    {
                        username: user.username,
                    },
                ],
            },
        }),
        prismaClient.user.create({
            data: {
                fullName: fullName,
                username: username,
                email: email,
                password: await bcrypt.hash(password, 10),
                role: {
                    connect: {
                        id: role,
                    },
                },
            },
            select: {
                username: true,
                email: true,
            },
        }),
    ])

    if (countUser === 1) {
        throw new ResponseError(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.USER.ALREADY_EXISTS
        )
    }

    if (!result) {
        throw new ResponseError(
            errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
            errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
            errors.USER.FAILED_TO_ADD
        )
    }

    return result
}
const remove = async (req) => {
    const id = validate(deleteUserValidationSchema, req.params.id)

    const currentUserId = req.user.id

    if (id === currentUserId) {
        throw new ResponseError(
            errors.HTTP.CODE.FORBIDDEN,
            errors.HTTP.STATUS.FORBIDDEN,
            errors.USER.CANNOT_DELETE_YOURSELF
        )
    }

    const [foundUser, deletedUser] = await prismaClient.$transaction([
        prismaClient.user.count({
            where: {
                id: id,
            },
        }),
        prismaClient.user.delete({
            where: {
                id: id,
            },
        }),
    ])

    if (!foundUser) {
        throw new ResponseError(
            errors.HTTP.CODE.NOT_FOUND,
            errors.HTTP.STATUS.NOT_FOUND,
            errors.USER.NOT_FOUND
        )
    }

    fs.rmSync(`public/images/avatar/${id}`, { recursive: true, force: true })

    return deletedUser
}

const get = async (req) => {
    const query = validate(searchUserValidationSchema, req.query)

    const id = req.user.id

    const { name, email, username, role, page, size, sortBy, orderBy } = query

    // validation for sortBy and orderBy
    if (sortBy) {
        if (
            sortBy !== 'id' &&
            sortBy !== 'fullName' &&
            sortBy !== 'username' &&
            sortBy !== 'email' &&
            sortBy !== 'role'
        ) {
            throw new ResponseError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.SORT_BY.MUST_VALID
            )
        }
    }

    const skip = (page - 1) * size

    const filters = []

    if (name) {
        filters.push({
            fullName: {
                contains: name,
            },
        })
    }

    if (email) {
        filters.push({
            email: {
                contains: email,
            },
        })
    }

    if (username) {
        filters.push({
            username: {
                contains: username,
            },
        })
    }

    if (role) {
        filters.push({
            role: {
                name: {
                    contains: role,
                },
            },
        })
    }

    if (sortBy && orderBy) {
        filters.push({
            [sortBy]: orderBy,
        })
    }

    const [users, totalItems] = await prismaClient.$transaction([
        prismaClient.user.findMany({
            where: {
                AND: filters,
                NOT: {
                    id: id,
                },
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
            take: size,
            skip: skip,
        }),
        prismaClient.user.count({
            where: {
                AND: filters,
            },
        }),
    ])

    // convert role object to role name
    users.forEach((user) => {
        user.role = user.role.name
    })

    return {
        data: users,
        pagination: {
            page: page,
            total_item: totalItems,
            total_page: Math.ceil(totalItems / size),
        },
    }
}

export default { add, remove, get }
