"use strict";
const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");

const VnpayController = require('../../controllers/vnpay.controller');
const router = express.Router();
router.get('/vnpay/return', asyncHandler(VnpayController.vnpayReturn));
router.post('/vnpay/payment', asyncHandler(VnpayController.createPaymentUrl));



module.exports = router;