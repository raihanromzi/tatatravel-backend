import Joi from 'joi'

const addAreaValidationSchema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        'string.base': 'name must be a string',
        'string.empty': 'name cannot be empty',
        'string.min': 'min 3 characters',
        'string.max': 'max 50 characters',
        'any.required': 'name is required!',
    }),
})

const updateAreaValidationSchema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        'string.base': 'name must be a string',
        'string.empty': 'name cannot be empty',
        'string.min': 'min 3 characters',
        'string.max': 'max 50 characters',
        'any.required': 'name is required!',
    }),
})

const getAreaValidationSchema = Joi.object({
    id: Joi.number().positive().required().messages({
        'number.base': 'id must be a number',
        'number.empty': 'id cannot be empty',
        'number.positive': 'id must be a positive number',
        'any.required': 'id is required!',
    }),
})

const deleteAreaValidationSchema = Joi.object({
    id: Joi.number().positive().required().messages({
        'number.base': 'id must be a number',
        'number.empty': 'id cannot be empty',
        'number.positive': 'id must be a positive number',
        'any.required': 'id is required!',
    }),
})

export {
    addAreaValidationSchema,
    updateAreaValidationSchema,
    getAreaValidationSchema,
    deleteAreaValidationSchema,
}
