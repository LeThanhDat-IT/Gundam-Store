const prisma = require("../lib/prisma");
const AppError = require("../util/AppError");

const findCategoryById = async (id) => {
  return await prisma.categories.findUnique({ where: { id: +id } });
};

const handleGetAll = async () => {
  const categories = await prisma.categories.findMany();
  return categories;
};

const handleCreate = async (name) => {
  const newCategory = await prisma.categories.create({ data: { name } });
  return newCategory;
};

const handleDelete = async (id) => {
  const category = await findCategoryById(id);
  if (!category)
    throw new AppError(`Không tìm thấy category với id = ${id}`, 422);

  const sub = await prisma.subcategories.findMany({
    where: { category_id: +id },
    include: { products: true },
  });
  if (sub.some((s) => s.products.length > 0))
    throw new AppError("Không thể xóa vì còn product", 422);

  return await prisma.$transaction([
    prisma.subcategories.deleteMany({
      where: { category_id: +id },
    }),
    prisma.categories.delete({
      where: { id: +id },
    }),
  ]);
};

const handleUpdate = async (id, name) => {
  const category = await findCategoryById(id);
  if (!category)
    throw new AppError(`Không tìm thấy category với id = ${id}`, 422);

  return await prisma.categories.update({
    where: { id: +id },
    data: { name },
  });
};

module.exports = {
  handleGetAll,
  handleCreate,
  handleDelete,
  handleUpdate,
  findCategoryById,
};
