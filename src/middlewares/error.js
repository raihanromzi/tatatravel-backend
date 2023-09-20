import { ResponseError } from '../utils/response-error.js'
import response from '../utils/response.js'
import { logger } from '../application/logging.js'

const error = async (err, req, res, next) => {
    if (!err) {
        next()
        return
    }

    if (err instanceof ResponseError) {
        res.status(err.code)
            .send(response.responseError(err.code, err.status, err.message))
            .end()
    } else {
        logger.info(err.message)
        res.status(500)
            .send(response.responseError(500, 'Internal Server Error', err.message))
            .end()
    }
}

export { error }
