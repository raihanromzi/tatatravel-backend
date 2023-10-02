import userService from '../service/user-service.js'
import responses from '../utils/response-api.js'
import { success } from '../utils/message-success.js'

const get = async (req, res, next) => {
    try {
        const result = await userService.get(req)
        res.status(success.HTTP.CODE.OK).send(
            responses.responseSuccess(success.HTTP.CODE.OK, success.HTTP.STATUS.OK, result)
        )
    } catch (e) {
        next(e)
    }
}

const update = async (req, res, next) => {
    try {
        const result = await userService.update(req)
        res.status(success.HTTP.CODE.OK).send(
            responses.responseSuccess(success.HTTP.CODE.OK, success.HTTP.STATUS.OK, result)
        )
    } catch (e) {
        next(e)
    }
}

const logout = async (req, res, next) => {
    try {
        await userService.logout(req, res)
        res.status(success.HTTP.CODE.OK).send(
            responses.responseSuccess(
                success.HTTP.CODE.OK,
                success.HTTP.STATUS.OK,
                success.AUTHENTICATION.LOGOUT
            )
        )
    } catch (e) {
        next(e)
    }
}

export default { get, update, logout }
