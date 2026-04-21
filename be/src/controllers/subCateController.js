const {
  getAll,
  handleCreate,
  handleDelete,
  handleUpdate,
} = require("../services/subCategoriesService");

const getSubCategories = async (req, res) => {
  const categories = await getAll();
  res.json({
    status: "success",
    result: categories.length,
    data: categories,
  });
};

const createSubCate = async (req, res) => {
  const subCate = await handleCreate(req.body);
  res.json({
    status: "success",
    data: subCate,
  });
};

const deleteSubCate = async (req, res) => {
  await handleDelete(req.params.id);
  res.json({ status: "success", data: null });
};

const updateSubCate = async (req, res) => {
  try {
    const subCate = await handleUpdate(req.params.id, req.body);
    res.json({
      status: "success",
      data: subCate,
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getSubCategories,
  createSubCate,
  deleteSubCate,
  updateSubCate,
};
