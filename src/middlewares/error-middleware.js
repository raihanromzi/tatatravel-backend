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
    } else if (err.code === 'LIMIT_FILE_SIZE') {
        // handle multer limit file size
        res.status(errors.HTTP.CODE.BAD_REQUEST)
            .send(
                response.responseError(
                    errors.HTTP.CODE.BAD_REQUEST,
                    errors.HTTP.STATUS.BAD_REQUEST,
                    errors.AVATAR.MUST_LESS_THAN_2MB
                )
            )
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
