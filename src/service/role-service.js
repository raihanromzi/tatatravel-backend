import {
    addRoleValidationSchema,
    deleteRoleValidationSchema,
    updateRoleValidationSchema,
} from '../validation/role-validation.js'
import { prismaClient } from '../application/database.js'
import { ResponseError } from '../utils/response-error.js'
import { validate } from '../validation/validation.js'

const add = async (request) => {
    const roleRequest = await validate(addRoleValidationSchema, request)

    const countRole = await prismaClient.role.count({
        where: {
            name: roleRequest.name,
        },
    })

    if (countRole === 1) {
        throw new ResponseError(400, 'Bad Request', 'Role already exists')
    }

    const result = prismaClient.role.create({
        data: {
            name: roleRequest.name,
        },
    })

    if (!result) {
        throw new ResponseError(500, 'Internal Server Error', 'Failed to add role')
    }

    return result
}

const update = async (request) => {
    const roleRequest = await validate(updateRoleValidationSchema, request)

    const countRole = await prismaClient.role.count({
        where: {
            id: roleRequest.roleId,
        },
    })

    if (countRole === 0) {
        throw new ResponseError(400, 'Bad Request', 'Role not found')
    }

    const result = prismaClient.role.update({
        where: {
            id: roleRequest.roleId,
        },
        data: {
            name: roleRequest.name,
        },
    })

    if (!result) {
        throw new ResponseError(500, 'Internal Server Error', 'Failed to update role')
    }

    return result
}

const remove = async (request) => {
    const roleId = await validate(deleteRoleValidationSchema, request)

    const countRole = await prismaClient.role.count({
        where: {
            id: roleId,
        },
    })

    if (countRole === 0) {
        throw new ResponseError(400, 'Bad Request', 'Role not found')
    }

    const result = prismaClient.role.delete({
        where: {
            id: roleId,
        },
    })

    if (!result) {
        throw new ResponseError(500, 'Internal Server Error', 'Failed to delete role')
    }

    return result
}

export default { add, update, remove }
