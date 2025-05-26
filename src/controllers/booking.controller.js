'use strict'

const { OK } = require('../core/success.response')
const BookingService = require('../services/booking.service')

class BookingController {
  bookSlot = async (req, res, next) => {
     const ipAddr = req.headers['x-forwarded-for'] ||
                  req.connection.remoteAddress ||
                  req.socket.remoteAddress ||
                  (req.connection.socket && req.connection.socket.remoteAddress) || '';
    const newBooking = await BookingService.bookSlot({
      
      userId: req.user.userId,
      ...req.body
    }, ipAddr);

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

  getBookingByTxnRef = async (req, res, next) => {
  const booking = await BookingService.getBookingByTxnRef(req.params.txnRef);
    
    new OK({
      message: 'Get booking successfully',
      metadata: booking
    }).send(res);
  }

}
module.exports = new BookingController()