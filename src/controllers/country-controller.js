import responses from '../utils/response-api.js'
import countryService from '../service/country-service.js'

const add = async (req, res, next) => {
    try {
        const result = await countryService.add(req.body)

        res.status(201).send(responses.responseSuccess(201, 'CREATED', result))
    } catch (e) {
        next(e)
    }
}

const update = async (req, res, next) => {
    try {
        const result = await countryService.update(req.body)

        res.status(200).send(responses.responseSuccess(200, 'OK', result))
    } catch (e) {
        next(e)
    }
}

const deleteCountry = async (req, res, next) => {
    try {
        const result = await countryService.deleteCountry(req.params.id)

        res.status(200).send(responses.responseSuccess(200, 'OK', result))
    } catch (e) {
        next(e)
    }
}

const search = async (req, res, next) => {
    try {
        const result = await countryService.search(req.query)

        res.status(200).send(responses.responseSuccess(200, 'OK', result))
    } catch (e) {
        next(e)
    }
}

export default { add, update, deleteCountry, search }
