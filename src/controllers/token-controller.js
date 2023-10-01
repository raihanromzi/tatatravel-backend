import tokenService from '../service/token-service.js'
import responses from '../utils/response-api.js'
import { success } from '../utils/message-success.js'
import { logger } from '../application/logging.js'

const refreshToken = async (req, res, next) => {
    try {
        const result = await tokenService.refresh(req, res)
        logger.info('result', result)
        res.status(success.HTTP.CODE.CREATED).send(
            responses.responseSuccess(
                success.HTTP.CODE.CREATED,
                success.HTTP.STATUS.CREATED,
                result
            )
        )
    } catch (e) {
        next(e)
    }
}

export default { refreshToken }
