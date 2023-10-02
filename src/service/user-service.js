import { validate } from '../validation/validation.js'
import {
    avatarValidationSchema,
    getUserValidationSchema,
    updateUserValidationSchema,
} from '../validation/user-validation.js'
import { prismaClient } from '../application/database.js'
import { ResponseError } from '../utils/response-error.js'
import * as bcrypt from 'bcrypt'
import { errors } from '../utils/message-error.js'

const get = async (req) => {
    const user = validate(getUserValidationSchema, req.user)

    const id = user.id

    const foundUser = await prismaClient.user.findUniqueOrThrow({
        where: {
            id: id,
        },
        select: {
            email: true,
            username: true,
            fullName: true,
            avatar: true,
            role: {
                select: {
                    name: true,
                },
            },
        },
    })

    const { email, username, fullName, avatar, role } = foundUser

    return {
        email: email,
        username: username,
        fullName: fullName,
        avatar: avatar,
        role: role.name,
    }
}

const update = async (req) => {
    const user = validate(updateUserValidationSchema, req.body)

    const avatar = validate(avatarValidationSchema, req.file)

    const id = req.user.id

    const { username, fullName, password } = user

    const { path } = avatar

    const data = {}

    if (fullName) {
        data.fullName = user.fullName
    }

    if (password) {
        data.password = await bcrypt.hash(password, 10)
    }

    if (avatar) {
        data.avatar = path
    }

    if (username) {
        data.username = username
    }

    const [, anotherUser, updatedUser] = await prismaClient.$transaction([
        prismaClient.user.findUniqueOrThrow({
            where: {
                id: id,
            },
        }),
        prismaClient.user.findMany({
            where: {
                username: username,
            },
        }),
        prismaClient.user.update({
            where: {
                id: id,
            },
            data: data,
            select: {
                username: true,
                fullName: true,
                avatar: true,
            },
        }),
    ])

    if (anotherUser.length === 1) {
        if (anotherUser[0].id !== id) {
            throw new ResponseError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.USER.FAILED_TO_UPDATE
            )
        }
    }

    return updatedUser
}

const logout = async (req, res) => {
    const user = validate(getUserValidationSchema, req.user)

    const id = user.id

    const [, logoutUser] = await prismaClient.$transaction([
        prismaClient.user.findUniqueOrThrow({
            where: {
                id: id,
            },
        }),
        prismaClient.user.update({
            where: {
                id: id,
            },
            data: {
                token: null,
            },
        }),
    ])

    res.clearCookie('refreshToken')

    return logoutUser
}

export default { get, update, logout }
