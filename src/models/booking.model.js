"use strict";

const { model, Schema } = require("mongoose");
const {
  BOOKING_DOCUMENT_NAME,
  BOOKING_COLLECTION_NAME,
} = require("../consts/models.const");

const bookingSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    venue_id: { type: Schema.Types.ObjectId, ref: "Venue" },
    slot_id: { type: Schema.Types.ObjectId },
    status: {
      type: String,
      enum: ["pending", "confirmed", "canceled"],
      default: "pending",
    },
    note: {
      type: String,
    },
    payment_method: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: BOOKING_COLLECTION_NAME,
  }
);

module.exports = model(BOOKING_DOCUMENT_NAME, bookingSchema);
