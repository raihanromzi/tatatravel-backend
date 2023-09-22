import express from 'express'
import { authMiddleware } from '../middlewares/auth-middleware.js'
import { adminMiddlewares } from '../middlewares/admin-middlewares.js'
import categoryController from '../controllers/category-controller.js'

const categoryRouter = express.Router()

categoryRouter.use(authMiddleware)
categoryRouter.use(adminMiddlewares)

categoryRouter.post('/api/v1/categories', categoryController.add)
categoryRouter.patch('/api/v1/categories/:categoryId', categoryController.updateActive)
categoryRouter.delete('/api/v1/categories/:categoryId', categoryController.deleteCategory)
categoryRouter.get('/api/v1/categories', categoryController.getAll)

export { categoryRouter }
