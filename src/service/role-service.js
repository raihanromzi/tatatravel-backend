import {
    addRoleValidationSchema,
    deleteRoleValidationSchema,
    getRoleByIdValidationSchema,
    getRoleValidationSchema,
    updateRoleValidationSchema,
} from '../validation/role-validation.js'
import { prismaClient } from '../application/database.js'
import { ResponseError } from '../utils/response-error.js'
import { validate } from '../validation/validation.js'
import { errors } from '../utils/message-error.js'

const add = async (req) => {
    const role = validate(addRoleValidationSchema, req.body)

    const { name } = role

    const [countRole, result] = await prismaClient.$transaction([
        prismaClient.role.count({
            where: {
                name: name,
            },
        }),
        prismaClient.role.create({
            data: {
                name: name,
            },
            select: {
                name: true,
                isActive: true,
            },
        }),
    ])

    if (countRole === 1) {
        throw new ResponseError(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.ROLE.ALREADY_EXISTS
        )
    }

    if (!result) {
        throw new ResponseError(
            errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
            errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
            errors.ROLE.FAILED_TO_ADD
        )
    }

    return result
}

const update = async (req) => {
    const role = validate(updateRoleValidationSchema, req.body)

    const params = validate(getRoleByIdValidationSchema, req.params)

    const { name, isActive } = role

    const roleId = params.id

    const [findRole, findRoleByName, updateRole] = await prismaClient.$transaction([
        prismaClient.role.count({
            where: {
                id: roleId,
            },
        }),
        prismaClient.role.count({
            where: {
                name: name,
            },
        }),
        prismaClient.role.update({
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
        }),
    ])

    if (findRole === 0) {
        throw new ResponseError(
            errors.HTTP.CODE.NOT_FOUND,
            errors.HTTP.STATUS.NOT_FOUND,
            errors.ROLE.NOT_FOUND
        )
    }

    if (findRoleByName === 1) {
        throw new ResponseError(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.ROLE.ALREADY_EXISTS
        )
    }

    if (!updateRole) {
        throw new ResponseError(
            errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
            errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
            errors.ROLE.FAILED_TO_UPDATE
        )
    }

    return updateRole
}

const remove = async (req) => {
    const params = validate(deleteRoleValidationSchema, req.params)

    const roleId = params.id

    const [countRole, result] = await prismaClient.$transaction([
        prismaClient.role.count({
            where: {
                id: roleId,
            },
        }),
        prismaClient.role.delete({
            where: {
                id: roleId,
            },
        }),
    ])

    if (countRole === 0) {
        throw new ResponseError(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.ROLE.NOT_FOUND
        )
    }

    if (!result) {
        throw new ResponseError(
            errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
            errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
            errors.ROLE.FAILED_TO_DELETE
        )
    }

    return result
}

const get = async (req) => {
    const query = validate(getRoleValidationSchema, req.query)

    const { name, page, size } = query

    const skip = (page - 1) * size

    const filters = []

    if (name) {
        filters.push({
            name: {
                contains: name,
            },
        })
    }

    const [roles, totalItems] = await prismaClient.$transaction([
        prismaClient.role.findMany({
            where: {
                AND: filters,
            },
            select: {
                id: true,
                name: true,
                isActive: true,
            },
            take: size,
            skip: skip,
        }),
        prismaClient.role.count({
            where: {
                AND: filters,
            },
        }),
    ])

    return {
        data: roles,
        pagination: {
            page: page,
            total_item: totalItems,
            total_page: Math.ceil(totalItems / size),
        },
    }
}

const getById = async (req) => {
    const params = await validate(getRoleByIdValidationSchema, req.params)

    const roleId = params.id

    const [findRole] = await prismaClient.$transaction([
        prismaClient.role.count({
            where: {
                id: roleId,
            },
        }),
    ])

    if (findRole === 0) {
        throw new ResponseError(
            errors.HTTP.CODE.NOT_FOUND,
            errors.HTTP.STATUS.NOT_FOUND,
            errors.ROLE.NOT_FOUND
        )
    }

    return prismaClient.role.findUniqueOrThrow({
        where: {
            id: roleId,
        },
        select: {
            id: true,
            name: true,
            isActive: true,
        },
    })
}

export default { add, update, remove, get, getById }
