import { useState, useEffect, useContext, useRef } from 'react';
import { createPortal } from 'react-dom'; 
import { useLocation, useNavigate } from 'react-router-dom';
import axiosClient from '../../config/axiosClient';
import { useProducts } from '../../features/products/hooks/useProducts';
import ProductCard from '../../features/products/components/ProductCard';
import { resolveProductImages } from '../../features/products/utils/productImages';
import { useCartContext } from '../../features/cart/context/CartContext';
import { AuthContext } from '../../features/auth/context/AuthContext';
import toast from 'react-hot-toast';
import { SOCIAL_APP_URL } from '../../config/appUrls';

const safeArray = (data) => Array.isArray(data) ? data : [];
const safeJSON = (data) => {
  if (!data) return [];
  if (typeof data !== 'string') return safeArray(data);
  try { return safeArray(JSON.parse(data)); } 
  catch (e) { return []; }
};

const Catalog = () => {
  const { addToCart } = useCartContext();
  const { user } = useContext(AuthContext);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [dbProducts, setDbProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // States quản lý Modal Quick View
  const [modalQuantity, setModalQuantity] = useState(1);
  const [modalUserRating, setModalUserRating] = useState(5);
  const [modalUserComment, setModalUserComment] = useState("");
  const [currentGalleryImageIndex, setCurrentGalleryImageIndex] = useState(0);
  const relatedCarouselRef = useRef(null);
  
  const modalScrollRef = useRef(null);
  
  // Bắt trạng thái cuộn của Modal
  const [isModalScrolled, setIsModalScrolled] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
      setModalQuantity(1);
      setCurrentGalleryImageIndex(0);
      setModalUserComment("");
      setModalUserRating(5);
      setIsModalScrolled(false);
      
      setTimeout(() => {
        if (modalScrollRef.current) {
          modalScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);

    } else {
      document.body.style.overflow = 'auto';
    }
  }, [selectedProduct]);

  useEffect(() => {
    const fetchCatalogData = async () => {
      setIsLoading(true);
      try {
        const [catRes, subRes, prodRes] = await Promise.all([
          axiosClient.get('/categories').catch(() => ({ data: [] })),
          axiosClient.get('/subcategories').catch(() => ({ data: [] })),
          axiosClient.get('/products').catch(() => ({ data: [] }))
        ]);

        const fetchedCategories = safeArray(catRes.data?.data || catRes.data);
        const fetchedSubcategories = safeArray(subRes.data?.data || subRes.data);
        const rawProducts = safeArray(prodRes.data?.data || prodRes.data);
        
        const formattedProducts = rawProducts.map(p => ({
          ...p,
          id: p.id || p.Id,
          name: p.name || p.Name,
          price: p.price || p.Price,
          images: resolveProductImages({
            id: p.id || p.Id,
            name: p.name || p.Name,
            images: p.images || p.Images || p.imageUrls || p.ImageUrls || p.productImages || p.ProductImages,
          }),
          specs: safeJSON(p.specs || p.Specs),
          reviews: safeJSON(p.reviews || p.Reviews),
          rating: p.rating || p.Rating || 5.0,
          desc: p.desc || p.description || p.Description || 'Chưa có mô tả cho sản phẩm này.',
          stock: p.stock || p.Stock || 0,
          category_id: p.category_id || p.categoryId || p.CategoryId,
          subcategory_id: p.subcategory_id || p.subcategoryId || p.SubcategoryId
        }));

        setCategories(fetchedCategories);
        setSubcategories(fetchedSubcategories);
        setDbProducts(formattedProducts);
      } catch (error) {
        toast.error("Không thể kết nối đến máy chủ!");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCatalogData();
  }, []);

  const { 
    filteredProducts, paginatedProducts, activeSubcategory, setActiveSubcategory,
    searchQuery, setSearchQuery, sortOrder, setSortOrder,
    priceRange, setPriceRange, inStockOnly, setInStockOnly,
    currentPage, setCurrentPage, totalPages
  } = useProducts(dbProducts);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam !== null) {
      setSearchQuery(searchParam);
    }
  }, [location.search, setSearchQuery]);

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    const params = new URLSearchParams(location.search);
    params.set('pid', product.id || product.Id);
    navigate(`?${params.toString()}`, { replace: true }); 
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    const params = new URLSearchParams(location.search);
    params.delete('pid');
    navigate(`?${params.toString()}`, { replace: true });
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pid = params.get('pid');
    
    if (pid && dbProducts.length > 0) {
      const productToOpen = dbProducts.find(p => String(p.id || p.Id) === pid);
      if (productToOpen && (!selectedProduct || String(selectedProduct.id || selectedProduct.Id) !== pid)) {
        setSelectedProduct(productToOpen);
      }
    }
  }, [location.search, dbProducts]);

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const handleQuickBuy = (product, quantity) => {
    if (!user) {
      window.location.href = `${SOCIAL_APP_URL}/auth/login`;
      return;
    }
    const finalProduct = { ...product, quantity: quantity || 1 };
    addToCart(finalProduct);
    setSelectedProduct(null);
    const params = new URLSearchParams(location.search);
    params.delete('pid');
    navigate(`?${params.toString()}`, { replace: true });
  };

  const getRelatedProducts = (currentProductId) => {
      return dbProducts.filter(p => p.id !== currentProductId).slice(0, 8);
  };

  const scrollRelatedCarousel = (direction) => {
      if (relatedCarouselRef.current) {
          const { scrollLeft, clientWidth, scrollWidth } = relatedCarouselRef.current;
          const scrollAmount = clientWidth / 2;
          if (direction === 'right') {
              if (scrollLeft + clientWidth >= scrollWidth - 10) {
                  relatedCarouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
              } else {
                  relatedCarouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
              }
          } else {
              if (scrollLeft <= 0) {
                  relatedCarouselRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
              } else {
                  relatedCarouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
              }
          }
      }
  };

  useEffect(() => {
    let timer;
    if (selectedProduct) {
      timer = setInterval(() => scrollRelatedCarousel('right'), 5000);
    }
    return () => clearInterval(timer);
  }, [selectedProduct]);

  return (
    <div className="flex flex-col md:flex-row gap-8 relative min-h-[600px] items-start p-4 bg-gray-50 text-gray-800">
      
      {isLoading && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white/80 backdrop-blur-sm">
           <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-none animate-spin"></div>
        </div>
      )}

      {/* ================= SIDEBAR LỌC ================= */}
      <aside className="w-full md:w-64 flex-shrink-0 sticky top-24 z-10">
        <div className="bg-white p-6 border border-gray-100 shadow-sm max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          
          <h3 className="text-sm font-bold uppercase text-gray-900 border-b border-gray-100 pb-3 mb-4 tracking-wider">Danh mục</h3>
          <div className="space-y-5 mb-8">
            {categories && categories.length > 0 ? (
              categories.map(category => (
                <div key={category.id || category.Id}>
                  <h4 className="font-bold text-gray-500 uppercase tracking-wide text-xs mb-2">{category.name || category.Name}</h4>
                  <ul className="space-y-1 border-l-2 border-gray-100 pl-2">
                    {subcategories.filter(sub => (sub.category_id || sub.categoryId || sub.CategoryId) === (category.id || category.Id)).map(sub => (
                      <li key={sub.id || sub.Id}>
                        <button onClick={() => setActiveSubcategory(sub.id || sub.Id)} className={`text-sm w-full text-left px-3 py-2 transition-all duration-200 font-medium ${activeSubcategory === (sub.id || sub.Id) ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                          {sub.name || sub.Name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-xs italic py-2">Đang tải danh mục...</div>
            )}
          </div>

          <h3 className="text-sm font-bold uppercase text-gray-900 border-b border-gray-100 pb-3 mb-4 tracking-wider">Lọc theo giá</h3>
          <div className="space-y-3 mb-6 text-sm text-gray-600 font-medium">
            <label className="flex items-center gap-2 cursor-pointer hover:text-gray-900 transition-colors">
              <input type="radio" name="price" value="all" checked={priceRange === 'all'} onChange={(e) => setPriceRange(e.target.value)} className="accent-blue-600 w-4 h-4"/> Tất cả giá
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:text-gray-900 transition-colors">
              <input type="radio" name="price" value="under500" checked={priceRange === 'under500'} onChange={(e) => setPriceRange(e.target.value)} className="accent-blue-600 w-4 h-4"/> Dưới 500.000 đ
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:text-gray-900 transition-colors">
              <input type="radio" name="price" value="500-1m" checked={priceRange === '500-1m'} onChange={(e) => setPriceRange(e.target.value)} className="accent-blue-600 w-4 h-4"/> 500.000đ - 1.000.000đ
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:text-gray-900 transition-colors">
              <input type="radio" name="price" value="over1m" checked={priceRange === 'over1m'} onChange={(e) => setPriceRange(e.target.value)} className="accent-blue-600 w-4 h-4"/> Trên 1.000.000 đ
            </label>
          </div>

          <button onClick={() => { setActiveSubcategory('all'); setPriceRange('all'); setInStockOnly(false); setSearchQuery(''); setCurrentPage(1); }} className="text-sm font-bold w-full py-2.5 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-all uppercase tracking-wide">Xóa Bộ Lọc</button>
        </div>
      </aside>

      {/* ================= KHU VỰC CHÍNH ================= */}
      <main className="flex-grow w-full overflow-hidden">
        
        {/* THANH TOOLBAR */}
        <div className="bg-white p-4 border border-gray-100 shadow-sm mb-6 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="relative w-full lg:w-[350px]">
            <input type="text" placeholder="Tìm kiếm sản phẩm..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-sm text-gray-800 pl-10 pr-4 py-2.5 outline-none focus:border-blue-500 focus:bg-white transition-colors"/>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
          </div>
          
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap">
              <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="accent-blue-600 w-4 h-4 rounded"/> Sẵn hàng ({filteredProducts?.length || 0})
            </label>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="bg-gray-50 border border-gray-200 text-gray-700 font-medium text-sm px-3 py-2 outline-none cursor-pointer focus:border-blue-500 focus:bg-white transition-colors">
                <option value="default">Mới nhất</option>
                <option value="price_asc">Giá tăng dần</option>
                <option value="price_desc">Giá giảm dần</option>
            </select>
          </div>
        </div>

        {/* LƯỚI SẢN PHẨM */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id || product.Id} product={product} formatPrice={formatPrice} onQuickView={handleOpenModal} />
          ))}
        </div>

        {/* PHÂN TRANG */}
        {totalPages > 1 && (
            <div className="flex justify-center mt-12 gap-2">
                <button onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }} disabled={currentPage === 1} className="px-4 py-2 bg-white text-gray-600 border border-gray-200 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">&larr; Trước</button>
                <div className="hidden sm:flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                      <button key={i} onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`w-10 h-10 text-sm font-bold border ${currentPage === i + 1 ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>{i + 1}</button>
                  ))}
                </div>
                <button onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); window.scrollTo({ top: 0, behavior: 'smooth' }); }} disabled={currentPage === totalPages} className="px-4 py-2 bg-white text-gray-600 border border-gray-200 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">Sau &rarr;</button>
            </div>
        )}
      </main>

      {/* ================= MODAL QUICK VIEW ================= */}
      {selectedProduct && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 animate-fade-in font-sans">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
          
          <div className="bg-white shadow-2xl w-full max-w-[1300px] h-[95vh] relative z-10 overflow-hidden flex flex-col transition-all">
            
            <div className="relative z-10 flex flex-col flex-1 overflow-hidden">
                
                {/* 🔥 HEADER MODAL 🔥 */}
                <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-100 bg-white/95 backdrop-blur-md sticky top-0 z-30 flex-shrink-0">
                  
                  <div className="flex items-center gap-4 flex-1 overflow-hidden pr-4">
                    <h2 className={`text-lg md:text-xl font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2 transition-all ${isModalScrolled ? 'hidden sm:flex' : 'flex'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-blue-600 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                      <span className="whitespace-nowrap">CHI TIẾT</span>
                    </h2>

                    {/* HIỂN THỊ TÊN & GIÁ KHI CUỘN */}
                    <div className={`flex items-center gap-3 transition-all duration-300 origin-left ${isModalScrolled ? 'opacity-100 scale-100 sm:pl-4 sm:border-l border-gray-200' : 'opacity-0 scale-95 hidden'}`}>
                      {selectedProduct.images && selectedProduct.images.length > 0 && (
                         <img src={selectedProduct.images[0]} alt="thumb" className="w-10 h-10 rounded-none bg-gray-50 object-contain border border-gray-100 flex-shrink-0"/>
                      )}
                      <div className="flex flex-col justify-center min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate max-w-[150px] sm:max-w-[300px] lg:max-w-[500px]">{selectedProduct.name || selectedProduct.Name}</p>
                        <p className="text-sm font-bold text-orange-600">{formatPrice(selectedProduct.price || selectedProduct.Price)}</p>
                      </div>
                    </div>
                  </div>

                  <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 p-2.5 rounded-none transition-colors flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                {/* BẮT SỰ KIỆN CUỘN */}
                <div 
                  ref={modalScrollRef} 
                  onScroll={(e) => setIsModalScrolled(e.target.scrollTop > 250)}
                  className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
                >
                  
                  {/* PHẦN 1: GALLERY & THÔNG TIN */}
                  <div className="flex flex-col md:flex-row gap-8 lg:gap-14 mb-16 border-b border-gray-100 pb-16">
                    
                    <div className="w-full md:w-1/2 flex-shrink-0 relative group bg-gray-50 p-6 border border-gray-100 flex flex-col items-center justify-center">
                      {selectedProduct.images && selectedProduct.images.length > 0 ? (
                        <>
                          <img src={selectedProduct.images[currentGalleryImageIndex]} alt={selectedProduct.name} className="w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] object-contain mx-auto mix-blend-multiply" />
                          {selectedProduct.images.length > 1 && (
                            <>
                            <button onClick={() => setCurrentGalleryImageIndex(prev => prev === 0 ? selectedProduct.images.length - 1 : prev - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white text-gray-600 p-3 shadow-md hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg></button>
                            <button onClick={() => setCurrentGalleryImageIndex(prev => prev === selectedProduct.images.length - 1 ? 0 : prev + 1)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-gray-600 p-3 shadow-md hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg></button>
                            </>
                          )}
                          <div className="flex justify-center gap-3 mt-8">
                            {selectedProduct.images.slice(0, 5).map((img, i) => (
                                <img key={i} src={img} alt="thumb" onClick={() => setCurrentGalleryImageIndex(i)} className={`w-16 h-16 object-cover border-2 bg-white cursor-pointer transition-all ${i === currentGalleryImageIndex ? 'border-blue-600 shadow-md scale-105' : 'border-gray-200 hover:border-gray-300'}`} />
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="h-[400px] flex items-center justify-center text-gray-400 font-medium">Hình ảnh đang cập nhật</div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col pt-2">
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="bg-blue-50 text-blue-600 text-[11px] font-bold uppercase px-3 py-1.5 tracking-wider">Sản phẩm nổi bật</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 border border-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>
                            <span className="text-sm font-bold text-gray-900">{selectedProduct.rating}</span>
                            <span className="text-gray-500 text-xs font-medium">({selectedProduct.reviews ? selectedProduct.reviews.length : 0} đánh giá)</span>
                        </div>
                      </div>
                      
                      <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight leading-tight">
                        {selectedProduct.name || selectedProduct.Name}
                      </h1>

                      <p className="text-4xl md:text-5xl font-black text-orange-600 mb-8 tracking-tighter">
                        {formatPrice(selectedProduct.price || selectedProduct.Price)}
                      </p>

                      <div className="space-y-4 border-t border-gray-100 pt-8 mb-8">
                         <div className="flex justify-between items-center bg-gray-50 p-4 border border-gray-100">
                            <span className="text-gray-600 font-semibold">Tình trạng kho:</span>
                            {selectedProduct.stock > 0 ? (
                              <span className="text-green-600 font-bold flex items-center gap-1.5 bg-green-50 px-3 py-1 text-sm">Còn hàng ({selectedProduct.stock})</span>
                            ) : (
                              <span className="text-red-500 font-bold bg-red-50 px-3 py-1 text-sm">Tạm hết hàng</span>
                            )}
                         </div>

                         <div className="flex justify-between items-center bg-gray-50 p-4 border border-gray-100">
                            <span className="text-gray-600 font-semibold">Số lượng muốn mua:</span>
                            <div className="flex items-center bg-white border border-gray-200 p-1 h-11">
                                <button 
                                  onClick={() => setModalQuantity(prev => Math.max(1, Number(prev) - 1))} 
                                  className="w-9 h-9 flex items-center justify-center bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" /></svg>
                                </button>
                                
                                <input 
                                  type="number" 
                                  min="1" 
                                  max={selectedProduct.stock || 99} 
                                  value={modalQuantity} 
                                  onChange={(e) => setModalQuantity(Math.max(1, Math.min(Number(selectedProduct.stock) || 99, parseInt(e.target.value) || 1)))} 
                                  className="w-12 text-center bg-transparent text-lg font-bold text-gray-900 outline-none focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                                />
                                
                                <button 
                                  onClick={() => setModalQuantity(prev => Math.max(1, Math.min(Number(selectedProduct.stock) || 99, Number(prev) + 1)))} 
                                  className="w-9 h-9 flex items-center justify-center bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                                </button>
                            </div>
                         </div>
                      </div>

                      <button 
                        onClick={() => handleQuickBuy(selectedProduct, modalQuantity)}
                        disabled={selectedProduct.stock === 0}
                        className={`w-full py-4 font-bold uppercase text-base tracking-widest transition-all shadow-md active:scale-[0.98] flex justify-center items-center gap-3 mb-10 ${
                          selectedProduct.stock === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/30'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
                        {selectedProduct.stock === 0 ? 'Đã bán hết' : `Thêm vào giỏ hàng • SL: ${modalQuantity}`}
                      </button>

                      {selectedProduct.specs && selectedProduct.specs.length > 0 && (
                        <div className="bg-gray-50 p-6 border border-gray-100 mt-auto">
                            <h4 className="text-sm font-bold uppercase text-gray-900 mb-5 flex items-center gap-2.5"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-blue-600"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg> Thông số chi tiết</h4>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-3.5 text-sm">
                                {selectedProduct.specs.map((spec, i) => (
                                    <div key={i} className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                                        <span className="text-gray-500 font-medium">{spec.key || spec.Key}</span>
                                        <span className="text-gray-900 font-bold">{spec.value || spec.Value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* PHẦN 2: MÔ TẢ */}
                  <div className="border-t border-gray-100 pt-12 mb-16 pb-12">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-blue-600"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg> Thông tin mô tả</h3>
                    <div className="flex flex-col lg:flex-row gap-10">
                        <div className="prose prose-sm flex-1 text-gray-700 leading-relaxed bg-gray-50 p-8 border border-gray-100 max-w-none">
                            <p>{selectedProduct.desc}</p>
                        </div>
                        {selectedProduct.images && selectedProduct.images.length > 1 && (
                            <div className="w-full lg:w-1/3 grid grid-cols-2 gap-4 flex-shrink-0">
                                {selectedProduct.images.slice(1, 6).map((img, i) => (
                                    <img key={i} src={img} alt={`ilust-${i}`} className={`object-cover w-full h-full border border-gray-100 aspect-square ${i===0 ? 'col-span-2' : ''}`} />
                                ))}
                            </div>
                        )}
                    </div>
                  </div>

                  {/* PHẦN 3: BÌNH LUẬN */}
                  <div className="border-t border-gray-100 pt-12 mb-16 pb-12">
                    <div className="flex items-center justify-between mb-10 gap-4">
                        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-yellow-400"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442a.562.562 0 01.313.988l-4.289 3.692a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557l-4.289-3.692a.562.562 0 01.313-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg> Đánh giá sản phẩm ({selectedProduct.reviews ? selectedProduct.reviews.length : 0})</h3>
                    </div>

                    {user ? (
                        <div className="bg-gray-50 p-8 border border-gray-100 mb-12">
                            <div className="flex items-start gap-5 mb-6">
                                <div className="w-12 h-12 rounded-none bg-blue-600 flex-shrink-0 flex items-center justify-center font-bold text-white text-lg shadow-sm">{user.username?.charAt(0).toUpperCase() || 'U'}</div>
                                <div className="flex-1">
                                    <p className="font-bold text-gray-900 mb-1.5">Viết đánh giá của <strong className="text-blue-600">{user.username}</strong></p>
                                    <p className="text-xs text-gray-500 mb-4">Chia sẻ cảm nhận của bạn về sản phẩm này</p>
                                    <div className="flex text-yellow-400 gap-1.5 mb-5 bg-white w-fit p-2 rounded-none border border-gray-200 shadow-sm">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} onClick={() => setModalUserRating(5 - i)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill={5 - i <= modalUserRating ? "currentColor" : "none"} className="w-7 h-7 cursor-pointer transform hover:scale-110 transition-transform"><path stroke="currentColor" strokeWidth={1} d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.12 4.637c-.194.808.691 1.451 1.425 1.02L10 14.217l4.132 2.413c.734.431 1.619-.212 1.426-1.02l-1.12-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" /></svg>
                                        ))}
                                    </div>
                                    <textarea value={modalUserComment} onChange={(e) => setModalUserComment(e.target.value)} rows="3" placeholder="Sản phẩm tuyệt vời, đáng tiền..." className="w-full bg-white border border-gray-200 text-sm text-gray-800 rounded-none p-4 focus:outline-none focus:border-blue-500 transition-colors outline-none mb-4 shadow-sm"></textarea>
                                    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-none shadow-md transition-all flex items-center gap-2">Gửi Đánh Giá <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg></button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 p-6 rounded-none border border-gray-100 text-center text-gray-600 text-sm mb-12">Vui lòng <a href={`${SOCIAL_APP_URL}/auth/login`} className="text-blue-600 font-bold hover:underline">đăng nhập</a> để gửi đánh giá.</div>
                    )}

                    {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                        <div className="space-y-6">
                            {selectedProduct.reviews.map((review, idx) => (
                                <div key={review.id || idx} className="bg-gray-50 p-6 border border-gray-100 flex gap-5">
                                  <div className="w-12 h-12 bg-gray-200 flex-shrink-0 flex items-center justify-center font-bold text-gray-600 text-lg">{review.avatar || (review.name?.charAt(0).toUpperCase() || 'U')}</div>
                                    <div className="flex-1">
                                        <div className="mb-2 flex justify-between items-center">
                                            <div>
                                              <p className="font-bold text-gray-900 text-sm">{review.name || review.Name}</p>
                                              <p className="text-xs text-gray-500">{review.date || review.Date}</p>
                                            </div>
                                            <div className="flex text-yellow-400 gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill={i < (review.rating || 5) ? "currentColor" : "none"} className="w-4 h-4"><path d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.12 4.637c-.194.808.691 1.451 1.425 1.02L10 14.217l4.132 2.413c.734.431 1.619-.212 1.426-1.02l-1.12-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" /></svg>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed bg-white p-4 border border-gray-100 italic shadow-sm">"{review.comment || review.Comment}"</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-gray-50 border border-gray-100 text-gray-500 italic text-sm">Chưa có đánh giá nào cho sản phẩm này.</div>
                    )}
                  </div>

                  {/* PHẦN 4: SẢN PHẨM LIÊN QUAN */}
                  <div className="border-t border-gray-100 pt-10 mt-12 pb-6 relative group">
                    <div className="flex items-center justify-between mb-8 gap-4">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">Sản phẩm liên quan</h3>
                    </div>

                    <div className="relative group">
                        <button onClick={() => scrollRelatedCarousel('left')} className="absolute -left-4 top-[40%] -translate-y-1/2 z-20 bg-white text-gray-800 p-3 border border-gray-200 opacity-0 group-hover:opacity-100 transition-all shadow-md hover:text-blue-600 hover:bg-blue-50">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                        </button>
                        <button onClick={() => scrollRelatedCarousel('right')} className="absolute -right-4 top-[40%] -translate-y-1/2 z-20 bg-white text-gray-800 p-3 border border-gray-200 opacity-0 group-hover:opacity-100 transition-all shadow-md hover:text-blue-600 hover:bg-blue-50">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                        </button>

                        <div ref={relatedCarouselRef} className="flex gap-4 lg:gap-6 overflow-x-auto scroll-smooth pb-4 pt-2 px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {getRelatedProducts(selectedProduct.id || selectedProduct.Id).map((p) => (
                                <div key={p.id || p.Id} className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)] flex-shrink-0">
                                    <ProductCard product={p} formatPrice={formatPrice} onQuickView={handleOpenModal} />
                                </div>
                            ))}
                            {getRelatedProducts(selectedProduct.id).length === 0 && (
                                <div className="text-center py-10 w-full text-gray-500 bg-gray-50 border border-gray-100">Không có sản phẩm liên quan.</div>
                            )}
                        </div>
                    </div>
                  </div>

                </div>
            </div>
          </div>
        </div>
      , document.body)}

    </div>
  );
};

export default Catalog;