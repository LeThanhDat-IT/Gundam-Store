import { useContext, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axiosClient from '../../config/axiosClient';
import { AuthContext } from '../../features/auth/context/AuthContext';

const cancelStatuses = new Set(['cancelled', 'failed', 'cancel', 'canceled']);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { user } = useContext(AuthContext);

  const loadLocalOrders = () => JSON.parse(localStorage.getItem('orders') || '[]');

  useEffect(() => {
    const paymentStatus = searchParams.get("status");

    const fetchOrders = async () => {
      if (!user) {
        setOrders(loadLocalOrders());
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axiosClient.get('/orders');
        const apiOrders = Array.isArray(response.data?.data ?? response.data)
          ? (response.data?.data ?? response.data)
          : [];

        setOrders(
          apiOrders.map((order) => ({
            id: order.id ?? order.Id,
            totalPrice: order.totalPrice ?? order.TotalPrice,
            status: order.status ?? order.Status,
            createdAt: order.createdAt ?? order.CreatedAt,
            receiverName: order.receiverName ?? order.ReceiverName,
            phone: order.phone ?? order.Phone,
            address: order.address ?? order.Address,
            itemCount: order.itemCount ?? order.ItemCount ?? 0,
          })),
        );
      } catch (error) {
        console.error('Không tải được đơn hàng từ server:', error);
        setOrders(loadLocalOrders());
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    if (!user) {
      return;
    }

    if (paymentStatus === "success") {
      return;
    }
  }, [searchParams, user]);

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto rounded-none border border-gray-100 bg-white p-8 md:p-12 text-center shadow-xl shadow-slate-200/50 my-10">
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 tracking-tight uppercase">Đang tải đơn hàng...</h1>
        <p className="text-slate-500 font-medium">Đang đồng bộ lịch sử mua hàng từ máy chủ.</p>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="max-w-3xl mx-auto rounded-none border border-gray-100 bg-white p-8 md:p-12 text-center shadow-xl shadow-slate-200/50 my-10">
        <div className="w-24 h-24 bg-slate-50 rounded-none flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-slate-400"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-orange-500 mb-3 font-bold">Lịch sử giao dịch</p>
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 tracking-tight uppercase">Chưa có đơn hàng nào</h1>
        <p className="text-slate-500 font-medium mb-8">Lịch sử mua hàng của bạn sẽ xuất hiện ở đây sau khi bạn thanh toán thành công.</p>
        <Link
          to="/shop"
          className="inline-flex items-center justify-center rounded-none bg-blue-600 px-8 py-3.5 font-bold text-white uppercase tracking-wider hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
        >
          Bắt đầu mua sắm ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1000px] mx-auto my-6">
      
      <div className="rounded-none border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-orange-500 mb-2 font-bold">Quản lý giao dịch</p>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Lịch sử đặt hàng</h1>
        <p className="text-slate-500 text-sm font-medium mt-2">Theo dõi trạng thái và chi tiết các đơn hàng bạn đã mua tại hệ thống.</p>
      </div>

      <div className="grid gap-5">
        {orders.map((order) => (
          <article key={order.id} className="rounded-none border border-gray-100 bg-white p-6 md:p-8 shadow-md shadow-slate-200/40 hover:shadow-lg hover:border-blue-100 transition-all duration-300">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Mã đơn: #{order.id || 'ORDER-LOCAL'}</p>
                </div>
                <h2 className="text-xl font-black text-slate-800 mt-1">
                  Người nhận: {order.receiverName || 'Khách hàng'}
                </h2>
                <p className="mt-2 text-sm text-slate-500 font-medium flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-4.08-7.074-6.959l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                  {order.phone}
                </p>
                <p className="mt-1 text-sm text-slate-500 font-medium flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                  {order.address}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-widest mt-2 md:mt-0">
                {/* Trạng thái đơn hàng */}
                <span className={`rounded-none px-3 py-1.5 border shadow-sm ${order.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : order.status === 'cancelled' ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                  {order.status === 'paid' ? '✅ Đã thanh toán' : order.status === 'cancelled' ? '❌ Đã huỷ' : '⏳ Đang chờ xử lý'}
                </span>
                
                {/* Phương thức thanh toán */}
                <span className="rounded-none bg-slate-50 px-3 py-1.5 text-slate-600 border border-gray-200 shadow-sm flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>
                  {order.paymentMethod || '—'}
                </span>
              </div>

            </div>

            {/* Chi tiết Tiền bạc & Sản phẩm */}
            <div className="mt-6 grid gap-4 border-t border-gray-100 pt-6 text-sm text-slate-600 md:grid-cols-2 bg-slate-50 rounded-none p-5 border border-dashed">
              <div>
                <p className="text-slate-400 font-bold uppercase tracking-wider text-[11px] mb-1">Số lượng mua</p>
                <p className="font-bold text-slate-800 text-base">{order.itemCount || order.items?.length || 0} sản phẩm</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase tracking-wider text-[11px] mb-1">Tổng thanh toán</p>
                <p className="font-black text-orange-500 text-xl">{formatPrice(order.totalPrice || 0)}</p>
              </div>
            </div>
            
          </article>
        ))}
      </div>

      <div className="flex justify-center pt-6">
        <Link
          to="/shop"
          className="inline-flex items-center justify-center rounded-none bg-blue-600 px-8 py-3.5 font-bold text-white uppercase tracking-wider hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
        >
          Mua thêm sản phẩm
        </Link>
      </div>
    </div>
  );
};

export default Orders;