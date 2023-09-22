import categoryService from '../service/category-service.js'
import responses from '../utils/response-api.js'

const add = async (req, res, next) => {
    try {
        const result = await categoryService.add(req.body)

        res.status(201).send(responses.responseSuccess(201, 'CREATED', result))
    } catch (e) {
        next(e)
    }
}

const updateActive = async (req, res, next) => {
    try {
        const result = await categoryService.updateActive(req.body)

        res.status(200).send(responses.responseSuccess(200, 'OK', result))
    } catch (e) {
        next(e)
    }
}

const deleteCategory = async (req, res, next) => {
    try {
        const result = await categoryService.deleteCategory(req.body)

        res.status(200).send(responses.responseSuccess(200, 'OK', result))
    } catch (e) {
        next(e)
    }
}

const getAll = async (req, res, next) => {
    try {
        const result = await categoryService.getAll()

        res.status(200).send(responses.responseSuccess(200, 'OK', result))
    } catch (e) {
        next(e)
    }
}

export default { add, updateActive, deleteCategory, getAll }
