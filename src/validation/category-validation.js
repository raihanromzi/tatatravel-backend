import Joi from 'joi'

const addCategoryValidationSchema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        'string.base': 'name must be a string',
        'string.empty': 'name cannot be empty',
        'string.min': 'min 3 characters',
        'string.max': 'max 50 characters',
        'any.required': 'name is required!',
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
