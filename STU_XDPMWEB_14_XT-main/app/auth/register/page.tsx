import type { Metadata } from "next";
import RegisterPage from "./RegisterPage";

export const metadata: Metadata = {
  title: "GunBuys | Đăng ký tài khoản",
  description: "Trang đăng ký tài khoản",
};

export default function Page() {
  return <RegisterPage />;
}
