'use strict'

const { CREATED, SuccessResponse } = require('../core/success.response')
const AuthService = require('../services/auth.service')

class AuthController {
  login = async (req, res, next) => {
    new SuccessResponse({
      message: 'Login OK!',
      metadata: await AuthService.login(req.body)
    }).send(res)
  }

  signUp = async (req, res, next) => {
    new CREATED({
      message: 'Registed OK!',
      metadata: await AuthService.signUp(req.body)
    }).send(res)
  }
}

module.exports = new AuthController()