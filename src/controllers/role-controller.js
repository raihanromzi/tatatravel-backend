import responses from '../utils/response-api.js'
import roleService from '../service/role-service.js'

const add = async (req, res, next) => {
    try {
        const result = await roleService.add(req.body)

        res.status(201).send(responses.responseSuccess(201, 'Created', result))
    } catch (e) {
        next(e)
    }
}

const update = async (req, res, next) => {
    try {
        const result = await roleService.update(req.body)

        res.status(200).send(responses.responseSuccess(200, 'OK', result))
    } catch (e) {
        next(e)
    }
}

const remove = async (req, res, next) => {
    try {
        const result = await roleService.remove(req.body)

        res.status(200).send(responses.responseSuccess(200, 'OK', result))
    } catch (e) {
        next(e)
    }
}

export default { add, update, remove }
