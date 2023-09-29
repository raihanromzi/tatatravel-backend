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
    const newRole = validate(addRoleValidationSchema, req.body)

    const countRole = await prismaClient.role.count({
        where: {
            name: newRole.name,
        },
    })

    if (countRole === 1) {
        throw new ResponseError(
            errors.HTTP_CODE_BAD_REQUEST,
            errors.HTTP_STATUS_BAD_REQUEST,
            errors.ERROR_ROLE_ALREADY_EXISTS
        )
    }

    const result = prismaClient.role.create({
        data: {
            name: newRole.name,
        },
        select: {
            name: true,
            isActive: true,
        },
    })

    if (!result) {
        throw new ResponseError(
            errors.HTTP_CODE_INTERNAL_SERVER_ERROR,
            errors.HTTP_STATUS_INTERNAL_SERVER_ERROR,
            errors.ERROR_FAILED_TO_ADD_ROLE
        )
    }

    return result
}

const update = async (req) => {
    const updatedRole = validate(updateRoleValidationSchema, req.body)
    const idParams = validate(getRoleByIdValidationSchema, req.params)

    const { name, isActive } = updatedRole
    const roleId = idParams.id

    const findRole = await prismaClient.role.count({
        where: {
            id: roleId,
        },
    })

    if (findRole === 0) {
        throw new ResponseError(
            errors.HTTP_CODE_NOT_FOUND,
            errors.HTTP_STATUS_NOT_FOUND,
            errors.ERROR_ROLE_NOT_FOUND
        )
    }

    const findRoleByName = await prismaClient.role.count({
        where: {
            name: name,
        },
    })

    if (findRoleByName === 1) {
        throw new ResponseError(
            errors.HTTP_CODE_BAD_REQUEST,
            errors.HTTP_STATUS_BAD_REQUEST,
            errors.ERROR_ROLE_ALREADY_EXISTS
        )
    }

    const updateRole = await prismaClient.role.update({
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

    if (!updateRole) {
        throw new ResponseError(
            errors.HTTP_CODE_INTERNAL_SERVER_ERROR,
            errors.HTTP_STATUS_INTERNAL_SERVER_ERROR,
            errors.ERROR_FAILED_TO_UPDATE_ROLE
        )
    }

    return updateRole
}

const remove = async (req) => {
    const idParams = validate(deleteRoleValidationSchema, req.params)

    const roleId = idParams.id

    const countRole = await prismaClient.role.count({
        where: {
            id: roleId,
        },
    })

    if (countRole === 0) {
        throw new ResponseError(
            errors.HTTP_CODE_BAD_REQUEST,
            errors.HTTP_STATUS_BAD_REQUEST,
            errors.ERROR_ROLE_NOT_FOUND
        )
    }

    const result = await prismaClient.role.delete({
        where: {
            id: roleId,
        },
    })

    if (!result) {
        throw new ResponseError(
            errors.HTTP_CODE_INTERNAL_SERVER_ERROR,
            errors.HTTP_STATUS_INTERNAL_SERVER_ERROR,
            errors.ERROR_FAILED_TO_DELETE_ROLE
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

    const roles = await prismaClient.role.findMany({
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
    })

    if (!roles) {
        throw new ResponseError(
            errors.HTTP_CODE_NOT_FOUND,
            errors.HTTP_STATUS_NOT_FOUND,
            errors.ERROR_COUNTRY_NOT_FOUND
        )
    }

    const totalItems = await prismaClient.role.count({
        where: {
            AND: filters,
        },
    })

    if (!totalItems) {
        return {
            data: [],
            pagination: {
                page: page,
                total_item: totalItems,
                total_page: Math.ceil(totalItems / size),
            },
        }
    }

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

    const findRole = await prismaClient.role.count({
        where: {
            id: roleId,
        },
    })

    if (findRole === 0) {
        throw new ResponseError(
            errors.HTTP_CODE_NOT_FOUND,
            errors.HTTP_STATUS_NOT_FOUND,
            errors.ERROR_ROLE_NOT_FOUND
        )
    }

    const role = await prismaClient.role.findUnique({
        where: {
            id: roleId,
        },
        select: {
            id: true,
            name: true,
            isActive: true,
        },
    })

    if (!role) {
        throw new ResponseError(
            errors.HTTP_CODE_NOT_FOUND,
            errors.HTTP_STATUS_NOT_FOUND,
            errors.ERROR_COUNTRY_NOT_FOUND
        )
    }

    return role
}

export default { add, update, remove, get, getById }
