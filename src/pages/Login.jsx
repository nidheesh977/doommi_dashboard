import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ phone: '', otp: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/user/login/`,
        { phone: formData.phone, otp: formData.otp },
        { withCredentials: true }
      );
      // Backend sets access_token cookie
      setError(null);
      navigate('/', { state: { userPhone: response.data.user.phone } });
    } catch (error) {
      const errorMessage = error.response?.data?.otp?.[0] || 'Login failed. Please check your phone number and OTP.';
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded focus:border-blue-500 focus:ring focus:ring-blue-200"
            placeholder="Enter phone number"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">OTP</label>
          <input
            type="text"
            name="otp"
            value={formData.otp}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded focus:border-blue-500 focus:ring focus:ring-blue-200"
            placeholder="Enter OTP (1234)"
          />
        </div>
        <button
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;