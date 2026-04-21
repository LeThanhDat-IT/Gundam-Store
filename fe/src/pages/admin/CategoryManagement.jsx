import axiosClient from "../../config/axiosClient";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CategoryManagement() {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    const res = await axiosClient.get("/categories");
    setData(res.data?.data || res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Vui lòng nhập tên danh mục!");
      return;
    }

    try {
      if (editingId) {
        await axiosClient.patch(`/categories/${editingId}`, { name });
        toast.success("Cập nhật danh mục thành công!");
      } else {
        await axiosClient.post("/categories", { name });
        toast.success("Tạo danh mục thành công!");
      }

      setName("");
      setEditingId(null);
      fetchData();
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        "Lỗi: " + (error.response?.data?.message || "Không thể xử lý yêu cầu"),
      );
    }
  };

  const handleEdit = (c) => {
    setName(c.name);
    setEditingId(c.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;
    try {
      await axiosClient.delete(`/categories/${id}`);
      toast.success("Xóa danh mục thành công!");
      fetchData();
    } catch (error) {
      toast.error("Lỗi khi xóa!");
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto animate-fade-in">
      {/* FORM THÊM/SỬA DANH MỤC */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#141414] p-6 rounded-xl border border-gray-800 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 mb-10"
      >
        <div>
          <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">
            Tên Danh mục
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-black border border-gray-700 p-2.5 rounded text-sm focus:border-blue-500 outline-none text-white"
            placeholder="Nhập tên danh mục..."
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
            {editingId ? "Cập nhật" : "Tạo Danh mục"}
          </button>
        </div>
      </form>

      {/* BẢNG DỮ LIỆU DANH MỤC */}
      <div className="border border-gray-800 rounded-xl overflow-x-auto shadow-2xl bg-[#141414] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-[#1f1f1f] text-gray-300 text-xs uppercase tracking-widest font-black border-b border-gray-700">
              <th className="p-4 w-16 text-center">ID</th>
              <th className="p-4">Tên Danh mục</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-gray-800 hover:bg-[#1a1a1a] transition-colors text-sm text-gray-300"
                >
                  <td className="p-4 text-center text-gray-500 font-mono">
                    {c.id}
                  </td>
                  <td className="p-4 font-bold text-gray-100">{c.name}</td>
                  <td className="p-4 flex justify-center items-center gap-3">
                    <button
                      onClick={() => handleEdit(c)}
                      className="text-blue-400 hover:text-blue-300 font-bold transition-colors"
                    >
                      Sửa
                    </button>
                    <span className="text-gray-700">|</span>
                    <button
                      onClick={() => handleDelete(c.id)}
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
