import Joi from 'joi'

const addUserValidationSchema = Joi.object({
    firstName: Joi.string().min(3).max(50).required().messages({
        'string.base': 'first name must be a string',
        'string.empty': 'first name cannot be empty',
        'string.min': 'min 3 characters',
        'string.max': 'max 50 characters',
        'any.required': 'first name is required!',
    }),
    lastName: Joi.string().min(3).max(50).required().messages({
        'string.base': 'last name must be a string',
        'string.empty': 'last name cannot be empty',
        'string.min': 'min 3 characters',
        'string.max': 'max 50 characters',
        'any.required': 'last name is required!',
    }),
    username: Joi.string().min(3).max(30).required().messages({
        'string.base': 'username must be a string',
        'string.empty': 'username cannot be empty',
        'string.min': 'min 3 characters',
        'string.max': 'max 30 characters',
        'any.required': 'username is required!',
    }),
    email: Joi.string().email().required().messages({
        'string.base': 'email must be a string',
        'string.empty': 'email cannot be empty',
        'string.email': 'email must be a valid email',
        'any.required': 'email is required!',
    }),
    password: Joi.string().min(6).max(255).required().messages({
        'string.base': 'password must be a string',
        'string.empty': 'password cannot be empty',
        'string.min': 'min 6 characters',
        'string.max': 'max 255 characters',
        'any.only': 'Password is required!',
    }),
    role: Joi.number().required(),
}).unknown(true)

const loginValidationSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.base': 'email must be a string',
        'string.empty': 'email cannot be empty',
        'string.email': 'email must be a valid email',
        'any.required': 'email is required!',
    }),
    password: Joi.string().min(6).max(255).required().messages({
        'string.base': 'password must be a string',
        'string.empty': 'password cannot be empty',
        'string.min': 'min 6 characters',
        'string.max': 'max 255 characters',
        'any.only': 'Password is required!',
    }),
}).unknown(true)

const getUserValidationSchema = Joi.string().min(3).max(30).required().messages({
    'string.base': 'username must be a string',
    'string.empty': 'username cannot be empty',
    'string.min': 'min 3 characters',
    'string.max': 'max 30 characters',
    'any.required': 'username is required!',
})

const updateUserValidationSchema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
        'string.base': 'username must be a string',
        'string.min': 'min 3 characters',
        'string.max': 'max 30 characters',
    }),
    newUsername: Joi.string().min(3).max(30).required().messages({
        'string.base': 'username must be a string',
        'string.min': 'min 3 characters',
        'string.max': 'max 30 characters',
    }),
    password: Joi.string().min(6).max(255).optional().messages({
        'string.base': 'password must be a string',
        'string.min': 'min 6 characters',
        'string.max': 'max 255 characters',
    }),
    firstName: Joi.string().min(3).max(50).optional().messages({
        'string.base': 'first name must be a string',
        'string.min': 'min 3 characters',
        'string.max': 'max 50 characters',
    }),
    lastName: Joi.string().min(3).max(50).optional().messages({
        'string.base': 'last name must be a string',
        'string.min': 'min 3 characters',
        'string.max': 'max 50 characters',
    }),
})

const searchUserValidationSchema = Joi.object({
    page: Joi.number().min(1).positive().default(1),
    size: Joi.number().min(1).positive().max(100).default(10),
    username: Joi.string().max(30).optional().messages({
        'string.base': 'username must be a string',
        'string.max': 'max 30 characters',
    }),
    email: Joi.string().email().optional().messages({
        'string.base': 'email must be a string',
        'string.email': 'email must be a valid email',
    }),
    name: Joi.string().max(50).optional().messages({
        'string.base': 'first name must be a string',
        'string.max': 'max 50 characters',
    }),
    role: Joi.string().max(50).optional().messages({
        'string.base': 'role must be a string',
        'string.max': 'max 50 characters',
    }),
})

const deleteUserValidationSchema = Joi.number().positive().required().messages({
    'number.base': 'user id must be a number',
    'number.positive': 'user id must be a positive number',
    'any.required': 'user id is required!',
})

export {
    addUserValidationSchema,
    loginValidationSchema,
    getUserValidationSchema,
    updateUserValidationSchema,
    deleteUserValidationSchema,
    searchUserValidationSchema,
}
