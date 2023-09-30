import express from 'express'
import categoryController from '../controllers/category-controller.js'
import {
    accessTokenVerifyMiddleware,
    refreshTokenVerifyMiddleware,
} from '../middlewares/token-middleware.js'

const categoryRouter = express.Router()

categoryRouter.use(accessTokenVerifyMiddleware)
categoryRouter.use(refreshTokenVerifyMiddleware)

categoryRouter.post('/v1/categories', categoryController.add)
categoryRouter.patch('/v1/categories/:id', categoryController.update)
categoryRouter.delete('/v1/categories/:id', categoryController.remove)
categoryRouter.get('/v1/categories', categoryController.get)
categoryRouter.get('/v1/categories/:id', categoryController.getById)

export { categoryRouter }
