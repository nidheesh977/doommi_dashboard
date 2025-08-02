import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReminderOptionPage = () => {
  const [options, setOptions] = useState([]);
  const [formData, setFormData] = useState({ title: '', days: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/reminder-options/`);
      setOptions(response.data);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch reminder options.';
      setError(errorMessage);
      console.error('Error fetching reminder options:', errorMessage);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'days' ? parseInt(value) || '' : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/reminder-options/${editingId}/`,
          formData
        );
        setSuccess('Reminder option updated successfully!');
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/reminder-options/`,
          formData
        );
        setSuccess('Reminder option created successfully!');
      }
      setFormData({ title: '', days: '' });
      setEditingId(null);
      setError(null);
      fetchOptions();
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to save reminder option.';
      setError(errorMessage);
      console.error('Error saving reminder option:', errorMessage);
    }
  };

  const handleEdit = (option) => {
    setFormData({ title: option.title, days: option.days });
    setEditingId(option.id);
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reminder option?')) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/reminder-options/${id}/`
      );
      setSuccess('Reminder option deleted successfully!');
      setError(null);
      fetchOptions();
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to delete reminder option.';
      setError(errorMessage);
      console.error('Error deleting reminder option:', errorMessage);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Reminder Options Management</h2>
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
        <h3 className="text-lg font-semibold mb-2">{editingId ? 'Edit Reminder Option' : 'Add New Reminder Option'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter title (e.g., One Week)"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Days</label>
            <input
              type="number"
              name="days"
              value={formData.days}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter number of days"
              required
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingId ? 'Update Option' : 'Add Option'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setFormData({ title: '', days: '' });
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
              <th className="py-2 px-4 border-b text-left">Title</th>
              <th className="py-2 px-4 border-b text-left">Days</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {options.length === 0 ? (
              <tr>
                <td colSpan="3" className="py-2 px-4 text-center text-gray-500">
                  No reminder options found.
                </td>
              </tr>
            ) : (
              options.map((option) => (
                <tr key={option.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{option.title}</td>
                  <td className="py-2 px-4 border-b">{option.days}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleEdit(option)}
                      className="mr-2 p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(option.id)}
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

export default ReminderOptionPage;