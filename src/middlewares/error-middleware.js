import { ResponseError } from '../utils/response-error.js'
import response from '../utils/response-api.js'
import { errors } from '../utils/message-error.js'

const errorMiddleware = async (err, req, res, next) => {
    if (!err) {
        next()
        return
    }

    if (err instanceof ResponseError) {
        res.status(err.code)
            .send(response.responseError(err.code, err.status, err.message))
            .end()
    } else {
        res.status(errors.HTTP.CODE.INTERNAL_SERVER_ERROR)
            .send(
                response.responseError(
                    errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                    errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                    err.message
                )
            )
            .end()
    }
}

export { errorMiddleware }
