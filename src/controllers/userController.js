import userService from '../service/user.service.js'
import responses from '../utils/response.js'
import { logger } from '../application/logging.js'

const add = async (req, res, next) => {
    try {
        const result = await userService.add(req.body)

        res.status(200).send(responses.responseSuccess(200, 'OK', result))
    } catch (e) {
        logger.error(e)
        next(e)
    }
}

export default { add }
