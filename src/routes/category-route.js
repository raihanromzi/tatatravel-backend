import express from 'express'
import categoryController from '../controllers/category-controller.js'

const categoryRouter = express.Router()

categoryRouter.post('/v1/categories', categoryController.add)
categoryRouter.patch('/v1/categories/:id', categoryController.update)
categoryRouter.delete('/v1/categories/:id', categoryController.remove)
categoryRouter.get('/v1/categories', categoryController.get)
categoryRouter.get('/v1/categories/:id', categoryController.getById)

export { categoryRouter }
