"use strict";

const userModel = require("../../models/user.model");

const findByEmail = async ({
  email,
  select = {
    email: 1,
    password: 1,
    name: 1,
    status: 1,
    role: 1,
  },
}) => {
  return await userModel.findOne({ email }).select(select).lean();
};

const createOne = async ({ name, email, phone, hashedPassword, role }) => {
  return await userModel.create({
    name,
    email,
    phone,
    password: hashedPassword,
    status: "active",
    role,
  });
};

module.exports = {
  findByEmail,
  createOne,
};
