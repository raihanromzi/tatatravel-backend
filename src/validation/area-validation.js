import Joi from 'joi'
import { errors } from '../utils/message-error.js'

const addAreaValidationSchema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        'string.base': errors.ERROR_AREA_NAME_STRING,
        'string.empty': errors.ERROR_AREA_NAME_EMPTY,
        'string.min': errors.ERROR_AREA_NAME_MIN,
        'string.max': errors.ERROR_AREA_NAME_MAX,
        'any.required': errors.ERROR_AREA_NAME_REQUIRED,
    }),
}).unknown(true)

const updateAreaValidationSchema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        'string.base': 'name must be a string',
        'string.empty': 'name cannot be empty',
        'string.min': 'min 3 characters',
        'string.max': 'max 50 characters',
        'any.required': 'name is required!',
    }),
}).unknown(true)

const getAreaValidationSchema = Joi.object({
    page: Joi.number().min(1).positive().default(1).messages({
        'number.base': errors.ERROR_PAGE_NUMBER,
        'number.empty': errors.ERROR_PAGE_EMPTY,
        'number.positive': errors.ERROR_PAGE_POSITIVE,
    }),
    size: Joi.number().min(1).positive().max(100).default(10).messages({
        'number.base': errors.ERROR_SIZE_NUMBER,
        'number.empty': errors.ERROR_SIZE_EMPTY,
        'number.positive': errors.ERROR_SIZE_POSITIVE,
    }),
    name: Joi.string().max(100).optional().default('').messages({
        'string.base': errors.ERROR_AREA_NAME_STRING,
        'string.empty': errors.ERROR_AREA_NAME_EMPTY,
        'string.min': errors.ERROR_AREA_NAME_MIN,
        'string.max': errors.ERROR_AREA_NAME_MAX,
    }),
}).unknown(true)

const getAreaByIdValidationSchema = Joi.object({
    id: Joi.number().positive().required().messages({
        'number.base': 'id must be a number',
        'number.empty': 'id cannot be empty',
        'number.positive': 'id must be a positive number',
    }),
}).unknown(true)

const deleteAreaValidationSchema = Joi.object({
    id: Joi.number().positive().required().messages({
        'number.base': 'id must be a number',
        'number.empty': 'id cannot be empty',
        'number.positive': 'id must be a positive number',
        'any.required': 'id is required!',
    }),
}).unknown(true)

export {
    addAreaValidationSchema,
    updateAreaValidationSchema,
    getAreaValidationSchema,
    getAreaByIdValidationSchema,
    deleteAreaValidationSchema,
}
