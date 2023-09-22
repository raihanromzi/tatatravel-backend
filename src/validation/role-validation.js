import Joi from 'joi'

const addRoleValidationSchema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        'string.base': 'name must be a string',
        'string.empty': 'name cannot be empty',
        'string.min': 'min 3 characters',
        'string.max': 'max 50 characters',
        'any.required': 'name is required!',
    }),
}).unknown(true)

const updateRoleValidationSchema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        'string.base': 'name must be a string',
        'string.empty': 'name cannot be empty',
        'string.min': 'min 3 characters',
        'string.max': 'max 50 characters',
        'any.required': 'name is required!',
    }),
    roleId: Joi.number().required().messages({
        'number.base': 'roleId must be a number',
        'number.empty': 'roleId cannot be empty',
        'any.required': 'roleId is required!',
    }),
}).unknown(true)

const deleteRoleValidationSchema = Joi.object({
    roleId: Joi.number().required().messages({
        'number.base': 'roleId must be a number',
        'number.empty': 'roleId cannot be empty',
        'any.required': 'roleId is required!',
    }),
})

export { addRoleValidationSchema, updateRoleValidationSchema, deleteRoleValidationSchema }
