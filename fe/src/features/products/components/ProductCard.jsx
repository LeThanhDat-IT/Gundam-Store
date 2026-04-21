import { useContext } from 'react';
import { useCartContext } from '../../cart/context/CartContext';
import { AuthContext } from '../../../features/auth/context/AuthContext';
import toast from 'react-hot-toast';
import { resolveProductImages } from '../utils/productImages';
import { SOCIAL_APP_URL } from '../../../config/appUrls';

const ProductCard = ({ product, formatPrice, onQuickView }) => {
  const { addToCart } = useCartContext();
  const { user } = useContext(AuthContext);
  const productImages = resolveProductImages(product);

  const handleBuyNow = (e) => {
    e.stopPropagation(); 
    
    if (!user) {
      window.location.href = `${SOCIAL_APP_URL}/auth/login`;
      return;
    }
    
    addToCart({ ...product, quantity: 1 });
  };

  return (
    <div 
      // THAY ĐỔI Ở ĐÂY: border-slate-200, shadow-md mặc định. Hover: border-blue-400, shadow-lg
      className="group/card flex flex-col bg-white rounded-none border border-slate-200 shadow-md overflow-hidden cursor-pointer hover:border-blue-400 hover:shadow-lg hover:shadow-blue-900/10 transition-all duration-300 h-full"
      onClick={() => onQuickView(product)} 
    >
      {/* ================= KHU VỰC ẢNH ================= */}
      <div className="relative w-full aspect-square bg-slate-50 flex items-center justify-center overflow-hidden p-4 border-b border-slate-100">
        
        {product.stock === 0 ? (
          <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-none shadow-sm">
            Hết hàng
          </span>
        ) : (
          <span className="absolute top-3 left-3 z-10 bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-bold uppercase px-2.5 py-1 rounded-none shadow-sm">
            Sẵn hàng
          </span>
        )}

        {productImages.length > 0 ? (
          <img 
            src={productImages[0]} 
            alt={product.name || product.Name} 
            className="w-full h-full object-contain group-hover/card:scale-105 transition-transform duration-500 ease-out drop-shadow-sm" 
          />
        ) : (
          <span className="text-slate-400 text-xs font-bold">CHƯA CÓ ẢNH</span>
        )}
        
        {/* Nút xem nhanh (Mắt) overlay */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] opacity-0 group-hover/card:opacity-100 flex items-center justify-center transition-all duration-300">
          <div className="bg-white text-blue-600 p-3 rounded-none hover:bg-blue-600 hover:text-white transition-colors shadow-lg scale-90 group-hover/card:scale-100 border border-blue-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>
          </div>
        </div>
      </div>

      {/* ================= KHU VỰC THÔNG TIN ================= */}
      <div className="flex flex-col flex-1 p-4 md:p-5 items-center justify-between text-center relative z-20 bg-white">
        
        <h3 className="text-slate-800 font-bold text-[13px] md:text-sm line-clamp-2 h-[40px] mb-3 w-full px-1 group-hover/card:text-blue-600 transition-colors leading-snug">
          {product.name}
        </h3>

        {/* VÙNG CHỨA GIÁ / NÚT BẤM */}
        <div className="relative w-full h-[40px] flex items-center justify-center overflow-hidden">
          
          {/* GIÁ SẢN PHẨM */}
          <span className="text-orange-600 font-black text-[15px] md:text-base transition-all duration-300 ease-in-out group-hover/card:opacity-0 group-hover/card:translate-y-6 absolute">
            {formatPrice(product.price)}
          </span>

          {/* NÚT MUA NGAY */}
          <div className="absolute transition-all duration-300 ease-in-out opacity-0 translate-y-6 group-hover/card:opacity-100 group-hover/card:translate-y-0 w-full flex justify-center">
            {product.stock > 0 ? (
              <button 
                onClick={handleBuyNow}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[11px] md:text-xs font-bold uppercase py-2.5 rounded-none tracking-wider shadow-md shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
                Mua ngay
              </button>
            ) : (
              <button 
                onClick={(e) => { e.stopPropagation(); toast.error('Sản phẩm đang chờ nhập hàng!'); }}
                className="w-full bg-slate-200 text-slate-500 text-[11px] md:text-xs font-bold uppercase py-2.5 rounded-none tracking-wider cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                Chờ nhập
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductCard;