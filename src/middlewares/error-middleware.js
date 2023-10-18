import {
    JoiError,
    MulterError,
    MulterErrorMultipleImages,
    ResponseError,
} from '../utils/response-error.js'
import response from '../utils/response-api.js'
import { errors } from '../utils/message-error.js'

const errorMiddleware = async (err, req, res, next) => {
    if (!err) {
        next()
        return
    }

    if (err instanceof ResponseError) {
        return res
            .status(err.code)
            .send(response.responseError(err.code, err.status, err.message))
            .end()
    } else if (err.code === 'LIMIT_FILE_SIZE') {
        // handle multer limit file size
        return res
            .status(errors.HTTP.CODE.BAD_REQUEST)
            .send(
                response.responseError(
                    errors.HTTP.CODE.BAD_REQUEST,
                    errors.HTTP.STATUS.BAD_REQUEST,
                    errors.AVATAR.MUST_BE_LESS_THAN_2MB
                )
            )
            .end()
    } else if (err instanceof MulterError) {
        // handle multer error
        await err.deleteImages()
        return res
            .status(err.code)
            .send(response.responseError(err.code, err.status, err.message))
            .end()
    } else if (err instanceof MulterErrorMultipleImages) {
        // handle multer error
        await err.deleteImages()
        return res
            .status(err.code)
            .send(response.responseError(err.code, err.status, err.message))
            .end()
    } else if (err instanceof JoiError) {
        // handle joi error
        return res
            .status(err.code)
            .send(response.responseError(err.code, err.status, err.errors))
            .end()
    } else {
        return res
            .status(errors.HTTP.CODE.INTERNAL_SERVER_ERROR)
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
