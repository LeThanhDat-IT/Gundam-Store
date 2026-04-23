import { SOCIAL_APP_URL } from '../../config/appUrls';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosClient from '../../config/axiosClient';
import { AuthContext } from '../../features/auth/context/AuthContext';
import { useCartContext } from '../../features/cart/context/CartContext';

const PAYMENT_METHODS = [
  {
    value: 'cod',
    label: 'Thanh toán khi nhận hàng',
    description: 'Xác nhận đơn ngay, thanh toán cho shipper khi nhận hàng.',
  },
  {    value: 'demo',
    label: 'Chuyển khoản (Demo)',
    description: 'Dùng để demo trạng thái hiển thị "Đã thanh toán" (Bỏ qua OTP/Tiền thật).',
  },
];

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const { cartItems, totalPrice, clearCart, loading } = useCartContext();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    receiverName: '',
    phone: '',
    address: '',
    paymentMethod: 'cod',
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        receiverName: user.username || prev.receiverName,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
      }));
    }
  }, [user]);

  const orderItems = useMemo(
    () =>
      cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    [cartItems],
  );

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const storeOrderHistory = (order) => {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const nextOrders = [order, ...savedOrders].slice(0, 20);
    localStorage.setItem('orders', JSON.stringify(nextOrders));
  };

  const buildLocalOrder = () => ({
    id: `local-${Date.now()}`,
    status: formData.paymentMethod === 'cod' ? 'pending' : 'paid',
    paymentMethod: formData.paymentMethod,
    receiverName: formData.receiverName.trim(),
    phone: formData.phone.trim(),
    address: formData.address.trim(),
    totalPrice,
    items: cartItems,
    createdAt: new Date().toISOString(),
    localOnly: true,
  });

  //hàm submit, xử lý kết quả, lưu lịch sử đơn hàng
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      window.location.href = `${SOCIAL_APP_URL}/auth/login`;
      return;
    }

    if (!cartItems.length) {
      toast.error('Giỏ hàng đang trống.');
      return;
    }

    if (!formData.receiverName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      toast.error('Vui lòng nhập đầy đủ thông tin giao hàng.');
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        userId: user.id || null,
        receiverName: formData.receiverName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        paymentMethod: formData.paymentMethod,
        items: orderItems,
      };

      //request tạo đơn hàng trên server
      const response = await axiosClient.post('/orders', payload);
      const createdOrder = response.data?.data || response.data;

      storeOrderHistory({
        id: createdOrder?.id,
        status: createdOrder?.status || (formData.paymentMethod === 'cod' ? 'pending' : 'paid'),
        paymentMethod: formData.paymentMethod,
        receiverName: formData.receiverName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        totalPrice,
        items: cartItems,
        createdAt: createdOrder?.created_at || new Date().toISOString(),
      });

      clearCart();

      if (createdOrder?.paymentUrl) {
        toast.success('Đang chuyển hướng sang cổng thanh toán...');
        window.location.href = createdOrder.paymentUrl;
        return;
      }

      toast.success('Thanh toán thành công. Đơn hàng đã được tạo!', { icon: '✅' });
      navigate('/orders', { replace: true });
    } catch (error) {
      const statusCode = error?.response?.status;

      if (!statusCode || statusCode >= 500) {
        const fallbackOrder = buildLocalOrder();
        storeOrderHistory(fallbackOrder);
        clearCart();
        toast.success('Đơn hàng đã được lưu cục bộ để demo.', { icon: '✅' });
        navigate('/orders', { replace: true });
        return;
      }

      const message = error?.response?.data?.message || 'Không thể tạo đơn hàng vào lúc này.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto rounded-none border border-gray-100 bg-white p-8 md:p-12 text-center shadow-xl shadow-slate-200/50 my-10">
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 uppercase tracking-tight">Đang tải giỏ hàng...</h1>
        <p className="text-slate-500 font-medium">Vui lòng chờ trong giây lát.</p>
      </div>
    );
  }

  // UI Khi chưa đăng nhập
  if (!user) {
    return (
      <div className="max-w-3xl mx-auto rounded-none border border-gray-100 bg-white p-8 md:p-12 text-center shadow-xl shadow-slate-200/50 my-10">
        <div className="w-20 h-20 bg-blue-50 rounded-none flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 uppercase tracking-tight">Bạn cần đăng nhập</h1>
        <p className="text-slate-500 mb-8 max-w-xl mx-auto font-medium">
          Vui lòng đăng nhập để tiến hành thanh toán. Đơn hàng sẽ được gắn với tài khoản của bạn để dễ dàng theo dõi trạng thái và lịch sử.
        </p>
        <a
          href={`${SOCIAL_APP_URL}/auth/login`}
          className="inline-flex items-center justify-center rounded-none bg-blue-600 px-8 py-3.5 font-bold text-white uppercase tracking-wider hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
        >
          Đăng nhập ngay
        </a>
      </div>
    );
  }

  // UI Khi giỏ hàng trống
  if (!cartItems.length) {
    return (
      <div className="max-w-3xl mx-auto rounded-none border border-gray-100 bg-white p-8 md:p-12 text-center shadow-xl shadow-slate-200/50 my-10">
        <div className="w-24 h-24 bg-slate-50 rounded-none flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-slate-400"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 uppercase tracking-tight">Giỏ hàng đang trống</h1>
        <p className="text-slate-500 mb-8 font-medium">Bạn chưa chọn sản phẩm nào. Hãy thêm sản phẩm vào giỏ trước khi tiến hành thanh toán nhé.</p>
        <Link
          to="/shop"
          className="inline-flex items-center justify-center rounded-none bg-blue-600 px-8 py-3.5 font-bold text-white uppercase tracking-wider hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] max-w-[1100px] mx-auto my-6">
      
      {/* CỘT TRÁI: FORM THANH TOÁN */}
      <form
        onSubmit={handleSubmit}
        className="rounded-none border border-gray-100 bg-white p-6 md:p-8 shadow-xl shadow-slate-200/50"
      >
        <div className="mb-8 border-b border-gray-100 pb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-orange-500 mb-2 font-bold">Thủ tục thanh toán</p>
          <h1 className="text-3xl font-black text-slate-800 mb-2 uppercase tracking-tight">Thông tin đặt hàng</h1>
          <p className="text-slate-500 text-sm font-medium">Vui lòng kiểm tra kỹ thông tin giao hàng và chọn phương thức thanh toán phù hợp.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Họ tên người nhận</span>
            <input
              name="receiverName"
              value={formData.receiverName}
              onChange={handleChange}
              className="w-full rounded-none border border-gray-200 bg-slate-50 px-4 py-3.5 text-slate-800 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Nhập họ và tên..."
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Số điện thoại</span>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-none border border-gray-200 bg-slate-50 px-4 py-3.5 text-slate-800 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Nhập số điện thoại..."
            />
          </label>
        </div>

        <label className="mt-6 block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Địa chỉ giao hàng chi tiết</span>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            className="w-full rounded-none border border-gray-200 bg-slate-50 px-4 py-3.5 text-slate-800 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
            placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
          />
        </label>

        <div className="mt-10">
          <span className="mb-4 block text-sm font-bold uppercase tracking-wide text-slate-800 border-b border-gray-100 pb-3">Phương thức thanh toán</span>
          <div className="grid gap-4">
            {PAYMENT_METHODS.map((method) => (
              <label
                key={method.value}
                className={`cursor-pointer rounded-none border p-4 transition-all duration-300 ${
                  formData.paymentMethod === method.value
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={formData.paymentMethod === method.value}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <div>
                    <div className={`font-bold ${formData.paymentMethod === method.value ? 'text-blue-700' : 'text-slate-800'}`}>
                      {method.label}
                    </div>
                    <p className={`mt-1 text-sm ${formData.paymentMethod === method.value ? 'text-blue-600/80' : 'text-slate-500'}`}>
                      {method.description}
                    </p>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-gray-100 pt-6">
          <Link to="/cart" className="text-sm font-bold flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
            Quay lại giỏ hàng
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-none bg-orange-500 px-8 py-3.5 font-black uppercase tracking-widest text-white transition-all hover:bg-orange-600 shadow-md shadow-orange-500/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
          >
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
          </button>
        </div>
      </form>

      {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
      <aside className="h-fit rounded-none border border-gray-100 bg-slate-50 p-6 md:p-8 shadow-lg shadow-slate-200/30 lg:sticky lg:top-28">
        <h2 className="text-lg font-black text-slate-800 uppercase tracking-wide border-b border-gray-200 pb-4">Tóm tắt đơn hàng</h2>
        
        <div className="mt-6 space-y-4 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-none border border-white bg-white p-3 shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-none bg-slate-50 overflow-hidden flex-shrink-0">
                {item.images?.[0] ? (
                  <img src={item.images[0]} alt={item.name} className="h-full w-full object-contain" />
                ) : (
                  <span className="text-[10px] font-bold text-slate-400">NO IMG</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-slate-700 text-sm leading-snug">{item.name}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">Số lượng: {item.quantity}</p>
              </div>
              <div className="text-right text-sm font-black text-orange-500">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3 border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between text-sm font-bold text-slate-500">
            <span>Tạm tính</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex items-center justify-between text-sm font-bold text-slate-500">
            <span>Phí vận chuyển</span>
            <span className="text-emerald-500">Miễn phí</span>
          </div>
          <div className="flex items-center justify-between text-lg font-black text-slate-800 pt-3 border-t border-gray-200 border-dashed">
            <span>Tổng thanh toán</span>
            <span className="text-orange-500 text-2xl">{formatPrice(totalPrice)}</span>
          </div>
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-none border border-blue-100 bg-blue-50 p-4 text-xs font-medium text-blue-800 leading-relaxed shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 flex-shrink-0 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
          <p>
            Đơn hàng sẽ được chuyển sang trạng thái <strong className="text-blue-600">Pending (Chờ xử lý)</strong> với COD, hoặc <strong className="text-blue-600">Paid (Đã thanh toán)</strong> với các phương thức chuyển khoản trực tuyến.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default Checkout;