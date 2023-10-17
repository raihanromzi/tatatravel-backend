import { validate } from '../validation/validation.js'
import { loginValidationSchema } from '../validation/user-validation.js'
import { prismaClient } from '../application/database.js'
import { ResponseError } from '../utils/response-error.js'
import { errors } from '../utils/message-error.js'
import * as bcrypt from 'bcrypt'
import tokenService from './token-service.js'
import { logger } from '../application/logging.js'

const login = async (req, res) => {
    const { emailOrUserName, password } = validate(loginValidationSchema, req.body)

    logger.info(emailOrUserName)

    const findUser = await prismaClient.user.findFirst({
        where: {
            OR: [
                {
                    email: emailOrUserName,
                },
                {
                    userName: emailOrUserName,
                },
            ],
        },
        select: {
            id: true,
            userName: true,
            password: true,
            roleId: true,
        },
    })

    if (!findUser) {
        throw new ResponseError(
            errors.HTTP.CODE.UNAUTHORIZED,
            errors.HTTP.STATUS.UNAUTHORIZED,
            errors.AUTHENTICATION
        )
    }

    const { id, userName, password: passwordHash, roleId } = findUser
    const isPasswordValid = await bcrypt.compare(password, passwordHash)

    if (!isPasswordValid) {
        throw new ResponseError(
            errors.HTTP.CODE.UNAUTHORIZED,
            errors.HTTP.STATUS.UNAUTHORIZED,
            errors.AUTHENTICATION
        )
    }

    const userAccessTokenData = {
        id: id,
        roleId: roleId,
    }

    const userRefreshTokenData = {
        id: id,
        userName: userName,
        roleId: roleId,
    }

    const accessToken = tokenService.generateAccessToken(userAccessTokenData)
    const refreshToken = tokenService.generateRefreshToken(userRefreshTokenData)

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    })

    await prismaClient.user.update({
        where: {
            id: id,
            userName: userName,
        },
        data: {
            token: refreshToken,
        },
    })

    return {
        accessToken: accessToken,
    }
}

export default { login }
