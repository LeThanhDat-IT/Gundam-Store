const { createProductSchema } = require("./create-product.schema");

exports.updateProductSchema = createProductSchema.fork(
  Object.keys(createProductSchema.describe().keys),
  (field) => field.optional(),
);
