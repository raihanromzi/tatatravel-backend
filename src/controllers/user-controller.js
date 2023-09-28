import userService from '../service/user-service.js'
import responses from '../utils/response-api.js'
import publicService from '../service/public-service.js'

const add = async (req, res, next) => {
    try {
        const result = await userService.add(req.body)
        res.status(201).send(responses.responseSuccess(201, 'CREATED', result))
    } catch (e) {
        next(e)
    }
}

const login = async (req, res, next) => {
    try {
        const result = await publicService.login(req.body, res)
        res.status(200).send(responses.responseSuccess(200, 'OK', result))
    } catch (e) {
        next(e)
    }
}

const getUser = async (req, res, next) => {
    try {
        const result = await userService.getUser(req)
        res.status(200).send(responses.responseSuccess(200, 'OK', result))
    } catch (e) {
        next(e)
    }
}

const updateUser = async (req, res, next) => {
    try {
        const username = req.user.username
        const request = req.body
        request.username = username

        const result = await userService.updateUser(request)
        res.status(200).send(responses.responseSuccess(200, 'OK', result))
    } catch (e) {
        next(e)
    }
}

const logout = async (req, res, next) => {
    try {
        await userService.logout(req.user.username)
        res.status(200).send(responses.responseSuccess(200, 'OK', 'Logout success'))
    } catch (e) {
        next(e)
    }
}

export default { add, login, getUser, updateUser, logout }
