"use strict";

const BookingRepo = require("../models/repositories/booking.repo");
const vnpayService = require("../services/vnpay.service");

class BookingService {
  bookSlot = async (bookingData, ipAddr) => {
    const { booking, price } = await BookingRepo.bookSlot(bookingData);
    
    const paymentUrl = await vnpayService.createPaymentUrl({
      amount: price,
      orderInfo: `Booking #${booking._id}`,
      ipAddr,
    });
    
    const params = new URLSearchParams(paymentUrl.split('?')[1]);
    booking.vnp_TxnRef = params.get('vnp_TxnRef');
    booking.paymentUrl = paymentUrl;
    await booking.save();
    
    return { booking, paymentUrl };
  };

  getBookingsByUserId = async (userId, limit, page) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    return await BookingRepo.getBookingsByUserId(userId, limit, skip);
  };

  updateStatusByTxnRef = async (txnRef, status) => {
    return BookingRepo.updateStatusByTxnRef(txnRef, status);
  }

  finalizeSlotByTxnRef = async (txnRef) => {
    const booking = await BookingRepo.findByTxnRef(txnRef);
    if (!booking) {
      throw new Error('Booking not found');
    }
    return await BookingRepo.finalizeSlot(booking.venue_id, booking.slot_id);
  }

  releaseSlotByTxnRef = async (txnRef) => {
    const booking = await BookingRepo.findByTxnRef(txnRef);
    if (!booking) {
      throw new Error('Booking not found');
    }
    return await BookingRepo.releaseSlot(booking.venue_id, booking.slot_id);
  }

  getBookingByTxnRef = async (txnRef) => {
    if (!txnRef) {
      throw new Error('Transaction reference is required');
    }
    return await BookingRepo.findByTxnRef(txnRef);
  }

  handlePaymentResult = async (txnRef, responseCode, paymentData = {}) => {
    if (!txnRef) {
      throw new Error('Transaction reference is required');
    }
    
    if (!responseCode) {
      throw new Error('Response code is required');
    }
    
    const existingBooking = await this.getBookingByTxnRef(txnRef);
    if (!existingBooking) {
      throw new Error(`Booking not found for transaction: ${txnRef}`);
    }
    
    if (responseCode === '00') {
      await this.updateStatusByTxnRef(txnRef, 'confirmed');
      await this.finalizeSlotByTxnRef(txnRef);
      
      if (paymentData.transactionNo) {
        await BookingRepo.updatePaymentInfo(txnRef, {
          vnp_TransactionNo: paymentData.transactionNo,
          vnp_BankCode: paymentData.bankCode,
          vnp_PayDate: paymentData.payDate,
          paid_at: new Date()
        });
      }
      
      return { success: true, message: 'Payment successful' };
    } else {
      await this.updateStatusByTxnRef(txnRef, 'failed');
      await this.releaseSlotByTxnRef(txnRef);
      
      return { success: false, message: 'Payment failed', responseCode };
    }
  }
}

module.exports = new BookingService();