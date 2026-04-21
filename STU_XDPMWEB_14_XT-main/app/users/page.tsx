"use client";

import { useState, useEffect } from "react";
import styles from "./user.module.css";
import Logo from "../components/logo";
import { BASE_URL } from "../utils/url";

type User = {
  id: number;
  username: string;
  email: string;
  password: string;
  password_confirmation: string,
  phone: string | null;
  role: string;
  address: string | null;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
    role: "",
    address: "",
  });

  const [showModal, setShowModal] = useState(false);

  const [editForm, setEditForm] = useState({
    id: 0,
    username: "",
    email: "",
    phone: "",
    role: "",
    address: "",
  });

  const [editId, setEditId] = useState<number | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/users`);
      const result = await res.json();
      setUsers(result.data);
    } catch (error) {
      console.error("Lỗi khi lấy user:", error);
    }
  };
    // https://gundam-model.onrender.com/
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ====== HÀM LƯU ======
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          phone: formData.phone || null,
          address: formData.address || null,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        console.log(result);
        alert("Thêm user thất bại");
        return;
      }

      alert("Thêm user mới thành công!");

      fetchUsers();

      setFormData({
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
        phone: "",
        role: "user",
        address: "",
      });

    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra!");
    }
  };
  // ====== DELETE USER ======
  const handleDelete = async (id: number) => {
    const isConfirm = window.confirm(`Bạn có chắc muốn xóa user có mã ${id}?`);

    if (!isConfirm) return;
    try {
      await fetch(`${BASE_URL}/users/${id}`, {
        method: "DELETE",
      });

      alert("Xóa user thành công!");

      fetchUsers();
    } catch (error) {
      console.error(error);
      alert("Không thể xóa user!");
    }
  };

  // ====== LOAD DATA VÀO FORM ======
  const handleEdit = (user: User) => {
    setEditForm({
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone ?? "",
      role: user.role,
      address: user.address ?? "",
    });

    setEditId(user.id);
    setShowModal(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateUser = async () => {
    if (!editId) return;
    const { id, ...data } = editForm;

    try {
      const res = await fetch(
        `${BASE_URL}/users/${editId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      await res.json();

      alert("Cập nhật user thành công!");

      setShowModal(false);
      setEditId(null);

      fetchUsers();

    } catch (error) {
      console.error(error);
      alert("Lỗi khi cập nhật user");
    }
  };

  return (
    <div className={styles.container}>
      <Logo />
      <h1 className={styles.title}>Hobby Japan - Demo</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Xác nhận Password</label>
          <input
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>SĐT</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Địa chỉ</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className={styles.modalInputGroup}>
          <label>Role</label>
          <div className={styles.radioGroup}>
            <label><input type="radio" name="role" value="user" checked={editForm.role === "user"} onChange={handleEditChange} /> User </label>
            <label> <input type="radio" name="role" value="admin" checked={editForm.role === "admin"} onChange={handleEditChange} /> Admin </label> 
          </div> 
        </div>

        {/* NÚT LƯU */}
        <button className={styles.submitBtn} type="submit">
          Lưu
        </button>
      </form>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã</th>
            <th>Username</th>
            <th>Email</th>
            <th>SĐT</th>
            <th>Role</th>
            <th>Địa chỉ</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phone ?? "Chưa có"}</td>
              <td>{user.role}</td>
              <td>{user.address ?? "Chưa có"}</td>

              <td className={styles.actions}>
                <button
                  type="button"
                  onClick={() => handleEdit(user)}
                  className={styles.editBtn}
                >
                  Sửa
                </button>

                <button
                  type="button"
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(user.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Chỉnh sửa User #{editForm.id}</h2>

            <div className={styles.modalForm}>

              <div className={styles.modalInputGroup}>
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={editForm.username}
                  onChange={handleEditChange}
                />
              </div>

              <div className={styles.modalInputGroup}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                />
              </div>

              <div className={styles.modalInputGroup}>
                <label>SĐT</label>
                <input
                  type="text"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditChange}
                />
              </div>

              <div className={styles.modalInputGroup}>
                <label>Role</label>

                <div className={styles.radioGroup}>
                  <label>
                    <input
                      type="radio"
                      name="role"
                      value="user"
                      checked={editForm.role === "user"}
                      onChange={handleEditChange}
                    />
                    User
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={editForm.role === "admin"}
                      onChange={handleEditChange}
                    />
                    Admin
                  </label>
                </div>
              </div>

              <div className={styles.modalInputGroup}>
                <label>Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={editForm.address}
                  onChange={handleEditChange}
                />
              </div>

            </div>

            <div className={styles.modalActions}>
              <button onClick={handleUpdateUser} className={styles.saveBtn}>
                Lưu
              </button>

              <button
                onClick={() => setShowModal(false)}
                className={styles.cancelBtn}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
