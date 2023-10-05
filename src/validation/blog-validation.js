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

const imagesValidationSchema = Joi.array()
    .items(
        Joi.object()
            .required()
            .keys({
                path: Joi.string()
                    .required()
                    .messages({
                        'string.base': `${errors.BLOG.IMAGES.PATH_MUST_STRING}`,
                        'string.empty': `${errors.BLOG.IMAGES.CANNOT_EMPTY}`,
                        'any.required': `${errors.BLOG.IMAGES.IS_REQUIRED}`,
                    }),
            })
            .unknown(true)
            .error(new Error('images must be an array'))
    )
    .min(1)
    .required()
    .error(new Error('failed to add image, please upload image with PNG, JPG, or JPEG format'))

const idBlogValidationSchema = Joi.object({
    id: Joi.number()
        .positive()
        .required()
        .messages({
            'number.base': `${errors.BLOG.ID.MUST_NUMBER}`,
            'number.empty': `${errors.BLOG.ID.CANNOT_EMPTY}`,
            'number.positive': `${errors.BLOG.ID.MUST_POSITIVE}`,
            'any.required': `${errors.BLOG.ID.IS_REQUIRED}`,
        }),
}).unknown(true)

const searchBlogValidationSchema = Joi.object({
    page: Joi.number().min(1).positive().default(1).messages({
        'number.base': errors.PAGE.MUST_NUMBER,
        'number.empty': errors.PAGE.CANNOT_EMPTY,
        'number.positive': errors.PAGE.MUST_POSITIVE,
    }),
    size: Joi.number().min(1).positive().max(100).default(10).messages({
        'number.base': errors.SIZE.MUST_NUMBER,
        'number.empty': errors.SIZE.CANNOT_EMPTY,
        'number.positive': errors.SIZE.MUST_POSITIVE,
    }),
    sortBy: Joi.string()
        .optional()
        .default('id')
        .messages({
            'string.base': `${errors.SORT_BY.MUST_STRING}`,
        }),
    orderBy: Joi.string()
        .valid('asc', 'desc')
        .optional()
        .default('asc')
        .messages({
            'string.base': `${errors.ORDER_BY.MUST_STRING}`,
            'any.valid': `${errors.ORDER_BY.MUST_VALID}`,
        }),
    title: Joi.string()
        .max(255)
        .optional()
        .messages({
            'string.base': `${errors.BLOG.TITLE.MUST_STRING}`,
            'string.max': `${errors.BLOG.TITLE.MUST_MAX}`,
        }),
    description: Joi.string()
        .max(255)
        .optional()
        .messages({
            'string.base': `${errors.BLOG.DESCRIPTION.MUST_STRING}`,
            'string.max': `${errors.BLOG.DESCRIPTION.MUST_MAX}`,
        }),
}).unknown(true)

export {
    addBlogValidationSchema,
    imagesValidationSchema,
    idBlogValidationSchema,
    searchBlogValidationSchema,
}
