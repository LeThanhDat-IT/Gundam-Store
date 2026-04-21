const { PayOS } = require("@payos/node");

// Thông tin tài khoản PayOS của bạn
const PAYOS_CLIENT_ID = process.env.PAYOS_CLIENT_ID || "c15fb724-b630-413e-92f0-d972389ec5e1";
const PAYOS_API_KEY = process.env.PAYOS_API_KEY || "fe6ae1ed-7e0f-4311-b6ed-91c80c266f74";
const PAYOS_CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY || "6f7776e43e52d6788fd590a707c47fb46157313cf69d108ac58969e82e4a022c";

// Khởi tạo PayOS
const payos = new PayOS({
  clientId: PAYOS_CLIENT_ID,
  apiKey: PAYOS_API_KEY,
  checksumKey: PAYOS_CHECKSUM_KEY,
});

const createPaymentUrl = async (order) => {
  // orderCode tại PayOS phải là kiểu số (Integer) và <= 9007199254740991
  // Dùng id của đơn hàng trực tiếp
  const body = {
    orderCode: Number(order.id),
    amount: Number(order.total_price),
    description: `Thanh toan DH ${order.id}`, // Yêu cầu tối đa 25 ký tự không dấu
    cancelUrl: "https://gundam-model.onrender.com/orders/payos_return?cancel=true",
    returnUrl: "https://gundam-model.onrender.com/orders/payos_return",
  };

  try {
    const paymentLinkRes = await payos.paymentRequests.create(body);
    return paymentLinkRes.checkoutUrl; 
  } catch (error) {
    console.error("PAYOS ERROR:", error);
    throw new Error("Không tạo được link thanh toán PayOS");
  }
};

module.exports = {
  payos,
  createPaymentUrl,
};