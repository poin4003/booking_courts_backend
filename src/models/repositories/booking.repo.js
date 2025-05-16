"use strict";

const bookingModel = require("../booking.model");
const { BadRequestError } = require("../../core/error.response");
const venueModel = require("../venue.model");

class BookingRepo {
  bookSlot = async ({ userId, venueId, slotId, paymentMethod, note }) => {
    const venue = await venueModel.findOneAndUpdate(
      { _id: venueId, "slots._id": slotId, "slots.status": "available" },
      { $set: { "slots.$.status": "pending" } }
    );

    if (!venue) {
      throw new BadRequestError("Slot is not available");
    }

    const newBooking = await bookingModel.create({
      user_id: userId,
      venue_id: venueId,
      slot_id: slotId,
      status: "confirmed",
      note,
      payment_method: paymentMethod,
    });

    await venueModel.updateOne(
      { _id: venueId, "slots._id": slotId },
      { $set: { "slots.$.status": "booked" } }
    );

    return newBooking;
  };

  getBookingsByUserId = async (userId, limit, skip) => {
    return await bookingModel
      .find({ user_id: userId })
      .skip(skip)
      .limit(limit)
      .populate("user_id", "name email phone")
      .populate({
        path: "venue_id",
        select: "-slots",
        populate: {
          path: "slots",
          match: { _id: { $eq: "$slot_id" } },
        },
      })
      .lean();
  };
}

module.exports = new BookingRepo();
