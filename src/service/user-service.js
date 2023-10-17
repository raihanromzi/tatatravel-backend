import { validate } from '../validation/validation.js'
import {
    avatarValidationSchema,
    getUserValidationSchema,
    updateUserValidationSchema,
} from '../validation/user-validation.js'
import { prismaClient } from '../application/database.js'
import { MulterError, ResponseError } from '../utils/response-error.js'
import * as bcrypt from 'bcrypt'
import { errors } from '../utils/message-error.js'
import fs from 'fs/promises'

const get = async (req) => {
    const { id: userId } = validate(getUserValidationSchema, { id: req.user.id })
    const { roleId } = req.user

    const findUser = await prismaClient.user.findUnique({
        where: {
            id: userId,
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
    const { id: userId } = validate(getUserValidationSchema, { id: req.user.id })
    const { avatar: images } = validate(avatarValidationSchema, { avatar: req.files })
    let avatar = []
    if (images && images.length > 0) {
        avatar = images.map((image) => {
            return {
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

    if (avatar && avatar.length > 0) {
        data.avatar = avatar[0].filename
    }

    if (userName) {
        data.userName = userName
    }

    return prismaClient.$transaction(async (prisma) => {
        const findUser = await prisma.user.findUnique({
            where: {
                id: userId,
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

        const updateUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: data,
        })

        if (!updateUser) {
            throw new MulterError(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.USER.FAILED_TO_UPDATE,
                avatar
            )
        }

        if (avatar.length > 0) {
            try {
                await fs.mkdir(`public/images/avatar/${userId}`, { recursive: true })
                const oldAvatar = await fs.readdir(`public/images/avatar/${userId}`)

                // Delete old avatar
                for (const avatar of oldAvatar) {
                    await fs.unlink(`public/images/avatar/${userId}/${avatar}`)
                }
            } catch (error) {
                throw new MulterError(
                    errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                    errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                    errors.AVATAR.FAILED_TO_CREATE_DIRECTORY,
                    avatar
                )
            }

            await Promise.all(
                avatar.map(async (image) => {
                    const { path: oldPath, filename } = image
                    const newPath = `public/images/avatar/${userId}/${filename}`

                    try {
                        await fs.rename(oldPath, newPath)
                        await prisma.user.update({
                            where: {
                                id: userId,
                            },
                            data: {
                                avatar: newPath,
                            },
                            select: {
                                userName: true,
                                fullName: true,
                                avatar: true,
                            },
                        })
                    } catch (error) {
                        const deleteDirectoryAndEmptyAvatar = async () => {
                            await fs.rm(`public/images/avatar/${userId}`, {
                                recursive: true,
                                force: true,
                            })
                            await prisma.user.update({
                                where: {
                                    id: userId,
                                },
                                data: {
                                    avatar: null,
                                },
                            })
                            await fs.rm(oldPath, { recursive: true, force: true })
                        }

                        return deleteDirectoryAndEmptyAvatar()
                            .then(() => {
                                throw new MulterError(
                                    errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                                    errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                                    errors.USER.FAILED_TO_UPDATE,
                                    avatar
                                )
                            })
                            .catch(() => {
                                throw new MulterError(
                                    errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                                    errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                                    errors.USER.FAILED_TO_UPDATE,
                                    avatar
                                )
                            })
                    }
                })
            )
        }

        return prisma.user.findUnique({
            where: {
                id: userId,
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
    const { id: userId } = validate(getUserValidationSchema, { id: req.user.id })

    return prismaClient.$transaction(async (prisma) => {
        const findUser = await prisma.user.findUnique({
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
