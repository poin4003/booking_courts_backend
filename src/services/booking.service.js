"use strict";

const BookingRepo = require("../models/repositories/booking.repo");

class BookingService {
  bookSlot = async (bookingData) => {
    return await BookingRepo.bookSlot(bookingData);
  };

  getBookingsByUserId = async (userId, limit, page) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit)
    const skip = (page - 1) * limit;

    return await BookingRepo.getBookingsByUserId(userId, limit, skip);
  };
}

module.exports = new BookingService();
