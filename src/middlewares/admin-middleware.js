import response from '../utils/response-api.js'
import { prismaClient } from '../application/database.js'
import { errors } from '../utils/message-error.js'

const adminMiddleware = async (req, res, next) => {
    const user = req.user

    const findUser = await prismaClient.user.findUnique({
        where: {
            id: user.id,
        },
        select: {
            isActive: true,
        },
    })

    const { isActive } = findUser

    if (!isActive) {
        res.status(errors.HTTP.CODE.UNAUTHORIZED)
            .send(
                response.responseError(
                    errors.HTTP.CODE.UNAUTHORIZED,
                    errors.HTTP.STATUS.UNAUTHORIZED,
                    errors.USER.IS_NOT_ACTIVE
                )
            )
            .end()
        return
    }

    // find role in database
    const role = await prismaClient.role.findUnique({
        where: {
            id: user.roleId,
        },
        select: {
            name: true,
            isActive: true,
        },
    })

    const { name, isActive: roleIsActive } = role

    if (name !== 'superAdmin') {
        res.status(errors.HTTP.CODE.UNAUTHORIZED)
            .send(
                response.responseError(
                    errors.HTTP.CODE.UNAUTHORIZED,
                    errors.HTTP.STATUS.UNAUTHORIZED,
                    errors.ROLE.IS_NOT_SUPER_ADMIN
                )
            )
            .end()
        return
    }

    if (!roleIsActive) {
        res.status(errors.HTTP.CODE.UNAUTHORIZED)
            .send(
                response.responseError(
                    errors.HTTP.CODE.UNAUTHORIZED,
                    errors.HTTP.STATUS.UNAUTHORIZED,
                    errors.ROLE.IS_NOT_ACTIVE
                )
            )
            .end()
        return
    }

    next()
}

export { adminMiddleware }
