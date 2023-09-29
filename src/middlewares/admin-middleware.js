import response from '../utils/response-api.js'
import { prismaClient } from '../application/database.js'
import { errors } from '../utils/message-error.js'

const adminMiddleware = async (req, res, next) => {
    const user = req.user

    // find role in database
    const role = await prismaClient.role.findFirst({
        where: {
            id: user.roleId,
        },
        select: {
            name: true,
        },
    })

    if (!role.name) {
        res.status(errors.HTTP_CODE_UNAUTHORIZED)
            .send(
                response.responseError(
                    errors.HTTP_CODE_UNAUTHORIZED,
                    errors.HTTP_STATUS_UNAUTHORIZED,
                    errors.ERROR_ROLE_UNKNOWN
                )
            )
            .end()
    }

    if (role.name !== 'super admin') {
        res.status(errors.HTTP_CODE_UNAUTHORIZED)
            .send(
                response.responseError(
                    errors.HTTP_CODE_UNAUTHORIZED,
                    errors.HTTP_STATUS_UNAUTHORIZED,
                    errors.ERROR_ROLE_NOT_SUPER_ADMIN
                )
            )
            .end()
    }

    next()
}

export { adminMiddleware }
