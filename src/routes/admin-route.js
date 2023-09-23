import express from 'express'
import { authMiddleware } from '../middlewares/auth-middleware.js'
import { adminMiddleware } from '../middlewares/admin-middleware.js'
import adminController from '../controllers/admin-controller.js'

const adminRouter = express.Router()

adminRouter.use(authMiddleware)
adminRouter.use(adminMiddleware)

adminRouter.delete('/api/v1/users/:userId', adminController.deleteUser)
adminRouter.get('/api/v1/users', adminController.searchUser)
