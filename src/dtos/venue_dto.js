'use strict';

const Joi = require('joi');

const createVenueValidationSchema = Joi.object({
  name: Joi.string().min(3).max(255).required().messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name must be at least 3 characters long',
    'string.max': 'Name must be less than 255 characters',
    'any.required': 'Name is required'
  }),
  phone: Joi.string().required().messages({
    'string.base': 'Phone must be a string',
    'any.required': 'Phone is required'
  }),
  location: Joi.object({
    type: Joi.string().valid('Point').default('Point'),
    coordinates: Joi.array().items(Joi.number()).length(2).required(),
    city: Joi.string().required(),
    district: Joi.string().required(),
    ward: Joi.string().required(),
    street: Joi.string().required(),
    full_address: Joi.string().required()
  }).required().messages({
    'any.required': 'Location is required'
  }),
  sport_types: Joi.array().items(Joi.string()).optional(),
  amenities: Joi.array().items(Joi.string()).optional(),
  images: Joi.array().items(Joi.string()).optional(),
  slots: Joi.array().items(
    Joi.object({
      date: Joi.date().required(),
      time: Joi.string().required(),
      price: Joi.number().required(),
      status: Joi.string().valid('available', 'booked', 'pending').default('available')
    })
  ).optional(),
  deals: Joi.array().items(Joi.string()).optional()
})

const updateVenueValidationSchema = Joi.object({
  name: Joi.string().min(3).max(255).optional(),
  phone: Joi.string().optional(),
  location: Joi.object({
    type: Joi.string().valid('Point').optional(),
    coordinates: Joi.array().items(Joi.number()).length(2).optional(),
    city: Joi.string().optional(),
    district: Joi.string().optional(),
    ward: Joi.string().optional(),
    street: Joi.string().optional(),
    full_address: Joi.string().optional()
  }).optional(),
  sport_types: Joi.array().items(Joi.string()).optional(),
  amenities: Joi.array().items(Joi.string()).optional(),
  images: Joi.array().items(Joi.string()).optional(),
  slots: Joi.array().items(
    Joi.object({
      date: Joi.date().optional(),
      time: Joi.string().optional(),
      price: Joi.number().optional(),
      status: Joi.string().valid('available', 'booked', 'pending').optional()
    })
  ).optional(),
  deals: Joi.array().items(Joi.string()).optional()
})

const searchVenueValidationSchema = Joi.object({
  venueName: Joi.string().min(1).max(255).optional(),
  sportTypes: Joi.array().items(Joi.string()).optional(),
  city: Joi.string().optional(),
  district: Joi.string().optional(),
  ward: Joi.string().optional(),
  street: Joi.string().optional(),
  venueLocation: Joi.object({
    lat: Joi.number().required().messages({
      'number.base': 'Latitude must be a number',
      'any.required': 'Latitude is required'
    }),
    lng: Joi.number().required().messages({
      'number.base': 'Longitude must be a number',
      'any.required': 'Longitude is required'
    })
  }).optional(),
  radius: Joi.number().default(1000).optional(),
  limit: Joi.number().integer().min(1).default(20),
  skip: Joi.number().integer().min(0).default(0)
})

module.exports = { 
  createVenueValidationSchema,
  updateVenueValidationSchema,
  searchVenueValidationSchema 
}
