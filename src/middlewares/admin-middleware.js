import response from '../utils/response-api.js'
import { prismaClient } from '../application/database.js'

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
        res.status(401)
            .send(response.responseError(401, 'Unauthorized', 'role is unknown'))
            .end()
    }

    if (role.name !== 'admin') {
        res.status(401)
            .send(response.responseError(401, 'Unauthorized', 'role is not admin'))
            .end()
    }

    next()
}

export { adminMiddleware }
