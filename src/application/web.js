import express from 'express'
import { userRouter } from '../routes/userRoute.js'
import { error } from '../middlewares/error.js'

const web = express()
web.use(express.json())

web.use(userRouter)

web.use(error)

export { web }
