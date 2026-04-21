import { useContext, useState, useEffect, useRef } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../features/auth/context/AuthContext'; 
import { useCartContext } from '../../features/cart/context/CartContext';

const API_BASE_URL = 'http://localhost:5045';

const SimpleLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems, totalItems, totalPrice, removeItem, cartNotice, setCartNotice } = useCartContext();
  const navigate = useNavigate();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [categories, setCategories] = useState([]);
  
  const dropdownRef = useRef(null);
  const cartButtonRef = useRef(null);
  const cartNoticeTimerRef = useRef(null);
  const [cartNoticePosition, setCartNoticePosition] = useState({ left: 0, top: 0, arrowLeft: 0 });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/categories`);
        let fetchedData = res.data?.data || res.data;
        if (Array.isArray(fetchedData)) {
          setCategories(fetchedData);
        }
      } catch (error) {
        console.error("Không thể tải danh mục cho Menu:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isNotifOpen || isMobileMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }, [isNotifOpen, isMobileMenuOpen]);

  useEffect(() => {
    if (cartNoticeTimerRef.current) {
      clearTimeout(cartNoticeTimerRef.current);
      cartNoticeTimerRef.current = null;
    }

    if (cartNotice) {
      cartNoticeTimerRef.current = setTimeout(() => {
        setCartNotice(null);
      }, 3000);
    }

    return () => {
      if (cartNoticeTimerRef.current) {
        clearTimeout(cartNoticeTimerRef.current);
      }
    };
  }, [cartNotice, setCartNotice]);

  useEffect(() => {
    if (!cartNotice || !cartButtonRef.current) {
      return undefined;
    }

    const updateCartNoticePosition = () => {
      const buttonRect = cartButtonRef.current?.getBoundingClientRect();
      if (!buttonRect) {
        return;
      }

      const noticeWidth = 360;
      const viewportPadding = 16;
      const buttonCenterX = buttonRect.left + buttonRect.width / 2;
      const desiredLeft = buttonCenterX - noticeWidth / 2;
      const left = Math.min(
        Math.max(desiredLeft, viewportPadding),
        window.innerWidth - noticeWidth - viewportPadding,
      );
      const arrowLeft = Math.min(
        Math.max(buttonCenterX - left - 10, 44),
        noticeWidth - 44,
      );

      setCartNoticePosition({
        left,
        top: buttonRect.bottom + 12,
        arrowLeft,
      });
    };

    updateCartNoticePosition();

    window.addEventListener('resize', updateCartNoticePosition);
    window.addEventListener('scroll', updateCartNoticePosition, true);

    return () => {
      window.removeEventListener('resize', updateCartNoticePosition);
      window.removeEventListener('scroll', updateCartNoticePosition, true);
    };
  }, [cartNotice]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setShowScrollTop(window.scrollY > 300);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeCartNotice = () => {
    setCartNotice(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col relative selection:bg-blue-200 selection:text-blue-900">

      {/* ================= HEADER ================= */}
      <header className={`fixed w-full top-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 border-b border-orange-300 shadow-lg shadow-orange-500/10' : 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 border-b border-orange-300 shadow-md shadow-orange-500/10'}`}>
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-4">
          
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-slate-600 hover:text-blue-600 p-2 -ml-2 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" /></svg>
          </button>

          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <span className="text-xl sm:text-[28px] font-black italic tracking-tight text-white uppercase transition-colors duration-300 drop-shadow-sm">
              GUNDAM<span className="text-amber-100 ml-1 group-hover:text-white transition-colors">STORES</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[14px] font-bold text-white/90 uppercase tracking-wide h-full whitespace-nowrap flex-1 justify-center">
            <Link to="/" className="hover:text-white transition-colors h-full flex items-center border-b-2 border-transparent hover:border-white/80">Trang chủ</Link>
            
            <div className="relative group h-full flex items-center cursor-pointer">
              <Link to="/shop" className="hover:text-white transition-colors flex items-center gap-1 border-b-2 border-transparent group-hover:border-white/80 h-full">
                Sản phẩm
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-300"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
              </Link>
              
              <div className="absolute top-full left-0 w-64 bg-white border border-gray-100 rounded-none shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 overflow-hidden mt-1">
                <div className="py-2">
                  <Link to="/shop" className="block px-6 py-3 text-sm text-blue-600 hover:bg-blue-50 transition-colors font-bold normal-case tracking-normal border-b border-gray-100">
                     Tất cả sản phẩm
                  </Link>
                  {/* TRUYỀN ID DANH MỤC VÀO URL KHI CLICK (DESKTOP) */}
                  {categories.length > 0 ? (
                    categories.map(cat => (
                      <Link 
                        key={cat.id || cat.Id} 
                        to={`/shop?categoryId=${cat.id || cat.Id}`} 
                        className="block px-6 py-3 text-sm text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors font-semibold normal-case tracking-normal"
                      >
                        {cat.name || cat.Name}
                      </Link>
                    ))
                  ) : (
                    <span className="block px-6 py-4 text-sm text-slate-400 italic">Đang tải danh mục...</span>
                  )}
                </div>
              </div>
            </div>

            <Link to="/contact" className="hover:text-white transition-colors h-full flex items-center border-b-2 border-transparent hover:border-white/80">Liên hệ</Link>

            <a href="http://localhost:3000/social" className="hover:text-white transition-colors h-full flex items-center gap-1.5 group relative border-b-2 border-transparent hover:border-white/80">
              <span className="font-bold tracking-wide">GUNVERSE</span>
              <span className="absolute top-4 -right-6 bg-white text-orange-600 text-[9px] px-1.5 py-0.5 rounded-none font-black animate-pulse shadow-sm">SOCIAL</span>
            </a>
          </nav>

          <div className="flex items-center gap-3 xl:gap-5 flex-shrink-0">
            <form onSubmit={handleSearch} className="hidden md:flex relative group w-48 lg:w-64">
              <input type="text" placeholder="Tìm sản phẩm..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white/95 border border-white/30 text-sm text-slate-800 rounded-none pl-5 pr-10 py-2.5 focus:outline-none focus:bg-white focus:border-white focus:ring-2 focus:ring-white/40 transition-all shadow-sm"/>
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-200 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
              </button>
            </form>

            <div className="h-5 w-px bg-white/30 hidden lg:block"></div>

            <button onClick={() => setIsNotifOpen(true)} className="relative text-white/90 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
              <span className="absolute top-0 right-0.5 bg-white w-2.5 h-2.5 rounded-none border-2 border-orange-500 animate-pulse"></span>
            </button>

            <button
              ref={cartButtonRef}
              onClick={() => {
                if (cartItems.length === 0) {
                  navigate('/cart');
                  return;
                }

                setCartNotice({
                  id: `view-${Date.now()}`,
                  product: cartItems[0],
                  quantity: totalItems,
                  mode: 'view',
                });
              }}
              className="relative text-white hover:text-white transition-colors mr-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-white text-orange-600 text-[10px] font-black h-[18px] min-w-[18px] flex items-center justify-center rounded-none px-1 shadow-sm border border-orange-200">
                  {totalItems}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative z-50 ml-1" ref={dropdownRef}>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center focus:outline-none">
                  <div className="w-9 h-9 rounded-none bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                    {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-none shadow-xl py-2 overflow-hidden animate-fade-in origin-top-right">
                    <div className="px-5 py-4 border-b border-gray-100 bg-slate-50">
                      <p className="text-sm font-bold text-slate-800 line-clamp-1">{user.username || 'Học viên'}</p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{user.email || user.role}</p>
                    </div>
                    <div className="py-2">
                      <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="block px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">Hồ sơ cá nhân</Link>
                      <Link to="/orders" onClick={() => setIsDropdownOpen(false)} className="block px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">Lịch sử đơn hàng</Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={() => setIsDropdownOpen(false)} className="block px-5 py-2.5 text-sm font-semibold text-orange-500 hover:bg-orange-50 transition-colors mt-1">Trang Quản Trị</Link>
                      )}
                    </div>
                    <button onClick={() => { setIsDropdownOpen(false); logout(); }} className="w-full text-left px-5 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100">Đăng xuất</button>
                  </div>
                )}
              </div>
            ) : (
              <a href="http://localhost:3000/auth/login" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-none uppercase text-xs font-bold transition-all shadow-md hover:shadow-lg hover:shadow-orange-500/30 whitespace-nowrap ml-2">Đăng nhập</a>
            )}
          </div>
        </div>
      </header>

      <div className="h-16 md:h-20"></div>

      {/* LỚP PHỦ MỜ */}
      {(isNotifOpen || isMobileMenuOpen || cartNotice) && (
        <div className="fixed inset-x-0 top-16 md:top-20 bottom-0 bg-slate-900/35 z-50 transition-opacity" onClick={() => { setIsNotifOpen(false); setIsMobileMenuOpen(false); setCartNotice(null); }}></div>
      )}

      {/* CART NOTICE */}
      {cartNotice && (
        <div
          className="fixed z-[70] w-[360px] max-w-[calc(100vw-2rem)] animate-[fade-in_0.2s_ease-out]"
          style={{ top: `${cartNoticePosition.top}px`, left: `${cartNoticePosition.left}px` }}
        >
          <div
            className="absolute -top-2 h-4 w-4 rotate-45 border-l border-t border-orange-100 bg-white shadow-[-2px_-2px_6px_rgba(15,23,42,0.05)]"
            style={{ left: `${cartNoticePosition.arrowLeft}px` }}
          ></div>
          <div className="rounded-none border border-orange-100 bg-white shadow-[0_22px_45px_rgba(15,23,42,0.18)] overflow-hidden relative">
            <div className="flex items-center justify-between px-5 py-3 border-b border-orange-50 bg-gradient-to-r from-orange-50 to-white">
              <h3 className="text-[15px] font-bold text-slate-800 uppercase tracking-wide">Giỏ hàng</h3>
              <button onClick={closeCartNotice} className="text-slate-400 hover:text-slate-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="px-5 py-4">
              <div className="flex gap-4 items-start mb-4">
                <div className="w-16 h-16 rounded-none border border-gray-200 bg-white overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {cartNotice.product?.images?.length > 0 ? (
                    <img src={cartNotice.product.images[0]} alt={cartNotice.product.name || cartNotice.product.Name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-[10px] text-slate-400">No Image</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-slate-900 line-clamp-2 leading-snug">
                    {cartNotice.product?.name || cartNotice.product?.Name}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    {cartNotice.mode === 'updated'
                      ? 'Đã tăng số lượng trong giỏ'
                      : cartNotice.mode === 'view'
                        ? `Hiện có ${totalItems} sản phẩm trong giỏ`
                        : 'Đã thêm vào giỏ hàng'}
                  </p>
                </div>
              </div>

              <div className={`space-y-3 ${cartItems.length > 2 ? 'max-h-[164px] overflow-y-auto pr-2' : ''}`}>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-none border border-gray-100 bg-slate-50 px-3 py-2.5">
                    <div className="w-12 h-12 rounded-none border border-gray-200 bg-white overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {item.images?.length > 0 ? (
                        <img src={item.images[0]} alt={item.name || item.Name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-[9px] text-slate-400">No Image</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {item.name || item.Name}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                          <span className="inline-flex items-center rounded-none bg-blue-50 px-2 py-0.5 font-bold text-blue-700 border border-blue-100">
                          SL: {item.quantity}
                        </span>
                        <span className="font-semibold text-orange-500">
                          {formatPrice(item.price || item.Price || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => { closeCartNotice(); navigate('/cart'); }}
                  className="flex-1 py-3 rounded-none bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors"
                >
                  Xem giỏ hàng
                </button>
                <button
                  onClick={() => { closeCartNotice(); navigate('/checkout'); }}
                  className="flex-1 py-3 rounded-none border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-bold transition-colors"
                >
                  Thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER MENU MOBILE */}
      <div className={`fixed top-0 left-0 h-full w-[280px] bg-white shadow-2xl z-[60] transform transition-transform duration-300 ease-out flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-slate-50">
           <span className="text-xl font-black italic tracking-tight text-blue-600 uppercase">
              GUNDAM<span className="text-orange-500 ml-1">STORES</span>
           </span>
           <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-slate-700 bg-white p-1.5 rounded-none shadow-sm border border-gray-100"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5 space-y-2">
          <form onSubmit={handleSearch} className="relative mb-6">
            <input type="text" placeholder="Tìm kiếm..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-100 border border-transparent text-sm text-slate-800 rounded-none pl-4 pr-10 py-3 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"/>
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg></button>
          </form>

          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block p-3 text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-none transition-colors">Trang chủ</Link>
          
          <div className="p-3">
             <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Danh mục sản phẩm</span>
             <div className="space-y-1">
                <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="block py-2.5 px-3 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-none">Tất cả sản phẩm</Link>
                {/* TRUYỀN ID DANH MỤC VÀO URL KHI CLICK (MOBILE) */}
                {categories.map(cat => (
                  <Link 
                    key={cat.id || cat.Id} 
                    to={`/shop?categoryId=${cat.id || cat.Id}`} 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="block py-2.5 px-3 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-none"
                  >
                    {cat.name || cat.Name}
                  </Link>
                ))}
             </div>
          </div>

          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block p-3 text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-none transition-colors">Liên hệ</Link>
        </div>
      </div>

      {/* DRAWER THÔNG BÁO */}
      <div className={`fixed top-0 right-0 h-full w-[300px] sm:w-[350px] bg-white shadow-2xl z-[60] transform transition-transform duration-300 ease-out flex flex-col ${isNotifOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">Thông báo</h2>
          <button onClick={() => setIsNotifOpen(false)} className="text-slate-400 hover:text-slate-700 bg-white p-1.5 rounded-none shadow-sm border border-gray-100"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <div className="flex-1 p-6 flex flex-col items-center justify-center bg-white">
          <div className="w-16 h-16 rounded-none bg-slate-100 flex items-center justify-center mb-4"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-400"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg></div>
          <p className="text-slate-500 text-sm font-medium">Bạn chưa có thông báo nào.</p>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-grow w-full flex flex-col items-center relative z-10">
        <div className="w-full">
           <Outlet /> 
        </div>
      </main>
      
      {/* ================= FOOTER ================= */}
      <footer className="mt-auto border-t border-gray-200 bg-white pt-16 pb-8 w-full">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          <div className="space-y-4">
            <Link to="/" className="inline-block mb-1 group">
              <span className="text-2xl font-black italic tracking-tight text-blue-600 uppercase">
                GUNDAM<span className="text-orange-500 ml-1 group-hover:text-orange-400 transition-colors">STORES</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">Khám phá thế giới Gunpla và các mô hình, khóa học đa dạng. Giao diện trực quan, trải nghiệm mua sắm tuyệt vời.</p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-none bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-colors">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-none bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-white transition-colors">
                 <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[13px] font-bold uppercase text-slate-900 mb-5">Danh Mục</h4>
            <ul className="space-y-3 text-sm text-slate-500 font-medium">
              <li className="hover:text-blue-600 transition-colors cursor-pointer w-fit">Sản phẩm nổi bật</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer w-fit">Khóa học kỹ năng</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer w-fit">Pre-order</li>
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-bold uppercase text-slate-900 mb-5">Hỗ Trợ</h4>
            <ul className="space-y-3 text-sm text-slate-500 font-medium">
              <li className="hover:text-blue-600 transition-colors cursor-pointer w-fit">Chính sách bảo hành</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer w-fit">Vận chuyển & Giao nhận</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer w-fit">Liên hệ chúng tôi</li>
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-bold uppercase text-slate-900 mb-5">Đăng ký nhận tin</h4>
            <p className="text-slate-500 text-xs mb-3">Nhận thông tin cập nhật mới nhất về sản phẩm và khuyến mãi.</p>
            <div className="flex bg-slate-50 border border-gray-200 rounded-none overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <input type="email" placeholder="Email của bạn" className="w-full bg-transparent py-2.5 px-3 text-sm text-slate-800 focus:outline-none"/>
              <button className="px-4 bg-blue-600 text-white text-xs font-bold uppercase hover:bg-blue-700 transition-colors">Gửi</button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 px-4 lg:px-8 max-w-[1280px] mx-auto text-xs font-medium text-slate-400">
          <p>© 2026 GUNDAM STORES. All rights reserved.</p>
          <div className="flex gap-4">
             <span className="cursor-pointer hover:text-slate-600">Điều khoản dịch vụ</span>
             <span className="cursor-pointer hover:text-slate-600">Chính sách bảo mật</span>
          </div>
        </div>
      </footer>

      {/* NÚT SCROLL TO TOP MÀU XANH */}
      <button onClick={scrollToTop} className={`fixed bottom-6 right-6 z-[45] p-3 bg-blue-600 text-white rounded-none shadow-lg shadow-blue-600/30 hover:bg-orange-500 hover:shadow-orange-500/30 hover:-translate-y-1 transition-all duration-300 ${showScrollTop ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-4 invisible'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
      </button>

    </div>
  );
};

export default SimpleLayout;