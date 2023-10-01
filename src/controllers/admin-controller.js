import adminService from '../service/admin-service.js'
import responses from '../utils/response-api.js'
import { success } from '../utils/message-success.js'
import userService from '../service/user-service.js'

const search = async (req, res, next) => {
    try {
        const query = {
            name: req.query.name,
            email: req.query.email,
            username: req.query.username,
            role: req.query.role,
            page: req.query.page,
            size: req.query.size,
        }

        const result = await adminService.searchUser(query)
        res.status(success.HTTP.CODE.OK).send(
            responses.responseSuccess(
                success.HTTP.CODE.OK,
                success.HTTP.STATUS.OK,
                result.data,
                result.pagination
            )
        )
    } catch (e) {
        next(e)
    }
}

const remove = async (req, res, next) => {
    try {
        const user = req.user
        const userId = req.params.userId
        await adminService.deleteUser(user, userId)
        res.status(success.HTTP.CODE.OK).send(
            responses.responseSuccess(
                success.HTTP.CODE.OK,
                success.HTTP.STATUS.OK,
                success.USER.DELETE
            )
        )
    } catch (e) {
        next(e)
    }
}

export const add = async (req, res, next) => {
    try {
        const result = await userService.add(req.body)
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

export default { add, search, remove }
