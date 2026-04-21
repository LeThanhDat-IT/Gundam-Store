import { useState, useEffect } from 'react';

// Tạo một mảng rỗng bên ngoài để giữ nguyên Reference (tránh lỗi Infinite Loop / Màn hình trắng)
const EMPTY_ARRAY = [];

const ProductGallery = ({ images }) => {
  // Đảm bảo an toàn 100%: Nếu không phải mảng hoặc mảng rỗng, dùng mảng cố định
  const safeImages = Array.isArray(images) && images.length > 0 ? images : EMPTY_ARRAY;
  
  // Lưu vị trí index của ảnh thay vì URL, giúp dễ dàng làm nút Next/Prev
  const [currentIndex, setCurrentIndex] = useState(0);

  // Tự động quay về ảnh đầu tiên nếu danh sách ảnh thay đổi (khi đổi sản phẩm)
  useEffect(() => {
    setCurrentIndex(0);
  }, [safeImages]);

  // TRẠNG THÁI KHÔNG CÓ ẢNH
  if (safeImages.length === 0) {
    return (
      <div className="w-full aspect-square bg-slate-50 rounded-none flex items-center justify-center border border-gray-200 shadow-sm">
        <span className="text-slate-400 text-sm font-bold tracking-widest uppercase">Chưa có hình ảnh</span>
      </div>
    );
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      
      {/* ================= KHU VỰC ẢNH CHÍNH ================= */}
      <div className="relative w-full aspect-square bg-white rounded-none flex items-center justify-center p-4 lg:p-6 border border-gray-100 shadow-sm overflow-hidden group">
        
        {/* Nền lưới công nghệ nhạt (Light Grid) */}
        <div 
          className="absolute inset-0 z-0 opacity-40" 
          style={{ backgroundImage: 'linear-gradient(#f1f5f9 1px, transparent 1px), linear-gradient(90deg, #f1f5f9 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        ></div>

        <img 
          src={safeImages[currentIndex]} 
          alt={`Product view ${currentIndex + 1}`} 
          className="relative z-10 w-full h-full object-contain animate-fade-in"
        />

        {/* Nút điều hướng Trái / Phải (Chỉ hiển thị khi có nhiều hơn 1 ảnh) */}
        {safeImages.length > 1 && (
          <>
            <button 
              onClick={handlePrev} 
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 p-3 rounded-none border border-gray-200 text-slate-500 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all opacity-0 group-hover:opacity-100 shadow-md backdrop-blur-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </button>
            <button 
              onClick={handleNext} 
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 p-3 rounded-none border border-gray-200 text-slate-500 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all opacity-0 group-hover:opacity-100 shadow-md backdrop-blur-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </button>
          </>
        )}
      </div>

      {/* ================= DANH SÁCH ẢNH NHỎ (THUMBNAILS) ================= */}
      {safeImages.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {safeImages.slice(0, 5).map((img, index) => (
            <button 
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative aspect-square bg-white rounded-none p-2 border-2 transition-all duration-300 overflow-hidden group/thumb ${
                currentIndex === index 
                  ? 'border-blue-500 shadow-md scale-[1.03] z-10 ring-2 ring-blue-50' 
                  : 'border-gray-100 hover:border-blue-300 hover:bg-slate-50'
              }`}
            >
              <img 
                src={img} 
                alt={`Thumbnail ${index + 1}`} 
                className={`w-full h-full object-contain transition-transform duration-500 ${currentIndex !== index && 'group-hover/thumb:scale-110'}`} 
              />
              {/* Lớp phủ mờ màu xanh siêu nhạt khi đang active */}
              {currentIndex === index && (
                <div className="absolute inset-0 bg-blue-50/30 z-10 pointer-events-none"></div>
              )}
            </button>
          ))}
        </div>
      )}

    </div>
  );
};

export default ProductGallery;