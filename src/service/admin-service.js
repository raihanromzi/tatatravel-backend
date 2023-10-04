import { validate } from '../validation/validation.js'
import {
    addUserValidationSchema,
    deleteUserValidationSchema,
    getUserValidationSchema,
    searchUserValidationSchema,
    updateActiveUserValidationSchema,
} from '../validation/user-validation.js'
import { prismaClient } from '../application/database.js'
import { ResponseError } from '../utils/response-error.js'
import { errors } from '../utils/message-error.js'
import * as bcrypt from 'bcrypt'
import fs from 'fs'

const add = async (req) => {
    const user = validate(addUserValidationSchema, req.body)
    const { fullName, username, email, password, role } = user

    return prismaClient.$transaction(async (prisma) => {
        const findRole = await prisma.role.findUnique({
            where: {
                id: role,
            },
        })

        if (!findRole) {
            throw new ResponseError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.ROLE.NOT_FOUND
            )
        }

        const countSameUsernameOrEmail = await prisma.user.count({
            where: {
                OR: [
                    {
                        email: email,
                    },
                    {
                        username: username,
                    },
                ],
            },
        })

        if (countSameUsernameOrEmail === 1) {
            throw new ResponseError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.USER.ALREADY_EXISTS
            )
        }

        const result = await prisma.user.create({
            data: {
                fullName: fullName,
                username: username,
                email: email,
                password: await bcrypt.hash(password, 10),
                role: {
                    connect: {
                        id: role,
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
    })
}
const remove = async (req) => {
    const paramUserId = validate(deleteUserValidationSchema, req.params.id)
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

        fs.rmSync(`public/images/avatar/${paramUserId}`, { recursive: true, force: true })

        return prisma.user.delete({
            where: {
                id: paramUserId,
            },
        })
    })
}

const get = async (req) => {
    const query = validate(searchUserValidationSchema, req.query)
    const userId = req.user.id
    const { name, email, username, role, page, size, sortBy, orderBy } = query
    const skip = (page - 1) * size
    const filters = []

    if (sortBy) {
        if (
            sortBy !== 'id' &&
            sortBy !== 'fullName' &&
            sortBy !== 'username' &&
            sortBy !== 'email' &&
            sortBy !== 'role'
        ) {
            throw new ResponseError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.SORT_BY.MUST_VALID
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

    if (username) {
        filters.push({
            username: {
                contains: username,
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
                username: true,
                email: true,
                role: {
                    select: {
                        name: true,
                    },
                },
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
    const paramUserid = validate(getUserValidationSchema, req.params)
    const currentUserId = req.user.id

    if (paramUserid === currentUserId) {
        throw new ResponseError(
            errors.HTTP.CODE.FORBIDDEN,
            errors.HTTP.STATUS.FORBIDDEN,
            errors.USER.CANNOT_UPDATE_YOURSELF
        )
    }

    const user = validate(updateActiveUserValidationSchema, req.body)
    const { isActive } = user

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

export default { add, remove, get, update }
