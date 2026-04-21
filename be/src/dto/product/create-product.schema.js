const Joi = require("joi");
exports.createProductSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({ "any.required": "Bắt buộc phải có field name" }),
  price: Joi.number().required().positive().messages({
    "number.base": "Giá tiền phải là số",
    "number.positive": "Giá tiền phải là số dương",
    "any.required": "Vui lòng nhập giá tiền",
  }),
  description: Joi.string(),
  category_id: Joi.number().required().messages({
    "number.base": "category_id phải là số",
    "any.required": "Vui lòng nhập category id",
  }),
  subcategory_id: Joi.number().required().messages({
    "number.base": "subcategory_id phải là số",
    "any.required": "Vui lòng nhập subcategory_id id",
  }),
  location: Joi.string().default(""),
  tag: Joi.string().default(""),
  stock: Joi.number().positive().default(0).messages({
    "number.base": "Số lượng kho phải là số",
    "number.positive": "Số lượng kho phải là số dương",
    "any.required": "Vui lòng nhập số lượng kho",
  }),
}).rename("NAME", "name", {
  ignoreUndefined: true,
  override: true,
});
