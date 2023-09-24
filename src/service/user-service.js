import { validate } from '../validation/validation.js'
import {
    addUserValidationSchema,
    getUserValidationSchema,
    updateUserValidationSchema,
} from '../validation/user-validation.js'
import { prismaClient } from '../application/database.js'
import { ResponseError } from '../utils/response-error.js'
import * as bcrypt from 'bcrypt'

const add = async (request) => {
    const user = validate(addUserValidationSchema, request)

    const countUser = await prismaClient.user.count({
        where: {
            username: user.username,
            email: user.email,
        },
    })

    if (countUser === 1) {
        throw new ResponseError(400, 'Bad Request', 'Username or email already exists')
    }

    const hashedPassword = await bcrypt.hash(request.password, 10)

    const result = prismaClient.user.create({
        data: {
            firstName: user.firstName,
            lastName: user.lastName,
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
        throw new ResponseError(500, 'Internal Server Error', 'Failed to add user')
    }

    return result
}

const getUser = async (req) => {
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
        throw new ResponseError(404, 'Not Found', 'user is not found')
    }

    return user
}

const updateUser = async (request) => {
    const user = validate(updateUserValidationSchema, request)

    const totalUserInDatabase = await prismaClient.user.count({
        where: {
            username: user.username,
        },
    })

    if (totalUserInDatabase !== 1) {
        throw new ResponseError(404, 'Not Found', 'user is not found')
    }

    const data = {}

    if (user.newUsername) {
        data.username = user.newUsername
    }

    if (user.firstName) {
        data.firstName = user.firstName
    }

    if (user.lastName) {
        data.lastName = user.lastName
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
            firstName: true,
            lastName: true,
        },
    })
}

const logout = async (req) => {
    const username = validate(getUserValidationSchema, req.user.username)

    const user = await prismaClient.user.findUnique({
        where: {
            username: username,
        },
    })

    if (!user) {
        throw new ResponseError(404, 'Not Found', 'user is not found')
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

export default { add, getUser, updateUser, logout }
