import express from 'express'
import { publicRouter } from '../routes/public-route.js'
import { userRouter } from '../routes/user-route.js'
import { tokenRouter } from '../routes/token-route.js'
import cookieParser from 'cookie-parser'
import { errorMiddleware } from '../middlewares/error-middleware.js'

const web = express()
web.use(express.json())
web.use(express.urlencoded({ extended: true }))
web.use(express.static('public'))
web.use(cookieParser())

web.use(tokenRouter)
web.use(publicRouter)
web.use(userRouter)

web.use(errorMiddleware)

export { web }
