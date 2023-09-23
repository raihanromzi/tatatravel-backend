import express from 'express'
import { authMiddleware } from '../middlewares/auth-middleware.js'
import { adminMiddleware } from '../middlewares/admin-middleware.js'
import categoryController from '../controllers/category-controller.js'

const categoryRouter = express.Router()

categoryRouter.use(authMiddleware)
categoryRouter.use(adminMiddleware)

categoryRouter.post('/api/v1/categories', categoryController.add)
categoryRouter.patch('/api/v1/categories/:categoryId', categoryController.updateActive)
categoryRouter.delete('/api/v1/categories/:categoryId', categoryController.deleteCategory)
categoryRouter.get('/api/v1/categories', categoryController.getAll)

export { categoryRouter }
