import Joi from 'joi'
import { errors } from '../utils/message-error.js'

const addCategoryValidationSchema = Joi.object({
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

const updateActiveCategoryValidationSchema = Joi.object({
    id: Joi.number().required().messages({
        'number.base': 'id must be a number',
        'number.empty': 'id cannot be empty',
        'any.required': 'id is required!',
    }),
    status: Joi.bool().required().messages({
        'bool.base': 'status must be a boolean',
        'bool.empty': 'status cannot be empty',
        'any.required': 'status is required!',
    }),
}).unknown(true)

const deleteCategoryValidationSchema = Joi.object({
    id: Joi.number().required().messages({
        'number.base': 'id must be a number',
        'number.empty': 'id cannot be empty',
        'any.required': 'id is required!',
    }),
})

export {
    addCategoryValidationSchema,
    updateActiveCategoryValidationSchema,
    deleteCategoryValidationSchema,
}
