const {
  getUsers,
  handleCreateUser,
  handleUpdateUser,
  handleDeleteUser,
  getUser,
} = require("../../services/userService");

exports.getUser = async (req, res) => {
  const user = await getUser(+req.params.id);
  if (!user)
    res.json({
      status: "fail",
      message: `User with id: ${req.params.id} not found. Please try with another id`,
    });
  res.json({
    status: "success",
    data: user,
  });
};

exports.getUsers = async (req, res) => {
  const users = await getUsers();
  res.json({
    status: "success",
    result: users.length,
    data: users,
  });
};

exports.createUser = async (req, res) => {
  const { username, password, email, avatar, role, phone, address } = req.body;
  const newUser = await handleCreateUser(
    username,
    password,
    email,
    avatar,
    role,
    phone,
    address,
  );
  res.status(201).json({
    status: "succes",
    data: newUser,
  });
};

exports.updateUser = async (req, res) => {
  const id = +req.params.id;
  const { username, password, email, avatar, role, phone, address } = req.body;
  const updatedUser = await handleUpdateUser(
    id,
    username,
    password,
    email,
    avatar,
    role,
    phone,
    address,
  );
  res.status(201).json({
    status: "succes",
    data: updatedUser,
  });
};

exports.deleteUser = async (req, res) => {
  const id = +req.params.id;
  await handleDeleteUser(id);
  res.status(204).json({
    status: "succes",
    message: "Deleted successfully",
  });
};

exports.createUser = async (req, res) => {
  const { username, password, email, avatar, role, phone, address } = req.body;
  if (!username || !email) {
    return res
      .status(400)
      .json({ status: "fail", message: "Thiếu username hoặc email" });
  }
  try {
    const newUser = await handleCreateUser(
      username,
      password,
      email,
      avatar,
      role,
      phone,
      address,
    );
    res.status(201).json({ status: "success", data: newUser });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
