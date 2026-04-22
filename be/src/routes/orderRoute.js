const express = require("express");
const validate = require("../dto/validate");
const { createOrderSchema } = require("../dto/order/create-order.schema");
const { getOrders, createOrder, demoPay } = require("../controllers/orderController");

const orderRoute = express.Router();

orderRoute.route("/").get(getOrders).post(validate(createOrderSchema), createOrder);
orderRoute.get("/demo_pay", demoPay);

module.exports = orderRoute;