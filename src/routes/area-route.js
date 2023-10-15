import express from 'express'
import areaController from '../controllers/area-controller.js'

const areaRouter = express.Router()

areaRouter.post('/v1/areas', areaController.add)
areaRouter.get('/v1/areas', areaController.get)
areaRouter.get('/v1/areas/:id', areaController.getById)
areaRouter.patch('/v1/areas/:id', areaController.update)
areaRouter.delete('/v1/areas/:id', areaController.remove)

export { areaRouter }
