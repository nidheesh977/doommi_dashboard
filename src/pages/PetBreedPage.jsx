import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const PET_TYPES = [
  { value: 'Dog', label: 'Dog' },
  { value: 'Cat', label: 'Cat' },
  { value: 'Rabbit', label: 'Rabbit' },
  { value: 'Bird', label: 'Bird' },
  { value: 'Hamster', label: 'Hamster' },
  { value: 'Guinea Pig', label: 'Guinea Pig' },
  { value: 'Turtle', label: 'Turtle' },
  { value: 'Fish', label: 'Fish' },
  { value: 'Horse', label: 'Horse' },
  { value: 'Lizard', label: 'Lizard' },
];

const PetBreedPage = () => {
  const [breeds, setBreeds] = useState([]);
  const [formData, setFormData] = useState({ pet_type: '', breed: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchBreeds();
  }, []);

  const fetchBreeds = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/breeds/`);
      setBreeds(response.data);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.status === 403
        ? 'Access forbidden. Please check your authentication token.'
        : err.response?.data?.detail || 'Failed to fetch pet breeds.';
      setError(errorMessage);
      console.error('Error fetching pet breeds:', errorMessage);
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
        // Update existing breed
        await axios.put(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/breeds/${editingId}/`,
          formData,{}
        );
        setSuccess('Pet breed updated successfully!');
      } else {
        // Create new breed
        await axios.post(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/breeds/`,
          formData, {}
        );
        setSuccess('Pet breed created successfully!');
      }
      setFormData({ pet_type: '', breed: '' });
      setEditingId(null);
      setError(null);
      fetchBreeds(); // Refresh the list
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to save pet breed.';
      setError(errorMessage);
      console.error('Error saving pet breed:', errorMessage);
    }
  };

  const handleEdit = (breed) => {
    setFormData({ pet_type: breed.pet_type, breed: breed.breed });
    setEditingId(breed.id);
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pet breed?')) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/breeds/${id}/`
      );
      setSuccess('Pet breed deleted successfully!');
      setError(null);
      fetchBreeds(); // Refresh the list
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to delete pet breed.';
      setError(errorMessage);
      console.error('Error deleting pet breed:', errorMessage);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Pet Breeds Management</h2>

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
        <h3 className="text-lg font-semibold mb-2">{editingId ? 'Edit Pet Breed' : 'Add New Pet Breed'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Pet Type</label>
            <select
              name="pet_type"
              value={formData.pet_type}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>Select Pet Type</option>
              {PET_TYPES.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Breed</label>
            <input
              type="text"
              name="breed"
              value={formData.breed}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter breed name"
              required
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingId ? 'Update Breed' : 'Add Breed'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setFormData({ pet_type: '', breed: '' });
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

      {/* Table for Listing Breeds */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Pet Type</th>
              <th className="py-2 px-4 border-b text-left">Breed</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {breeds.length === 0 ? (
              <tr>
                <td colSpan="3" className="py-2 px-4 text-center text-gray-500">
                  No pet breeds found.
                </td>
              </tr>
            ) : (
              breeds.map((breed) => (
                <tr key={breed.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{breed.pet_type}</td>
                  <td className="py-2 px-4 border-b">{breed.breed}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleEdit(breed)}
                      className="mr-2 p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(breed.id)}
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

export default PetBreedPage;