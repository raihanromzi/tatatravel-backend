import { validate } from '../validation/validation.js'
import {
    avatarValidationSchema,
    updateUserValidationSchema,
} from '../validation/user-validation.js'
import { prismaClient } from '../application/database.js'
import { MulterError, ResponseError } from '../utils/response-error.js'
import * as bcrypt from 'bcrypt'
import { errors } from '../utils/message-error.js'
import fs from 'fs/promises'

const get = async (req) => {
    const { id: userId, roleId } = req.user

    if (!parseInt(userId)) {
        throw new ResponseError(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.USER.ID.MUST_BE_VALID
        )
    }

    if (!parseInt(roleId)) {
        throw new ResponseError(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.ROLE.ID.MUST_BE_VALID
        )
    }

    const findUser = await prismaClient.user.findUnique({
        where: {
            id: parseInt(userId),
            roleId: parseInt(roleId),
        },
        select: {
            email: true,
            userName: true,
            fullName: true,
            avatar: true,
            role: {
                select: {
                    id: true,
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

    if (findUser.role.id !== roleId) {
        throw new ResponseError(
            errors.HTTP.CODE.FORBIDDEN,
            errors.HTTP.STATUS.FORBIDDEN,
            errors.HTTP.MESSAGE.FORBIDDEN
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
    const { userName, fullName, password } = validate(updateUserValidationSchema, req.body)
    const { avatar: images } = validate(avatarValidationSchema, { avatar: req.files })
    const { id: userId } = req.user

    if (!parseInt(userId)) {
        throw new ResponseError(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.USER.ID.MUST_BE_VALID
        )
    }

    if (images.length > 1) {
        throw new MulterError(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.AVATAR.IS_REQUIRED,
            images
        )
    }

    let avatar = {}
    if (images && images.length > 0) {
        images.map((image) => {
            avatar = {
                filename: image.filename,
                path: image.path,
            }
        })
    }

    const data = {}

    if (fullName) {
        data.fullName = fullName
    }

    if (password) {
        data.password = await bcrypt.hash(password, 10)
    }

    if (avatar) {
        data.avatar = avatar.filename
    }

    if (userName) {
        data.userName = userName
    }

    return prismaClient.$transaction(async (prisma) => {
        const findUser = await prisma.user.findUnique({
            where: {
                id: parseInt(userId),
            },
        })

        if (!findUser) {
            throw new MulterError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.USER.NOT_FOUND,
                avatar
            )
        }

        const findUsersByUsername = await prisma.user.findUnique({
            where: {
                userName: userName || '',
            },
            select: {
                id: true,
            },
        })

        if (findUsersByUsername) {
            const { id } = findUsersByUsername
            if (id !== userId) {
                throw new MulterError(
                    errors.HTTP.CODE.BAD_REQUEST,
                    errors.HTTP.STATUS.BAD_REQUEST,
                    errors.USER.ALREADY_EXISTS,
                    avatar
                )
            }
        }

        const { path: oldPath, filename } = avatar
        const newPath = `public/images/avatar/${parseInt(userId)}/${filename}`

        try {
            // Delete old avatar
            const oldAvatar = await fs.readdir(`public/images/avatar/${parseInt(userId)}`)
            for (const avatar of oldAvatar) {
                await fs.unlink(`public/images/avatar/${parseInt(userId)}/${avatar}`)
            }

            await prisma.user.update({
                where: {
                    id: parseInt(userId),
                },
                data: { ...data, avatar: newPath },
            })
            await fs.mkdir(`public/images/avatar/${parseInt(userId)}`, { recursive: true })
            await fs.rename(oldPath, newPath)
        } catch (error) {
            throw new MulterError(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.USER.FAILED_TO_UPDATE,
                [avatar]
            )
        }

        return prisma.user.findUnique({
            where: {
                id: parseInt(userId),
            },
            select: {
                fullName: true,
                userName: true,
                avatar: true,
            },
        })
    })
}

const logout = async (req, res) => {
    const { id: userId } = req.user

    if (!parseInt(userId)) {
        throw new ResponseError(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.USER.ID.MUST_BE_VALID
        )
    }

    return prismaClient.$transaction(async (prisma) => {
        const findUser = await prisma.user.findUnique({
            where: {
                id: parseInt(userId),
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
                id: parseInt(userId),
            },
            data: {
                token: null,
            },
        })
    })
}

export default { get, update, logout }
