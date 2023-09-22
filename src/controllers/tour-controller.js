import responses from '../utils/response-api.js'
import tourService from '../service/tour-service.js'

const add = async (req, res, next) => {
    try {
        const result = await tourService.add(req.body)
        res.status(201).send(responses.responseSuccess(201, 'CREATED', result))
    } catch (e) {
        next(e)
    }
}

const updateTour = async (req, res, next) => {
    try {
        const request = req.body
        const result = await tourService.updateTour(request)
        res.status(200).send(responses.responseSuccess(200, 'OK', result))
    } catch (e) {
        next(e)
    }
}

const getTour = async (req, res, next) => {
    try {
        const result = await tourService.getTour()
        res.status(200).send(responses.responseSuccess(200, 'OK', result))
    } catch (e) {
        next(e)
    }
}

const deleteTour = async (req, res, next) => {
    try {
        const result = await tourService.deleteTour(req.params.id)
        res.status(200).send(responses.responseSuccess(200, 'OK', result))
    } catch (e) {
        next(e)
    }
}
