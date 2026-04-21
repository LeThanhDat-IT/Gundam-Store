const Joi = require("joi");
exports.createCategorySchema = Joi.object({
  name: Joi.string()
    .required()

    .messages({ "any.required": "Bắt buộc phải có field name" }),
}).rename("NAME", "name", {
  ignoreUndefined: true,
  override: true,
});
