import express from 'express'
import tokenController from '../controllers/token-controller.js'

const tokenRouter = express.Router()
tokenRouter.get('/api/v1/token/refresh', tokenController.refreshToken)

export { tokenRouter }
