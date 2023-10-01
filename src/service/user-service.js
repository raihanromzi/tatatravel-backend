import { validate } from '../validation/validation.js'
import {
    addUserValidationSchema,
    getUserValidationSchema,
    updateUserValidationSchema,
} from '../validation/user-validation.js'
import { prismaClient } from '../application/database.js'
import { ResponseError } from '../utils/response-error.js'
import * as bcrypt from 'bcrypt'
import { errors } from '../utils/message-error.js'

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

const get = async (req) => {
    const username = validate(getUserValidationSchema, req.user.username)

    const user = await prismaClient.user.findUnique({
        where: {
            username: username,
        },
        select: {
            username: true,
            email: true,
        },
    })

    if (!user) {
        throw new ResponseError(
            errors.HTTP.CODE.NOT_FOUND,
            errors.HTTP.STATUS.NOT_FOUND,
            errors.USER.NOT_FOUND
        )
    }

    return user
}

const update = async (req) => {
    const user = validate(updateUserValidationSchema, req)

    const totalUserInDatabase = await prismaClient.user.count({
        where: {
            username: user.username,
        },
    })

    if (totalUserInDatabase !== 1) {
        throw new ResponseError(
            errors.HTTP.CODE.NOT_FOUND,
            errors.HTTP.STATUS.NOT_FOUND,
            errors.USER.NOT_FOUND
        )
    }

    const data = {}

    if (user.fullName) {
        data.fullName = user.fullName
    }

    if (user.password) {
        data.password = await bcrypt.hash(user.password, 10)
    }

    return prismaClient.user.update({
        where: {
            username: user.username,
        },
        data: data,
        select: {
            username: true,
            fullName: true,
        },
    })
}

const logout = async (req) => {
    const username = validate(getUserValidationSchema, req)

    const user = await prismaClient.user.findUnique({
        where: {
            username: username,
        },
    })

    if (!user) {
        throw new ResponseError(
            errors.HTTP.CODE.NOT_FOUND,
            errors.HTTP.STATUS.NOT_FOUND,
            errors.USER.NOT_FOUND
        )
    }

    return prismaClient.user.update({
        where: {
            username: username,
        },
        data: {
            token: null,
        },
        select: {
            username: true,
            role: {
                select: {
                    name: true,
                },
            },
        },
    })
}

export default { add, get, update, logout }
