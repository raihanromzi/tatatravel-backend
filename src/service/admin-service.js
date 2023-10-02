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

    await prismaClient.role.findFirstOrThrow({
        where: {
            id: role,
        },
    })

    const countUser = await prismaClient.user.count({
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
    })

    if (countUser === 1) {
        throw new ResponseError(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.USER.ALREADY_EXISTS
        )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = prismaClient.user.create({
        data: {
            fullName: fullName,
            username: username,
            email: email,
            password: hashedPassword,
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

    const foundUser = await prismaClient.user.count({
        where: {
            id: id,
        },
    })

    if (!foundUser) {
        throw new ResponseError(
            errors.HTTP.CODE.NOT_FOUND,
            errors.HTTP.STATUS.NOT_FOUND,
            errors.USER.NOT_FOUND
        )
    }

    fs.rmSync(`public/images/avatar/${id}`, { recursive: true, force: true })

    return prismaClient.user.delete({
        where: {
            id: id,
        },
    })
}

const get = async (req) => {
    const query = validate(searchUserValidationSchema, req.query)

    const id = req.user.id

    const { name, email, username, role, page, size } = query

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

    const users = await prismaClient.user.findMany({
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
    })

    const totalItems = await prismaClient.user.count({
        where: {
            AND: filters,
        },
    })

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
