import Joi from 'joi'
import { errors } from '../utils/message-error.js'

const addCountryValidationSchema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        'string.base': errors.ERROR_COUNTRY_NAME_STRING,
        'string.max': errors.ERROR_COUNTRY_NAME_MAX,
        'string.min': errors.ERROR_COUNTRY_NAME_MIN,
        'any.required': errors.ERROR_COUNTRY_NAME_REQUIRED,
    }),
    areaId: Joi.number().positive().required().messages({
        'number.base': errors.ERROR_AREA_ID_NUMBER,
        'number.positive': errors.ERROR_AREA_ID_POSITIVE,
        'any.required': errors.ERROR_AREA_ID_REQUIRED,
    }),
}).unknown(true)

const updateCountryValidationSchema = Joi.object({
    name: Joi.string().min(3).max(100).optional().messages({
        'string.base': errors.ERROR_COUNTRY_NAME_STRING,
        'string.max': errors.ERROR_COUNTRY_NAME_MAX,
        'string.min': errors.ERROR_COUNTRY_NAME_MIN,
    }),
    areaId: Joi.number().positive().optional().messages({
        'number.base': errors.ERROR_AREA_ID_NUMBER,
        'number.positive': errors.ERROR_AREA_ID_POSITIVE,
    }),
}).unknown(true)

const deleteCountryValidationSchema = Joi.object({
    id: Joi.number().positive().required().messages({
        'number.base': 'country id must be a number',
        'number.positive': 'country id must be a positive number',
        'any.required': 'country id is required!',
    }),
}).unknown(true)

const getCountryByIdValidationSchema = Joi.object({
    id: Joi.number().positive().required().messages({
        'number.base': errors.ERROR_COUNTRY_ID_NUMBER,
        'number.positive': errors.ERROR_COUNTRY_ID_POSITIVE,
        'number.empty': errors.ERROR_COUNTRY_EMPTY,
        'any.required': errors.ERROR_COUNTRY_ID_REQUIRED,
    }),
}).unknown(true)

export {
    addCountryValidationSchema,
    updateCountryValidationSchema,
    getCountryByIdValidationSchema,
    deleteCountryValidationSchema,
}
