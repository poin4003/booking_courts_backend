"use strict";

const bookingModel = require("../booking.model");
const { BadRequestError } = require("../../core/error.response");
const venueModel = require("../venue.model");

class BookingRepo {
  bookSlot = async ({ userId, venueId, slotId, paymentMethod, note }) => {
    const venue = await venueModel.findOneAndUpdate(
      { 
        _id: venueId, 
        "slots._id": slotId, 
        "slots.status": "available" 
      },
      { $set: { "slots.$.status": "pending" } },
      { new: true }  
    );


    if (!venue) {
      throw new BadRequestError("Slot is not available or venue not found");
    }
    const slot = venue.slots.id(slotId);
    if (!slot) {
      throw new BadRequestError("Slot not found in venue");
    }
    const price = slot.price;
    const newBooking = await bookingModel.create({
      user_id: userId,
      venue_id: venueId,
      slot_id: slotId,
      status: "pending",
      note,
      payment_method: paymentMethod,
      created_at: new Date()
    });
    return { booking: newBooking, price };
  };

  getBookingsByUserId = async (userId, limit, skip) => {
    return await bookingModel
      .find({ user_id: userId })
      .sort({ created_at: -1 }) 
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

  findByTxnRef = async (txnRef) => {
    if (!txnRef) {
      throw new BadRequestError("Transaction reference is required");
    }
    return await bookingModel.findOne({ vnp_TxnRef: txnRef }).lean();
  };

  updateStatusByTxnRef = async (txnRef, status) => {
    if (!txnRef || !status) {
      throw new BadRequestError("Transaction reference and status are required");
    }
    
    const result = await bookingModel.findOneAndUpdate(
      { vnp_TxnRef: txnRef },
      { 
        status,
        updated_at: new Date()
      },
      { new: true }
    );

    if (!result) {
      throw new BadRequestError(`Booking not found with transaction reference: ${txnRef}`);
    }

    return result;
  };

  updatePaymentInfo = async (txnRef, paymentData) => {
    if (!txnRef) {
      throw new BadRequestError("Transaction reference is required");
    }

    return await bookingModel.findOneAndUpdate(
      { vnp_TxnRef: txnRef },
      { 
        ...paymentData,
        updated_at: new Date()
      },
      { new: true }
    );
  };

  finalizeSlot = async (venueId, slotId) => {
    if (!venueId || !slotId) {
      throw new BadRequestError("Venue ID and Slot ID are required");
    }

    const result = await venueModel.findOneAndUpdate(
      { _id: venueId, "slots._id": slotId },
      { $set: { "slots.$.status": "booked" } },
      { new: true }
    );

    if (!result) {
      throw new BadRequestError("Venue or slot not found for finalizing");
    }

    return result;
  };

  releaseSlot = async (venueId, slotId) => {
    if (!venueId || !slotId) {
      throw new BadRequestError("Venue ID and Slot ID are required");
    }

    const result = await venueModel.findOneAndUpdate(
      { _id: venueId, "slots._id": slotId },
      { $set: { "slots.$.status": "available" } },
      { new: true }
    );

    if (!result) {
      throw new BadRequestError("Venue or slot not found for releasing");
    }

    return result;
  };
} 

module.exports = new BookingRepo();