import userService from '../service/user-service.js'
import responses from '../utils/response-api.js'
import publicService from '../service/public-service.js'
import { success } from '../utils/message-success.js'

const add = async (req, res, next) => {
    try {
        const result = await userService.add(req.body)
        res.status(success.HTTP_CODE_CREATED).send(
            responses.responseSuccess(
                success.HTTP_CODE_CREATED,
                success.HTTP_STATUS_CREATED,
                result
            )
        )
    } catch (e) {
        next(e)
    }
}

const login = async (req, res, next) => {
    try {
        const result = await publicService.login(req, res)
        res.status(success.HTTP.CODE.OK).send(
            responses.responseSuccess(success.HTTP.CODE.OK, success.HTTP.STATUS.OK, result)
        )
    } catch (e) {
        next(e)
    }
}

const get = async (req, res, next) => {
    try {
        const result = await userService.get(req)
        res.status(success.HTTP_CODE_OK).send(
            responses.responseSuccess(success.HTTP_CODE_OK, success.HTTP_STATUS_OK, result)
        )
    } catch (e) {
        next(e)
    }
}

const update = async (req, res, next) => {
    try {
        const username = req.user.username
        const request = req.body
        request.username = username

        const result = await userService.update(request)
        res.status(success.HTTP_CODE_OK).send(
            responses.responseSuccess(success.HTTP_CODE_OK, success.HTTP_STATUS_OK, result)
        )
    } catch (e) {
        next(e)
    }
}

const logout = async (req, res, next) => {
    try {
        await userService.logout(req.user.username)
        res.status(success.HTTP_CODE_OK).send(
            responses.responseSuccess(
                success.HTTP_CODE_OK,
                success.HTTP_STATUS_OK,
                success.SUCCESS_LOGOUT
            )
        )
    } catch (e) {
        next(e)
    }
}

export default { add, login, get, update, logout }
