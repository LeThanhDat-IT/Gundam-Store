import { createContext, useState, useEffect } from 'react';
import axiosClient from '../../../config/axiosClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAuth = async () => {
      setLoading(true);

      // 1. Quét tìm token trên thanh URL
      const urlString = window.location.href;
      const tokenMatch = urlString.match(/token=\s*([^&/#]+)/);
      let tokenFromUrl = tokenMatch ? tokenMatch[1] : null;

      // 2. Nếu có token trên URL -> Cất vào localStorage và dọn dẹp URL
      if (tokenFromUrl) {
        tokenFromUrl = decodeURIComponent(tokenFromUrl).trim();
        localStorage.setItem('token', tokenFromUrl);
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      // 3. Lấy token ra xài
      const savedToken = localStorage.getItem('token');
      if (!savedToken) {
        localStorage.removeItem('user');
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await axiosClient.get('/me', {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });

        const currentUser = response.data?.data ?? response.data;

        setUser({
          ...currentUser,
          token: savedToken,
        });
        localStorage.setItem('user', JSON.stringify(currentUser));
      } catch (error) {
        console.error('❌ Không lấy được user hiện tại từ /me:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
      }

      setLoading(false);
    };

    fetchUserAuth();
  }, []);

  // Hàm Đăng xuất
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/'; 
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};