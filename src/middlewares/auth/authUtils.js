"use strict";

const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { AuthFailureError } = require("../../core/error.response");

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
  // 1. Check userId missing
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid requets");

  // 3. Get and verify token
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid request");

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    // 4. Check keyStore with userId
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid UserId");
    req.keyStore = keyStore;
    req.user = decodeUser;
    return next();
  } catch (error) {
    throw error;
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
