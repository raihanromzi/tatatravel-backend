import express from 'express'
import tokenController from '../controllers/token-controller.js'
import { refreshTokenVerifyMiddleware } from '../middlewares/token-middleware.js'

const tokenRouter = express.Router()

tokenRouter.use(refreshTokenVerifyMiddleware)

tokenRouter.get('/v1/token/refresh', tokenController.refreshToken)

export { tokenRouter }
