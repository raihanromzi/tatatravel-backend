import express from 'express'
import adminController from '../controllers/admin-controller.js'
import {
    accessTokenVerifyMiddleware,
    refreshTokenVerifyMiddleware,
} from '../middlewares/token-middleware.js'
import { adminMiddleware } from '../middlewares/admin-middleware.js'

const adminRouter = express.Router()

adminRouter.use(accessTokenVerifyMiddleware)
adminRouter.use(refreshTokenVerifyMiddleware)
adminRouter.use(adminMiddleware)

adminRouter.post('/v1/users', adminController.add)
adminRouter.get('/v1/users', adminController.search)
adminRouter.delete('/v1/users/:userId', adminController.remove)

export { adminRouter }
