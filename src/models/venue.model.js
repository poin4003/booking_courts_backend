"use strict";

const { model, Schema } = require("mongoose");
const {
  VENUE_DOCUMENT_NAME,
  VENUE_COLLECTION_NAME,
} = require("../consts/models.const");

const venueSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      city: { type: String, required: true },
      district: { type: String, required: true },
      ward: { type: String, required: true },
      street: { type: String, required: true },
      full_address: { type: String, required: true },
    },
    sport_types: [
      {
        type: String,
      },
    ],
    amenities: [
      {
        type: String,
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    slots: [
      {
        time: { type: String, required: true },
        price: { type: Number, required: true },
        status: {
          type: String,
          enum: ["available", "booked", "pending"],
          default: "available",
        },
      },
    ],
    deals: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
    collection: VENUE_COLLECTION_NAME,
  }
);

venueSchema.index({ location: "2dsphere" });

module.exports = model(VENUE_DOCUMENT_NAME, venueSchema);
