import express from 'express'
import { adminMiddleware } from '../middlewares/admin-middleware.js'
import areaController from '../controllers/area-controller.js'
import {
    accessTokenVerifyMiddleware,
    refreshTokenVerifyMiddleware,
} from '../middlewares/token-middleware.js'

const areaRouter = express.Router()

areaRouter.use(accessTokenVerifyMiddleware)
areaRouter.use(refreshTokenVerifyMiddleware)
areaRouter.use(adminMiddleware)

areaRouter.post('/v1/areas', areaController.add)
areaRouter.get('/v1/areas', areaController.get)
areaRouter.get('/v1/areas/:id', areaController.getById)
areaRouter.patch('/v1/areas', areaController.update)
areaRouter.delete('/v1/areas/:id', areaController.remove)

export { areaRouter }
