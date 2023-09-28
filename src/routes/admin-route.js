import express from 'express'
import { adminMiddleware } from '../middlewares/admin-middleware.js'
import adminController from '../controllers/admin-controller.js'
import { accessTokenVerifyMiddleware } from '../middlewares/token-middleware.js'
import userController from '../controllers/user-controller.js'

const adminRouter = express.Router()

adminRouter.use(accessTokenVerifyMiddleware)
adminRouter.use(adminMiddleware)

adminRouter.post('/api/v1/users', userController.add)
adminRouter.get('/api/v1/users', adminController.searchUser)
adminRouter.delete('/api/v1/users/:userId', adminController.deleteUser)

export { adminRouter }
