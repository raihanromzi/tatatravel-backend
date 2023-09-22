import { validate } from '../validation/validation.js'
import {
    addUserValidationSchema,
    getUserValidationSchema,
    loginValidationSchema,
    updateUserValidationSchema,
} from '../validation/user-validation.js'
import { prismaClient } from '../application/database.js'
import { ResponseError } from '../utils/response-error.js'
import * as bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'

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

const login = async (request) => {
    const loginRequest = validate(loginValidationSchema, request)

    const user = await prismaClient.user.findUnique({
        where: {
            email: loginRequest.email,
        },
        select: {
            username: true,
            password: true,
        },
    })

    if (!user) {
        throw new ResponseError(401, 'Unauthorized', 'Username or password is wrong')
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password)

    if (!isPasswordValid) {
        throw new ResponseError(401, 'Unauthorized', 'Username or password is wrong')
    }

    const token = uuid().toString()

    return prismaClient.user.update({
        data: {
            token: token,
        },
        where: {
            username: user.username,
        },
        select: {
            token: true,
        },
    })
}

const getUser = async (username) => {
    username = validate(getUserValidationSchema, username)

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

const logout = async (username) => {
    username = validate(getUserValidationSchema, username)

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

export default { add, login, getUser, updateUser, logout }
