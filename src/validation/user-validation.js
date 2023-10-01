import Joi from 'joi'
import { errors } from '../utils/message-error.js'

const addUserValidationSchema = Joi.object({
    fullName: Joi.string()
        .min(3)
        .max(255)
        .required()
        .messages({
            'string.base': `${errors.FULL_NAME.MUST_STRING}`,
            'string.empty': `${errors.FULL_NAME.CANNOT_EMPTY}`,
            'string.min': `${errors.FULL_NAME.MUST_MIN}`,
            'string.max': `${errors.FULL_NAME.MUST_MAX}`,
            'any.required': `${errors.FULL_NAME.IS_REQUIRED}`,
        }),
    username: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.base': `${errors.USERNAME.MUST_STRING}`,
            'string.empty': `${errors.USERNAME.CANNOT_EMPTY}`,
            'string.min': `${errors.USERNAME.MUST_MIN}`,
            'string.max': `${errors.USERNAME.MUST_MAX}`,
            'any.required': `${errors.USERNAME.IS_REQUIRED}`,
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.base': `${errors.EMAIL.MUST_STRING}`,
            'string.empty': `${errors.EMAIL.CANNOT_EMPTY}`,
            'string.email': `${errors.EMAIL.MUST_VALID}`,
            'any.required': `${errors.EMAIL.IS_REQUIRED}`,
        }),
    password: Joi.string()
        .min(6)
        .max(255)
        .required()
        .pattern(new RegExp('^[a-zA-Z0-9]{6,255}$'))
        .messages({
            'string.base': `${errors.PASSWORD.MUST_STRING}`,
            'string.empty': `${errors.PASSWORD.CANNOT_EMPTY}`,
            'string.min': `${errors.PASSWORD.MUST_MIN}`,
            'string.max': `${errors.PASSWORD.MUST_MAX}`,
            'string.pattern.base': `${errors.PASSWORD.MUST_VALID}`,
            'any.required': `${errors.PASSWORD.IS_REQUIRED}`,
        }),
    role: Joi.number()
        .required()
        .positive()
        .messages({
            'number.base': `${errors.ROLE.MUST_NUMBER}`,
            'number.positive': `${errors.ROLE.MUST_POSITIVE}`,
        }),
}).unknown(true)

const loginValidationSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.base': `${errors.EMAIL.MUST_STRING}`,
            'string.empty': `${errors.EMAIL.CANNOT_EMPTY}`,
            'string.email': `${errors.EMAIL.MUST_VALID}`,
            'any.required': `${errors.EMAIL.IS_REQUIRED}`,
        }),
    password: Joi.string()
        .min(6)
        .max(255)
        .required()
        .pattern(new RegExp('^[a-zA-Z0-9]{6,255}$'))
        .messages({
            'string.base': `${errors.PASSWORD.MUST_STRING}`,
            'string.empty': `${errors.PASSWORD.CANNOT_EMPTY}`,
            'string.min': `${errors.PASSWORD.MUST_MIN}`,
            'string.max': `${errors.PASSWORD.MUST_MAX}`,
            'string.pattern.base': `${errors.PASSWORD.MUST_VALID}`,
            'any.required': `${errors.PASSWORD.IS_REQUIRED}`,
        }),
}).unknown(true)

const getUserValidationSchema = Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
        'string.base': `${errors.USERNAME.MUST_STRING}}`,
        'string.empty': `${errors.USERNAME.CANNOT_EMPTY}`,
        'string.min': `${errors.USERNAME.MUST_MIN}`,
        'string.max': `${errors.USERNAME.MUST_MAX}`,
        'any.required': `${errors.USERNAME.IS_REQUIRED}`,
    })

const updateUserValidationSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.base': `${errors.USERNAME.MUST_STRING}}`,
            'string.min': `${errors.USERNAME.MUST_MIN}`,
            'string.max': `${errors.USERNAME.MUST_MAX}`,
        }),

    password: Joi.string()
        .min(6)
        .max(255)
        .optional()
        .messages({
            'string.base': `${errors.PASSWORD.MUST_STRING}`,
            'string.min': `${errors.PASSWORD.MUST_MIN}`,
            'string.max': `${errors.PASSWORD.MUST_MAX}`,
        }),
    fullName: Joi.string()
        .min(3)
        .max(255)
        .optional()
        .messages({
            'string.base': `${errors.FULL_NAME.MUST_STRING}`,
            'string.empty': `${errors.FULL_NAME.CANNOT_EMPTY}`,
            'string.min': `${errors.FULL_NAME.MUST_MIN}`,
            'string.max': `${errors.FULL_NAME.MUST_MAX}`,
        }),
}).unknown(true)

const searchUserValidationSchema = Joi.object({
    page: Joi.number().min(1).positive().default(1).messages({
        'number.base': errors.PAGE.MUST_NUMBER,
        'number.empty': errors.PAGE.CANNOT_EMPTY,
        'number.positive': errors.PAGE.MUST_POSITIVE,
    }),
    size: Joi.number().min(1).positive().max(100).default(10).messages({
        'number.base': errors.SIZE.MUST_NUMBER,
        'number.empty': errors.SIZE.CANNOT_EMPTY,
        'number.positive': errors.SIZE.MUST_POSITIVE,
    }),
    username: Joi.string()
        .max(30)
        .optional()
        .messages({
            'string.base': `${errors.USERNAME.MUST_STRING}`,
            'string.max': `${errors.USERNAME.MUST_MAX}`,
        }),
    email: Joi.string()
        .optional()
        .messages({
            'string.base': `${errors.EMAIL.MUST_STRING}`,
            'string.email': `${errors.EMAIL.MUST_VALID}`,
        }),
    name: Joi.string()
        .max(50)
        .optional()
        .messages({
            'string.base': `${errors.FULL_NAME.MUST_STRING}`,
            'string.max': `${errors.FULL_NAME.MUST_MAX}`,
        }),
    role: Joi.string()
        .max(30)
        .optional()
        .messages({
            'string.base': `${errors.ROLE.MUST_STRING}`,
            'string.max': `${errors.ROLE.MUST_MAX}`,
        }),
}).unknown(true)

const deleteUserValidationSchema = Joi.number()
    .positive()
    .required()
    .messages({
        'number.base': `${errors.USERID.MUST_NUMBER}`,
        'number.positive': `${errors.USERID.MUST_POSITIVE}`,
        'any.required': `${errors.USERID.IS_REQUIRED}`,
    })

export {
    addUserValidationSchema,
    loginValidationSchema,
    getUserValidationSchema,
    updateUserValidationSchema,
    deleteUserValidationSchema,
    searchUserValidationSchema,
}
