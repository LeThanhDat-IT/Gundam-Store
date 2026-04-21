import axiosClient from "../../config/axiosClient";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category_id: "",
    subcategory_id: "",
    location: "",
    tag: "",
    stock: "",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Fetch tất cả dữ liệu
  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axiosClient.get("/products");
      setProducts(res.data?.data || res.data || []);
    } catch (error) {
      toast.error("Lỗi khi tải sản phẩm!");
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

  const fetchSubcategories = async () => {
    try {
      const res = await axiosClient.get("/subcategories");
      setSubcategories(res.data?.data || res.data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh mục con:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(
      (item) => Number(item.id) === Number(categoryId),
    );

    return category ? category.name : categoryId || "-";
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      toast.error("Tối đa chỉ có thể upload 5 hình ảnh!");
      return;
    }

    setImages(files);

    // Tạo preview
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      description: form.description,
      categoryId: Number(form.category_id),
      subcategoryId: Number(form.subcategory_id),
      location: form.location,
      tag: form.tag,
      stock: Number(form.stock || 0),
    };

    try {
      if (editingId) {
        await axiosClient.put(`/products/${editingId}`, payload);
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        await axiosClient.post("/products", payload);
        toast.success("Tạo sản phẩm thành công!");
      }

      setForm({
        name: "",
        price: "",
        description: "",
        category_id: "",
        subcategory_id: "",
        location: "",
        tag: "",
        stock: "",
      });
      setImages([]);
      setImagePreviews([]);
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.log(err.response);
      toast.error(
        "Lỗi: " +
          (err.response?.data?.message ||
            err.response?.data?.title ||
            err.response?.data?.errors?.Category?.[0] ||
            err.response?.data?.errors?.Subcategory?.[0] ||
            err.response?.data?.errors?.CategoryId?.[0] ||
            err.response?.data?.errors?.SubcategoryId?.[0] ||
            "Không thể xử lý yêu cầu"),
      );
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name || "",
      price: p.price ?? "",
      description: p.description || "",
      category_id: p.categoryId ?? p.category_id ?? "",
      subcategory_id: p.subcategoryId ?? p.subcategory_id ?? "",
      location: p.location || "",
      tag: p.tag || "",
      stock: p.stock ?? "",
    });
    setEditingId(p.id);
    setImages([]);
    setImagePreviews([]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;

    try {
      await axiosClient.delete(`/products/${id}`);
      toast.success("Xóa sản phẩm thành công!");
      fetchProducts();
    } catch (error) {
      toast.error("Lỗi khi xóa!");
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto animate-fade-in">
      {/* FORM THÊM/SỬA SẢN PHẨM */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#141414] p-6 rounded-xl border border-gray-800 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 mb-10"
      >
        <div>
          <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">
            Tên Sản phẩm
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full bg-black border border-gray-700 p-2.5 rounded text-sm focus:border-blue-500 outline-none text-white"
            placeholder="Nhập tên sản phẩm..."
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">
            Giá
          </label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            className="w-full bg-black border border-gray-700 p-2.5 rounded text-sm focus:border-blue-500 outline-none text-white"
            placeholder="Nhập giá..."
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">
            Danh mục
          </label>
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="w-full bg-black border border-gray-700 p-2.5 rounded text-sm focus:border-blue-500 outline-none text-white"
            required
          >
            <option value="">-- Chọn danh mục --</option>
            {categories &&
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">
            Danh mục Con
          </label>
          <select
            required
            name="subcategory_id"
            value={form.subcategory_id}
            onChange={handleChange}
            className="w-full bg-black border border-gray-700 p-2.5 rounded text-sm focus:border-blue-500 outline-none text-white"
          >
            <option value="">-- Chọn danh mục con --</option>
            {subcategories &&
              subcategories.map((subcat) => (
                <option key={subcat.id} value={subcat.id}>
                  {subcat.name}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">
            Vị trí
          </label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full bg-black border border-gray-700 p-2.5 rounded text-sm focus:border-blue-500 outline-none text-white"
            placeholder="Vị trí..."
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">
            Tags
          </label>
          <input
            name="tag"
            value={form.tag}
            onChange={handleChange}
            className="w-full bg-black border border-gray-700 p-2.5 rounded text-sm focus:border-blue-500 outline-none text-white"
            placeholder="Tags..."
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">
            Số lượng
          </label>
          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            className="w-full bg-black border border-gray-700 p-2.5 rounded text-sm focus:border-blue-500 outline-none text-white"
            placeholder="Số lượng..."
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">
            Mô tả
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full bg-black border border-gray-700 p-2.5 rounded text-sm focus:border-blue-500 outline-none text-white min-h-[100px]"
            placeholder="Nhập mô tả sản phẩm..."
            required
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">
            Upload Hình ảnh (Tối đa 5 ảnh)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full bg-black border border-gray-700 p-2.5 rounded text-sm focus:border-blue-500 outline-none text-gray-400 file:bg-blue-600 file:text-white file:border-0 file:px-4 file:py-2 file:rounded file:cursor-pointer file:mr-4"
          />
          <p className="text-xs text-gray-500 mt-1">
            {images.length > 0
              ? `${images.length} ảnh được chọn`
              : "Chưa chọn ảnh"}
          </p>
        </div>

        {/* Hiển thị preview hình ảnh */}
        {imagePreviews.length > 0 && (
          <div className="col-span-1 md:col-span-2">
            <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">
              Xem trước hình ảnh
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {imagePreviews.map((preview, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-24 object-cover rounded border border-gray-700"
                  />
                  <p className="text-xs text-gray-400 text-center mt-1">
                    Ảnh {idx + 1}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="col-span-1 md:col-span-2 flex items-center justify-end gap-4 border-t border-gray-800 pt-5 mt-2">
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({
                  name: "",
                  price: "",
                  description: "",
                  category_id: "",
                  subcategory_id: "",
                  location: "",
                  tag: "",
                  stock: "",
                });
                setImages([]);
                setImagePreviews([]);
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
            {editingId ? "Cập nhật" : "Tạo Sản phẩm"}
          </button>
        </div>
      </form>

      {/* BẢNG DỮ LIỆU SẢN PHẨM */}
      <div className="border border-gray-800 rounded-xl overflow-x-auto shadow-2xl bg-[#141414] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[#1f1f1f] text-gray-300 text-xs uppercase tracking-widest font-black border-b border-gray-700">
              <th className="p-4 w-16 text-center">ID</th>
              <th className="p-4">Tên Sản phẩm</th>
              <th className="p-4">Giá</th>
              <th className="p-4">Danh mục</th>
              <th className="p-4 text-center">Số lượng</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products && products.length > 0 ? (
              products.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-gray-800 hover:bg-[#1a1a1a] transition-colors text-sm text-gray-300"
                >
                  <td className="p-4 text-center text-gray-500 font-mono">
                    {p.id}
                  </td>
                  <td className="p-4 font-bold text-gray-100">{p.name}</td>
                  <td className="p-4 text-green-400 font-bold">
                    {p.price?.toLocaleString()}đ
                  </td>
                  <td className="p-4 text-gray-400">
                    {getCategoryName(p.categoryId ?? p.category_id)}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${
                        p.stock > 0
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center items-center gap-3">
                    <button
                      onClick={() => handleEdit(p)}
                      className="text-blue-400 hover:text-blue-300 font-bold transition-colors"
                    >
                      Sửa
                    </button>
                    <span className="text-gray-700">|</span>
                    <button
                      onClick={() => handleDelete(p.id)}
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

  return (
    <div className="max-w-[1200px] mx-auto animate-fade-in">
      {/* FORM THÊM/SỬA SẢN PHẨM */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#141414] p-6 rounded-xl border border-gray-800 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 mb-10"
      >
        <div>
          <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">
            Tên Sản phẩm
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full bg-black border border-gray-700 p-2.5 rounded text-sm focus:border-blue-500 outline-none text-white"
            placeholder="Nhập tên sản phẩm..."
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">
            Giá
          </label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            className="w-full bg-black border border-gray-700 p-2.5 rounded text-sm focus:border-blue-500 outline-none text-white"
            placeholder="Nhập giá..."
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">
            Danh mục
          </label>
          <input
            name="category_id"
            type="number"
            value={form.category_id}
            onChange={handleChange}
            className="w-full bg-black border border-gray-700 p-2.5 rounded text-sm focus:border-blue-500 outline-none text-white"
            placeholder="ID Danh mục..."
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">
            Danh mục Con
          </label>
          <input
            name="subcategory_id"
            type="number"
            value={form.subcategory_id}
            onChange={handleChange}
            className="w-full bg-black border border-gray-700 p-2.5 rounded text-sm focus:border-blue-500 outline-none text-white"
            placeholder="ID Danh mục con..."
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">
            Vị trí
          </label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full bg-black border border-gray-700 p-2.5 rounded text-sm focus:border-blue-500 outline-none text-white"
            placeholder="Vị trí..."
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">
            Tags
          </label>
          <input
            name="tag"
            value={form.tag}
            onChange={handleChange}
            className="w-full bg-black border border-gray-700 p-2.5 rounded text-sm focus:border-blue-500 outline-none text-white"
            placeholder="Tags..."
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">
            Số lượng
          </label>
          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            className="w-full bg-black border border-gray-700 p-2.5 rounded text-sm focus:border-blue-500 outline-none text-white"
            placeholder="Số lượng..."
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">
            Mô tả
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full bg-black border border-gray-700 p-2.5 rounded text-sm focus:border-blue-500 outline-none text-white min-h-[100px]"
            placeholder="Nhập mô tả sản phẩm..."
            required
          />
        </div>

        <div className="col-span-1 md:col-span-2 flex items-center justify-end gap-4 border-t border-gray-800 pt-5 mt-2">
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({
                  name: "",
                  price: "",
                  description: "",
                  category_id: "",
                  subcategory_id: "",
                  location: "",
                  tag: "",
                  stock: "",
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
            {editingId ? "Cập nhật" : "Tạo Sản phẩm"}
          </button>
        </div>
      </form>

      {/* BẢNG DỮ LIỆU SẢN PHẨM */}
      <div className="border border-gray-800 rounded-xl overflow-x-auto shadow-2xl bg-[#141414] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[#1f1f1f] text-gray-300 text-xs uppercase tracking-widest font-black border-b border-gray-700">
              <th className="p-4 w-16 text-center">ID</th>
              <th className="p-4">Tên Sản phẩm</th>
              <th className="p-4">Giá</th>
              <th className="p-4">Danh mục</th>
              <th className="p-4 text-center">Số lượng</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products && products.length > 0 ? (
              products.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-gray-800 hover:bg-[#1a1a1a] transition-colors text-sm text-gray-300"
                >
                  <td className="p-4 text-center text-gray-500 font-mono">
                    {p.id}
                  </td>
                  <td className="p-4 font-bold text-gray-100">{p.name}</td>
                  <td className="p-4 text-green-400 font-bold">
                    {p.price?.toLocaleString()}đ
                  </td>
                  <td className="p-4 text-gray-400">{p.category_id || "-"}</td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${
                        p.stock > 0
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center items-center gap-3">
                    <button
                      onClick={() => handleEdit(p)}
                      className="text-blue-400 hover:text-blue-300 font-bold transition-colors"
                    >
                      Sửa
                    </button>
                    <span className="text-gray-700">|</span>
                    <button
                      onClick={() => handleDelete(p.id)}
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
}
