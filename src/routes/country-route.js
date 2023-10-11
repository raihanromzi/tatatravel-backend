import express from 'express'
import countryController from '../controllers/country-controller.js'
// import {
//     accessTokenVerifyMiddleware,
//     refreshTokenVerifyMiddleware,
// } from '../middlewares/token-middleware.js'
// import { areaRouter } from './area-route.js'

const countryRouter = express.Router()

// areaRouter.use(accessTokenVerifyMiddleware)
// areaRouter.use(refreshTokenVerifyMiddleware)

countryRouter.post('/v1/countries', countryController.add)
countryRouter.get('/v1/countries', countryController.get)
countryRouter.get('/v1/countries/:id', countryController.getById)
countryRouter.patch('/v1/countries/:id', countryController.update)
countryRouter.delete('/v1/countries/:id', countryController.remove)

export { countryRouter }
