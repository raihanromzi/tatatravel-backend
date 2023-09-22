import Joi from 'joi'

const tourCountryValidationSchema = Joi.object({
    tourId: Joi.number().positive().required().messages({
        'number.base': 'tour id must be a number',
        'number.positive': 'tour id must be a positive number',
        'any.required': 'tour id is required!',
    }),
    countryId: Joi.number().positive().required().messages({
        'number.base': 'country id must be a number',
        'number.positive': 'country id must be a positive number',
        'any.required': 'country id is required!',
    }),
})

export default { tourCountryValidationSchema }
