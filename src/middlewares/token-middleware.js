import response from '../utils/response-api.js'
import { errors } from '../utils/message-error.js'
import jwt from 'jsonwebtoken'

const accessTokenVerifyMiddleware = async (req, res, next) => {
    const authHeader = req.get('Authorization')

    if (!authHeader?.startsWith('Bearer ')) {
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

    const token = authHeader.split(' ')[1]

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
            res.status(errors.HTTP_CODE_FORBIDDEN)
                .send(
                    response.responseError(
                        errors.HTTP_CODE_FORBIDDEN,
                        errors.HTTP_STATUS_FORBIDDEN,
                        errors.ERROR_FORBIDDEN
                    )
                )
                .end()
            return
        }
        // save user to req.user
        req.user = user
        next()
    })
}

const refreshTokenVerifyMiddleware = async (req, res, next) => {
    const foundRefreshToken = req.cookies.refreshToken

    if (!foundRefreshToken) {
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

    jwt.verify(foundRefreshToken, process.env.REFRESH_TOKEN_SECRET_KEY, (err, user) => {
        if (err) {
            res.status(errors.HTTP_CODE_FORBIDDEN)
                .send(
                    response.responseError(
                        errors.HTTP_CODE_FORBIDDEN,
                        errors.HTTP_STATUS_FORBIDDEN,
                        errors.ERROR_FORBIDDEN
                    )
                )
                .end()
            return
        }
        // save user to req.user
        req.user = user
        next()
    })
}

export { accessTokenVerifyMiddleware, refreshTokenVerifyMiddleware }
