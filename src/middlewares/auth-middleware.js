import { prismaClient } from '../application/database.js'
import response from '../utils/response-api.js'
import { logger } from '../application/logging.js'

const authMiddleware = async (req, res, next) => {
    if (!req.get('Authorization')) {
        res.status(401)
            .send(response.responseError(401, 'Unauthorized', 'Authorization header is required'))
            .end()
        return
    }
    const token = req.get('Authorization').split(' ')[1]

    if (!token) {
        res.status(401)
            .send(response.responseError(401, 'Unauthorized', 'token is required'))
            .end()
    } else {
        const user = await prismaClient.user.findFirst({
            where: {
                token: token,
            },
            select: {
                username: true,
            },
        })

        if (!user) {
            res.status(401)
                .send(response.responseError(404, 'Not Found', 'user is not founds'))
                .end()
        } else {
            req.user = user
            next()
        }
    }
}

export { authMiddleware }
