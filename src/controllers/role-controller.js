import responses from '../utils/response-api.js'
import roleService from '../service/role-service.js'
import { success } from '../utils/message-success.js'

const add = async (req, res, next) => {
    try {
        const result = await roleService.add(req)
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

const update = async (req, res, next) => {
    try {
        const result = await roleService.update(req)
        res.status(success.HTTP_CODE_OK).send(
            responses.responseSuccess(success.HTTP_CODE_OK, success.HTTP_STATUS_OK, result)
        )
    } catch (e) {
        next(e)
    }
}

const remove = async (req, res, next) => {
    try {
        await roleService.remove(req)
        res.status(success.HTTP_CODE_OK).send(
            responses.responseSuccess(
                success.HTTP_CODE_OK,
                success.HTTP_STATUS_OK,
                success.SUCCESS_DELETE_ROLE
            )
        )
    } catch (e) {
        next(e)
    }
}

const get = async (req, res, next) => {
    try {
        const result = await roleService.get(req)
        res.status(success.HTTP_CODE_OK).send(
            responses.responseSuccess(success.HTTP_CODE_OK, success.HTTP_STATUS_OK, result)
        )
    } catch (e) {
        next(e)
    }
}

const getById = async (req, res, next) => {
    try {
        const result = await roleService.getById(req)
        res.status(success.HTTP_CODE_OK).send(
            responses.responseSuccess(success.HTTP_CODE_OK, success.HTTP_STATUS_OK, result)
        )
    } catch (e) {
        next(e)
    }
}

export default { add, update, remove, get, getById }
