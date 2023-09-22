import express from 'express'
import { authMiddleware } from '../middlewares/auth-middleware.js'
import { adminMiddlewares } from '../middlewares/admin-middlewares.js'
import countryController from '../controllers/country-controller.js'

const countryRouter = express.Router()

countryRouter.use(authMiddleware)
countryRouter.use(adminMiddlewares)

countryRouter.post('/api/v1/countries', countryController.add)
countryRouter.patch('/api/v1/countries', countryController.update)
countryRouter.delete('/api/v1/countries/:id', countryController.deleteCountry)
countryRouter.get('/api/v1/countries', countryController.search)

export { countryRouter }
