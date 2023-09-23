import express from 'express'

import { authMiddleware } from '../middlewares/auth-middleware.js'
import { adminMiddleware } from '../middlewares/admin-middleware.js'
import areaController from '../controllers/area-controller.js'

const areaRouter = express.Router()

areaRouter.use(authMiddleware)
areaRouter.use(adminMiddleware)

areaRouter.post('/api/v1/areas', areaController.add)
areaRouter.get('/api/v1/areas', areaController.get)
areaRouter.get('/api/v1/areas/:id', areaController.getById)
areaRouter.patch('/api/v1/areas', areaController.update)
areaRouter.delete('/api/v1/areas/:id', areaController.remove)

export { areaRouter }
