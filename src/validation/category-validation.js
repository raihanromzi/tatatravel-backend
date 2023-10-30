import Joi from 'joi'
import { errors } from '../utils/message-error.js'

const categoryNameValidationSchema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        'string.base': errors.CATEGORY.NAME.MUST_BE_STRING,
        'string.empty': errors.CATEGORY.NAME.CANNOT_BE_EMPTY,
        'string.min': errors.CATEGORY.NAME.MUST_BE_3_CHAR_MIN,
        'string.max': errors.CATEGORY.NAME.MUST_BE_50_CHAR_MAX,
        'any.required': errors.CATEGORY.NAME.IS_REQUIRED,
    }),
}).messages({
    'object.unknown': errors.HTTP.MESSAGE.UNKNOWN_BODY_ERROR,
})

const updateCategoryValidationSchema = Joi.object({
    name: Joi.string().min(3).max(50).optional().messages({
        'string.base': errors.CATEGORY.NAME.MUST_BE_STRING,
        'string.empty': errors.CATEGORY.NAME.CANNOT_BE_EMPTY,
        'string.min': errors.CATEGORY.NAME.MUST_BE_3_CHAR_MIN,
        'string.max': errors.CATEGORY.NAME.MUST_BE_50_CHAR_MAX,
    }),
    isActive: Joi.boolean().optional().messages({
        'boolean.base': errors.ROLE.IS_ACTIVE.MUST_BE_BOOLEAN,
        'boolean.empty': errors.ROLE.IS_ACTIVE.CANNOT_BE_EMPTY,
    }),
}).messages({
    'object.unknown': errors.HTTP.MESSAGE.UNKNOWN_BODY_ERROR,
})

const categoryIdValidationSchema = Joi.object({
    id: Joi.string().required().messages({
        'any.required': errors.CATEGORY.ID.IS_REQUIRED,
        'string.empty': errors.CATEGORY.ID.CANNOT_BE_EMPTY,
        'string.base': errors.CATEGORY.ID.MUST_VALID,
    }),
}).messages({
    'object.unknown': errors.HTTP.MESSAGE.UNKNOWN_BODY_ERROR,
})

const getCategoryValidationSchema = Joi.object({
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
    name: Joi.string().max(100).optional().empty('').messages({
        'string.base': errors.CATEGORY.NAME.MUST_BE_STRING,
        'string.max': errors.CATEGORY.NAME.MUST_BE_50_CHAR_MAX,
    }),
}).messages({
    'object.unknown': errors.HTTP.MESSAGE.UNKNOWN_BODY_ERROR,
})

export {
    categoryNameValidationSchema,
    categoryIdValidationSchema,
    updateCategoryValidationSchema,
    getCategoryValidationSchema,
}
