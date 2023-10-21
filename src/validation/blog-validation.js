import Joi from 'joi'
import { errors } from '../utils/message-error.js'

const addBlogValidationSchema = Joi.object({
    categoryId: Joi.number().positive().required().messages({
        'number.base': errors.CATEGORY.ID.MUST_BE_NUMBER,
        'number.empty': errors.CATEGORY.ID.CANNOT_BE_EMPTY,
        'number.positive': errors.CATEGORY.ID.MUST_BE_POSITIVE,
        'any.required': errors.CATEGORY.ID.IS_REQUIRED,
    }),
    title: Joi.string()
        .min(3)
        .max(255)
        .required()
        .messages({
            'string.base': `${errors.BLOG.TITLE.MUST_BE_STRING}`,
            'string.empty': `${errors.BLOG.TITLE.CANNOT_BE_EMPTY}`,
            'string.min': `${errors.BLOG.TITLE.MUST_BE_3_CHAR_MIN}`,
            'string.max': `${errors.BLOG.TITLE.MUST_BE_255_CHAR_MAX}`,
            'any.required': `${errors.BLOG.TITLE.IS_REQUIRED}`,
        }),
    slug: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.base': `${errors.BLOG.SLUG.MUST_BE_STRING}`,
            'string.empty': `${errors.BLOG.SLUG.CANNOT_BE_EMPTY}`,
            'string.min': `${errors.BLOG.SLUG.MUST_BE_3_CHAR_MIN}`,
            'string.max': `${errors.BLOG.SLUG.MUST_BE_100_CHAR_MAX}`,
            'any.required': `${errors.BLOG.SLUG.IS_REQUIRED}`,
        }),
    desc: Joi.string()
        .min(3)
        .max(255)
        .required()
        .messages({
            'string.base': `${errors.BLOG.DESCRIPTION.MUST_BE_STRING}`,
            'string.empty': `${errors.BLOG.DESCRIPTION.CANNOT_BE_EMPTY}`,
            'string.min': `${errors.BLOG.DESCRIPTION.MUST_BE_3_CHAR_MIN}`,
            'string.max': `${errors.BLOG.DESCRIPTION.MUST_BE_255_CHAR_MAX}`,
            'any.required': `${errors.BLOG.DESCRIPTION.IS_REQUIRED}`,
        }),
    content: Joi.string()
        .min(3)
        .required()
        .messages({
            'string.base': `${errors.BLOG.CONTENT.MUST_BE_STRING}`,
            'string.empty': `${errors.BLOG.CONTENT.CANNOT_BE_EMPTY}`,
            'string.min': `${errors.BLOG.CONTENT.MUST_BE_3_CHAR_MIN}`,
            'any.required': `${errors.BLOG.CONTENT.IS_REQUIRED}`,
        }),
    imgHead: Joi.string()
        .empty('')
        .messages({
            'string.base': `${errors.BLOG.IMAGES.IS_REQUIRED}`,
        }),
    imgDetail: Joi.string()
        .empty('')
        .messages({
            'string.base': `${errors.BLOG.IMAGES.IS_REQUIRED}`,
        }),
}).messages({
    'object.unknown': `${errors.HTTP.MESSAGE.UNKNOWN_BODY_ERROR}`,
})

const imagesValidationSchema = Joi.array()
    .items(
        Joi.object()
            .required()
            .keys({
                path: Joi.string()
                    .required()
                    .messages({
                        'string.base': `${errors.BLOG.IMAGES.PATH_MUST_STRING}`,
                        'string.empty': `${errors.BLOG.IMAGES.CANNOT_BE_EMPTY}`,
                        'any.required': `${errors.BLOG.IMAGES.IS_REQUIRED}`,
                    }),
            })
            .unknown(true)
    )
    .messages({
        'array.base': `${errors.BLOG.IMAGES.MUST_BE_VALID_FORMAT}`,
        'array.includesRequiredUnknowns': `${errors.BLOG.IMAGES.MUST_BE_VALID_FORMAT}`,
    })

const idBlogValidationSchema = Joi.object({
    id: Joi.number()
        .positive()
        .required()
        .messages({
            'number.base': `${errors.BLOG.ID.MUST_BE_NUMBER}`,
            'number.empty': `${errors.BLOG.ID.CANNOT_BE_EMPTY}`,
            'number.positive': `${errors.BLOG.ID.MUST_BE_POSITIVE}`,
            'any.required': `${errors.BLOG.ID.IS_REQUIRED}`,
        }),
}).messages({
    'object.unknown': `${errors.HTTP.MESSAGE.UNKNOWN_BODY_ERROR}`,
})

const getBlogValidationSchema = Joi.object({
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
    sortBy: Joi.string()
        .optional()
        .default('id')
        .empty('')
        .messages({
            'string.base': `${errors.SORT_BY.MUST_BE_STRING}`,
            'any.only': `${errors.SORT_BY.MUST_BE_VALID}`,
        }),
    orderBy: Joi.string()
        .valid('asc', 'desc')
        .optional()
        .default('asc')
        .messages({
            'string.base': `${errors.ORDER_BY.MUST_BE_STRING}`,
            'any.valid': `${errors.ORDER_BY.MUST_BE_VALID}`,
            'string.empty': `${errors.ORDER_BY.CANNOT_BE_EMPTY}`,
            'any.only': `${errors.ORDER_BY.MUST_BE_VALID}`,
        }),
    title: Joi.string()
        .max(255)
        .optional()
        .empty('')
        .messages({
            'string.base': `${errors.BLOG.TITLE.MUST_BE_STRING}`,
            'string.max': `${errors.BLOG.TITLE.MUST_BE_255_CHAR_MAX}`,
        }),
    description: Joi.string()
        .max(255)
        .optional()
        .empty('')
        .messages({
            'string.base': `${errors.BLOG.DESCRIPTION.MUST_BE_STRING}`,
            'string.max': `${errors.BLOG.DESCRIPTION.MUST_BE_255_CHAR_MAX}`,
        }),
}).messages({
    'object.unknown': errors.HTTP.MESSAGE.UNKNOWN_BODY_ERROR,
})

const updateBlogValidationSchema = Joi.object({
    categoryId: Joi.number().positive().messages({
        'number.base': errors.CATEGORY.ID.MUST_BE_NUMBER,
        'number.empty': errors.CATEGORY.ID.CANNOT_BE_EMPTY,
        'number.positive': errors.CATEGORY.ID.MUST_BE_POSITIVE,
    }),
    title: Joi.string()
        .min(3)
        .max(255)
        .messages({
            'string.base': `${errors.BLOG.TITLE.MUST_BE_STRING}`,
            'string.empty': `${errors.BLOG.TITLE.CANNOT_BE_EMPTY}`,
            'string.min': `${errors.BLOG.TITLE.MUST_BE_3_CHAR_MIN}`,
            'string.max': `${errors.BLOG.TITLE.MUST_BE_255_CHAR_MAX}`,
        }),
    slug: Joi.string()
        .min(3)
        .max(100)
        .messages({
            'string.base': `${errors.BLOG.SLUG.MUST_BE_STRING}`,
            'string.empty': `${errors.BLOG.SLUG.CANNOT_BE_EMPTY}`,
            'string.min': `${errors.BLOG.SLUG.MUST_BE_3_CHAR_MIN}`,
            'string.max': `${errors.BLOG.SLUG.MUST_BE_100_CHAR_MAX}`,
        }),
    desc: Joi.string()
        .min(3)
        .max(255)
        .messages({
            'string.base': `${errors.BLOG.DESCRIPTION.MUST_BE_STRING}`,
            'string.empty': `${errors.BLOG.DESCRIPTION.CANNOT_BE_EMPTY}`,
            'string.min': `${errors.BLOG.DESCRIPTION.MUST_BE_3_CHAR_MIN}`,
            'string.max': `${errors.BLOG.DESCRIPTION.MUST_BE_255_CHAR_MAX}`,
        }),
    content: Joi.string()
        .min(3)
        .messages({
            'string.base': `${errors.BLOG.CONTENT.MUST_BE_STRING}`,
            'string.empty': `${errors.BLOG.CONTENT.CANNOT_BE_EMPTY}`,
            'string.min': `${errors.BLOG.CONTENT.MUST_BE_3_CHAR_MIN}`,
        }),
}).messages({
    'object.unknown': `${errors.HTTP.MESSAGE.UNKNOWN_BODY_ERROR}`,
})

export {
    addBlogValidationSchema,
    imagesValidationSchema,
    idBlogValidationSchema,
    getBlogValidationSchema,
    updateBlogValidationSchema,
}
