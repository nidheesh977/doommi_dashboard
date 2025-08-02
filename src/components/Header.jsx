import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
  const [userPhone, setUserPhone] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = Cookies.get('access_token');
    if (token) {
      setUserPhone(location.state?.userPhone || 'User');
    }
  }, [location.state]);

  const handleLogout = () => {
    Cookies.remove('access_token', { path: '/', domain: 'localhost' });
    setUserPhone(null);
    window.location.href = '/login';
  };

  return (
    <header className="bg-white p-4 flex justify-between items-center shadow">
      <div className="flex items-center">
        <button
          className="md:hidden p-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-4"
          onClick={toggleSidebar}
        >
          Menu
        </button>
        <h1 className="text-xl font-semibold">Pet Management Admin</h1>
      </div>
      <div className="flex items-center">
        {userPhone ? (
          <>
            <span className="mr-4 text-gray-700">Welcome, {userPhone}</span>
            <button
              className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <a href="/login" className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Login
          </a>
        )}
      </div>
    </header>
  );
};

export default Header;