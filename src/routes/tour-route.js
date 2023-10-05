import express from 'express'
import tourController from '../controllers/tour-controller.js'
import {
    accessTokenVerifyMiddleware,
    refreshTokenVerifyMiddleware,
} from '../middlewares/token-middleware.js'

const tourRouter = express.Router()

tourRouter.use(accessTokenVerifyMiddleware)
tourRouter.use(refreshTokenVerifyMiddleware)

tourRouter.post('/api/v1/tours', tourController.add)
tourRouter.patch('/api/v1/tours/:id', tourController.update)
tourRouter.get('/api/v1/tours', tourController.get)
tourRouter.delete('/api/v1/tours/:id', tourController.remove)

export { tourRouter }
