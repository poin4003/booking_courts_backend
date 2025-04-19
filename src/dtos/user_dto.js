const Joi = require('@hapi/joi')

const userValidateDto = {
  authSignUpSchema: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(10).max(12).required(),
    password: Joi.string().min(8).required()
  }),

  authLoginSchema: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
  })
}

module.exports = {
  userValidateDto
}