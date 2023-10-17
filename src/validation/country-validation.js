import Joi from 'joi'
import { errors } from '../utils/message-error.js'

const addCountryValidationSchema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        'string.base': errors.COUNTRY.NAME.MUST_BE_STRING,
        'string.max': errors.COUNTRY.NAME.MUST_BE_100_CHAR_MAX,
        'string.min': errors.COUNTRY.NAME.MUST_BE_3_CHAR_MIN,
        'string.empty': errors.COUNTRY.NAME.CANNOT_BE_EMPTY,
        'any.required': errors.COUNTRY.NAME.IS_REQUIRED,
    }),
    areaId: Joi.number().positive().required().messages({
        'number.base': errors.AREA.ID.MUST_BE_NUMBER,
        'number.positive': errors.AREA.ID.MUST_BE_POSITIVE,
        'number.empty': errors.AREA.ID.CANNOT_BE_EMPTY,
        'any.required': errors.AREA.ID.IS_REQUIRED,
    }),
}).messages({
    'object.unknown': errors.HTTP.MESSAGE.UNKNOWN_BODY_ERROR,
})

const getCountryValidationSchema = Joi.object({
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
    name: Joi.string().max(50).optional().empty('').messages({
        'string.base': errors.COUNTRY.NAME.MUST_BE_STRING,
        'string.empty': errors.COUNTRY.NAME.CANNOT_BE_EMPTY,
        'string.min': errors.COUNTRY.NAME.MUST_BE_3_CHAR_MIN,
        'string.max': errors.COUNTRY.NAME.MUST_BE_50_CHAR_MAX,
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
    'object.unknown': errors.HTTP.MESSAGE.UNKNOWN_BODY_ERROR,
})

const countryIdValidationSchema = Joi.object({
    id: Joi.number().positive().required().messages({
        'number.base': errors.COUNTRY.ID.MUST_BE_NUMBER,
        'number.positive': errors.COUNTRY.ID.MUST_BE_POSITIVE,
        'number.empty': errors.COUNTRY.ID.CANNOT_BE_EMPTY,
        'any.required': errors.COUNTRY.ID.IS_REQUIRED,
    }),
}).messages({
    'object.unknown': errors.HTTP.MESSAGE.UNKNOWN_BODY_ERROR,
})

const updateCountryValidationSchema = Joi.object({
    name: Joi.string().min(3).max(100).optional().messages({
        'string.base': errors.COUNTRY.NAME.MUST_BE_STRING,
        'string.max': errors.COUNTRY.NAME.MUST_BE_100_CHAR_MAX,
        'string.min': errors.COUNTRY.NAME.MUST_BE_3_CHAR_MIN,
    }),
    areaId: Joi.number().positive().optional().empty('').messages({
        'number.base': errors.AREA.ID.MUST_BE_NUMBER,
        'number.positive': errors.AREA.ID.MUST_BE_POSITIVE,
    }),
}).messages({
    'object.unknown': errors.HTTP.MESSAGE.UNKNOWN_BODY_ERROR,
})

export {
    addCountryValidationSchema,
    getCountryValidationSchema,
    countryIdValidationSchema,
    updateCountryValidationSchema,
}
