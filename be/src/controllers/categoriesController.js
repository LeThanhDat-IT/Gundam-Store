const {
  handleGetAll,
  handleCreate,
  handleDelete,
  handleUpdate,
} = require("../services/categoriesService");

const getAll = async (req, res) => {
  const categories = await handleGetAll();
  res.json({
    status: "success",
    result: categories.length,
    data: categories,
  });
};

const createCategory = async (req, res) => {
  const { name } = req.body;
  const newCategory = await handleCreate(name);
  res.json({
    status: "success",
    data: newCategory,
  });
};

const deleteCategory = async (req, res) => {
  await handleDelete(req.params.id);
  res.json({
    status: "sucess",
    data: null,
  });
};

const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await handleUpdate(req.params.id, name);
    res.json({
      status: "success",
      data: category,
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAll,
  createCategory,
  deleteCategory,
  updateCategory,
};
