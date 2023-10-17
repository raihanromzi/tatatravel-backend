import Joi from 'joi'
import { errors } from '../utils/message-error.js'

const addRoleValidationSchema = Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
        'string.base': errors.ROLE.NAME.MUST_BE_STRING,
        'string.empty': errors.ROLE.NAME.CANNOT_BE_EMPTY,
        'string.min': errors.ROLE.NAME.MUST_BE_3_CHAR_MIN,
        'string.max': errors.ROLE.NAME.MUST_BE_30_CHAR_MAX,
        'any.required': errors.ROLE.NAME.IS_REQUIRED,
    }),
}).unknown(true)

const updateRoleValidationSchema = Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
        'string.base': errors.ROLE.NAME.MUST_BE_STRING,
        'string.empty': errors.ROLE.NAME.CANNOT_BE_EMPTY,
        'string.min': errors.ROLE.NAME.MUST_BE_3_CHAR_MIN,
        'string.max': errors.ROLE.NAME.MUST_BE_30_CHAR_MAX,
        'any.required': errors.ROLE.NAME.IS_REQUIRED,
    }),
    isActive: Joi.boolean().required().messages({
        'boolean.base': errors.ROLE.IS_ACTIVE.MUST_BE_BOOLEAN,
        'boolean.empty': errors.ROLE.IS_ACTIVE.CANNOT_BE_EMPTY,
        'any.required': errors.ROLE.IS_ACTIVE.IS_REQUIRED,
    }),
}).unknown(true)

const deleteRoleValidationSchema = Joi.object({
    id: Joi.number().positive().required().messages({
        'number.base': errors.ROLE.ID.MUST_BE_NUMBER,
        'number.empty': errors.ROLE.ID.CANNOT_BE_EMPTY,
        'number.positive': errors.ROLE.ID.MUST_BE_POSITIVE,
        'any.required': errors.ROLE.ID.IS_REQUIRED,
    }),
}).unknown(true)

const getRoleValidationSchema = Joi.object({
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
        'string.base': errors.ROLE.NAME.MUST_BE_STRING,
        'string.empty': errors.ROLE.NAME.CANNOT_BE_EMPTY,
        'string.min': errors.ROLE.NAME.MUST_BE_3_CHAR_MIN,
        'string.max': errors.ROLE.NAME.MUST_BE_30_CHAR_MAX,
    }),
}).unknown(true)

const getRoleByIdValidationSchema = Joi.object({
    id: Joi.number().positive().required().messages({
        'number.base': errors.ROLE.ID.MUST_BE_NUMBER,
        'number.empty': errors.ROLE.ID.CANNOT_BE_EMPTY,
        'number.positive': errors.ROLE.ID.MUST_BE_POSITIVE,
        'any.required': errors.ROLE.ID.IS_REQUIRED,
    }),
}).unknown(true)

export {
    addRoleValidationSchema,
    updateRoleValidationSchema,
    deleteRoleValidationSchema,
    getRoleValidationSchema,
    getRoleByIdValidationSchema,
}
