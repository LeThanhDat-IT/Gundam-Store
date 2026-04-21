import axiosClient from "../../config/axiosClient";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Đã sửa lại đường dẫn import tương đối (lùi 2 cấp từ pages/admin ra src)
import toast from "react-hot-toast";
import logoHobby from "../../assets/logo.png";
import { AuthContext } from "../../features/auth/context/AuthContext";
import CategoryManagement from "./CategoryManagement";
import ProductManagement from "./ProductManagement";
import SubCategoryManagement from "./SubCategoryManagement";

// Import các component quản lý

// 🔥 ĐÃ ĐỔI LINK API VỀ RENDER CỦA BẠN 🔥
// ====================================================================================
// ==================== COMPONENT QUẢN LÝ USER (NỘI DUNG BÊN PHẢI) ====================
// ====================================================================================
const UserContent = () => {
  const [users, setUsers] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosClient.get("/users");
      // 🔥 Xử lý thông minh: Nhận diện cả data bọc trong object hoặc mảng thuần
      const fetchedData = response.data?.data || response.data;

      if (Array.isArray(fetchedData)) {
        setUsers(fetchedData);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Lỗi kết nối API:", error);
      setUsers([]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }
    try {
      const { confirmPassword, ...submitData } = formData;
      if (editingId) {
        await axiosClient.patch(`/users/${editingId}`, submitData);
        setEditingId(null);
        toast.success("Cập nhật thành công!");
      } else {
        await axiosClient.post("/users", submitData);
        toast.success("Thêm người dùng thành công!");
      }
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
        phone: "",
        address: "",
      });
      fetchUsers();
    } catch (error) {
      toast.error("Lỗi: Username/Email đã tồn tại hoặc server đang bận!");
    }
  };

  const handleEdit = (u) => {
    setEditingId(u.id);
    setFormData({
      username: u.username,
      email: u.email,
      password: "",
      confirmPassword: "",
      role: u.role || "user",
      phone: u.phone || "",
      address: u.address || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa không?")) return;
    try {
      await axiosClient.delete(`/users/${id}`);
      fetchUsers();
    } catch (error) {
      toast.error("Lỗi khi xóa!");
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto animate-fade-in">
      {/* FORM THÊM/SỬA USERS */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#141414] p-6 rounded-xl border border-gray-800 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 mb-10"
      >
        <div>
          <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">
            Username
          </label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full bg-black border border-gray-700 p-2.5 rounded text-sm focus:border-blue-500 outline-none text-white"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">
            Email
          </label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-black border border-gray-700 p-2.5 rounded text-sm focus:border-blue-500 outline-none text-white"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">
            Password
          </label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-black border border-gray-700 p-2.5 rounded text-sm focus:border-blue-500 outline-none text-white"
            required={!editingId}
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">
            Xác nhận Password
          </label>
          <input
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full bg-black border border-gray-700 p-2.5 rounded text-sm focus:border-blue-500 outline-none text-white"
            required={!editingId || formData.password.length > 0}
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">
            SĐT
          </label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-black border border-gray-700 p-2.5 rounded text-sm focus:border-blue-500 outline-none text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">
            Địa chỉ
          </label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full bg-black border border-gray-700 p-2.5 rounded text-sm focus:border-blue-500 outline-none text-white"
          />
        </div>

        <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row items-center justify-between border-t border-gray-800 pt-5 mt-2 gap-4">
          <div className="flex gap-4 w-full md:w-auto">
            <label className="flex-1 md:flex-none flex items-center justify-center gap-2 cursor-pointer border border-gray-700 rounded-md px-4 py-2 text-sm bg-black hover:bg-gray-900 transition-colors">
              <input
                type="radio"
                name="role"
                value="user"
                checked={formData.role === "user"}
                onChange={handleChange}
                className="accent-blue-500"
              />{" "}
              User
            </label>
            <label className="flex-1 md:flex-none flex items-center justify-center gap-2 cursor-pointer border border-gray-700 rounded-md px-4 py-2 text-sm bg-black hover:bg-gray-900 transition-colors">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={formData.role === "admin"}
                onChange={handleChange}
                className="accent-blue-500"
              />{" "}
              Admin
            </label>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    username: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    role: "user",
                    phone: "",
                    address: "",
                  });
                }}
                className="text-gray-400 hover:text-white underline text-sm transition-colors"
              >
                Hủy
              </button>
            )}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-8 rounded shadow-lg transition-all uppercase text-sm w-full md:w-auto"
            >
              {editingId ? "Cập nhật" : "Lưu User"}
            </button>
          </div>
        </div>
      </form>

      {/* BẢNG DỮ LIỆU USERS */}
      <div className="border border-gray-800 rounded-xl overflow-x-auto shadow-2xl bg-[#141414] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#1f1f1f] text-gray-300 text-xs uppercase tracking-widest font-black border-b border-gray-700">
              <th className="p-4 w-16 text-center">ID</th>
              <th className="p-4">Username</th>
              <th className="p-4">Email</th>
              <th className="p-4">SĐT</th>
              <th className="p-4 text-center">Role</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users === null ? (
              <tr>
                <td
                  colSpan="6"
                  className="p-10 text-center text-gray-500 italic"
                >
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-gray-800 hover:bg-[#1a1a1a] transition-colors text-sm text-gray-300"
                >
                  <td className="p-4 text-center text-gray-500 font-mono">
                    {u.id}
                  </td>
                  <td className="p-4 font-bold text-gray-100">{u.username}</td>
                  <td className="p-4 text-gray-400">{u.email}</td>
                  <td className="p-4 text-gray-400 font-mono">
                    {u.phone || "-"}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${u.role === "admin" ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "bg-blue-500/20 text-blue-400 border border-blue-500/30"}`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center items-center gap-3">
                    <button
                      onClick={() => handleEdit(u)}
                      className="text-blue-400 hover:text-blue-300 font-bold transition-colors"
                    >
                      Sửa
                    </button>
                    <span className="text-gray-700">|</span>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="text-red-400 hover:text-red-300 font-bold transition-colors"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-10 text-center text-gray-500">
                  Database trống.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ====================================================================================
// ==================== COMPONENT CHÍNH: KHUNG GIAO DIỆN ADMIN ========================
// ====================================================================================
const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("Quản lý Người dùng");

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <div className="flex h-screen bg-[#0d0d0d] text-white font-sans overflow-hidden">
      {/* ================= CỘT TRÁI: SIDEBAR MENU ================= */}
      <aside className="w-64 bg-[#141414] border-r border-gray-800 flex flex-col justify-between flex-shrink-0 shadow-2xl z-20">
        <div>
          {/* LOGO & TITLE */}
          <div className="h-20 flex items-center px-6 border-b border-gray-800 bg-[#0a0a0a]">
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity w-full"
            >
              <img
                src={logoHobby}
                alt="Logo"
                className="w-10 h-10 rounded-xl border border-gray-700 shadow-lg object-contain bg-black flex-shrink-0"
              />
              <div className="flex flex-col justify-center leading-none mt-1">
                <span className="text-lg font-black tracking-widest text-white uppercase mb-1">
                  Gundam
                </span>
                <span className="text-xs font-black tracking-[0.2em] text-orange-500 uppercase">
                  Admin
                </span>
              </div>
            </Link>
          </div>

          {/* MENU NAVIGATION */}
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActivePage("Quản lý Người dùng")}
              className={`block w-full text-left font-bold p-3 rounded-lg transition-colors text-sm uppercase tracking-wider ${activePage === "Quản lý Người dùng" ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
            >
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  />
                </svg>
                Users
              </div>
            </button>

            <button
              onClick={() => setActivePage("Quản lý Sản phẩm")}
              className={`block w-full text-left font-bold p-3 rounded-lg transition-colors text-sm uppercase tracking-wider ${activePage === "Quản lý Sản phẩm" ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
            >
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                  />
                </svg>
                Sản Phẩm
              </div>
            </button>

            <button
              onClick={() => setActivePage("Quản lý Danh mục")}
              className={`block w-full text-left font-bold p-3 rounded-lg transition-colors text-sm uppercase tracking-wider ${activePage === "Quản lý Danh mục" ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
            >
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m0 0H3M9 18h6m0 0h3m0-12h3m0 0v6m0 0v-6M3 9h3m0 0h3V3m0 0V0m0 6V3m0 0H3v6h6V3z"
                  />
                </svg>
                Danh Mục
              </div>
            </button>

            <button
              onClick={() => setActivePage("Quản lý Danh mục con")}
              className={`block w-full text-left font-bold p-3 rounded-lg transition-colors text-sm uppercase tracking-wider ${activePage === "Quản lý Danh mục con" ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
            >
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 6h18M3 12h18M3 18h18"
                  />
                </svg>
                Danh Mục Con
              </div>
            </button>

            <button
              onClick={() => setActivePage("Quản lý Đơn hàng")}
              className={`block w-full text-left font-bold p-3 rounded-lg transition-colors text-sm uppercase tracking-wider ${activePage === "Quản lý Đơn hàng" ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
            >
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
                Đơn Hàng
              </div>
            </button>
          </nav>
        </div>

        {/* Nút Quay về trang chủ ở Đáy Sidebar */}
        <div className="p-4 border-t border-gray-800">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-3 rounded-lg transition-all text-sm uppercase tracking-wider"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
              />
            </svg>
            Về Trang Chủ
          </Link>
        </div>
      </aside>

      {/* =========================================
          CỘT PHẢI: KHU VỰC NỘI DUNG (MAIN CONTENT)
      ========================================= */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative bg-[#0a0a0a]">
        {/* HEADER TOP RIGHT */}
        <header className="h-20 bg-[#141414] border-b border-gray-800 flex items-center justify-between px-8 flex-shrink-0 z-10 shadow-sm">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white font-sans animate-fade-in flex items-center gap-3">
            {activePage}
            <span className="text-gray-500 font-normal text-lg italic mt-1 hidden sm:inline-block">
              {" "}
              - Dashboard
            </span>
          </h1>

          {/* Dropdown User */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 text-sm font-bold text-gray-300 hover:text-white transition-colors focus:outline-none bg-black p-2 pr-4 rounded-full border border-gray-800 hover:border-gray-600"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {user?.username ? user.username.charAt(0).toUpperCase() : "A"}
              </div>
              <span className="hidden sm:inline-block">
                Hi,{" "}
                <span className="text-orange-400">
                  {user?.username || "Admin"}
                </span>
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className={`w-3.5 h-3.5 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-[#1f1f1f] border border-gray-700 rounded-xl shadow-2xl py-2 overflow-hidden animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-700 mb-1 bg-[#141414]">
                  <p className="text-xs text-gray-400 mb-1">
                    Đang đăng nhập với quyền:
                  </p>
                  <p className="text-sm font-bold text-white capitalize">
                    {user?.role || "admin"}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                    />
                  </svg>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </header>

        {/* ================= KHU VỰC HIỂN THỊ NỘI DUNG ĐỘNG ================= */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
          {/* Render Component tương ứng với Menu được chọn */}
          {activePage === "Quản lý Người dùng" && <UserContent />}

          {activePage === "Quản lý Sản phẩm" && <ProductManagement />}

          {activePage === "Quản lý Danh mục" && <CategoryManagement />}

          {activePage === "Quản lý Danh mục con" && <SubCategoryManagement />}

          {activePage === "Quản lý Đơn hàng" && (
            <div className="max-w-[1200px] mx-auto text-center py-32 bg-[#141414] rounded-2xl border border-gray-800 shadow-xl animate-fade-in">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-24 h-24 mx-auto text-gray-700 mb-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              <h2 className="text-3xl font-black uppercase text-gray-400 mb-4 tracking-widest">
                Khu vực Quản lý Đơn hàng
              </h2>
              <p className="text-gray-500 italic">
                Tính năng đang được phát triển...
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
