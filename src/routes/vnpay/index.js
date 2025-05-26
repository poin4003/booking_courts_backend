"use strict";
const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");

const VnpayController = require('../../controllers/vnpay.controller');
const router = express.Router();
router.get('/vnpay/return', asyncHandler(VnpayController.vnpayReturn));
router.post('/vnpay/payment', asyncHandler(VnpayController.createPaymentUrl));
router.get('/vnpay/ipn', asyncHandler(VnpayController.vnpayIPN));


module.exports = router;