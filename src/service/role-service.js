import {
    getRoleValidationSchema,
    roleIdValidationSchema,
    roleNameValidationSchema,
    updateRoleValidationSchema,
} from '../validation/role-validation.js'
import { prismaClient } from '../application/database.js'
import { ResponseError } from '../utils/response-error.js'
import { validate } from '../validation/validation.js'
import { errors } from '../utils/message-error.js'

const add = async (req) => {
    const { name } = validate(roleNameValidationSchema, req.body)

    return prismaClient.$transaction(async (prisma) => {
        const countRole = await prisma.role.count({
            where: {
                name: name,
            },
        })

        if (countRole === 1) {
            throw new ResponseError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.ROLE.ALREADY_EXISTS
            )
        }

        const result = await prisma.role.create({
            data: {
                name: name,
            },
            select: {
                name: true,
            },
        })

        if (!result) {
            throw new ResponseError(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.ROLE.FAILED_TO_ADD
            )
        }

        return result
    })
}

const get = async (req) => {
    const { name, page, size, sortBy, orderBy } = validate(getRoleValidationSchema, req.query)
    const skip = (page - 1) * size
    const filters = []

    if (sortBy) {
        if (sortBy !== 'id' && sortBy !== 'name') {
            throw new ResponseError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.SORT_BY.MUST_BE_VALID
            )
        }
    }

    if (name) {
        filters.push({
            name: {
                contains: name,
            },
        })
    }

    return prismaClient.$transaction(async (prisma) => {
        const roles = await prisma.role.findMany({
            where: {
                AND: filters,
            },
            select: {
                id: true,
                name: true,
                isActive: true,
                _count: {
                    select: {
                        user: true,
                    },
                },
            },
            take: size,
            skip: skip,
            orderBy: {
                [sortBy]: orderBy,
            },
        })

        const totalItems = await prisma.role.count({
            where: {
                AND: filters,
            },
        })

        const result = roles.map((role) => {
            const { id, name, isActive, _count } = role
            return {
                id: id,
                name: name,
                isActive: isActive,
                totalUser: _count.user,
            }
        })

        return {
            data: result,
            pagination: {
                page: page,
                total_item: totalItems,
                total_page: Math.ceil(totalItems / size),
            },
        }
    })
}

const getById = async (req) => {
    const { id: roleId } = await validate(roleIdValidationSchema, req.params)

    return prismaClient.$transaction(async (prisma) => {
        const findRole = await prisma.role.count({
            where: {
                id: roleId,
            },
        })

        if (findRole === 0) {
            throw new ResponseError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.ROLE.NOT_FOUND
            )
        }

        return prisma.role.findUnique({
            where: {
                id: roleId,
            },
            select: {
                id: true,
                name: true,
                isActive: true,
            },
        })
    })
}

const update = async (req) => {
    const { name, isActive } = validate(updateRoleValidationSchema, req.body)
    const { id: roleId } = validate(roleIdValidationSchema, req.params)

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

        const findRoleByName = await prisma.role.findUnique({
            where: {
                name: name || '',
            },
        })

        if (findRoleByName) {
            throw new ResponseError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.ROLE.ALREADY_EXISTS
            )
        }

        return prisma.role.update({
            where: {
                id: roleId,
            },
            data: {
                name: name,
                isActive: isActive,
            },
            select: {
                id: true,
                name: true,
                isActive: true,
            },
        })
    })
}

const remove = async (req) => {
    const { id: roleId } = validate(roleIdValidationSchema, req.params)

    return prismaClient.$transaction(async (prisma) => {
        const countRole = await prisma.role.count({
            where: {
                id: roleId,
            },
        })

        if (countRole === 0) {
            throw new ResponseError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.ROLE.NOT_FOUND
            )
        }

        await prisma.role.delete({
            where: {
                id: roleId,
            },
        })
    })
}

export default { add, update, remove, get, getById }
