import express from 'express'
import { authMiddleware } from '../middlewares/auth-middleware.js'
import { adminMiddleware } from '../middlewares/admin-middleware.js'
import tourController from '../controllers/tour-controller.js'

const tourRouter = express.Router()

tourRouter.use(authMiddleware)
tourRouter.use(adminMiddleware)

tourRouter.post('/api/v1/tours', tourController.add)
tourRouter.patch('/api/v1/tours/:id', tourController.updateTour)
tourRouter.get('/api/v1/tours', tourController.getTour)
tourRouter.delete('/api/v1/tours/:id', tourController.deleteTour)

export { tourRouter }
