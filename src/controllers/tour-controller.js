import responses from '../utils/response-api.js'
import tourService from '../service/tour-service.js'
import { success } from '../utils/message-success.js'

const add = async (req, res, next) => {
    try {
        const result = await tourService.add(req)
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
        const result = await tourService.getById(req)
        res.status(success.HTTP.CODE.OK).send(
            responses.responseSuccess(success.HTTP.CODE.OK, success.HTTP.STATUS.OK, result)
        )
    } catch (e) {
        next(e)
    }
}

const get = async (req, res, next) => {
    try {
        const { data, pagination } = await tourService.get(req)
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
        await tourService.remove(req)
        res.status(success.HTTP.CODE.OK).send(
            responses.responseSuccess(
                success.HTTP.CODE.OK,
                success.HTTP.STATUS.OK,
                success.TOUR.DELETE
            )
        )
    } catch (e) {
        next(e)
    }
}

const update = async (req, res, next) => {
    try {
        const result = await tourService.update(req)
        res.status(success.HTTP.CODE.OK).send(
            responses.responseSuccess(success.HTTP.CODE.OK, success.HTTP.STATUS.OK, result)
        )
    } catch (e) {
        next(e)
    }
}

export default {
    add,
    getById,
    get,
    update,
    remove,
}
