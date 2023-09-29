import responses from '../utils/response-api.js'
import areaService from '../service/area-service.js'

const add = async (req, res, next) => {
    try {
        const result = await areaService.add(req.body)
        res.status(201).send(responses.responseSuccess(201, 'CREATED', result))
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
        res.status(200).send(responses.responseSuccess(200, 'OK', result.data, result.pagination))
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
        res.status(200).send(responses.responseSuccess(200, 'OK', result))
    } catch (e) {
        next(e)
    }
}

const update = async (req, res, next) => {
    try {
        const result = await areaService.update(req.body)
        res.status(200).send(responses.responseSuccess(200, 'OK', result))
    } catch (e) {
        next(e)
    }
}

const remove = async (req, res, next) => {
    try {
        const result = await areaService.remove(req.params.id)
        res.status(200).send(responses.responseSuccess(200, 'OK', result))
    } catch (e) {
        next(e)
    }
}

export default { add, get, getById, update, remove }
