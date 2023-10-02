import Joi from 'joi'
import { errors } from '../utils/message-error.js'

const addAreaValidationSchema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        'string.base': errors.AREA.NAME.MUST_STRING,
        'string.empty': errors.AREA.NAME.CANNOT_EMPTY,
        'string.min': errors.AREA.NAME.MUST_MIN,
        'string.max': errors.AREA.NAME.MUST_MAX,
        'any.required': errors.AREA.NAME.IS_REQUIRED,
    }),
}).unknown(true)

const updateAreaValidationSchema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        'string.base': errors.AREA.NAME.MUST_STRING,
        'string.empty': errors.AREA.NAME.CANNOT_EMPTY,
        'string.min': errors.AREA.NAME.MUST_MIN,
        'string.max': errors.AREA.NAME.MUST_MAX,
        'any.required': errors.AREA.NAME.IS_REQUIRED,
    }),
}).unknown(true)

const getAreaValidationSchema = Joi.object({
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
    name: Joi.string().max(100).optional().default('').messages({
        'string.base': errors.AREA.NAME.MUST_STRING,
        'string.empty': errors.AREA.NAME.CANNOT_EMPTY,
        'string.min': errors.AREA.NAME.MUST_MIN,
        'string.max': errors.AREA.NAME.MUST_MAX,
    }),
    sortBy: Joi.string()
        .optional()
        .default('id')
        .messages({
            'string.base': `${errors.SORT_BY.MUST_STRING}`,
        }),
    orderBy: Joi.string()
        .valid('asc', 'desc')
        .optional()
        .default('asc')
        .messages({
            'string.base': `${errors.ORDER_BY.MUST_STRING}`,
        }),
}).unknown(true)

const getAreaByIdValidationSchema = Joi.object({
    id: Joi.number().positive().required().messages({
        'number.base': errors.AREA.ID.MUST_NUMBER,
        'number.empty': errors.AREA.ID.CANNOT_EMPTY,
        'number.positive': errors.AREA.ID.MUST_POSITIVE,
    }),
}).unknown(true)

const deleteAreaValidationSchema = Joi.object({
    id: Joi.number().positive().required().messages({
        'number.base': errors.AREA.ID.MUST_NUMBER,
        'number.empty': errors.AREA.ID.CANNOT_EMPTY,
        'number.positive': errors.AREA.ID.MUST_POSITIVE,
        'any.required': errors.AREA.ID.IS_REQUIRED,
    }),
}).unknown(true)

export {
    addAreaValidationSchema,
    updateAreaValidationSchema,
    getAreaValidationSchema,
    getAreaByIdValidationSchema,
    deleteAreaValidationSchema,
}
