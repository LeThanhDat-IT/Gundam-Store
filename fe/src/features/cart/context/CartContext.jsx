import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosClient from "../../../config/axiosClient";
import { AuthContext } from "../../auth/context/AuthContext";

export const CartContext = createContext();

const mapCartItem = (item) => ({
  id: item.productId ?? item.ProductId ?? item.id ?? item.CartId,
  productId: item.productId ?? item.ProductId ?? item.id ?? item.CartId,
  name: item.productName ?? item.ProductName ?? item.name ?? item.ProductName,
  price: Number(item.price ?? item.Price ?? 0),
  quantity: Number(item.quantity ?? item.Quantity ?? 1),
  images: item.images ?? [],
  totalPrice: Number(item.totalPrice ?? item.TotalPrice ?? 0),
});

export const CartProvider = ({ children }) => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartNotice, setCartNotice] = useState(null);

  const showCartNotice = (product, quantity, mode) => {
    setCartNotice({
      id: `${product.id}-${Date.now()}`,
      product,
      quantity,
      mode,
    });
  };

  const syncCartFromServer = async () => {
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axiosClient.get("/carts");
      const items = Array.isArray(response.data?.data ?? response.data)
        ? response.data?.data ?? response.data
        : [];

      setCartItems(items.map(mapCartItem));
    } catch (error) {
      console.error("Không tải được giỏ hàng từ server:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    syncCartFromServer();
  }, [user, authLoading]);

  const addToCart = async (product) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
      return;
    }

    const productId = product.id ?? product.productId;
    const quantityToAdd = Number(product.quantity ?? 1) > 0 ? Number(product.quantity ?? 1) : 1;

    const previousCart = cartItems;
    const existingItem = previousCart.find((item) => item.id === productId);
    const nextCart = existingItem
      ? previousCart.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item,
        )
      : [
          ...previousCart,
          {
            id: productId,
            productId,
            name: product.name,
            price: product.price,
            quantity: quantityToAdd,
            images: product.images ?? [],
            totalPrice: Number(product.price ?? 0) * quantityToAdd,
          },
        ];

    setCartItems(nextCart);
    showCartNotice(
      existingItem ? { ...existingItem, quantity: existingItem.quantity + quantityToAdd } : product,
      existingItem ? existingItem.quantity + quantityToAdd : quantityToAdd,
      existingItem ? "updated" : "added",
    );

    try {
      await axiosClient.post("/carts", {
        productId,
        quantity: quantityToAdd,
      });

      toast.success(existingItem ? `Đã tăng số lượng: ${product.name}` : `Đã thêm vào giỏ: ${product.name}`);
    } catch (error) {
      console.error("Không thêm được vào giỏ hàng:", error);
      toast.error(error?.response?.data?.message || "Không thể thêm vào giỏ hàng.");
      await syncCartFromServer();
    }
  };

  const updateQuantity = async (id, delta) => {
    const currentItem = cartItems.find((item) => item.id === id);
    if (!currentItem) return;

    const nextQuantity = currentItem.quantity + delta;
    if (nextQuantity <= 0) {
      await removeItem(id);
      return;
    }

    const nextCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: nextQuantity } : item,
    );

    setCartItems(nextCart);

    try {
      await axiosClient.put("/carts/update-quantity", {
        productId: id,
        quantity: nextQuantity,
      });
    } catch (error) {
      console.error("Không cập nhật được số lượng giỏ hàng:", error);
      toast.error(error?.response?.data?.message || "Không thể cập nhật số lượng.");
      await syncCartFromServer();
    }
  };

  const removeItem = async (id) => {
    const nextCart = cartItems.filter((item) => item.id !== id);
    setCartItems(nextCart);

    try {
      await axiosClient.delete(`/carts/${id}`);
      toast.success("Đã xóa sản phẩm khỏi giỏ!");
    } catch (error) {
      console.error("Không xóa được sản phẩm khỏi giỏ:", error);
      toast.error(error?.response?.data?.message || "Không thể xóa sản phẩm khỏi giỏ.");
      await syncCartFromServer();
    }
  };

  const clearCart = async () => {
    setCartItems([]);

    try {
      await axiosClient.delete("/carts/clear");
    } catch (error) {
      console.error("Không xóa được giỏ hàng:", error);
      toast.error(error?.response?.data?.message || "Không thể xóa giỏ hàng.");
      await syncCartFromServer();
    }
  };

  // 4. Các biến tính toán phụ
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, updateQuantity, removeItem, clearCart, totalItems, totalPrice, cartNotice, setCartNotice, showCartNotice, loading, syncCartFromServer
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook tùy chỉnh để dùng cho tiện
export const useCartContext = () => useContext(CartContext);
