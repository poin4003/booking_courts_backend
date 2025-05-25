const crypto = require('crypto');
const config = require('../configs/vnpay.config');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment-timezone');
const qs = require('qs');

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

class VnpayService {
  createPaymentUrl({ amount, orderInfo, ipAddr, bankCode, locale, orderType }) {
    if (!amount || isNaN(amount) || amount <= 0) {
      throw new Error('Invalid amount');
    }
    
    if (!orderInfo) {
      throw new Error('OrderInfo is required');
    }
    

    if (locale === null || locale === '' || !locale) {
      locale = 'vn';
    }
    
    const date = new Date();
    const createDate = moment(date).tz('Asia/Ho_Chi_Minh').format('YYYYMMDDHHmmss');
    const orderId = moment(date).format('HHmmss') + uuidv4().slice(0, 6);
    
    const tmnCode = config.vnp_TmnCode;
    const secretKey = config.vnp_HashSecret;
    const vnpUrl = config.vnp_Url;
    const returnUrl = config.vnp_ReturnUrl;
    const currCode = 'VND';

    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType || 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '' && bankCode) {
      vnp_Params['vnp_BankCode'] = bankCode;
    }
    vnp_Params = sortObject(vnp_Params);

    const signData = qs.stringify(vnp_Params, { encode: false });
    
    const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    const paymentUrl = vnpUrl + '?' + qs.stringify(vnp_Params, { encode: false });
    return paymentUrl;
  }

  validateReturn(params) {
    const secureHash = params['vnp_SecureHash'];  
    const vnp_Params = { ...params };
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    const sortedParams = sortObject(vnp_Params);
    const signData = qs.stringify(sortedParams, { encode: false });

    const hmac = crypto.createHmac("sha512", config.vnp_HashSecret);
    const signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

    return secureHash === signed;
  }
}

module.exports = new VnpayService();