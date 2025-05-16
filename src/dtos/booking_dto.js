"use strict";

const Joi = require("joi");

const bookingDto = {
  bookSlotSchema: Joi.object().keys({
    venueId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    slotId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    paymentMethod: Joi.string().required(),
    note: Joi.string().optional(),
  }),
};

module.exports = {
  bookingDto
};
