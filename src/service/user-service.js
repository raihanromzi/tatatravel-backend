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

    const foundUser = await prismaClient.user.findUnique({
        where: {
            id: id,
        },
        select: {
            email: true,
            username: true,
            fullName: true,
            role: {
                select: {
                    name: true,
                },
            },
        },
    })

    if (!foundUser) {
        throw new ResponseError(
            errors.HTTP.CODE.NOT_FOUND,
            errors.HTTP.STATUS.NOT_FOUND,
            errors.USER.NOT_FOUND
        )
    }

    const { email, username, fullName, role } = foundUser

    return {
        email: email,
        username: username,
        fullName: fullName,
        role: role.name,
    }
}

const update = async (req) => {
    const user = validate(updateUserValidationSchema, req.body)

    const avatar = validate(avatarValidationSchema, req.file)

    const id = req.user.id

    const { username, fullName, password } = user

    const { path } = avatar

    const foundUser = await prismaClient.user.count({
        where: {
            id: id,
        },
    })

    if (foundUser !== 1) {
        throw new ResponseError(
            errors.HTTP.CODE.NOT_FOUND,
            errors.HTTP.STATUS.NOT_FOUND,
            errors.USER.NOT_FOUND
        )
    }

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

    return prismaClient.user.update({
        where: {
            id: id,
        },
        data: data,
        select: {
            username: true,
            fullName: true,
            avatar: true,
        },
    })
}

const logout = async (req, res) => {
    const user = validate(getUserValidationSchema, req.user)

    const id = user.id

    const foundUser = await prismaClient.user.findUnique({
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

    await prismaClient.user.update({
        where: {
            id: id,
        },
        data: {
            token: null,
        },
    })

    res.clearCookie('refreshToken')
}

export default { get, update, logout }
