import React, { useState, useEffect } from 'react';
import axios from 'axios';

const USER_TYPES = [
  { value: 'petParent', label: 'Pet Parent' },
  { value: 'lookingAdoption', label: 'Looking to adopt only' },
  { value: 'ngo', label: 'NGO or Shelter' },
];

const CustomUserPage = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ phone: '', user_type: '', is_active: true, is_admin: false, password: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/users/`);
      setUsers(response.data);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch users.';
      setError(errorMessage);
      console.error('Error fetching users:', errorMessage);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData };
      if (!dataToSend.password) delete dataToSend.password; // Omit password if empty
      if (editingId) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/users/${editingId}/`,
          dataToSend
        );
        setSuccess('User updated successfully!');
      } else {
        if (!dataToSend.password) {
          setError('Password is required for creating a new user.');
          return;
        }
        await axios.post(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/users/`,
          dataToSend
        );
        setSuccess('User created successfully!');
      }
      setFormData({ phone: '', user_type: '', is_active: true, is_admin: false, password: '' });
      setEditingId(null);
      setError(null);
      fetchUsers();
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to save user.';
      setError(errorMessage);
      console.error('Error saving user:', errorMessage);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      phone: user.phone,
      user_type: user.user_type || '',
      is_active: user.is_active,
      is_admin: user.is_admin,
      password: '',
    });
    setEditingId(user.id);
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/users/${id}/`
      );
      setSuccess('User deleted successfully!');
      setError(null);
      fetchUsers();
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to delete user.';
      setError(errorMessage);
      console.error('Error deleting user:', errorMessage);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Users Management</h2>
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          {success}
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">{editingId ? 'Edit User' : 'Add New User'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">User Type</label>
            <select
              name="user_type"
              value={formData.user_type}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select User Type</option>
              {USER_TYPES.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={editingId ? 'Enter new password (optional)' : 'Enter password'}
              required={!editingId}
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">Is Active</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_admin"
              checked={formData.is_admin}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">Is Admin</label>
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingId ? 'Update User' : 'Add User'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setFormData({ phone: '', user_type: '', is_active: true, is_admin: false, password: '' });
                  setEditingId(null);
                }}
                className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Phone</th>
              <th className="py-2 px-4 border-b text-left">User Type</th>
              <th className="py-2 px-4 border-b text-left">Active</th>
              <th className="py-2 px-4 border-b text-left">Admin</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-2 px-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{user.phone}</td>
                  <td className="py-2 px-4 border-b">{USER_TYPES.find(type => type.value === user.user_type)?.label || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{user.is_active ? 'Yes' : 'No'}</td>
                  <td className="py-2 px-4 border-b">{user.is_admin ? 'Yes' : 'No'}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleEdit(user)}
                      className="mr-2 p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomUserPage;