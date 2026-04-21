const express = require("express");
const validate = require("../dto/validate");
const { createOrderSchema } = require("../dto/order/create-order.schema");
const { getOrders, createOrder, vnpayReturn, momoReturn, momoIpn, payosReturn, payosWebhook, demoPay } = require("../controllers/orderController");

const orderRoute = express.Router();

orderRoute.route("/").get(getOrders).post(validate(createOrderSchema), createOrder);
orderRoute.get("/vnpay_return", vnpayReturn);
orderRoute.get("/momo_return", momoReturn);
orderRoute.post("/momo_ipn", momoIpn);
orderRoute.get("/payos_return", payosReturn);
orderRoute.post("/payos_webhook", payosWebhook);
orderRoute.get("/demo_pay", demoPay);

module.exports = orderRoute;