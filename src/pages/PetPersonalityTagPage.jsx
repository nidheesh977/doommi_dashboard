import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const PetPersonalityTagPage = () => {
  const [tags, setTags] = useState([]);
  const [formData, setFormData] = useState({ personality_tag: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/personality-tags/`);
      setTags(response.data);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.status === 403
        ? 'Access forbidden. Please check your authentication token.'
        : err.response?.data?.detail || 'Failed to fetch personality tags.';
      setError(errorMessage);
      console.error('Error fetching personality tags:', errorMessage);
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
        // Update existing tag
        await axios.put(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/personality-tags/${editingId}/`,
          formData
        );
        setSuccess('Personality tag updated successfully!');
      } else {
        // Create new tag
        await axios.post(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/personality-tags/`,
          formData);
        setSuccess('Personality tag created successfully!');
      }
      setFormData({ personality_tag: '' });
      setEditingId(null);
      setError(null);
      fetchTags(); // Refresh the list
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to save personality tag.';
      setError(errorMessage);
      console.error('Error saving personality tag:', errorMessage);
    }
  };

  const handleEdit = (tag) => {
    setFormData({ personality_tag: tag.personality_tag });
    setEditingId(tag.id);
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this personality tag?')) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/personality-tags/${id}/`);
      setSuccess('Personality tag deleted successfully!');
      setError(null);
      fetchTags(); // Refresh the list
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to delete personality tag.';
      setError(errorMessage);
      console.error('Error deleting personality tag:', errorMessage);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Pet Personality Tags Management</h2>

      {/* Error and Success Messages */}
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

      {/* Form for Creating/Editing */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">{editingId ? 'Edit Personality Tag' : 'Add New Personality Tag'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Personality Tag</label>
            <input
              type="text"
              name="personality_tag"
              value={formData.personality_tag}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter personality tag (e.g., Friendly, Playful)"
              required
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingId ? 'Update Tag' : 'Add Tag'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setFormData({ personality_tag: '' });
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

      {/* Table for Listing Tags */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Personality Tag</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tags.length === 0 ? (
              <tr>
                <td colSpan="2" className="py-2 px-4 text-center text-gray-500">
                  No personality tags found.
                </td>
              </tr>
            ) : (
              tags.map((tag) => (
                <tr key={tag.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{tag.personality_tag}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleEdit(tag)}
                      className="mr-2 p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tag.id)}
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

export default PetPersonalityTagPage;