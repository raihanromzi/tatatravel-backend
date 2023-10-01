import response from '../utils/response-api.js'
import { prismaClient } from '../application/database.js'
import { errors } from '../utils/message-error.js'
import { logger } from '../application/logging.js'

const adminMiddleware = async (req, res, next) => {
    const user = req.user

    // find role in database
    const role = await prismaClient.role.findUnique({
        where: {
            id: user.roleId,
        },
        select: {
            name: true,
        },
    })

    logger.info(`Role: ${role.name}`)

    if (!role.name) {
        res.status(errors.HTTP.CODE.UNAUTHORIZED)
            .send(
                response.responseError(
                    errors.HTTP.CODE.UNAUTHORIZED,
                    errors.HTTP.STATUS.UNAUTHORIZED,
                    errors.ROLE.IS_UNKNOWN
                )
            )
            .end()
    }

    if (role.name !== 'super admin') {
        res.status(errors.HTTP.CODE.UNAUTHORIZED)
            .send(
                response.responseError(
                    errors.HTTP.CODE.UNAUTHORIZED,
                    errors.HTTP.STATUS.UNAUTHORIZED,
                    errors.ROLE.IS_NOT_SUPER_ADMIN
                )
            )
            .end()
    }

    next()
}

export { adminMiddleware }
