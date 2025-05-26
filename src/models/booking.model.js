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
      enum: ["available","pending", "confirmed", "canceled",'failed'],
      default: "available",
    },
    note: {
      type: String,
    },
    payment_method: {
      type: String,
    },
     vnp_TxnRef: String,
     vnp_TransactionNo: String,
     vnp_BankCode: String,
     vnp_PayDate: String,
     paymentUrl: String,
     paid_at: Date,
  },
  {
    timestamps: true,
    collection: BOOKING_COLLECTION_NAME,
  }
);

module.exports = model(BOOKING_DOCUMENT_NAME, bookingSchema);
