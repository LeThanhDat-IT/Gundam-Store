const express = require("express");
const {
  getSubCategories,
  createSubCate,
  deleteSubCate,
  updateSubCate,
} = require("../controllers/subCateController");
const validate = require("../dto/validate");
const {
  createSubCategorySchema,
} = require("../dto/subcate/create-subcate.schema");
const subCategoryRoute = express.Router();

subCategoryRoute
  .route("")
  .get(getSubCategories)
  .post(validate(createSubCategorySchema), createSubCate);

subCategoryRoute
  .route("/:id")
  .patch(validate(createSubCategorySchema), updateSubCate)
  .delete(deleteSubCate);

module.exports = subCategoryRoute;
