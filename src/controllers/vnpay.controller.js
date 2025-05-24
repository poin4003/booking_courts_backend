const VnpayService = require('../services/vnpay.service');
const { OK } = require('../core/success.response');
const { BadRequestError } = require('../core/error.response');

class VnpayController {
  createPaymentUrl = async (req, res) => {
    const ipAddr = req.headers['x-forwarded-for'] ||
                  req.connection.remoteAddress ||
                  req.socket.remoteAddress ||
                  (req.connection.socket && req.connection.socket.remoteAddress) || '';

    const amount = req.body.amount;
    const bankCode = req.body.bankCode;
    const orderInfo = req.body.orderDescription || req.body.orderInfo; 
    const orderType = req.body.orderType;
    const locale = req.body.language || req.body.locale;
    
    if (!amount || !orderInfo) {
      throw new BadRequestError('Missing amount or orderDescription');
    }

    const paymentUrl = await VnpayService.createPaymentUrl({ 
      amount, 
      orderInfo, 
      ipAddr,
      bankCode,
      locale,
      orderType 
    });    

    new OK({
      message: 'Payment URL created successfully',
      metadata: { paymentUrl }
    }).send(res);
  }

  vnpayReturn = async (req, res) => {
    const params = req.query;
    const isValidSignature = VnpayService.validateReturn(params);
    
    if (!isValidSignature) {
      throw new BadRequestError('Invalid signature').send(res);
    }

    const responseCode = params.vnp_ResponseCode;
    
    if (responseCode === '00') {
      new OK({
        message: 'Payment successful',
        metadata: { 
          transactionRef: params.vnp_TxnRef,
          amount: params.vnp_Amount,
          orderInfo: params.vnp_OrderInfo,
          transactionNo: params.vnp_TransactionNo,
          bankCode: params.vnp_BankCode,
          payDate: params.vnp_PayDate
        }
      }).send(res);
    } else {
      new OK({
        message: 'Payment failed or canceled',
        metadata: { 
          responseCode,
          transactionRef: params.vnp_TxnRef 
        }
      }).send(res);
    }
  }

  vnpayIPN = async (req, res) => {
    const params = req.query;

    const isValidSignature = VnpayService.validateReturn(params);
    
    if (!isValidSignature) {
      return res.json({ RspCode: '97', Message: 'Invalid signature' });
    }

    const responseCode = params.vnp_ResponseCode;
    
    if (responseCode === '00') {
      return res.json({ RspCode: '00', Message: 'Confirm Success' });
    } else {
      return res.json({ RspCode: '01', Message: 'Payment Failed' });
    }
  }
}

module.exports = new VnpayController();
