import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DewormingFrequencyPage = () => {
  const [frequencies, setFrequencies] = useState([]);
  const [formData, setFormData] = useState({ frequency: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchFrequencies();
  }, []);

  const fetchFrequencies = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/deworming-frequencies/`, );
      setFrequencies(response.data);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch deworming frequencies.';
      setError(errorMessage);
      console.error('Error fetching deworming frequencies:', errorMessage);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/deworming-frequencies/${editingId}/`,
          formData
        );
        setSuccess('Deworming frequency updated successfully!');
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/deworming-frequencies/`,
          formData
        );
        setSuccess('Deworming frequency created successfully!');
      }
      setFormData({ frequency: '' });
      setEditingId(null);
      setError(null);
      fetchFrequencies();
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to save deworming frequency.';
      setError(errorMessage);
      console.error('Error saving deworming frequency:', errorMessage);
    }
  };

  const handleEdit = (frequency) => {
    setFormData({ frequency: frequency.frequency });
    setEditingId(frequency.id);
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this deworming frequency?')) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/deworming-frequencies/${id}/`
      );
      setSuccess('Deworming frequency deleted successfully!');
      setError(null);
      fetchFrequencies();
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to delete deworming frequency.';
      setError(errorMessage);
      console.error('Error deleting deworming frequency:', errorMessage);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Deworming Frequencies Management</h2>
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
        <h3 className="text-lg font-semibold mb-2">{editingId ? 'Edit Deworming Frequency' : 'Add New Deworming Frequency'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Frequency</label>
            <input
              type="text"
              name="frequency"
              value={formData.frequency}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter frequency (e.g., Monthly)"
              required
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingId ? 'Update Frequency' : 'Add Frequency'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setFormData({ frequency: '' });
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
              <th className="py-2 px-4 border-b text-left">Frequency</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {frequencies.length === 0 ? (
              <tr>
                <td colSpan="2" className="py-2 px-4 text-center text-gray-500">
                  No deworming frequencies found.
                </td>
              </tr>
            ) : (
              frequencies.map((frequency) => (
                <tr key={frequency.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{frequency.frequency}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleEdit(frequency)}
                      className="mr-2 p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(frequency.id)}
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

export default DewormingFrequencyPage;