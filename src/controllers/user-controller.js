import userService from '../service/user-service.js'
import responses from '../utils/response-api.js'
import { logger } from '../application/logging.js'

const add = async (req, res, next) => {
    try {
        const result = await userService.add(req.body)

        res.status(201).send(responses.responseSuccess(201, 'CREATED', result))
    } catch (e) {
        logger.error(e)
        next(e)
    }
}

const login = async (req, res, next) => {
    try {
        const result = await userService.login(req.body)
        res.status(200).send(responses.responseSuccess(200, 'OK', result))
    } catch (e) {
        logger.error(e)
        next(e)
    }
}

const getUser = async (req, res, next) => {
    try {
        const username = req.user.username
        const result = await userService.getUser(username)
        res.status(200).send(responses.responseSuccess(200, 'OK', result))
    } catch (e) {
        logger.error(e)
        next(e)
    }
}

export default { add, login, getUser }
