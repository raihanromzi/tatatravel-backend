import responses from '../utils/response-api.js'
import tourService from '../service/tour-service.js'

const add = async (req, res, next) => {
    try {
        const result = await tourService.add(req)
        res.status(201).send(responses.responseSuccess(201, 'CREATED', result))
    } catch (e) {
        next(e)
    }
}

const update = async (req, res, next) => {
    try {
        const result = await tourService.update(req)
        res.status(200).send(responses.responseSuccess(200, 'OK', result))
    } catch (e) {
        next(e)
    }
}

const get = async (req, res, next) => {
    try {
        const result = await tourService.get()
        res.status(200).send(responses.responseSuccess(200, 'OK', result))
    } catch (e) {
        next(e)
    }
}

const remove = async (req, res, next) => {
    try {
        const result = await tourService.remove(req)
        res.status(200).send(responses.responseSuccess(200, 'OK', result))
    } catch (e) {
        next(e)
    }
}

export default {
    add,
    update,
    get,
    remove,
}
