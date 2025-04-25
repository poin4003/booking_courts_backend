"use strict";

const bcrypt = require("bcrypt");
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const { findByEmail, createOne } = require("../models/repositories/user.repo");
const { getInfoData } = require("../utils/getter");
const config = require("../configs/config");
const { createToken } = require("../middlewares/auth/authUtils");
const { RoleUser } = require("../consts/role.const");

class AuthService {
  static login = async ({ email, password }) => {
    const foundUser = await findByEmail({ email });
    if (!foundUser) throw new BadRequestError("Email or password is wrong!");

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) throw new AuthFailureError("Email or password is wrong!");

    const key = config.app.jwt_secret_key;
    const { _id: userId } = foundUser;

    const payload = {
      userId,
      email: foundUser.email,
      name: foundUser.name,
      role: foundUser.role,
    };

    const token = createToken(payload, key);

    return {
      user: getInfoData({
        fileds: ["_id", "name", "email", "role"],
        object: foundUser,
      }),
      token,
    };
  };

  static signUp = async ({ name, email, phone, password }) => {
    const holderUser = await findByEmail({ email });
    if (holderUser) {
      throw new BadRequestError("shop already registed!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createOne({
      name,
      email,
      phone,
      hashedPassword,
      role: RoleUser,
    });

    if (newUser) {
      const payload = {
        userId: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      };

      const accessToken = createToken(payload, config.app.jwt_secret_key);

      return {
        user: getInfoData({
          fileds: ["_id", "name", "email", "role", "status"], 
          object: newUser,
        }),
        token: accessToken,
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AuthService;
