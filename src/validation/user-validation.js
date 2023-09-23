import Joi from 'joi'
import { errors } from '../utils/message-error.js'

const addUserValidationSchema = Joi.object({
    firstName: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.base': `${errors.ERROR_FIRST_NAME_STRING}`,
            'string.empty': `${errors.ERROR_FIRST_NAME_EMPTY}`,
            'string.min': `${errors.ERROR_FIRST_NAME_MIN}`,
            'string.max': `${errors.ERROR_FIRST_NAME_MAX}`,
            'any.required': `${errors.ERROR_FIRSTNAME_REQUIRED}`,
        }),
    lastName: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.base': `${errors.ERROR_LAST_NAME_STRING}`,
            'string.empty': `${errors.ERROR_LAST_NAME_EMPTY}`,
            'string.min': `${errors.ERROR_LAST_NAME_MIN}`,
            'string.max': `${errors.ERROR_LAST_NAME_MAX}`,
            'any.required': `${errors.ERROR_LASTNAME_REQUIRED}`,
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
            'any.required': `${errors.ERROR_PASSWORD_REQUIRED}`,
        }),
    role: Joi.number()
        .required()
        .positive()
        .messages({
            'number.base': `${errors.ERROR_ROLE_NUMBER}`,
            'number.positive': `${errors.ERROR_ROLE_NUMBER}`,
        }),
}).unknown(true)

const loginValidationSchema = Joi.object({
    email_username: [
        Joi.string()
            .email()
            .messages({
                'string.base': `${errors.ERROR_EMAIL_STRING}`,
                'string.empty': `${errors.ERROR_EMAIL_EMPTY}`,
                'string.email': `${errors.ERROR_EMAIL_INVALID}`,
            }),
        Joi.string()
            .min(3)
            .max(30)
            .messages({
                'string.base': `${errors.ERROR_USERNAME_STRING}`,
                'string.empty': `${errors.ERROR_USERNAME_EMPTY}`,
                'string.min': `${errors.ERROR_USERNAME_MIN}`,
                'string.max': `${errors.ERROR_USERNAME_MAX}`,
            }),
    ],
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
            'any.required': `${errors.ERROR_PASSWORD_REQUIRED}`,
        }),
}).unknown(true)

const getUserValidationSchema = Joi.string().min(3).max(30).required().messages({
    'string.base': 'username must be a string',
    'string.empty': 'username cannot be empty',
    'string.min': 'min 3 characters',
    'string.max': 'max 30 characters',
    'any.required': 'username is required!',
})

const updateUserValidationSchema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
        'string.base': 'username must be a string',
        'string.min': 'min 3 characters',
        'string.max': 'max 30 characters',
    }),
    newUsername: Joi.string().min(3).max(30).required().messages({
        'string.base': 'username must be a string',
        'string.min': 'min 3 characters',
        'string.max': 'max 30 characters',
    }),
    password: Joi.string().min(6).max(255).optional().messages({
        'string.base': 'password must be a string',
        'string.min': 'min 6 characters',
        'string.max': 'max 255 characters',
    }),
    firstName: Joi.string().min(3).max(50).optional().messages({
        'string.base': 'first name must be a string',
        'string.min': 'min 3 characters',
        'string.max': 'max 50 characters',
    }),
    lastName: Joi.string().min(3).max(50).optional().messages({
        'string.base': 'last name must be a string',
        'string.min': 'min 3 characters',
        'string.max': 'max 50 characters',
    }),
})

const searchUserValidationSchema = Joi.object({
    page: Joi.number().min(1).positive().default(1),
    size: Joi.number().min(1).positive().max(100).default(10),
    username: Joi.string().max(30).optional().messages({
        'string.base': 'username must be a string',
        'string.max': 'max 30 characters',
    }),
    email: Joi.string().email().optional().messages({
        'string.base': 'email must be a string',
        'string.email': 'email must be a valid email',
    }),
    name: Joi.string().max(50).optional().messages({
        'string.base': 'first name must be a string',
        'string.max': 'max 50 characters',
    }),
    role: Joi.string().max(50).optional().messages({
        'string.base': 'role must be a string',
        'string.max': 'max 50 characters',
    }),
})

const deleteUserValidationSchema = Joi.number().positive().required().messages({
    'number.base': 'user id must be a number',
    'number.positive': 'user id must be a positive number',
    'any.required': 'user id is required!',
})

export {
    addUserValidationSchema,
    loginValidationSchema,
    getUserValidationSchema,
    updateUserValidationSchema,
    deleteUserValidationSchema,
    searchUserValidationSchema,
}
