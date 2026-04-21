import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [cartNotice, setCartNotice] = useState(null);

  const showCartNotice = (product, quantity, mode) => {
    setCartNotice({
      id: `${product.id}-${Date.now()}`,
      product,
      quantity,
      mode,
    });
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        const nextQuantity = existingItem.quantity + 1;
        toast.success(`Đã tăng số lượng: ${product.name}`);
        showCartNotice({ ...existingItem, quantity: nextQuantity }, nextQuantity, "updated");
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: nextQuantity } : item
        );
      }
      showCartNotice(product, 1, 'added');
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 }; // Không cho giảm dưới 1
        }
        return item;
      }),
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("Đã xóa sản phẩm khỏi giỏ!");
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // 4. Các biến tính toán phụ
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, updateQuantity, removeItem, clearCart, totalItems, totalPrice, cartNotice, setCartNotice, showCartNotice
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook tùy chỉnh để dùng cho tiện
export const useCartContext = () => useContext(CartContext);
