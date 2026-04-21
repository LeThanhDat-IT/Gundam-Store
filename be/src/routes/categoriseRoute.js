const express = require("express");
const {
  getAll,
  createCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/categoriesController");
const {
  createCategorySchema,
} = require("../dto/category/create-category.schema");
const validate = require("../dto/validate");
const categoriesRoute = express.Router();

categoriesRoute
  .route("")
  .get(getAll)
  .post(validate(createCategorySchema), createCategory);

categoriesRoute
  .route("/:id")
  .patch(validate(createCategorySchema), updateCategory)
  .delete(deleteCategory);

module.exports = categoriesRoute;
