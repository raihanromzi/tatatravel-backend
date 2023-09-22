import Joi from 'joi'

const addCountryValidationSchema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        'string.base': 'name must be a string',
        'string.max': 'max 100 characters',
        'string.min': 'min 3 characters',
        'any.required': 'name is required!',
    }),
    areaId: Joi.number().positive().required().messages({
        'number.base': 'area id must be a number',
        'number.positive': 'area id must be a positive number',
        'any.required': 'area id is required!',
    }),
}).unknown(true)

const updateCountryValidationSchema = Joi.object({
    name: Joi.string().min(3).max(100).optional().messages({
        'string.base': 'name must be a string',
        'string.max': 'max 100 characters',
        'string.min': 'min 3 characters',
    }),
    areaId: Joi.number().positive().optional().messages({
        'number.base': 'area id must be a number',
        'number.positive': 'area id must be a positive number',
    }),
}).unknown(true)

// const searchCountryValidationSchema = Joi.object({})

const deleteCountryValidationSchema = Joi.number()
    .positive()
    .required()
    .messages({
        'number.base': 'country id must be a number',
        'number.positive': 'country id must be a positive number',
        'any.required': 'country id is required!',
    })
    .unknown(true)

export { addCountryValidationSchema, updateCountryValidationSchema, deleteCountryValidationSchema }
