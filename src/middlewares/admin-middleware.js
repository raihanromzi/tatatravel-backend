import response from '../utils/response-api.js'
import { prismaClient } from '../application/database.js'
import { errors } from '../utils/message-error.js'

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

    if (!role) {
        res.status(errors.HTTP.CODE.UNAUTHORIZED)
            .send(
                response.responseError(
                    errors.HTTP.CODE.UNAUTHORIZED,
                    errors.HTTP.STATUS.UNAUTHORIZED,
                    errors.ROLE.NOT_FOUND
                )
            )
            .end()
        return
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
        return
    }

    next()
}

export { adminMiddleware }
