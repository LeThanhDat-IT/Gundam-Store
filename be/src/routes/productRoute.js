const express = require("express");
const { getAll, createProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const upload = require("../middlewares/multer");
const validate = require("../dto/validate");
const { createProductSchema } = require("../dto/product/create-product.schema");
const { updateProductSchema } = require("../dto/product/update-product.schema");
const productRoute = express.Router();

productRoute
  .route("")
  .get(getAll)
  .post(
    upload.array("images", 10),
    validate(createProductSchema),
    createProduct,
  );

productRoute
  .route("/:id")
  .patch(
    upload.array("images", 10),
    validate(updateProductSchema),
    updateProduct,
  )
  .delete(deleteProduct);

module.exports = productRoute;
