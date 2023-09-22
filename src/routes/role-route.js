import express from 'express'
import { authMiddleware } from '../middlewares/auth-middleware.js'
import { adminMiddlewares } from '../middlewares/admin-middlewares.js'
import roleController from '../controllers/role-controller.js'

const roleRouter = express.Router()

roleRouter.use(authMiddleware)
roleRouter.use(adminMiddlewares)

roleRouter.post('/api/v1/roles', roleController.add)
roleRouter.patch('/api/v1/roles/:id', roleController.update)
roleRouter.delete('/api/v1/roles/:id', roleController.remove)

export { roleRouter }
