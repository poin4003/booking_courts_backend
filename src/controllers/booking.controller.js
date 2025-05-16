'use strict'

const { OK } = require('../core/success.response')
const BookingService = require('../services/booking.service')

class BookingController {
  bookSlot = async (req, res, next) => {
    const newBooking = await BookingService.bookSlot({
      userId: req.user.userId,
      ...req.body
    });

    new OK ({
      message: 'Booking slot successfully',
      metadata: newBooking,
    }).send(res);
  }

  getBookings = async (req, res, next) => {
    const bookings = await BookingService.getBookingsByUserId(
      req.user.userId,
      req.query.limit,
      req.query.page
    )

    new OK ({
      message: 'Get bookings succesfully',
      metadata: bookings,
    }).send(res);
  }
}

module.exports = new BookingController()