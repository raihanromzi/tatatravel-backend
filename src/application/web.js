import express from 'express'
import { publicRouter } from '../routes/public-route.js'
import { errorMiddleware } from '../middlewares/error-middleware.js'
import { userRouter } from '../routes/user-route.js'
import { tokenRouter } from '../routes/token-route.js'

const web = express()
web.use(express.json())

web.use(tokenRouter)
web.use(publicRouter)
web.use(userRouter)

web.use(errorMiddleware)

export { web }
