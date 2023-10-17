import Joi from 'joi'
import { errors } from '../utils/message-error.js'

const getUserValidationSchema = Joi.object({
    id: Joi.number()
        .required()
        .positive()
        .messages({
            'number.base': `${errors.USERID.MUST_NUMBER}`,
            'number.positive': `${errors.USERID.MUST_POSITIVE}`,
            'any.required': `${errors.USERID.IS_REQUIRED}`,
        }),
}).unknown(true)

const updateUserValidationSchema = Joi.object({
    userName: Joi.string()
        .min(3)
        .max(30)
        .optional()
        .messages({
            'string.base': `${errors.USERNAME.MUST_STRING}}`,
            'string.min': `${errors.USERNAME.MUST_MIN}`,
            'string.max': `${errors.USERNAME.MUST_MAX}`,
            'any.required': `${errors.USERNAME.IS_REQUIRED}`,
        }),
    password: Joi.string()
        .min(6)
        .max(255)
        .optional()
        .messages({
            'string.base': `${errors.PASSWORD.MUST_STRING}`,
            'string.min': `${errors.PASSWORD.MUST_MIN}`,
            'string.max': `${errors.PASSWORD.MUST_MAX}`,
            'any.required': `${errors.PASSWORD.IS_REQUIRED}`,
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
            'any.required': `${errors.FULL_NAME.IS_REQUIRED}`,
        }),
}).unknown(true)

const avatarValidationSchema = Joi.array()
    .items(
        Joi.object()
            .keys({
                path: Joi.string().messages({
                    'string.base': `${errors.AVATAR.MUST_STRING}`,
                }),
            })
            .unknown(true)
            .error(new Error(`${errors.AVATAR.MUST_VALID}`))
    )
    .max(1)
    .error(new Error(`${errors.AVATAR.MUST_VALID}`))

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
    userName: Joi.string()
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
    roleId: Joi.number()
        .required()
        .positive()
        .messages({
            'any.required': `${errors.ROLE.ID.IS_REQUIRED}`,
            'number.base': `${errors.ROLE.ID.MUST_NUMBER}`,
            'number.positive': `${errors.ROLE.ID.MUST_POSITIVE}`,
        }),
}).unknown(true)

const loginValidationSchema = Joi.object({
    emailOrUserName: Joi.string()
        .min(3)
        .max(255)
        .required()
        .messages({
            'string.base': `${errors.USERNAME_OR_EMAIL.MUST_BE_STRING}`,
            'string.empty': `${errors.USERNAME_OR_EMAIL.CANNOT_BE_EMPTY}`,
            'string.min': `${errors.USERNAME_OR_EMAIL.MUST_BE_3_CHAR_MIN}`,
            'string.max': `${errors.USERNAME_OR_EMAIL.MUST_BE_255_CHAR_MAX}`,
            'any.required': `${errors.USERNAME_OR_EMAIL.REQUIRED}`,
        }),
    password: Joi.string()
        .min(6)
        .max(255)
        .required()
        .pattern(new RegExp('^[a-zA-Z0-9]{6,255}$'))
        .messages({
            'string.base': `${errors.PASSWORD.MUST_BE_STRING}`,
            'string.empty': `${errors.PASSWORD.CANNOT_BE_EMPTY}`,
            'string.min': `${errors.PASSWORD.MUST_BE_6_CHAR_MIN}`,
            'string.max': `${errors.PASSWORD.MUST_BE_255_CHAR_MAX}`,
            'string.pattern.base': `${errors.PASSWORD.MUST_BE_VALID}`,
            'any.required': `${errors.PASSWORD.REQUIRED}`,
        }),
}).messages({
    'object.unknown': `${errors.USERNAME_OR_EMAIL.UNKNOWN_BODY_ERROR}`,
})

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
    userName: Joi.string()
        .max(30)
        .optional()
        .empty('')
        .messages({
            'string.base': `${errors.USERNAME.MUST_STRING}`,
            'string.max': `${errors.USERNAME.MUST_MAX}`,
        }),
    email: Joi.string()
        .optional()
        .empty('')
        .messages({
            'string.base': `${errors.EMAIL.MUST_STRING}`,
            'string.email': `${errors.EMAIL.MUST_VALID}`,
        }),
    name: Joi.string()
        .max(50)
        .optional()
        .empty('')
        .messages({
            'string.base': `${errors.FULL_NAME.MUST_STRING}`,
            'string.max': `${errors.FULL_NAME.MUST_MAX}`,
        }),
    role: Joi.string()
        .max(30)
        .optional()
        .empty('')
        .messages({
            'string.base': `${errors.ROLE.MUST_STRING}`,
            'string.max': `${errors.ROLE.MUST_MAX}`,
        }),
    sortBy: Joi.string()
        .optional()
        .default('id')
        .empty('')
        .messages({
            'string.base': `${errors.SORT_BY.MUST_STRING}`,
        }),
    orderBy: Joi.string()
        .valid('asc', 'desc')
        .optional()
        .default('asc')
        .messages({
            'string.base': `${errors.ORDER_BY.MUST_STRING}`,
            'any.valid': `${errors.ORDER_BY.MUST_VALID}`,
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

const updateActiveUserValidationSchema = Joi.object({
    isActive: Joi.boolean()
        .required()
        .messages({
            'boolean.base': `${errors.USER.IS_ACTIVE.MUST_BOOLEAN}`,
            'any.required': `${errors.USER.IS_ACTIVE.IS_REQUIRED}`,
        }),
}).unknown(true)

export {
    addUserValidationSchema,
    loginValidationSchema,
    getUserValidationSchema,
    updateUserValidationSchema,
    updateActiveUserValidationSchema,
    avatarValidationSchema,
    deleteUserValidationSchema,
    searchUserValidationSchema,
}
