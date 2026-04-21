const Joi = require("joi");
exports.createSubCategorySchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({ "any.required": "Bắt buộc phải có field name" }),
  category_id: Joi.number()
    .required()
    .messages({
      "number.base": "category_id phải là số",
      "any.required": "Vui lòng nhập category id",
    }),
}).rename("NAME", "name", {
  ignoreUndefined: true,
  override: true,
});
