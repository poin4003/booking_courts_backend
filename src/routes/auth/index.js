'use strict'

const express = require('express')
const authController = require('../../controllers/auth_controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { validateBody } = require('../../middlewares/validator/validateHandler')
const { userValidateDto } = require('../../dtos/user_dto')
const router = express.Router()

// login |signup
router.post('/user/login', 
  validateBody(userValidateDto.authLoginSchema),
  asyncHandler(authController.login)
)

router.post('/user/signup', 
  validateBody(userValidateDto.authSignUpSchema),
  asyncHandler(authController.signUp)
)

module.exports = router