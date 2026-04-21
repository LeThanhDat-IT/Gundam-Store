import { useState, useMemo, useEffect } from 'react';

export const useProducts = (initialProducts = []) => {
  const [activeSubcategory, setActiveSubcategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [priceRange, setPriceRange] = useState('all'); 
  const [inStockOnly, setInStockOnly] = useState(false);
  
  // STATE MỚI: Quản lý Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // 20 Sản phẩm 1 trang

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (searchQuery.trim() !== '') result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (activeSubcategory !== 'all') result = result.filter(p => p.subcategory_id === activeSubcategory);
    if (inStockOnly) result = result.filter(p => p.stock > 0);
    
    if (priceRange === 'under500') result = result.filter(p => p.price < 500000);
    else if (priceRange === '500-1m') result = result.filter(p => p.price >= 500000 && p.price <= 1000000);
    else if (priceRange === 'over1m') result = result.filter(p => p.price > 1000000);

    if (sortOrder === 'price_asc') result.sort((a, b) => a.price - b.price);
    else if (sortOrder === 'price_desc') result.sort((a, b) => b.price - a.price);

    return result;
  }, [initialProducts, activeSubcategory, searchQuery, sortOrder, priceRange, inStockOnly]);

  // Tự động quay về Trang 1 nếu thay đổi bộ lọc tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSubcategory, searchQuery, sortOrder, priceRange, inStockOnly]);

  // Logic cắt mảng để lấy 20 sản phẩm cho trang hiện tại
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return { 
    filteredProducts,       // Tổng số SP tìm được (dùng để đếm)
    paginatedProducts,      // 20 SP của trang hiện tại (dùng để render)
    activeSubcategory, setActiveSubcategory,
    searchQuery, setSearchQuery,
    sortOrder, setSortOrder,
    priceRange, setPriceRange,
    inStockOnly, setInStockOnly,
    currentPage, setCurrentPage,
    totalPages
  };
};