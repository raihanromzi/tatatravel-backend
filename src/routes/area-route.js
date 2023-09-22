import express from 'express'

import { authMiddleware } from '../middlewares/auth-middleware.js'
import { adminMiddlewares } from '../middlewares/admin-middlewares.js'
import areaController from '../controllers/area-controller.js'

const areaRouter = express.Router()

areaRouter.use(authMiddleware)
areaRouter.use(adminMiddlewares)

areaRouter.post('/api/v1/areas', areaController.add)
areaRouter.get('/api/v1/areas', areaController.get)
areaRouter.get('/api/v1/areas/:id', areaController.getById)
areaRouter.patch('/api/v1/areas', areaController.update)
areaRouter.delete('/api/v1/areas/:id', areaController.remove)

export { areaRouter }
