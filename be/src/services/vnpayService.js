require("dotenv").config();
const moment = require("moment");
const crypto = require("crypto");
const qs = require("qs");

// Thông tin cấu hình VNPay
const vnp_TmnCode = "TCCZBATC";
const vnp_HashSecret = "W4VUY93IUTJVX9L7TQTBZVJPZ6JLD7JE";
const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const vnp_ReturnUrl = "https://gundam-model.onrender.com/orders/vnpay_return"; // Backend webhook URL

const createPaymentUrl = (order, ipAddr) => {
  const date = new Date();
  const createDate = moment(date).format("YYYYMMDDHHmmss");

  const vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = vnp_TmnCode;
  vnp_Params["vnp_Locale"] = "vn";
  vnp_Params["vnp_CurrCode"] = "VND";
  vnp_Params["vnp_CurrCode"] = "VND";
  vnp_Params["vnp_TxnRef"] = moment(date).format("DDHHmmss") + "-" + order.id;
  vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + order.id;
  vnp_Params["vnp_OrderType"] = "other";
  // amount là số nguyên, VNPay yêu cầu nhân 100
  vnp_Params["vnp_Amount"] = order.total_price * 100;
  vnp_Params["vnp_ReturnUrl"] = vnp_ReturnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr || "127.0.0.1";
  vnp_Params["vnp_CreateDate"] = createDate;

  // Sort keys an pha bêt
  const sortObject = (obj) => {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
  };

  const sortedParams = sortObject(vnp_Params);
  const signData = qs.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");

  sortedParams["vnp_SecureHash"] = signed;
  let paymentUrl = vnp_Url;
  paymentUrl += "?" + qs.stringify(sortedParams, { encode: false });

  return paymentUrl;
};

// Handle return check
const verifyReturn = (vnp_Params) => {
  const secureHash = vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  const sortObject = (obj) => {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
  };

  const sortedParams = sortObject(vnp_Params);
  const signData = qs.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");

  return secureHash === signed;
};

module.exports = {
  createPaymentUrl,
  verifyReturn,
};
