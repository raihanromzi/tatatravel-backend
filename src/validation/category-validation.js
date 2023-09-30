import Joi from 'joi'
import { errors } from '../utils/message-error.js'

const addOrUpdateCategoryValidationSchema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        'string.base': errors.CATEGORY_NAME_STRING,
        'string.empty': errors.CATEGORY_NAME_EMPTY,
        'string.min': errors.CATEGORY_NAME_MIN,
        'string.max': errors.CATEGORY_NAME_MAX,
        'any.required': errors.CATEGORY_NAME_REQUIRED,
    }),
    isActive: Joi.bool().required().messages({
        'bool.base': errors.ERROR_IS_ACTIVE_BOOLEAN,
        'bool.empty': errors.ERROR_IS_ACTIVE_EMPTY,
        'any.required': errors.ERROR_IS_ACTIVE_REQUIRED,
    }),
}).unknown(true)

const idCategoryValidationSchema = Joi.object({
    id: Joi.number().required().messages({
        'number.base': errors.ERROR_CATEGORY_ID_NUMBER,
        'number.empty': errors.ERROR_CATEGORY_ID_EMPTY,
        'any.required': errors.ERROR_CATEGORY_ID_REQUIRED,
    }),
})

const deleteCategoryValidationSchema = Joi.object({
    id: Joi.number().required().messages({
        'number.base': 'id must be a number',
        'number.empty': 'id cannot be empty',
        'any.required': 'id is required!',
    }),
})

const getCategoryValidationSchema = Joi.object({
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
        'string.base': errors.CATEGORY_NAME_STRING,
        'string.empty': errors.CATEGORY_NAME_EMPTY,
        'string.min': errors.CATEGORY_NAME_MIN,
        'string.max': errors.CATEGORY_NAME_MAX,
    }),
}).unknown(true)

export {
    addOrUpdateCategoryValidationSchema,
    deleteCategoryValidationSchema,
    idCategoryValidationSchema,
    getCategoryValidationSchema,
}
