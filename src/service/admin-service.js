import { validate } from '../validation/validation.js'
import {
    activeUserValidationSchema,
    getUserValidationSchema,
    userIdValidationSchema,
    userValidationSchema,
} from '../validation/user-validation.js'
import { prismaClient } from '../application/database.js'
import { ResponseError } from '../utils/response-error.js'
import { errors } from '../utils/message-error.js'
import * as bcrypt from 'bcrypt'
import fs from 'fs/promises'

const add = async (req) => {
    const { fullName, userName, email, password, roleId } = validate(userValidationSchema, req.body)

    return prismaClient.$transaction(async (prisma) => {
        const findRole = await prisma.role.findUnique({
            where: {
                id: roleId,
            },
        })

        if (!findRole) {
            throw new ResponseError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.ROLE.NOT_FOUND
            )
        }

        const findUserUserName = await prisma.user.findUnique({
            where: {
                userName: userName,
            },
        })

        if (findUserUserName) {
            throw new ResponseError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.USER.USERNAME_ALREADY_EXIST
            )
        }

        const findUserEmail = await prisma.user.findUnique({
            where: {
                email: email,
            },
        })

        if (findUserEmail) {
            throw new ResponseError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.USER.EMAIL_ALREADY_EXIST
            )
        }

        const result = await prisma.user.create({
            data: {
                fullName: fullName,
                userName: userName,
                email: email,
                password: await bcrypt.hash(password, 10),
                role: {
                    connect: {
                        id: roleId,
                    },
                },
            },
            select: {
                userName: true,
                email: true,
                role: {
                    select: {
                        name: true,
                    },
                },
            },
        })

        if (!result) {
            throw new ResponseError(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.USER.FAILED_TO_ADD
            )
        }
        const {
            email: userEmail,
            userName: userUserName,
            role: { name: userRoleName },
        } = result

        return {
            email: userEmail,
            userName: userUserName,
            roleName: userRoleName,
        }
    })
}
const get = async (req) => {
    const { name, email, userName, role, page, size, sortBy, orderBy } = validate(
        getUserValidationSchema,
        req.query
    )
    const { id: userId } = req.user
    const skip = (page - 1) * size
    const filters = []

    if (sortBy) {
        if (
            sortBy !== 'id' &&
            sortBy !== 'fullName' &&
            sortBy !== 'userName' &&
            sortBy !== 'email' &&
            sortBy !== 'role'
        ) {
            throw new ResponseError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.SORT_BY.MUST_BE_VALID
            )
        }
    }

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

    if (userName) {
        filters.push({
            userName: {
                contains: userName,
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

    return prismaClient.$transaction(async (prisma) => {
        const users = await prisma.user.findMany({
            where: {
                AND: filters,
                NOT: {
                    id: userId,
                },
            },
            select: {
                id: true,
                fullName: true,
                userName: true,
                email: true,
                role: {
                    select: {
                        name: true,
                    },
                },
                isActive: true,
            },
            take: size,
            skip: skip,
            orderBy: {
                [sortBy]: orderBy,
            },
        })

        // convert role object to role name
        users.forEach((user) => {
            user.role = user.role.name
        })

        const totalItems = await prisma.user.count({
            where: {
                AND: filters,
            },
        })

        return {
            data: users,
            pagination: {
                page: page,
                total_item: totalItems,
                total_page: Math.ceil(totalItems / size),
            },
        }
    })
}

const update = async (req) => {
    const { id: paramUserid } = validate(userIdValidationSchema, req.params)
    const { id: currentUserId } = req.user

    if (paramUserid === currentUserId) {
        throw new ResponseError(
            errors.HTTP.CODE.FORBIDDEN,
            errors.HTTP.STATUS.FORBIDDEN,
            errors.USER.CANNOT_UPDATE_YOURSELF
        )
    }

    const { isActive } = validate(activeUserValidationSchema, req.body)

    return prismaClient.$transaction(async (prisma) => {
        const findUser = await prisma.user.findUnique({
            where: {
                id: paramUserid,
            },
        })

        if (!findUser) {
            throw new ResponseError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.USER.NOT_FOUND
            )
        }

        const result = prisma.user.update({
            where: {
                id: paramUserid,
            },
            data: {
                isActive: isActive,
            },
            select: {
                id: true,
                userName: true,
                isActive: true,
            },
        })

        if (!result) {
            throw new ResponseError(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.USER.FAILED_TO_UPDATE
            )
        }

        return result
    })
}

const remove = async (req) => {
    const { id: paramUserId } = validate(userIdValidationSchema, req.params)
    const { id: currentUserId } = req.user

    if (paramUserId === currentUserId) {
        throw new ResponseError(
            errors.HTTP.CODE.FORBIDDEN,
            errors.HTTP.STATUS.FORBIDDEN,
            errors.USER.CANNOT_DELETE_YOURSELF
        )
    }

    return prismaClient.$transaction(async (prisma) => {
        const findUser = await prisma.user.findUnique({
            where: {
                id: paramUserId,
            },
        })

        if (!findUser) {
            throw new ResponseError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.USER.NOT_FOUND
            )
        }

        await fs.rm(`public/images/avatar/${paramUserId}`, { recursive: true, force: true })

        return prisma.user.delete({
            where: {
                id: paramUserId,
            },
        })
    })
}

export default { add, remove, get, update }
