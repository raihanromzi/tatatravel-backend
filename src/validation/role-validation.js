import Joi from 'joi'
import { errors } from '../utils/message-error.js'

const addRoleValidationSchema = Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
        'string.base': errors.ERROR_ROLE_STRING,
        'string.empty': errors.ERROR_ROLE_EMPTY,
        'string.min': errors.ERROR_ROLE_MIN,
        'string.max': errors.ERROR_ROLE_MAX,
        'any.required': errors.ERROR_ROLE_REQUIRED,
    }),
}).unknown(true)

const updateRoleValidationSchema = Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
        'string.base': errors.ERROR_ROLE_STRING,
        'string.empty': errors.ERROR_ROLE_EMPTY,
        'string.min': errors.ERROR_ROLE_MIN,
        'string.max': errors.ERROR_ROLE_MAX,
        'any.required': errors.ERROR_ROLE_REQUIRED,
    }),
    isActive: Joi.boolean().required().messages({
        'boolean.base': errors.ERROR_IS_ACTIVE_BOOLEAN,
        'boolean.empty': errors.ERROR_IS_ACTIVE_EMPTY,
        'any.required': errors.ERROR_IS_ACTIVE_REQUIRED,
    }),
}).unknown(true)

const deleteRoleValidationSchema = Joi.object({
    id: Joi.number().required().messages({
        'number.base': 'roleId must be a number',
        'number.empty': 'roleId cannot be empty',
        'any.required': 'roleId is required!',
    }),
}).unknown(true)

const getRoleValidationSchema = Joi.object({
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
        'string.base': errors.ERROR_ROLE_STRING,
        'string.empty': errors.ERROR_ROLE_EMPTY,
        'string.min': errors.ERROR_ROLE_MIN,
        'string.max': errors.ERROR_ROLE_MAX,
    }),
}).unknown(true)

const getRoleByIdValidationSchema = Joi.object({
    id: Joi.number().positive().required().messages({
        'number.base': 'id must be a number',
        'number.empty': 'id cannot be empty',
        'number.positive': 'id must be a positive number',
    }),
}).unknown(true)

export {
    addRoleValidationSchema,
    updateRoleValidationSchema,
    deleteRoleValidationSchema,
    getRoleValidationSchema,
    getRoleByIdValidationSchema,
}
