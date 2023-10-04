import Joi from 'joi'
import { errors } from '../utils/message-error.js'

const addBlogValidationSchema = Joi.object({
    categoryId: Joi.number()
        .positive()
        .required()
        .messages({
            'number.base': `${errors.CATEGORY.ID.MUST_NUMBER}`,
            'number.empty': `${errors.CATEGORY.ID.CANNOT_EMPTY}`,
            'number.positive': `${errors.CATEGORY.ID.MUST_POSITIVE}`,
            'any.required': `${errors.CATEGORY.ID.IS_REQUIRED}`,
        }),
    title: Joi.string()
        .min(3)
        .max(255)
        .required()
        .messages({
            'string.base': `${errors.BLOG.TITLE.MUST_STRING}`,
            'string.empty': `${errors.BLOG.TITLE.CANNOT_EMPTY}`,
            'string.min': `${errors.BLOG.TITLE.MUST_MIN}`,
            'string.max': `${errors.BLOG.TITLE.MUST_MAX}`,
            'any.required': `${errors.BLOG.TITLE.IS_REQUIRED}`,
        }),
    slug: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.base': `${errors.BLOG.SLUG.MUST_STRING}`,
            'string.empty': `${errors.BLOG.SLUG.CANNOT_EMPTY}`,
            'string.min': `${errors.BLOG.SLUG.MUST_MIN}`,
            'string.max': `${errors.BLOG.SLUG.MUST_MAX}`,
            'any.required': `${errors.BLOG.SLUG.IS_REQUIRED}`,
        }),
    description: Joi.string()
        .min(3)
        .max(255)
        .required()
        .messages({
            'string.base': `${errors.BLOG.DESCRIPTION.MUST_STRING}`,
            'string.empty': `${errors.BLOG.DESCRIPTION.CANNOT_EMPTY}`,
            'string.min': `${errors.BLOG.DESCRIPTION.MUST_MIN}`,
            'string.max': `${errors.BLOG.DESCRIPTION.MUST_MAX}`,
            'any.required': `${errors.BLOG.DESCRIPTION.IS_REQUIRED}`,
        }),
    content: Joi.string()
        .min(3)
        .required()
        .messages({
            'string.base': `${errors.BLOG.CONTENT.MUST_STRING}`,
            'string.empty': `${errors.BLOG.CONTENT.CANNOT_EMPTY}`,
            'string.min': `${errors.BLOG.CONTENT.MUST_MIN}`,
            'any.required': `${errors.BLOG.CONTENT.IS_REQUIRED}`,
        }),
}).unknown(true)

const imagesValidationSchema = Joi.object({
    path: Joi.string()
        .optional()
        .messages({
            'string.base': `${errors.BLOG.IMAGES.PATH_MUST_STRING}`,
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

export {
    addBlogValidationSchema,
    imagesValidationSchema,
    updateBlogValidationSchema,
    deleteBlogValidationSchema,
}
