'use strict'

const bcrypt = require('bcrypt')
const { BadRequestError, AuthFailureError } = require('../core/error.response')
const { 
  findByEmail,
  createOne
} = require("../models/repositories/user.repo")
const { getInfoData } = require('../utils/getter')
const config = require('../configs/config')
const { createToken } = require('../middlewares/auth/authUtils')
const { RoleUser } = require('../consts/role.const')

class AuthService {
  static login = async({email, password}) => {
    // 1. Check email exist
    const foundUser = await findByEmail({ email })
    if (!foundUser) throw new BadRequestError('Email or password is wrong!')

    // 2. Match password
    const match = await bcrypt.compare( password, foundUser.password )
    if (!match) throw new AuthFailureError('Email or password is wrong!')

    // 3. Create accessToken
    const key = config.app.jwt_secret_key
    const { _id: userId } = foundUser._id

    const token = createToken({ userId, email }, key)

    // 4. Get data return login
    return {
      user: getInfoData({ fileds: ['_id', 'name', 'email'], object: foundUser }),
      token
    }
  }

  static signUp = async ({ name, email, phone, password }) => {
    // 1. Check email exits
    const holderUser = await findByEmail({ email })
    if (holderUser) {
      throw new BadRequestError('shop already registed!')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await createOne({
      name, email, phone, hashedPassword, role: RoleUser
    })

    return {
      user: getInfoData({ fileds: ['_id', 'name', 'email'], object: newUser }), 
    }
  }
}

module.exports = AuthService