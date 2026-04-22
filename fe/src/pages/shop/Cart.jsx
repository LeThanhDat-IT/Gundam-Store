import { SOCIAL_APP_URL } from '../../config/appUrls';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../features/auth/context/AuthContext';
import { useCartContext } from '../../features/cart/context/CartContext';

const Cart = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeItem, totalPrice, clearCart, loading } = useCartContext();

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  if (loading) {
    return (
      <div className="bg-[#f8f9fa] min-h-screen py-10 font-sans">
        <div className="max-w-[1200px] mx-auto px-4 text-center py-20 bg-white border border-gray-200 rounded-md">
          <h2 className="text-2xl font-medium text-black mb-4">Đang tải giỏ hàng...</h2>
          <p className="text-gray-500">Đang đồng bộ giỏ hàng từ máy chủ.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-[#f8f9fa] min-h-screen py-10 font-sans">
        <div className="max-w-[1200px] mx-auto px-4 text-center py-20 bg-white border border-gray-200 rounded-md">
          <h2 className="text-2xl font-medium text-black mb-4">Bạn chưa đăng nhập</h2>
          <p className="text-gray-500 mb-8">Vui lòng đăng nhập để xem và quản lý giỏ hàng.</p>
          <a href={`${SOCIAL_APP_URL}/auth/login`} className="bg-black hover:bg-gray-800 text-white px-8 py-3 font-bold transition-colors">
            ĐĂNG NHẬP NGAY
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-8 font-sans">
      <div className="max-w-[1200px] mx-auto px-4">
        
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6 flex gap-2">
          <Link to="/" className="hover:text-black">Trang chủ</Link>
          <span>/</span>
          <span className="text-black">Giỏ hàng</span>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-200 rounded-md">
            <p className="text-gray-500 mb-6 text-lg">Giỏ hàng của bạn đang trống.</p>
            <Link to="/shop" className="bg-black hover:bg-gray-800 text-white px-8 py-3 font-bold transition-colors uppercase">
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
            <div className="flex-1 bg-white p-6 border border-gray-200 w-full rounded-md">
              <div className="flex justify-between items-end border-b border-gray-200 pb-4 mb-2">
                <h2 className="text-2xl font-semibold text-black">Giỏ hàng:</h2>
                <button onClick={clearCart} className="text-sm text-gray-600 underline hover:text-black">
                  {cartItems.length} Sản phẩm
                </button>
              </div>

              <div className="flex flex-col">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row items-center py-5 border-b border-gray-100 last:border-0 gap-4">
                    
                    {/* Hình ảnh */}
                    <div className="w-[100px] h-[100px] flex-shrink-0 border border-gray-200 p-1 bg-white rounded-md">
                      {item.images && item.images.length > 0 ? (
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-[10px] text-gray-400">NO IMG</div>
                      )}
                    </div>
                    
                    {/* Thông tin SP */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.id}`} className="text-[15px] text-black hover:text-blue-600 line-clamp-2 uppercase">
                        {item.name}
                      </Link>
                      <div className="text-[13px] mt-1.5 flex items-center gap-2">
                        <span className="text-black">Hàng có sẵn</span>
                        <span className="text-[#d0021b]">{formatPrice(item.price)}</span>
                      </div>
                    </div>
                    
                    {/* Nút tăng giảm số lượng & Xóa */}
                    <div className="flex flex-col items-center justify-center w-28">
                      <div className="flex border border-gray-300 w-[100px] h-[34px]">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" /></svg>
                        </button>
                        <div className="flex-1 flex items-center justify-center border-x border-gray-300 text-[15px] text-black bg-white">
                          {item.quantity}
                        </div>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-[13px] text-black underline mt-2 hover:text-[#d0021b] transition-colors">
                        Xóa
                      </button>
                    </div>
                    
                    {/* Tổng tiền từng SP */}
                    <div className="w-32 text-right font-bold text-[#d0021b] text-base">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CỘT PHẢI: THÔNG TIN ĐƠN HÀNG */}
            <div className="w-full lg:w-[340px] bg-white p-6 border border-gray-200 rounded-md">
              <h2 className="text-xl font-medium text-black mb-6">Thông tin đơn hàng</h2>
              
              <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                <span className="font-bold text-base text-black">Tổng tiền:</span>
                <span className="font-bold text-[22px] text-[#d0021b]">{formatPrice(totalPrice)}</span>
              </div>

              <label className="flex items-center gap-2.5 mb-5 cursor-pointer group w-fit">
                <input type="checkbox" className="w-4 h-4 border-gray-300 rounded-none accent-black cursor-pointer" />
                <span className="text-[14px] text-gray-800 group-hover:text-black">Xuất hoá đơn</span>
              </label>

              <div className="mb-4">
                <label className="block text-[15px] font-bold text-black mb-2">Ghi chú đơn hàng</label>
                <textarea 
                  placeholder="Ghi chú" 
                  className="w-full border border-gray-300 p-3 text-sm h-24 resize-none rounded-none focus:outline-none focus:border-black transition-colors bg-white" 
                />
              </div>

              <div className="mb-6">
                <input 
                  type="text" 
                  placeholder="Nhập mã khuyến mãi (nếu có)" 
                  className="w-full border border-gray-300 p-3 text-sm rounded-none focus:outline-none focus:border-black transition-colors bg-white" 
                />
              </div>

              <button 
                onClick={() => navigate('/checkout')} 
                className="w-full bg-black text-white font-medium py-3.5 mb-4 hover:bg-[#333] transition-colors rounded-none text-[14px]"
              >
                THANH TOÁN NGAY
              </button>

              <Link to="/shop" className="flex items-center justify-center text-[14px] text-black hover:text-gray-600 transition-colors gap-2 mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                Tiếp tục mua hàng
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;