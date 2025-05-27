"use strict";

module.exports = {
  vnp_TmnCode: process.env.VNPAY_TMN_CODE || "8KV42U1H",
  vnp_HashSecret: process.env.VNPAY_HASH_SECRET,
  vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  vnp_ReturnUrl: process.env.VNPAY_RETURN_URL,
};
