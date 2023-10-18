import { validate } from '../validation/validation.js'
import { loginValidationSchema } from '../validation/user-validation.js'
import { prismaClient } from '../application/database.js'
import { ResponseError } from '../utils/response-error.js'
import { errors } from '../utils/message-error.js'
import * as bcrypt from 'bcrypt'
import tokenService from './token-service.js'

const login = async (req, res) => {
    const { emailOrUserName, password } = validate(loginValidationSchema, req.body)

    return prismaClient.$transaction(async (prisma) => {
        const findUser = await prisma.user.findFirst({
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
                isActive: true,
                roleId: true,
            },
        })

        if (!findUser) {
            throw new ResponseError(
                errors.HTTP.CODE.UNAUTHORIZED,
                errors.HTTP.STATUS.UNAUTHORIZED,
                errors.AUTHENTICATION.USERNAME_OR_EMAIL
            )
        }

        const { id, userName, password: passwordHash, isActive, roleId } = findUser

        if (!isActive) {
            throw new ResponseError(
                errors.HTTP.CODE.UNAUTHORIZED,
                errors.HTTP.STATUS.UNAUTHORIZED,
                errors.USER.IS_NOT_ACTIVE
            )
        }

        const findRole = await prisma.role.findUnique({
            where: {
                id: roleId,
            },
            select: {
                isActive: true,
            },
        })

        const { isActive: isRoleActive } = findRole

        if (!isRoleActive) {
            throw new ResponseError(
                errors.HTTP.CODE.UNAUTHORIZED,
                errors.HTTP.STATUS.UNAUTHORIZED,
                errors.ROLE.IS_NOT_ACTIVE
            )
        }

        const isPasswordValid = await bcrypt.compare(password, passwordHash)

        if (!isPasswordValid) {
            throw new ResponseError(
                errors.HTTP.CODE.UNAUTHORIZED,
                errors.HTTP.STATUS.UNAUTHORIZED,
                errors.AUTHENTICATION.PASSWORD
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

        const updateUserToken = await prisma.user.update({
            where: {
                id: id,
                userName: userName,
            },
            data: {
                token: refreshToken,
            },
        })

        if (!updateUserToken) {
            throw new ResponseError(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.HTTP.MESSAGE.INTERNAL_SERVER_ERROR
            )
        }

        return {
            accessToken: accessToken,
        }
    })
}

export default { login }
