import jwt from 'jsonwebtoken'
import { ResponseError } from '../utils/response-error.js'
import { errors } from '../utils/message-error.js'
import { prismaClient } from '../application/database.js'

const refresh = async (req, res) => {
    const { refreshToken } = req.cookies
    let validUser = null

    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true })

    if (!refreshToken) {
        throw new ResponseError(
            errors.HTTP.CODE.UNAUTHORIZED,
            errors.HTTP.STATUS.UNAUTHORIZED,
            errors.AUTHORIZATION
        )
    }

    const foundUserWithRefreshToken = await prismaClient.user.findFirst({
        where: {
            token: refreshToken,
        },
        select: {
            userName: true,
        },
    })

    // detected refresh token reuse
    if (!foundUserWithRefreshToken) {
        // handle hacked user
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY, async (err, user) => {
            if (err) {
                throw new ResponseError(
                    errors.HTTP.CODE.FORBIDDEN,
                    errors.HTTP.STATUS.FORBIDDEN,
                    errors.HTTP.MESSAGE.FORBIDDEN
                )
            }

            // if user not found, but refreshToken is reused and valid -> user hacked
            await prismaClient.user.update({
                where: {
                    userName: user.userName,
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

    const { userName: foundUserName } = foundUserWithRefreshToken
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY, async (err, user) => {
        if (err || foundUserName !== user.userName) {
            throw new ResponseError(
                errors.HTTP.CODE.FORBIDDEN,
                errors.HTTP.STATUS.FORBIDDEN,
                errors.HTTP.MESSAGE.FORBIDDEN
            )
        }

        validUser = user
    })

    const { id, roleId, userName } = validUser

    const userAccessTokenData = {
        id: id,
        roleId: roleId,
    }

    const userRefreshTokenData = {
        id: id,
        userName: userName,
        roleId: roleId,
    }

    const newAccessToken = generateAccessToken(userAccessTokenData)
    const newRefreshToken = generateRefreshToken(userRefreshTokenData)

    await prismaClient.user.update({
        where: {
            userName: userName,
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
