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

    const { id: userId } = user

    const findUser = await prismaClient.user.findUnique({
        where: {
            id: userId,
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

    if (!findUser) {
        throw new ResponseError(
            errors.HTTP.CODE.NOT_FOUND,
            errors.HTTP.STATUS.NOT_FOUND,
            errors.USER.NOT_FOUND
        )
    }

    const { email, username, fullName, avatar, role } = findUser

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

    const { id: userId } = req.user

    const { username, fullName, password } = user

    const { path } = avatar

    const data = {}

    if (fullName) {
        data.fullName = fullName
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

    return prismaClient.$transaction(async (prisma) => {
        const findUser = await prisma.user.findUniqueOrThrow({
            where: {
                id: userId,
            },
        })

        if (!findUser) {
            throw new ResponseError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.USER.NOT_FOUND
            )
        }

        const findUserByUsername = await prisma.user.findMany({
            where: {
                username: username,
            },
        })

        if (findUserByUsername.length === 1) {
            if (findUserByUsername[0].id !== userId) {
                throw new ResponseError(
                    errors.HTTP.CODE.BAD_REQUEST,
                    errors.HTTP.STATUS.BAD_REQUEST,
                    errors.USER.ALREADY_EXISTS
                )
            }
        }

        return prisma.user.update({
            where: {
                id: userId,
            },
            data: data,
            select: {
                username: true,
                fullName: true,
                avatar: true,
            },
        })
    })
}

const logout = async (req, res) => {
    const user = validate(getUserValidationSchema, req.user)

    const { id: userId } = user

    return prismaClient.$transaction(async (prisma) => {
        const findUser = await prisma.user.findUniqueOrThrow({
            where: {
                id: userId,
            },
        })

        if (!findUser) {
            throw new ResponseError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.USER.NOT_FOUND
            )
        }

        res.clearCookie('refreshToken')

        return prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                token: null,
            },
        })
    })
}

export default { get, update, logout }
