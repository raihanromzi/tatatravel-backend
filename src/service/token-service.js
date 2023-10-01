import jwt from 'jsonwebtoken'
import { ResponseError } from '../utils/response-error.js'
import { errors } from '../utils/message-error.js'
import { prismaClient } from '../application/database.js'

const refresh = async (req, res) => {
    const foundRefreshToken = req.cookies.refreshToken

    let validUser = null

    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true })

    if (!foundRefreshToken) {
        throw new ResponseError(
            errors.HTTP.CODE.UNAUTHORIZED,
            errors.HTTP.STATUS.UNAUTHORIZED,
            errors.AUTHORIZATION
        )
    }

    const foundUserWithRefreshToken = await prismaClient.user.findFirst({
        where: {
            token: foundRefreshToken,
        },
        select: {
            username: true,
        },
    })

    // detected refresh token reuse
    if (!foundUserWithRefreshToken) {
        // handle hacked user
        jwt.verify(foundRefreshToken, process.env.REFRESH_TOKEN_SECRET_KEY, async (err, user) => {
            if (err) {
                throw new ResponseError(
                    errors.HTTP.CODE.FORBIDDEN,
                    errors.HTTP.STATUS.FORBIDDEN,
                    errors.FORBIDDEN
                )
            }
            // if user not found, but refreshToken is reused and valid -> user hacked
            await prismaClient.user.update({
                where: {
                    username: user.username,
                },
                data: {
                    token: null,
                },
            })
        })
        throw new ResponseError(
            errors.HTTP.CODE.UNAUTHORIZED,
            errors.HTTP.STATUS.UNAUTHORIZED,
            errors.AUTHORIZATION
        )
    }

    jwt.verify(foundRefreshToken, process.env.REFRESH_TOKEN_SECRET_KEY, async (err, user) => {
        if (err || foundUserWithRefreshToken.username !== user.username) {
            throw new ResponseError(
                errors.HTTP.CODE.FORBIDDEN,
                errors.HTTP.STATUS.FORBIDDEN,
                errors.FORBIDDEN
            )
        }

        validUser = user
    })

    const userAccessTokenData = {
        id: validUser.id,
        roleId: validUser.roleId,
    }

    const userRefreshTokenData = {
        id: validUser.id,
        username: validUser.username,
        roleId: validUser.roleId,
    }

    const newAccessToken = generateAccessToken(userAccessTokenData)
    const newRefreshToken = generateRefreshToken(userRefreshTokenData)

    await prismaClient.user.update({
        where: {
            username: validUser.username,
        },
        data: {
            token: newRefreshToken,
        },
    })

    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    })

    return {
        accessToken: newAccessToken,
    }
}

const generateAccessToken = (validUser) => {
    return jwt.sign(validUser, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '1d' }) // should be 5m
}

const generateRefreshToken = (validUser) => {
    return jwt.sign(validUser, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '1d' })
}

export default { refresh, generateAccessToken, generateRefreshToken }
