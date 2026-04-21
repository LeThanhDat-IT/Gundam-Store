"use client";

import styles from "./register.module.css";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import { BASE_URL } from "@/app/utils/url";

const readResponseData = async (response: Response) => {
  const text = await response.text();

  if (!text.trim()) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
    address: "",
    avatar: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const validate = () => {
    const nextErrors = {
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
    };

    let valid = true;

    if (!form.username.trim()) {
      nextErrors.username = "Vui lòng nhập username";
      valid = false;
    }

    if (!form.email.trim()) {
      nextErrors.email = "Vui lòng nhập email";
      valid = false;
    }

    if (!form.password.trim()) {
      nextErrors.password = "Vui lòng nhập mật khẩu";
      valid = false;
    }

    if (!form.password_confirmation.trim()) {
      nextErrors.password_confirmation = "Vui lòng xác nhận mật khẩu";
      valid = false;
    }

    if (
      form.password &&
      form.password_confirmation &&
      form.password !== form.password_confirmation
    ) {
      nextErrors.password_confirmation = "Mật khẩu không khớp";
      valid = false;
    }

    setErrors(nextErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = e.target.value;
    setForm((prev) => ({
      ...prev,
      avatar: selectedValue,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.warning("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          phone: form.phone || null,
          address: form.address || null,
          avatar: form.avatar || null,
          role: "user",
        }),
      });

      const data = await readResponseData(response);

      if (!response.ok) {
        throw new Error(data?.message || "Đăng ký thất bại");
      }

      toast.success("Đăng ký thành công");
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 1200);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Lỗi kết nối server");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.leftPanel}>
          <img src="/logo5.png" alt="HobbyJapan figure" className={styles.heroImage} />
          <p className={styles.tagline}>
            Tham gia <b>GunBuys & GunVerse</b> để khám phá thế giới Gundam, Figure và các bộ sưu tập độc đáo.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <h2>Đăng ký tài khoản</h2>
          <div className={styles.line}></div>

          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label>Tên người dùng *</label>
              <input name="username" type="text" value={form.username} onChange={handleChange} />
              {errors.username && <span className={styles.error}>{errors.username}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label>Email *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} />
              {errors.email && <span className={styles.error}>{errors.email}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label>Mật khẩu *</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} />
              {errors.password && <span className={styles.error}>{errors.password}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label>Xác nhận mật khẩu *</label>
              <input
                name="password_confirmation"
                type="password"
                value={form.password_confirmation}
                onChange={handleChange}
              />
              {errors.password_confirmation && <span className={styles.error}>{errors.password_confirmation}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label>Số điện thoại</label>
              <input name="phone" type="text" value={form.phone} onChange={handleChange} />
            </div>

            <div className={styles.inputGroup}>
              <label>Địa chỉ</label>
              <input name="address" type="text" value={form.address} onChange={handleChange} />
            </div>

            <div className={styles.inputGroup}>
              <label>Avatar URL</label>
              <input
                name="avatar"
                type="text"
                value={form.avatar}
                onChange={handleFile}
                placeholder="/avatars/user.png hoặc https://..."
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn}>
            Tạo tài khoản
          </button>

          <p className={styles.switchText}>
            Đã có tài khoản? <Link href="/auth/login" className={styles.switchLink}>Đăng nhập</Link>
          </p>
        </form>
      </div>
    </div>
  );
}