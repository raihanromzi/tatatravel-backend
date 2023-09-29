import Joi from 'joi'
import { errors } from '../utils/message-error.js'

const addUserValidationSchema = Joi.object({
    fullName: Joi.string()
        .min(3)
        .max(255)
        .required()
        .messages({
            'string.base': `${errors.ERROR_FULL_NAME_STRING}`,
            'string.empty': `${errors.ERROR_FULL_NAME_EMPTY}`,
            'string.min': `${errors.ERROR_FULL_NAME_MIN}`,
            'string.max': `${errors.ERROR_FULL_NAME_MAX}`,
            'any.required': `${errors.ERROR_FULL_NAME_REQUIRED}`,
        }),
    username: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.base': `${errors.ERROR_USERNAME_STRING}`,
            'string.empty': `${errors.ERROR_USERNAME_EMPTY}`,
            'string.min': `${errors.ERROR_USERNAME_MIN}`,
            'string.max': `${errors.ERROR_USERNAME_MAX}`,
            'any.required': `${errors.ERROR_USERNAME_REQUIRED}`,
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.base': `${errors.ERROR_EMAIL_STRING}`,
            'string.empty': `${errors.ERROR_EMAIL_EMPTY}`,
            'string.email': `${errors.ERROR_EMAIL_INVALID}`,
            'any.required': `${errors.ERROR_EMAIL_REQUIRED}`,
        }),
    password: Joi.string()
        .min(6)
        .max(255)
        .required()
        .pattern(new RegExp('^[a-zA-Z0-9]{6,255}$'))
        .messages({
            'string.base': `${errors.ERROR_PASSWORD_STRING}`,
            'string.empty': `${errors.ERROR_PASSWORD_EMPTY}`,
            'string.min': `${errors.ERROR_PASSWORD_MIN}`,
            'string.max': `${errors.ERROR_PASSWORD_MAX}`,
            'string.pattern.base': `${errors.ERROR_PASSWORD_PATTERN}`,
            'any.required': `${errors.ERROR_PASSWORD_REQUIRED}`,
        }),
    role: Joi.number()
        .required()
        .positive()
        .messages({
            'number.base': `${errors.ERROR_ROLE_NUMBER}`,
            'number.positive': `${errors.ERROR_ROLE_POSITIVE}`,
        }),
}).unknown(true)

const loginValidationSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.base': `${errors.ERROR_EMAIL_STRING}`,
            'string.empty': `${errors.ERROR_EMAIL_EMPTY}`,
            'string.email': `${errors.ERROR_EMAIL_INVALID}`,
            'any.required': `${errors.ERROR_EMAIL_REQUIRED}`,
        }),
    password: Joi.string()
        .min(6)
        .max(255)
        .required()
        .pattern(new RegExp('^[a-zA-Z0-9]{6,255}$'))
        .messages({
            'string.base': `${errors.ERROR_PASSWORD_STRING}`,
            'string.empty': `${errors.ERROR_PASSWORD_EMPTY}`,
            'string.min': `${errors.ERROR_PASSWORD_MIN}`,
            'string.max': `${errors.ERROR_PASSWORD_MAX}`,
            'string.pattern.base': `${errors.ERROR_PASSWORD_PATTERN}`,
            'any.required': `${errors.ERROR_PASSWORD_REQUIRED}`,
        }),
}).unknown(true)

const getUserValidationSchema = Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
        'string.base': `${errors.ERROR_USERNAME_STRING}}`,
        'string.empty': `${errors.ERROR_USERNAME_EMPTY}`,
        'string.min': `${errors.ERROR_USERNAME_MIN}`,
        'string.max': `${errors.ERROR_USERNAME_MAX}`,
        'any.required': `${errors.ERROR_USERNAME_REQUIRED}`,
    })

const updateUserValidationSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.base': `${errors.ERROR_USERNAME_STRING}}`,
            'string.min': `${errors.ERROR_USERNAME_MIN}`,
            'string.max': `${errors.ERROR_USERNAME_MAX}`,
        }),

    password: Joi.string()
        .min(6)
        .max(255)
        .optional()
        .messages({
            'string.base': `${errors.ERROR_PASSWORD_STRING}`,
            'string.min': `${errors.ERROR_PASSWORD_MIN}`,
            'string.max': `${errors.ERROR_PASSWORD_MAX}`,
        }),
    fullName: Joi.string()
        .min(3)
        .max(255)
        .optional()
        .messages({
            'string.base': `${errors.ERROR_FULL_NAME_STRING}`,
            'string.empty': `${errors.ERROR_FULL_NAME_EMPTY}`,
            'string.min': `${errors.ERROR_FULL_NAME_MIN}`,
            'string.max': `${errors.ERROR_FULL_NAME_MAX}`,
        }),
})

const searchUserValidationSchema = Joi.object({
    page: Joi.number().min(1).positive().default(1),
    size: Joi.number().min(1).positive().max(100).default(10),
    username: Joi.string()
        .max(30)
        .optional()
        .messages({
            'string.base': `${errors.ERROR_USERNAME_STRING}`,
            'string.max': `${errors.ERROR_USERNAME_MAX}`,
        }),
    email: Joi.string()
        .optional()
        .messages({
            'string.base': `${errors.ERROR_EMAIL_STRING}`,
            'string.email': `${errors.ERROR_EMAIL_INVALID}`,
        }),
    name: Joi.string()
        .max(50)
        .optional()
        .messages({
            'string.base': `${errors.ERROR_FULL_NAME_STRING}`,
            'string.max': `${errors.ERROR_FULL_NAME_MAX}`,
        }),
    role: Joi.string()
        .max(30)
        .optional()
        .messages({
            'string.base': `${errors.ERROR_ROLE_STRING}`,
            'string.max': `${errors.ERROR_ROLE_MAX}`,
        }),
})

const deleteUserValidationSchema = Joi.number()
    .positive()
    .required()
    .messages({
        'number.base': `${errors.ERROR_USERID_NUMBER}`,
        'number.positive': `${errors.ERROR_USERID_POSITIVE}`,
        'any.required': `${errors.ERROR_USERID_REQUIRED}`,
    })

export {
    addUserValidationSchema,
    loginValidationSchema,
    getUserValidationSchema,
    updateUserValidationSchema,
    deleteUserValidationSchema,
    searchUserValidationSchema,
}
