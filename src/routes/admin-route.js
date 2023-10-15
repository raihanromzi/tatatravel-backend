import express from 'express'
import adminController from '../controllers/admin-controller.js'

const adminRouter = express.Router()

adminRouter.post('/v1/users', adminController.add)
adminRouter.get('/v1/users', adminController.get)
adminRouter.patch('/v1/users/:id', adminController.update)
adminRouter.delete('/v1/users/:id', adminController.remove)

export { adminRouter }
