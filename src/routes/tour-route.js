import express from 'express'
import tourController from '../controllers/tour-controller.js'

const tourRouter = express.Router()

tourRouter.post('/v1/tours', tourController.add)
tourRouter.get('/v1/tours', tourController.get)
tourRouter.get('/v1/tours/:id', tourController.getById)
tourRouter.delete('/v1/tours/:id', tourController.remove)
tourRouter.patch('/v1/tours/:id', tourController.update)

export { tourRouter }
