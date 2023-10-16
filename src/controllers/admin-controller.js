import adminService from '../service/admin-service.js'
import responses from '../utils/response-api.js'
import { success } from '../utils/message-success.js'

const get = async (req, res, next) => {
    try {
        const { data, pagination } = await adminService.get(req)
        res.status(success.HTTP.CODE.OK).send(
            responses.responseSuccess(
                success.HTTP.CODE.OK,
                success.HTTP.STATUS.OK,
                data,
                pagination
            )
        )
    } catch (e) {
        next(e)
    }
}

const remove = async (req, res, next) => {
    try {
        await adminService.remove(req)
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

const add = async (req, res, next) => {
    try {
        const result = await adminService.add(req)
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

const update = async (req, res, next) => {
    try {
        const result = await adminService.update(req)
        res.status(success.HTTP.CODE.OK).send(
            responses.responseSuccess(success.HTTP.CODE.OK, success.HTTP.STATUS.OK, result)
        )
    } catch (e) {
        next(e)
    }
}

export default { add, get, remove, update }
