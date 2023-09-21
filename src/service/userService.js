import { validate } from '../validation/validation.js'
import { addUserValidationSchema, loginValidationSchema } from '../validation/user-validation.js'
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

export default { add, login }
