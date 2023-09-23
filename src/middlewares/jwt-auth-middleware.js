import response from '../utils/response-api.js'
import { errors } from '../utils/message-error.js'
import jwt from 'jsonwebtoken'

const jwtAuthMiddleware = async (req, res, next) => {
    const authHeader = req.get('Authorization')
    const token = authHeader.split(' ')[1]

    if (!authHeader) {
        res.status(errors.HTTP_CODE_UNAUTHORIZED)
            .send(
                response.responseError(
                    errors.HTTP_CODE_UNAUTHORIZED,
                    errors.HTTP_STATUS_UNAUTHORIZED,
                    errors.ERROR_AUTHORIZATION
                )
            )
            .end()
        return
    }

    if (!token) {
        res.status(errors.HTTP_CODE_UNAUTHORIZED)
            .send(
                response.responseError(
                    errors.HTTP_CODE_UNAUTHORIZED,
                    errors.HTTP_STATUS_UNAUTHORIZED,
                    errors.ERROR_AUTHORIZATION
                )
            )
            .end()
        return
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
        if (err) {
            res.status(errors.HTTP_CODE_UNAUTHORIZED)
                .send(
                    response.responseError(
                        errors.HTTP_CODE_UNAUTHORIZED,
                        errors.HTTP_STATUS_UNAUTHORIZED,
                        errors.ERROR_AUTHORIZATION
                    )
                )
                .end()
        }
        req.user = user
        next()
    })
}

export { jwtAuthMiddleware }
