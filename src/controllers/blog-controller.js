import responses from '../utils/response-api.js'
import blogService from '../service/blog-service.js'
import { success } from '../utils/message-success.js'

const add = async (req, res, next) => {
    try {
        const result = await blogService.add(req)
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

const getById = async (req, res, next) => {
    try {
        const result = await blogService.get(req)
        responses.responseSuccess(success.HTTP.CODE.OK, success.HTTP.STATUS.OK, result)
    } catch (e) {
        next(e)
    }
}

const get = async (req, res, next) => {
    try {
        const result = await blogService.getAll(req)
        responses.responseSuccess(success.HTTP.CODE.OK, success.HTTP.STATUS.OK, result)
    } catch (e) {
        next(e)
    }
}

const update = async (req, res, next) => {
    try {
        const result = await blogService.update(req)
        res.status(success.HTTP.CODE.OK).send(
            responses.responseSuccess(success.HTTP.CODE.OK, success.HTTP.STATUS.OK, result)
        )
    } catch (e) {
        next(e)
    }
}

const remove = async (req, res, next) => {
    try {
        const result = await blogService.remove(req)
        responses.responseSuccess(success.HTTP.CODE.OK, success.HTTP.STATUS.OK, result)
    } catch (e) {
        next(e)
    }
}

export default { add, getById, get, update, remove }
