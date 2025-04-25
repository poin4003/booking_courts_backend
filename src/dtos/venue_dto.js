'use strict'

const Joi = require('joi')


const venueValidationSchema = Joi.object({
  name: Joi.string().min(3).max(255).required().messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name must be at least 3 characters long',
    'string.max': 'Name must be less than 255 characters',
    'any.required': 'Name is required'
  }),
  address: Joi.string().required().messages({
    'string.base': 'Address must be a string',
    'any.required': 'Address is required'
  }),
  phone: Joi.string().required().messages({
    'string.base': 'Phone must be a string',
    'any.required': 'Phone is required'
  }),
  location: Joi.object({
    lat: Joi.number().required().messages({
      'number.base': 'Latitude must be a number',
      'any.required': 'Latitude is required'
    }),
    lng: Joi.number().required().messages({
      'number.base': 'Longitude must be a number',
      'any.required': 'Longitude is required'
    })
  }).required().messages({
    'any.required': 'Location is required'
  }),
  sport_types: Joi.array().items(Joi.string()).optional(),
  amenities: Joi.array().items(Joi.string()).optional(),
  images: Joi.array().items(Joi.string()).optional(),
  slots: Joi.array().items(
    Joi.object({
      date: Joi.date().required().messages({
        'date.base': 'Date must be a valid date',
        'any.required': 'Date is required'
      }),
      time: Joi.string().required().messages({
        'string.base': 'Time must be a string',
        'any.required': 'Time is required'
      }),
      price: Joi.number().required().messages({
        'number.base': 'Price must be a number',
        'any.required': 'Price is required'
      }),
      status: Joi.string().valid('available', 'booked', 'pending').default('available').messages({
        'string.base': 'Status must be a string',
        'any.valid': 'Status must be one of [available, booked, pending]'
      })
    })
  ).optional(),
  deals: Joi.array().items(Joi.string()).optional()
})

module.exports = { venueValidationSchema }
