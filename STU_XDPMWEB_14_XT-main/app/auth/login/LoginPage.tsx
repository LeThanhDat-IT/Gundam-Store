"use client";

import styles from "./login.module.css";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import { BASE_URL, SHOP_APP_URL } from "@/app/utils/url";

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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validate = () => {
    const nextErrors = {
      email: "",
      password: "",
    };

    let valid = true;

    if (!email.trim()) {
      nextErrors.email = "Vui lòng nhập email";
      valid = false;
    }

    if (!password.trim()) {
      nextErrors.password = "Vui lòng nhập mật khẩu";
      valid = false;
    }

    setErrors(nextErrors);
    return valid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.warning("Vui lòng nhập email và mật khẩu");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${BASE_URL}/auth/login/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await readResponseData(response);

      if (!response.ok) {
        const message = data?.message || "Đăng nhập thất bại";
        setErrors({
          email: message,
          password: message,
        });
        toast.error(message);
        return;
      }

      const payload = data?.data ?? data;
      const token = payload?.token;
      const user = payload?.user;
      const role = user?.role;

      if (!token || !user) {
        toast.error("Thiếu thông tin đăng nhập");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Đăng nhập thành công");

      if (role === "admin") {
        window.location.href = `${SHOP_APP_URL}/admin?token=${token}`;
        return;
      }

      window.location.href = `${SHOP_APP_URL}?token=${token}`;
    } catch (error) {
      console.error(error);
      toast.error("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginWrapper}>
        <div className={styles.leftPanel}>
          <img src="/logo5.png" alt="HobbyJapan figure" className={styles.heroImage} />
          <p className={styles.tagline}>
            <b>GunBuys & GunVerse</b> - Nơi dành cho những người đam mê mô hình, mua bán và chia sẻ.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <h2>Đăng nhập</h2>
          <div className={styles.line}></div>

          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
            />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
            />
            {errors.password && <span className={styles.error}>{errors.password}</span>}
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>

          <p className={styles.switchText}>
            Chưa có tài khoản? <Link href="/auth/register" className={styles.switchLink}>Đăng ký</Link>
          </p>
        </form>
      </div>
    </div>
  );
}