import Joi from 'joi'
import { errors } from '../utils/message-error.js'

const addCountryValidationSchema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        'string.base': errors.COUNTRY.NAME.MUST_STRING,
        'string.max': errors.COUNTRY.NAME.MUST_MAX,
        'string.min': errors.COUNTRY.NAME.MUST_MIN,
        'any.required': errors.COUNTRY.NAME.IS_REQUIRED,
    }),
    areaId: Joi.number().positive().required().messages({
        'number.base': errors.AREA.ID.MUST_NUMBER,
        'number.positive': errors.AREA.ID.MUST_POSITIVE,
        'any.required': errors.AREA.ID.IS_REQUIRED,
    }),
}).unknown(true)

const updateCountryValidationSchema = Joi.object({
    name: Joi.string().min(3).max(100).optional().messages({
        'string.base': errors.COUNTRY.NAME.MUST_STRING,
        'string.max': errors.COUNTRY.NAME.MUST_MAX,
        'string.min': errors.COUNTRY.NAME.MUST_MIN,
    }),
    areaId: Joi.number().positive().optional().messages({
        'number.base': errors.AREA.ID.MUST_NUMBER,
        'number.positive': errors.AREA.ID.MUST_POSITIVE,
    }),
}).unknown(true)

const deleteCountryValidationSchema = Joi.object({
    id: Joi.number().positive().required().messages({
        'number.base': errors.COUNTRY.ID.MUST_NUMBER,
        'number.positive': errors.COUNTRY.ID.MUST_POSITIVE,
        'any.required': errors.COUNTRY.ID.IS_REQUIRED,
    }),
}).unknown(true)

const getCountryByIdValidationSchema = Joi.object({
    id: Joi.number().positive().required().messages({
        'number.base': errors.COUNTRY.ID.MUST_NUMBER,
        'number.positive': errors.COUNTRY.ID.MUST_POSITIVE,
        'number.empty': errors.COUNTRY.ID.CANNOT_EMPTY,
        'any.required': errors.COUNTRY.ID.IS_REQUIRED,
    }),
}).unknown(true)

export {
    addCountryValidationSchema,
    updateCountryValidationSchema,
    getCountryByIdValidationSchema,
    deleteCountryValidationSchema,
}
