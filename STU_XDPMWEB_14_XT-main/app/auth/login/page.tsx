import type { Metadata } from "next";
import LoginPage from "./LoginPage";

export const metadata: Metadata = {
  title: "GunBuys | Đăng nhập",
  description: "Trang đăng nhập hệ thống",
};

export default function Page() {
  return <LoginPage />;
}

// "use client";

// import { useRouter } from "next/navigation";
// import styles from "./login.module.css";
// import { useState } from "react";
// import Logo from "@/app/components/logo";

// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "HobbyJapan | Đăng nhập",
//   description: "Trang đăng nhập hệ thống",
// };


// export default function LoginPage() {

//   const router = useRouter();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [errors,setErrors] = useState({
//     email:"",
//     password:""
//   });

//   const validate = () => {

//     let newErrors = {
//       email:"",
//       password:""
//     };

//     let isValid = true;

//     if(!email.trim()){
//       newErrors.email = "Vui lòng nhập email";
//       isValid = false;
//     }

//     if(!password.trim()){
//       newErrors.password = "Vui lòng nhập mật khẩu";
//       isValid = false;
//     }

//     setErrors(newErrors);

//     return isValid;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if(!validate()){
//       return;
//     }

//     console.log({
//       email,
//       password
//     });
//   };


//   return (
//     <div className={styles.container}>
//         <Logo />

//       <form className={styles.form} onSubmit={handleSubmit}>

//         <h2>Đăng nhập</h2>

//         <div className={styles.inputGroup}>
//         <label>Email</label>
//         <input
//             type="email"
//             value={email}
//             onChange={(e)=>setEmail(e.target.value)}
//         />
//         {errors.email && (
//             <span className={styles.error}>{errors.email}</span>
//         )}
//         </div>

//         <div className={styles.inputGroup}>
//         <label>Mật khẩu</label>
//         <input
//             type="password"
//             value={password}
//             onChange={(e)=>setPassword(e.target.value)}
//         />
//         {errors.password && (
//             <span className={styles.error}>{errors.password}</span>
//         )}
//         </div>

//         <button type="submit">Đăng nhập</button>

//         <p>
//           Chưa có tài khoản?
//           <span onClick={()=>router.push("/auth/register")}>
//             Đăng ký
//           </span>
//         </p>

//       </form>

//     </div>
//   );
// }