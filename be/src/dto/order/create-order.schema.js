const Joi = require("joi");

const orderItemSchema = Joi.object({
  productId: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().positive().required(),
});

const createOrderSchema = Joi.object({
  userId: Joi.number().integer().positive().optional().allow(null),
  receiverName: Joi.string().trim().min(2).max(100).required(),
  phone: Joi.string().trim().min(8).max(20).required(),
  address: Joi.string().trim().min(5).max(255).required(),
  paymentMethod: Joi.string()
    .valid("cod", "bank_transfer", "momo", "credit_card", "vnpay", "payos", "demo")
    .required(),
  items: Joi.array().items(orderItemSchema).min(1).required(),
});

module.exports = { createOrderSchema };