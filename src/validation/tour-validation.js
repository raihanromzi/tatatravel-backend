import Joi from 'joi'

const addTourValidationSchema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        'string.base': 'name must be a string',
        'string.min': 'min 3 characters',
        'string.max': 'max 100 characters',
        'any.required': 'name is required!',
    }),
    price: Joi.string().min(3).max(255).required().messages({
        'string.base': 'price must be a string',
        'string.min': 'min 3 characters',
        'string.max': 'max 255 characters',
        'any.required': 'price is required!',
    }),
    dateStart: Joi.date().required().messages({
        'date.base': 'dateStart must be a date',
        'any.required': 'dateStart is required!',
    }),
    dateEnd: Joi.date().required().messages({
        'date.base': 'dateEnd must be a date',
        'any.required': 'dateEnd is required!',
    }),
    description: Joi.string().min(3).max(255).messages({
        'string.base': 'description must be a string',
        'string.min': 'min 3 characters',
        'string.max': 'max 255 characters',
    }),
}).unknown(true)

const updateTourValidationSchema = Joi.object({
    name: Joi.string().min(3).max(100).optional().messages({
        'string.base': 'name must be a string',
        'string.min': 'min 3 characters',
        'string.max': 'max 100 characters',
    }),
    price: Joi.string().min(3).max(255).optional().messages({
        'string.base': 'price must be a string',
        'string.min': 'min 3 characters',
        'string.max': 'max 255 characters',
    }),
    dateStart: Joi.date().optional().messages({
        'date.base': 'dateStart must be a date',
    }),
    dateEnd: Joi.date().optional().messages({
        'date.base': 'dateEnd must be a date',
    }),
    description: Joi.string().min(3).max(255).optional().messages({
        'string.base': 'description must be a string',
        'string.min': 'min 3 characters',
        'string.max': 'max 255 characters',
    }),
}).unknown(true)

const getTourValidationSchema = Joi.number().required().messages({
    'number.base': 'id must be a number',
    'any.required': 'id is required!',
})

const deleteTourValidationSchema = Joi.number().required().messages({
    'number.base': 'id must be a number',
    'any.required': 'id is required!',
})

export {
    addTourValidationSchema,
    updateTourValidationSchema,
    getTourValidationSchema,
    deleteTourValidationSchema,
}
