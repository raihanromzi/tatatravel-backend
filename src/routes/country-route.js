import express from 'express'
import countryController from '../controllers/country-controller.js'

const countryRouter = express.Router()

countryRouter.post('/v1/countries', countryController.add)
countryRouter.get('/v1/countries', countryController.get)
countryRouter.get('/v1/countries/:id', countryController.getById)
countryRouter.patch('/v1/countries/:id', countryController.update)
countryRouter.delete('/v1/countries/:id', countryController.remove)

export { countryRouter }
