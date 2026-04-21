require("dotenv").config();
const crypto = require("crypto");
const axios = require("axios");

// Tham số cấu hình Test (Sandbox) mặc định từ tài liệu MoMo Developer
// (Trong môi trường thật, bạn nên đặt vào file .env)
const partnerCode = process.env.MOMO_PARTNER_CODE || "MOMO"; 
const accessKey = process.env.MOMO_ACCESS_KEY || "TEST_ACCESS_KEY"; 
const secretKey = process.env.MOMO_SECRET_KEY || "TEST_SECRET_KEY";
const momoApiUrl = "https://test-payment.momo.vn/v2/gateway/api/create";
const redirectUrl = "https://gundam-model.onrender.com/orders/momo_return"; // Dẫn về BE -> xử lý trạng thái -> điều hướng qua FE
const ipnUrl = "https://gundam-model.onrender.com/orders/momo_ipn";

const createPaymentUrl = async (order) => {
  // Amount phải là số chuỗi
  const amount = Number(order.total_price).toString();
  // Tạo unique orderId cho MoMo
  const orderId = `${partnerCode}-${new Date().getTime()}-${order.id}`;
  const requestId = orderId;
  const orderInfo = `Thanh toan don hang ${order.id}`;
  const requestType = "captureWallet";
  const extraData = "";

  // Sắp xếp param theo đúng format MoMo yêu cầu để mã hoá
  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
  
  // Tạo mã băm
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = {
    partnerCode: partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: "vi",
    requestType: requestType,
    autoCapture: true,
    extraData: extraData,
    signature: signature,
  };

  try {
    const response = await axios.post(momoApiUrl, requestBody);
    return response.data.payUrl;
  } catch (error) {
    console.error("MOMO ERROR:", error.response?.data || error.message);
    throw new Error("Không thể khởi tạo giao dịch MoMo");
  }
};

const verifySignature = (queryData) => {
  const {
    partnerCode,
    amount,
    extraData,
    message,
    orderId,
    orderInfo,
    orderType,
    payType,
    requestId,
    responseTime,
    resultCode,
    transId,
    signature,
  } = queryData;

  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

  const expectedSignature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  return signature === expectedSignature;
};

module.exports = {
  createPaymentUrl,
  verifySignature,
};