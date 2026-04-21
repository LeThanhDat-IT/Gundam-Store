import { useContext } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

// 1. Import Contexts
import { AuthContext, AuthProvider } from "./features/auth/context/AuthContext";
import { CartProvider } from "./features/cart/context/CartContext";

// 2. Import Layout & Pages
import SimpleLayout from "./components/Layout/SimpleLayout";
import Cart from "./pages/shop/Cart";
import Checkout from "./pages/shop/Checkout";
import Catalog from "./pages/shop/Catalog";
import Home from "./pages/shop/Home";
import Orders from "./pages/shop/Orders";
// 🔥 ĐÃ ĐỔI TÊN IMPORT Ở ĐÂY THÀNH AdminDashboard 🔥
import { Toaster } from "react-hot-toast";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { SOCIAL_APP_URL } from "./config/appUrls";

// TẠM THỜI ĐÓNG DÒNG NÀY LẠI VÌ BẠN CHƯA TẠO FILE CONTACT
// import Contact from './pages/shop/Contact';

// Component chuyển hướng an toàn ra web ngoài
const ExternalRedirect = ({ url }) => {
  window.location.href = url;
  return null;
};

// Bộ bảo vệ Route: Tạm thời không dùng đến để bạn code giao diện Admin
const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    window.location.href = `${SOCIAL_APP_URL}/auth/login`;
    return null;
  }

  if (user.role !== "admin") return <Navigate to="/" replace />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          {/* Thông báo góc phải */}
          <Toaster
            position="top-center"
            containerStyle={{
              top: 92,
              left: 16,
              right: 16,
            }}
            toastOptions={{
              duration: 3000,
              style: {
                background: "#ffffff",
                color: "#111827",
                border: "1px solid #d1d5db",
                boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
                borderRadius: "12px",
                fontWeight: 600,
              },
              success: {
                iconTheme: { primary: "#22c55e", secondary: "#ffffff" },
              },
              error: {
                iconTheme: { primary: "#ef4444", secondary: "#ffffff" },
              },
            }}
          />

          <Routes>
            {/* Layout chính cho người dùng */}
            <Route path="/" element={<SimpleLayout />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<Catalog />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="orders" element={<Orders />} />

              {/* TẠM THỜI ĐÓNG ROUTE NÀY LẠI */}
              {/* <Route path="contact" element={<Contact />} />  */}
            </Route>

            {/* 🔥 GỌI COMPONENT AdminDashboard MỚI Ở ĐÂY 🔥 */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Bắt route /login nội bộ và đẩy ra ngoài */}
            <Route
              path="/login"
              element={<ExternalRedirect url={`${SOCIAL_APP_URL}/auth/login`} />}
            />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
