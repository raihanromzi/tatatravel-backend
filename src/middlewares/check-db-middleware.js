import { prismaClient } from '../application/database.js'
import { errors } from '../utils/message-error.js'
import response from '../utils/response-api.js'

const checkDbMiddleware = async (req, res, next) => {
    try {
        await prismaClient.$connect()
        next()
    } catch (e) {
        return res
            .status(errors.HTTP.CODE.INTERNAL_SERVER_ERROR)
            .send(
                response.responseError(
                    errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                    errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                    errors.DATABASE.CONNECTION
                )
            )
    }
}

export { checkDbMiddleware }
