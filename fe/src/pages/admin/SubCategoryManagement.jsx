import axiosClient from "../../config/axiosClient";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SubCategoryManagement() {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category_id: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, []);

  const fetchSubcategories = async () => {
    try {
      const res = await axiosClient.get("/subcategories");
      setData(res.data?.data || res.data || []);
    } catch (error) {
      toast.error("Lỗi khi tải danh mục con!");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axiosClient.get("/categories");
      setCategories(res.data?.data || res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoryId = Number(form.category_id);
    const payload = {
      name: form.name.trim(),
      categoryId,
    };

    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên danh mục con!");
      return;
    }

    if (!form.category_id) {
      toast.error("Vui lòng chọn danh mục cha!");
      return;
    }

    try {
      if (editingId) {
        await axiosClient.put(`/subcategories/${editingId}`, payload);
        toast.success("Cập nhật danh mục con thành công!");
      } else {
        await axiosClient.post("/subcategories", payload);
        toast.success("Tạo danh mục con thành công!");
      }
      setForm({
        name: "",
        category_id: "",
      });
      setEditingId(null);
      fetchSubcategories();
    } catch (error) {
      const apiMessage =
        error.response?.data?.message ||
        error.response?.data?.title ||
        error.response?.data?.errors?.Category?.[0] ||
        error.response?.data?.errors?.CategoryId?.[0] ||
        "Không thể xử lý yêu cầu";

      toast.error("Lỗi: " + apiMessage);
    }
  };

  const handleEdit = (s) => {
    setForm({
      name: s.name,
      category_id: s.categoryId ?? s.category_id ?? "",
    });
    setEditingId(s.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;

    try {
      await axiosClient.delete(`/subcategories/${id}`);
      toast.success("Xóa danh mục con thành công!");
      fetchSubcategories();
    } catch (error) {
      toast.error("Lỗi khi xóa!");
    }
  };

  // Hàm lấy tên danh mục cha từ ID
  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => Number(c.id) === Number(categoryId));
    return cat ? cat.name : "-";
  };

  return (
    <div className="max-w-[1200px] mx-auto animate-fade-in">
      {/* FORM THÊM/SỬA DANH MỤC CON */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#141414] p-6 rounded-xl border border-gray-800 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 mb-10"
      >
        <div>
          <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">
            Tên Danh mục Con
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full bg-black border border-gray-700 p-2.5 rounded text-sm focus:border-blue-500 outline-none text-white"
            placeholder="Nhập tên danh mục con..."
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">
            Danh mục Cha
          </label>
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="w-full bg-black border border-gray-700 p-2.5 rounded text-sm focus:border-blue-500 outline-none text-white"
            required
          >
            <option value="">-- Chọn danh mục cha --</option>
            {categories &&
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>

        <div className="col-span-1 md:col-span-2 flex items-center justify-end gap-4 border-t border-gray-800 pt-5 mt-2">
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({
                  name: "",
                  category_id: "",
                });
              }}
              className="text-gray-400 hover:text-white underline text-sm transition-colors"
            >
              Hủy
            </button>
          )}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-8 rounded shadow-lg transition-all uppercase text-sm"
          >
            {editingId ? "Cập nhật" : "Tạo Danh mục Con"}
          </button>
        </div>
      </form>

      {/* BẢNG DỮ LIỆU DANH MỤC CON */}
      <div className="border border-gray-800 rounded-xl overflow-x-auto shadow-2xl bg-[#141414] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-[#1f1f1f] text-gray-300 text-xs uppercase tracking-widest font-black border-b border-gray-700">
              <th className="p-4 w-16 text-center">ID</th>
              <th className="p-4">Tên Danh mục Con</th>
              <th className="p-4">Danh mục Cha</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-gray-800 hover:bg-[#1a1a1a] transition-colors text-sm text-gray-300"
                >
                  <td className="p-4 text-center text-gray-500 font-mono">
                    {s.id}
                  </td>
                  <td className="p-4 font-bold text-gray-100">{s.name}</td>
                  <td className="p-4 text-gray-400">
                    {getCategoryName(s.categoryId ?? s.category_id)}
                  </td>
                  <td className="p-4 flex justify-center items-center gap-3">
                    <button
                      onClick={() => handleEdit(s)}
                      className="text-blue-400 hover:text-blue-300 font-bold transition-colors"
                    >
                      Sửa
                    </button>
                    <span className="text-gray-700">|</span>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-red-400 hover:text-red-300 font-bold transition-colors"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-10 text-center text-gray-500">
                  Database trống.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto animate-fade-in">
      {/* FORM THÊM/SỬA DANH MỤC CON */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#141414] p-6 rounded-xl border border-gray-800 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 mb-10"
      >
        <div>
          <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">
            Tên Danh mục Con
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-black border border-gray-700 p-2.5 rounded text-sm focus:border-blue-500 outline-none text-white"
            placeholder="Nhập tên danh mục con..."
            required
          />
        </div>

        <div className="col-span-1 md:col-span-2 flex items-center justify-end gap-4 border-t border-gray-800 pt-5 mt-2">
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setName("");
              }}
              className="text-gray-400 hover:text-white underline text-sm transition-colors"
            >
              Hủy
            </button>
          )}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-8 rounded shadow-lg transition-all uppercase text-sm"
          >
            {editingId ? "Cập nhật" : "Tạo Danh mục Con"}
          </button>
        </div>
      </form>

      {/* BẢNG DỮ LIỆU DANH MỤC CON */}
      <div className="border border-gray-800 rounded-xl overflow-x-auto shadow-2xl bg-[#141414] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-[#1f1f1f] text-gray-300 text-xs uppercase tracking-widest font-black border-b border-gray-700">
              <th className="p-4 w-16 text-center">ID</th>
              <th className="p-4">Tên Danh mục Con</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-gray-800 hover:bg-[#1a1a1a] transition-colors text-sm text-gray-300"
                >
                  <td className="p-4 text-center text-gray-500 font-mono">
                    {s.id}
                  </td>
                  <td className="p-4 font-bold text-gray-100">{s.name}</td>
                  <td className="p-4 flex justify-center items-center gap-3">
                    <button
                      onClick={() => handleEdit(s)}
                      className="text-blue-400 hover:text-blue-300 font-bold transition-colors"
                    >
                      Sửa
                    </button>
                    <span className="text-gray-700">|</span>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-red-400 hover:text-red-300 font-bold transition-colors"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-10 text-center text-gray-500">
                  Database trống.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
