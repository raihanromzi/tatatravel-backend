import Joi from 'joi'
import { errors } from '../utils/message-error.js'

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
        .required()
        .pattern(new RegExp('^(?=.*[A-Z])[A-Za-z0-9]{8,16}$'))
        .messages({
            'string.pattern.base': `${errors.PASSWORD.MUST_BE_VALID}`,
            'string.base': `${errors.PASSWORD.MUST_BE_STRING}`,
            'string.empty': `${errors.PASSWORD.CANNOT_BE_EMPTY}`,
            'any.required': `${errors.PASSWORD.REQUIRED}`,
        }),
}).messages({
    'object.unknown': `${errors.HTTP.MESSAGE.UNKNOWN_BODY_ERROR}`,
})

const userValidationSchema = Joi.object({
    fullName: Joi.string()
        .min(3)
        .max(255)
        .required()
        .messages({
            'string.base': `${errors.FULL_NAME.MUST_BE_STRING}`,
            'string.empty': `${errors.FULL_NAME.CANNOT_BE_EMPTY}`,
            'string.min': `${errors.FULL_NAME.MUST_BE_3_CHAR_MIN}`,
            'string.max': `${errors.FULL_NAME.MUST_BE_255_CHAR_MAX}`,
            'any.required': `${errors.FULL_NAME.IS_REQUIRED}`,
        }),
    userName: Joi.string()
        .min(3)
        .max(30)
        .alphanum()
        .required()
        .messages({
            'string.base': `${errors.USERNAME.MUST_BE_STRING}`,
            'string.empty': `${errors.USERNAME.CANNOT_BE_EMPTY}`,
            'string.min': `${errors.USERNAME.MUST_BE_3_CHAR_MIN}`,
            'string.max': `${errors.USERNAME.MUST_BE_30_CHAR_MAX}`,
            'string.alphanum': `${errors.USERNAME.MUST_BE_ALPHA_NUM}`,
            'any.required': `${errors.USERNAME.IS_REQUIRED}`,
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.base': `${errors.EMAIL.MUST_BE_STRING}`,
            'string.empty': `${errors.EMAIL.CANNOT_BE_EMPTY}`,
            'string.email': `${errors.EMAIL.MUST_BE_VALID}`,
            'any.required': `${errors.EMAIL.IS_REQUIRED}`,
        }),
    password: Joi.string()
        .required()
        .pattern(new RegExp('^(?=.*[A-Z])[A-Za-z0-9]{8,16}$'))
        .messages({
            'string.pattern.base': `${errors.PASSWORD.MUST_BE_VALID}`,
            'string.base': `${errors.PASSWORD.MUST_BE_STRING}`,
            'string.empty': `${errors.PASSWORD.CANNOT_BE_EMPTY}`,
            'any.required': `${errors.PASSWORD.REQUIRED}`,
        }),
    roleId: Joi.number()
        .required()
        .positive()
        .messages({
            'any.required': `${errors.ROLE.ID.IS_REQUIRED}`,
            'number.base': `${errors.ROLE.ID.MUST_BE_NUMBER}`,
            'number.positive': `${errors.ROLE.ID.MUST_BE_POSITIVE}`,
        }),
}).messages({
    'object.unknown': `${errors.HTTP.MESSAGE.UNKNOWN_BODY_ERROR}`,
})

const userIdValidationSchema = Joi.object({
    id: Joi.number()
        .required()
        .positive()
        .messages({
            'number.base': `${errors.USERID.MUST_BE_NUMBER}`,
            'number.positive': `${errors.USERID.MUST_BE_POSITIVE}`,
            'number.empty': `${errors.USERID.CANNOT_BE_EMPTY}`,
            'any.required': `${errors.USERID.IS_REQUIRED}`,
        }),
}).messages({
    'object.unknown': `${errors.HTTP.MESSAGE.UNKNOWN_BODY_ERROR}`,
})

const activeUserValidationSchema = Joi.object({
    isActive: Joi.boolean()
        .required()
        .messages({
            'boolean.base': `${errors.USER.IS_ACTIVE.MUST_BE_BOOLEAN}`,
            'boolean.empty': `${errors.USER.IS_ACTIVE.CANNOT_BE_EMPTY}`,
            'any.required': `${errors.USER.IS_ACTIVE.IS_REQUIRED}`,
        }),
}).messages({
    'object.unknown': `${errors.HTTP.MESSAGE.UNKNOWN_BODY_ERROR}`,
})

const getUserValidationSchema = Joi.object({
    page: Joi.number().min(1).positive().default(1).messages({
        'number.base': errors.PAGE.MUST_BE_NUMBER,
        'number.empty': errors.PAGE.CANNOT_BE_EMPTY,
        'number.positive': errors.PAGE.MUST_BE_POSITIVE,
    }),
    size: Joi.number().min(1).positive().max(100).default(10).messages({
        'number.base': errors.SIZE.MUST_BE_NUMBER,
        'number.empty': errors.SIZE.CANNOT_BE_EMPTY,
        'number.positive': errors.SIZE.MUST_BE_POSITIVE,
    }),
    userName: Joi.string()
        .max(30)
        .optional()
        .empty('')
        .messages({
            'string.base': `${errors.USERNAME.MUST_BE_STRING}`,
            'string.max': `${errors.USERNAME.MUST_BE_30_CHAR_MAX}`,
        }),
    email: Joi.string()
        .optional()
        .empty('')
        .messages({
            'string.base': `${errors.EMAIL.MUST_BE_STRING}`,
        }),
    name: Joi.string()
        .max(50)
        .optional()
        .empty('')
        .messages({
            'string.base': `${errors.FULL_NAME.MUST_BE_STRING}`,
            'string.max': `${errors.FULL_NAME.MUST_BE_50_CHAR_MAX}`,
        }),
    isActive: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': `${errors.USER.IS_ACTIVE.MUST_BE_BOOLEAN}`,
            'boolean.empty': `${errors.USER.IS_ACTIVE.CANNOT_BE_EMPTY}`,
        }),
    role: Joi.string()
        .max(30)
        .optional()
        .empty('')
        .messages({
            'string.base': `${errors.ROLE.NAME.MUST_BE_STRING}`,
            'string.max': `${errors.ROLE.NAME.MUST_BE_30_CHAR_MAX}`,
        }),
    sortBy: Joi.string()
        .optional()
        .default('id')
        .empty('')
        .messages({
            'string.base': `${errors.SORT_BY.MUST_BE_STRING}`,
            'any.only': `${errors.SORT_BY.MUST_BE_VALID}`,
        }),
    orderBy: Joi.string()
        .valid('asc', 'desc')
        .optional()
        .default('asc')
        .messages({
            'string.base': `${errors.ORDER_BY.MUST_BE_STRING}`,
            'any.valid': `${errors.ORDER_BY.MUST_BE_VALID}`,
            'string.empty': `${errors.ORDER_BY.CANNOT_BE_EMPTY}`,
            'any.only': `${errors.ORDER_BY.MUST_BE_VALID}`,
        }),
}).messages({
    'object.unknown': `${errors.HTTP.MESSAGE.UNKNOWN_BODY_ERROR}`,
})

const updateUserValidationSchema = Joi.object({
    userName: Joi.string()
        .min(3)
        .max(30)
        .alphanum()
        .optional()
        .messages({
            'string.base': `${errors.USERNAME.MUST_BE_STRING}}`,
            'string.min': `${errors.USERNAME.MUST_BE_3_CHAR_MIN}`,
            'string.max': `${errors.USERNAME.MUST_BE_30_CHAR_MAX}`,
            'string.alphanum': `${errors.USERNAME.MUST_BE_ALPHA_NUM}`,
        }),

    fullName: Joi.string()
        .min(3)
        .max(255)
        .optional()
        .messages({
            'string.base': `${errors.FULL_NAME.MUST_BE_STRING}`,
            'string.empty': `${errors.FULL_NAME.CANNOT_BE_EMPTY}`,
            'string.min': `${errors.FULL_NAME.MUST_BE_3_CHAR_MIN}`,
            'string.max': `${errors.FULL_NAME.MUST_BE_255_CHAR_MAX}`,
        }),
    password: Joi.string()
        .pattern(new RegExp('^(?=.*[A-Z])[A-Za-z0-9]{8,16}$'))
        .optional()
        .messages({
            'string.pattern.base': `${errors.PASSWORD.MUST_BE_VALID}`,
            'string.base': `${errors.PASSWORD.MUST_BE_STRING}`,
        }),
    avatar: Joi.array()
        .optional()
        .messages({
            'array.base': `${errors.AVATAR.MUST_BE_VALID_FORMAT}`,
            'array.empty': `${errors.AVATAR.CANNOT_BE_EMPTY}`,
        }),
}).messages({
    'object.unknown': `${errors.HTTP.MESSAGE.UNKNOWN_BODY_ERROR}`,
})

const avatarValidationSchema = Joi.object({
    avatar: Joi.array()
        .items(
            Joi.object()
                .keys({
                    path: Joi.string()
                        .required()
                        .messages({
                            'string.base': `${errors.AVATAR.MUST_BE_STRING}`,
                            'string.empty': `${errors.AVATAR.CANNOT_BE_EMPTY}`,
                            'any.required': `${errors.AVATAR.IS_REQUIRED}`,
                        }),
                })
                .unknown(true)
                .error(new Error(`${errors.AVATAR.MUST_BE_VALID_FORMAT}`))
        )
        .max(1)
        .error(new Error(`${errors.AVATAR.MUST_BE_VALID_FORMAT}`)),
}).messages({
    'object.unknown': `${errors.HTTP.MESSAGE.UNKNOWN_BODY_ERROR}`,
})

export {
    userValidationSchema,
    loginValidationSchema,
    userIdValidationSchema,
    updateUserValidationSchema,
    activeUserValidationSchema,
    avatarValidationSchema,
    getUserValidationSchema,
}
