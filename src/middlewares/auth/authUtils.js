"use strict";

const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { AuthFailureError } = require("../../core/error.response");
const config = require("../../configs/config");

const createToken = (payload, jwt_scret_key) => {
  try {
    // Access Token
    const accessToken = JWT.sign(payload, jwt_scret_key, {
      expiresIn: "30 days",
    });

    JWT.verify(accessToken, jwt_scret_key, (err, decode) => {
      if (err) {
        console.log("error verify::", err);
      } else {
        console.log("decode verify::", decode);
      }
    });

    return accessToken;
  } catch (error) {
    throw new AuthFailureError("Failed to create access token");
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AuthFailureError("Invalid or missing Authorization header");
  }

  const accessToken = authHeader.replace("Bearer ", "");
  if (!accessToken) {
    throw new AuthFailureError("Token is required");
  }

  try {
    console.log(config.app.jwt_secret_key);
    const decodeUser = JWT.verify(accessToken, config.app.jwt_secret_key);

    req.user = decodeUser;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new AuthFailureError("Token has expired");
    }
    throw new AuthFailureError("Invalid token");
  }
});

const verifyJWT = (token, keySecret) => {
  return JWT.verify(token, keySecret);
};

module.exports = {
  createToken,
  authentication,
  verifyJWT,
};
