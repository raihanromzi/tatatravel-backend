import express from 'express'
import { userRouter } from '../routes/user.route.js'
import { errorMiddleware } from '../middlewares/error.middleware.js'

const web = express()
web.use(express.json())

web.use(userRouter)

web.use(errorMiddleware)

export { web }
