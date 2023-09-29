import responses from '../utils/response-api.js'
import areaService from '../service/area-service.js'
import { success } from '../utils/message-success.js'

const add = async (req, res, next) => {
    try {
        const result = await areaService.add(req)
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

const get = async (req, res, next) => {
    try {
        const query = {
            name: req.query.name,
        }

        const result = await areaService.get(query)
        res.status(success.HTTP_CODE_OK).send(
            responses.responseSuccess(
                success.HTTP_CODE_OK,
                success.HTTP_STATUS_OK,
                result.data,
                result.pagination
            )
        )
    } catch (e) {
        next(e)
    }
}

const getById = async (req, res, next) => {
    try {
        const params = {
            id: req.params.id,
        }

        const result = await areaService.getById(params)
        res.status(success.HTTP_CODE_OK).send(
            responses.responseSuccess(success.HTTP_CODE_OK, success.HTTP_STATUS_OK, result)
        )
    } catch (e) {
        next(e)
    }
}

const update = async (req, res, next) => {
    try {
        const params = {
            id: req.params.id,
        }

        const result = await areaService.update(req, params)
        res.status(success.HTTP_CODE_OK).send(
            responses.responseSuccess(success.HTTP_CODE_OK, success.HTTP_STATUS_OK, result)
        )
    } catch (e) {
        next(e)
    }
}

const remove = async (req, res, next) => {
    try {
        const params = {
            id: req.params.id,
        }

        await areaService.remove(params)
        res.status(success.HTTP_CODE_OK).send(
            responses.responseSuccess(
                success.HTTP_CODE_OK,
                success.HTTP_STATUS_OK,
                success.SUCCESS_DELETE_AREA
            )
        )
    } catch (e) {
        next(e)
    }
}

export default { add, get, getById, update, remove }
