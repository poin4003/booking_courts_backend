'use strict';

const express = require('express');
const BookingController = require('../../controllers/booking.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const {
  validateBody,
} = require('../../middlewares/validator/validateHandler');
const {
  bookingDto
} = require('../../dtos/booking_dto')
const { authentication } = require('../../middlewares/auth/authUtils')
const router = express.Router();


// authentication //
router.use(authentication);
///////////////////////


router.post(
  "/booking",
  validateBody(bookingDto.bookSlotSchema),
  asyncHandler(BookingController.bookSlot)
)

router.get(
  "/booking",
  asyncHandler(BookingController.getBookings)
)

module.exports = router;