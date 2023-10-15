import express from 'express'
import roleController from '../controllers/role-controller.js'

const roleRouter = express.Router()

roleRouter.post('/v1/roles', roleController.add)
roleRouter.get('/v1/roles', roleController.get)
roleRouter.get('/v1/roles/:id', roleController.getById)
roleRouter.patch('/v1/roles/:id', roleController.update)
roleRouter.delete('/v1/roles/:id', roleController.remove)

export { roleRouter }
