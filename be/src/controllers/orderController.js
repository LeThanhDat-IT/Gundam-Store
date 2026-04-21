const {
  handleCreateOrder,
  handleGetOrders,
} = require("../services/orderService");
const vnpayService = require("../services/vnpayService");
const momoService = require("../services/momoService");
const payosService = require("../services/payosService");
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

const vnpayReturn = async (req, res) => {
  const vnp_Params = req.query;

  if (vnpayService.verifyReturn(vnp_Params)) {
    const orderId = vnp_Params["vnp_TxnRef"].split("-")[1]; // Lấy ID sau dấu gạch ngang
    if (vnp_Params["vnp_ResponseCode"] === "00") {
      // Thanh toán thành công, update db
      await prisma.orders.update({
        where: { id: Number(orderId) },
        data: { status: "paid" },
      });
      return redirectOrderStatus(res, "success");
    } else {
      // Thanh toán thất bại hoặc user hủy
      await prisma.orders.update({
        where: { id: Number(orderId) },
        data: { status: "cancelled" },
      });
      return redirectOrderStatus(res, "cancelled");
    }
  } else {
    res.status(400).json({ code: "97", message: "Checksum failed" });
  }
};

const momoReturn = async (req, res) => {
  const queryData = req.query;

  // Chữ ký hợp lệ
  if (momoService.verifySignature(queryData)) {
    // Mã resultCode = 0 có nghĩa là giao dịch thành công
    if (queryData.resultCode === "0") {
      const orderIdStr = queryData.orderId.split("-").pop(); // Lấy ID cuối cùng
      const orderId = Number(orderIdStr);

      await prisma.orders.update({
        where: { id: orderId },
        data: { status: "paid" },
      });
      return redirectOrderStatus(res, "success");
    } else {
      // Thanh toán momo thất bại hoặc huỷ
      const orderIdStr = queryData.orderId?.split("-").pop();
      const orderId = Number(orderIdStr);
      if (orderId) {
        await prisma.orders.update({
          where: { id: orderId },
          data: { status: "cancelled" },
        });
      }
      return redirectOrderStatus(res, "cancelled");
    }
  } else {
    // Sai chữ ký
    return redirectOrderStatus(res, "cancelled");
  }
};

const momoIpn = async (req, res) => {
  // Webhook được momo gọi ngầm (server-to-server)
  const bodyData = req.body;
  if (momoService.verifySignature(bodyData)) {
    if (bodyData.resultCode === 0) {
      const orderIdStr = bodyData.orderId.split("-").pop();
      const orderId = Number(orderIdStr);

      await prisma.orders.update({
        where: { id: orderId },
        data: { status: "paid" },
      });
    }
    return res.status(204).json({});
  }
  return res.status(400).json({});
};

const payosReturn = async (req, res) => {
  const { code, id, cancel, status, orderCode } = req.query;

  // Nếu user ấn nút Hủy trên giao diện Web PayOS
  if (cancel === "true") {
    if (orderCode) {
      await prisma.orders.update({
        where: { id: Number(orderCode) },
        data: { status: "cancelled" },
      });
    }
    return redirectOrderStatus(res, "cancelled");
  }

  // code="00" là thành công
  if (code === "00") {
    await prisma.orders.update({
      where: { id: Number(orderCode) },
      data: { status: "paid" },
    });
    return redirectOrderStatus(res, "success");
  }

  if (orderCode) {
    await prisma.orders.update({
      where: { id: Number(orderCode) },
      data: { status: "cancelled" },
    });
  }
  return redirectOrderStatus(res, "cancelled");
};

const payosWebhook = async (req, res) => {
  const body = req.body;
  try {
    const webhookData = payosService.payos.webhooks.verify(body);
    if (webhookData.code === "00") {
      await prisma.orders.update({
        where: { id: Number(webhookData.orderCode) },
        data: { status: "paid" },
      });
      return res.json({ success: true });
    }
  } catch (error) {
    console.error("Lỗi xác thực webhook PayOS", error);
  }
  return res.json({ success: false });
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
  vnpayReturn,
  momoReturn,
  momoIpn,
  payosReturn,
  payosWebhook,
  demoPay,
};