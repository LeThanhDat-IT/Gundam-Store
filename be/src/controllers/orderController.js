const {
  handleCreateOrder,
  handleGetOrders,
} = require("../services/orderService");
const prisma = require("../lib/prisma");

const getOrders = async (req, res) => {
  const orders = await handleGetOrders(req.query.userId);

  res.json({
    status: "success",
    result: orders.length,
    data: orders,
  });
};

const redirectOrderStatus = (res, status) =>
  res.redirect(`https://gundam-fe.netlify.app/orders?status=${status}`);

const createOrder = async (req, res) => {
  const order = await handleCreateOrder(req.body);

  res.status(201).json({
    status: "success",
    data: order,
  });
};

// Giả lập phương thức thanh toán trả về trạng thái trả tiền thành công
const demoPay = async (req, res) => {
  const { orderId } = req.query;
  if (!orderId) {
    return redirectOrderStatus(res, "cancelled");
  }
  try {
    // Đổi trạng thái trong DB thành 'paid' trực tiếp
    await prisma.orders.update({
      where: { id: Number(orderId) },
      data: { status: "paid" },
    });
    // Chuyển hướng người dùng về trang giao diện với status=success
    return redirectOrderStatus(res, "success");
  } catch (error) {
    console.error(error);
    return redirectOrderStatus(res, "cancelled");
  }
};

module.exports = {
  getOrders,
  createOrder,
  demoPay,
};