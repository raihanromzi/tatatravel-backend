import Joi from 'joi'
import { errors } from '../utils/message-error.js'

const addOrUpdateCategoryValidationSchema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        'string.base': errors.CATEGORY.NAME.MUST_STRING,
        'string.empty': errors.CATEGORY.NAME.CANNOT_EMPTY,
        'string.min': errors.CATEGORY.NAME.MUST_MIN,
        'string.max': errors.CATEGORY.NAME.MUST_MAX,
        'any.required': errors.CATEGORY.NAME.IS_REQUIRED,
    }),
    isActive: Joi.bool().required().messages({
        'bool.base': errors.CATEGORY.IS_ACTIVE.MUST_BOOLEAN,
        'bool.empty': errors.CATEGORY.IS_ACTIVE.CANNOT_EMPTY,
        'any.required': errors.CATEGORY.IS_ACTIVE.IS_REQUIRED,
    }),
}).unknown(true)

const idCategoryValidationSchema = Joi.object({
    id: Joi.number().required().messages({
        'number.base': errors.CATEGORY.ID.MUST_NUMBER,
        'number.empty': errors.CATEGORY.ID.CANNOT_EMPTY,
        'any.required': errors.CATEGORY.ID.IS_REQUIRED,
    }),
}).unknown(true)

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
    name: Joi.string().max(100).optional().default('').messages({
        'string.base': errors.CATEGORY.NAME.MUST_STRING,
        'string.empty': errors.CATEGORY.NAME.CANNOT_EMPTY,
        'string.max': errors.CATEGORY.NAME.MUST_MAX,
    }),
}).unknown(true)

export {
    addOrUpdateCategoryValidationSchema,
    idCategoryValidationSchema,
    getCategoryValidationSchema,
}
