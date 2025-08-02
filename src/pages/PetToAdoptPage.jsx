import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PET_TYPES = [
  "Dog", "Cat", "Rabbit", "Bird", "Hamster", "Guinea Pig", "Turtle", "Fish", "Horse", "Lizard"
];

const PetToAdoptPage = () => {
  const [petsToAdopt, setPetsToAdopt] = useState([]);
  const [users, setUsers] = useState([]);
  const [petBreeds, setPetBreeds] = useState([]);
  const [formData, setFormData] = useState({
    user: '',
    name: '',
    age_years: '',
    age_months: '',
    pet_type: '',
    pet_breed: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    pet_image: null,
    is_adopted: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchPetsToAdopt();
    fetchUsers();
    fetchPetBreeds();
  }, []);

  const fetchPetsToAdopt = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/pet-to-adopt/`);
      setPetsToAdopt(response.data);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch pets for adoption.';
      setError(errorMessage);
      console.error('Error fetching pets for adoption:', errorMessage);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/users/`);
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchPetBreeds = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/breeds/`);
      setPetBreeds(response.data);
    } catch (err) {
      console.error('Error fetching pet breeds:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    if (type === 'file') {
      const file = files[0];
      setFormData({ ...formData, pet_image: file });
      if (file && file.type.startsWith('image/')) {
        setImagePreview(URL.createObjectURL(file));
      } else {
        setImagePreview(null);
      }
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('user', formData.user);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('age_years', formData.age_years);
      formDataToSend.append('age_months', formData.age_months);
      formDataToSend.append('pet_type', formData.pet_type);
      formDataToSend.append('pet_breed', formData.pet_breed);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('description', formData.description);
      if (formData.pet_image instanceof File) {
        formDataToSend.append('pet_image', formData.pet_image);
      }
      formDataToSend.append('is_adopted', formData.is_adopted);

      if (editingId) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/pet-to-adopt/${editingId}/`,
          formDataToSend,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setSuccess('Pet for adoption updated successfully!');
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/pet-to-adopt/`,
          formDataToSend,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setSuccess('Pet for adoption created successfully!');
      }

      setFormData({
        user: '',
        name: '',
        age_years: '',
        age_months: '',
        pet_type: '',
        pet_breed: '',
        address: '',
        phone: '',
        email: '',
        description: '',
        pet_image: null,
        is_adopted: false,
      });
      setImagePreview(null);
      setEditingId(null);
      setError(null);
      fetchPetsToAdopt();
    } catch (err) {
      const errorMessage = err.response?.data || 'Failed to save pet for adoption.';
      setError(JSON.stringify(errorMessage));
      console.error('Error saving pet for adoption:', errorMessage);
    }
  };

  const handleEdit = (petToAdopt) => {
    setFormData({
      user: petToAdopt.user || '',
      name: petToAdopt.name || '',
      age_years: petToAdopt.age_years || '',
      age_months: petToAdopt.age_months || '',
      pet_type: petToAdopt.pet_type || '',
      pet_breed: petToAdopt.pet_breed || '',
      address: petToAdopt.address || '',
      phone: petToAdopt.phone || '',
      email: petToAdopt.email || '',
      description: petToAdopt.description || '',
      pet_image: null, // File input starts empty
      is_adopted: petToAdopt.is_adopted || false,
    });
    setImagePreview(petToAdopt.pet_image_url || null);
    setEditingId(petToAdopt.id);
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pet for adoption?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/pet-to-adopt/${id}/`);
      setSuccess('Pet for adoption deleted successfully!');
      setError(null);
      fetchPetsToAdopt();
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to delete pet for adoption.';
      setError(errorMessage);
      console.error('Error deleting pet for adoption:', errorMessage);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Pets for Adoption Management</h2>
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
        <h3 className="text-lg font-semibold mb-2">{editingId ? 'Edit Pet for Adoption' : 'Add New Pet for Adoption'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">User</label>
            <select
              name="user"
              value={formData.user}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>Select User</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.phone}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter pet name"
              required
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Age (Years)</label>
              <input
                type="number"
                name="age_years"
                value={formData.age_years}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter years"
                required
                min="0"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Age (Months)</label>
              <input
                type="number"
                name="age_months"
                value={formData.age_months}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter months"
                required
                min="0"
                max="11"
              />
            </div>
          </div>
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
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pet Breed</label>
            <select
              name="pet_breed"
              value={formData.pet_breed}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>Select Breed</option>
              {petBreeds.map((breed) => (
                <option key={breed.id} value={breed.id}>{breed.breed}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter address"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
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
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pet Image</label>
            <input
              type="file"
              name="pet_image"
              accept="image/*"
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={!editingId} // Required for create, optional for edit
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Pet Image Preview"
                  className="h-24 w-24 object-cover rounded"
                />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                name="is_adopted"
                checked={formData.is_adopted}
                onChange={handleInputChange}
                className="mr-2"
              />
              Is Adopted
            </label>
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingId ? 'Update Pet for Adoption' : 'Add Pet for Adoption'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    user: '',
                    name: '',
                    age_years: '',
                    age_months: '',
                    pet_type: '',
                    pet_breed: '',
                    address: '',
                    phone: '',
                    email: '',
                    description: '',
                    pet_image: null,
                    is_adopted: false,
                  });
                  setImagePreview(null);
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
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">User</th>
              <th className="py-2 px-4 border-b text-left">Age</th>
              <th className="py-2 px-4 border-b text-left">Pet Type</th>
              <th className="py-2 px-4 border-b text-left">Breed</th>
              <th className="py-2 px-4 border-b text-left">Address</th>
              <th className="py-2 px-4 border-b text-left">Phone</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">Description</th>
              <th className="py-2 px-4 border-b text-left">Image</th>
              <th className="py-2 px-4 border-b text-left">Adopted</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {petsToAdopt.length === 0 ? (
              <tr>
                <td colSpan="12" className="py-2 px-4 text-center text-gray-500">
                  No pets for adoption found.
                </td>
              </tr>
            ) : (
              petsToAdopt.map((pet) => (
                <tr key={pet.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{pet.name}</td>
                  <td className="py-2 px-4 border-b">
                    {users.find((u) => u.id === pet.user)?.phone || 'N/A'}
                  </td>
                  <td className="py-2 px-4 border-b">{pet.age_years}y {pet.age_months}m</td>
                  <td className="py-2 px-4 border-b">{pet.pet_type}</td>
                  <td className="py-2 px-4 border-b">
                    {petBreeds.find((b) => b.id === pet.pet_breed)?.breed || 'N/A'}
                  </td>
                  <td className="py-2 px-4 border-b">{pet.address}</td>
                  <td className="py-2 px-4 border-b">{pet.phone}</td>
                  <td className="py-2 px-4 border-b">{pet.email}</td>
                  <td className="py-2 px-4 border-b">{pet.description || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">
                    {pet.pet_image_url ? (
                      <img
                        src={import.meta.env.VITE_BACKEND_DOMAIN+pet.pet_image_url}
                        alt="Pet"
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      'No Image'
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">{pet.is_adopted ? 'Yes' : 'No'}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleEdit(pet)}
                      className="mr-2 p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pet.id)}
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

export default PetToAdoptPage;