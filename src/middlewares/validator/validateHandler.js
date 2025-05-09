'use strict'

const { BadRequestError } = require('../../core/error.response')

const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false })

    if (error) {
      const validationError = new BadRequestError('Validation Error')
      validationError.details = error.details
      return next(validationError)
    }

    if (!req.value) req.value = {}
    if (!req.value['params']) req.value.params = {}
    req.value.body = value

    next()
  }
}

const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, { abortEarly: false })

    if (error) {
      const validationError = new BadRequestError('Validation Error')
      validationError.details = error.details
      return next(validationError)
    }

    if (!req.value) req.value = {}
    if (!req.value['query']) req.value.query = {}
    req.value.query = value

    next()
  }
}

module.exports = {
  validateBody,
  validateQuery
}
