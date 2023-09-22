import Joi from 'joi'

const addBlogValidationSchema = Joi.object({
    authorId: Joi.string().min(3).max(50).required().messages({
        'string.base': 'author must be a string',
        'string.empty': 'author cannot be empty',
        'string.min': 'min 3 characters',
        'string.max': 'max 50 characters',
        'any.required': 'author is required!',
    }),
    categoryId: Joi.string().min(3).max(50).required().messages({
        'string.base': 'category must be a string',
        'string.empty': 'category cannot be empty',
        'string.min': 'min 3 characters',
        'string.max': 'max 50 characters',
        'any.required': 'category is required!',
    }),
    title: Joi.string().min(3).max(255).required().messages({
        'string.base': 'title must be a string',
        'string.empty': 'title cannot be empty',
        'string.min': 'min 3 characters',
        'string.max': 'max 255 characters',
        'any.required': 'title is required!',
    }),
    slug: Joi.string().min(3).max(100).required().messages({
        'string.base': 'slug must be a string',
        'string.empty': 'slug cannot be empty',
        'string.min': 'min 3 characters',
        'string.max': 'max 100 characters',
        'any.required': 'slug is required!',
    }),
    description: Joi.string().min(3).max(255).required().messages({
        'string.base': 'description must be a string',
        'string.empty': 'description cannot be empty',
        'string.min': 'min 3 characters',
        'string.max': 'max 255 characters',
        'any.required': 'description is required!',
    }),
    content: Joi.string().min(3).required().messages({
        'string.base': 'content must be a string',
        'string.empty': 'content cannot be empty',
        'string.min': 'min 3 characters',
        'any.required': 'content is required!',
    }),
}).unknown(true)

const updateBlogValidationSchema = Joi.object({
    authorId: Joi.string().min(3).max(50).optional().messages({
        'string.base': 'author must be a string',
        'string.min': 'min 3 characters',
        'string.max': 'max 50 characters',
    }),
    categoryId: Joi.string().min(3).max(50).optional().messages({
        'string.base': 'category must be a string',
        'string.min': 'min 3 characters',
        'string.max': 'max 50 characters',
    }),
    title: Joi.string().min(3).max(255).optional().messages({
        'string.base': 'title must be a string',
        'string.min': 'min 3 characters',
        'string.max': 'max 255 characters',
    }),
    slug: Joi.string().min(3).max(100).optional().messages({
        'string.base': 'slug must be a string',
        'string.min': 'min 3 characters',
        'string.max': 'max 100 characters',
    }),
    description: Joi.string().min(3).max(255).optional().messages({
        'string.base': 'description must be a string',
        'string.min': 'min 3 characters',
        'string.max': 'max 255 characters',
    }),
    content: Joi.string().min(3).optional().messages({
        'string.base': 'content must be a string',
        'string.min': 'min 3 characters',
    }),
}).unknown(true)

const deleteBlogValidationSchema = Joi.object({
    id: Joi.number().positive().required().messages({
        'number.base': 'id must be a number',
        'number.positive': 'id must be a positive number',
        'any.required': 'id is required!',
    }),
}).unknown(true)

export { addBlogValidationSchema, updateBlogValidationSchema, deleteBlogValidationSchema }
