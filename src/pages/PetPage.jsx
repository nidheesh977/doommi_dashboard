import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

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

const GENDERS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
];

const PetPage = () => {
  const [pets, setPets] = useState([]);
  const [users, setUsers] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [personalityTags, setPersonalityTags] = useState([]);
  const [formData, setFormData] = useState({
    pet_owner: '',
    pet_name: '',
    pet_type: '',
    pet_image: null, // Changed to store file object
    dob: '',
    breed: '',
    personality_tag: [],
    pet_weight: '',
    track_activity: true,
    gender: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchPets();
    fetchUsers();
    fetchBreeds();
    fetchPersonalityTags();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchPets = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/pets/`);
      setPets(response.data);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch pets.';
      setError(errorMessage);
      console.error('Error fetching pets:', errorMessage);
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

  const fetchBreeds = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/breeds/`);
      setBreeds(response.data);
    } catch (err) {
      console.error('Error fetching breeds:', err);
    }
  };

  const fetchPersonalityTags = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/personality-tags/`);
      setPersonalityTags(response.data);
    } catch (err) {
      console.error('Error fetching personality tags:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setFormData({ ...formData, pet_image: file });
      if (file) {
        setImagePreview(URL.createObjectURL(file));
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    }
  };

  const handlePersonalityTagChange = (tagId) => {
    setFormData((prev) => {
      const newTags = prev.personality_tag.includes(tagId)
        ? prev.personality_tag.filter((id) => id !== tagId)
        : [...prev.personality_tag, tagId];
      return { ...prev, personality_tag: newTags };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let petImageId = formData.pet_image;

      // If a new file is selected, upload it to create a PetImage
      if (formData.pet_image instanceof File) {
        const formDataImage = new FormData();
        formDataImage.append('pet_image', formData.pet_image);
        const imageResponse = await axios.post(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/pet-images/`,
          formDataImage,
          {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        );
        petImageId = imageResponse.data.id;
      } else if (editingId) {
        // If editing and no new file, use existing pet_image ID
        petImageId = formData.pet_image;
      } else {
        throw new Error('Pet image is required for new pets.');
      }

      const dataToSend = {
        pet_owner: formData.pet_owner || null,
        pet_name: formData.pet_name,
        pet_type: formData.pet_type,
        pet_image: petImageId,
        dob: formData.dob,
        breed: formData.breed,
        personality_tag: formData.personality_tag,
        pet_weight: parseFloat(formData.pet_weight) || null,
        track_activity: formData.track_activity,
        gender: formData.gender,
      };

      if (editingId) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/pets/${editingId}/`,
          dataToSend
        );
        setSuccess('Pet updated successfully!');
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/pets/`,
          dataToSend
        );
        setSuccess('Pet created successfully!');
      }

      setFormData({
        pet_owner: '',
        pet_name: '',
        pet_type: '',
        pet_image: null,
        dob: '',
        breed: '',
        personality_tag: [],
        pet_weight: '',
        track_activity: true,
        gender: '',
      });
      setImagePreview(null);
      setEditingId(null);
      setError(null);
      setIsDropdownOpen(false);
      fetchPets();
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to save pet.';
      setError(errorMessage);
      console.error('Error saving pet:', errorMessage);
    }
  };

  const handleEdit = (pet) => {
    setFormData({
      pet_owner: pet.pet_owner || '',
      pet_name: pet.pet_name || '',
      pet_type: pet.pet_type || '',
      pet_image: pet.pet_image || null, // Store ID, not file
      dob: pet.dob || '',
      breed: pet.breed || '',
      personality_tag: pet.personality_tag || [],
      pet_weight: pet.pet_weight || '',
      track_activity: pet.track_activity,
      gender: pet.gender || '',
    });
    setImagePreview(pet.pet_image_url || null);
    setEditingId(pet.id);
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pet?')) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/pets/${id}/`
      );
      setSuccess('Pet deleted successfully!');
      setError(null);
      fetchPets();
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to delete pet.';
      setError(errorMessage);
      console.error('Error deleting pet:', errorMessage);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Pets Management</h2>
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
        <h3 className="text-lg font-semibold mb-2">{editingId ? 'Edit Pet' : 'Add New Pet'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Pet Owner</label>
            <select
              name="pet_owner"
              value={formData.pet_owner}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">None</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.phone}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pet Name</label>
            <input
              type="text"
              name="pet_name"
              value={formData.pet_name}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter pet name"
              required
            />
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
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pet Image</label>
            <input
              type="file"
              name="pet_image"
              accept="image/*"
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={!editingId} // Required for create, optional for update
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="h-24 w-24 object-cover rounded"
                />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Breed</label>
            <select
              name="breed"
              value={formData.breed}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>Select Breed</option>
              {breeds.map((breed) => (
                <option key={breed.id} value={breed.id}>{`${breed.pet_type} - ${breed.breed}`}</option>
              ))}
            </select>
          </div>
          <div ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700">Personality Tags</label>
            <div className="relative mt-1">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full p-2 border border-gray-300 rounded-md text-left bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {formData.personality_tag.length > 0
                  ? formData.personality_tag
                      .map((id) => personalityTags.find((tag) => tag.id === id)?.personality_tag)
                      .filter(Boolean)
                      .join(', ')
                  : 'Select Personality Tags'}
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {personalityTags.map((tag) => (
                    <label
                      key={tag.id}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.personality_tag.includes(tag.id)}
                        onChange={() => handlePersonalityTagChange(tag.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{tag.personality_tag}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
            <input
              type="number"
              name="pet_weight"
              value={formData.pet_weight}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter pet weight"
              step="0.1"
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="track_activity"
              checked={formData.track_activity}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">Track Activity</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>Select Gender</option>
              {GENDERS.map((gender) => (
                <option key={gender.value} value={gender.value}>{gender.label}</option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingId ? 'Update Pet' : 'Add Pet'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    pet_owner: '',
                    pet_name: '',
                    pet_type: '',
                    pet_image: null,
                    dob: '',
                    breed: '',
                    personality_tag: [],
                    pet_weight: '',
                    track_activity: true,
                    gender: '',
                  });
                  setImagePreview(null);
                  setEditingId(null);
                  setIsDropdownOpen(false);
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
              <th className="py-2 px-4 border-b text-left">Pet Name</th>
              <th className="py-2 px-4 border-b text-left">Pet Owner</th>
              <th className="py-2 px-4 border-b text-left">Pet Type</th>
              <th className="py-2 px-4 border-b text-left">Image</th>
              <th className="py-2 px-4 border-b text-left">DOB</th>
              <th className="py-2 px-4 border-b text-left">Breed</th>
              <th className="py-2 px-4 border-b text-left">Personality Tags</th>
              <th className="py-2 px-4 border-b text-left">Weight</th>
              <th className="py-2 px-4 border-b text-left">Track Activity</th>
              <th className="py-2 px-4 border-b text-left">Gender</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pets.length === 0 ? (
              <tr>
                <td colSpan="11" className="py-2 px-4 text-center text-gray-500">
                  No pets found.
                </td>
              </tr>
            ) : (
              pets.map((pet) => (
                <tr key={pet.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{pet.pet_name}</td>
                  <td className="py-2 px-4 border-b">
                    {users.find((u) => u.id === pet.pet_owner)?.phone || 'None'}
                  </td>
                  <td className="py-2 px-4 border-b">{pet.pet_type}</td>
                  <td className="py-2 px-4 border-b">
                    {pet.pet_image_url ? (
                      <a href={import.meta.env.VITE_BACKEND_DOMAIN+pet.pet_image_url} target="_blank" rel="noopener noreferrer">
                        <img
                          src={import.meta.env.VITE_BACKEND_DOMAIN+pet.pet_image_url}
                          alt={`Pet ${pet.pet_name}`}
                          className="h-12 w-12 object-cover rounded"
                        />
                      </a>
                    ) : (
                      'No Image'
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">{pet.dob}</td>
                  <td className="py-2 px-4 border-b">
                    {breeds.find((b) => b.id === pet.breed)?.breed || 'N/A'}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {pet.personality_tag
                      .map((id) => personalityTags.find((t) => t.id === id)?.personality_tag)
                      .filter(Boolean)
                      .join(', ') || 'None'}
                  </td>
                  <td className="py-2 px-4 border-b">{pet.pet_weight}</td>
                  <td className="py-2 px-4 border-b">{pet.track_activity ? 'Yes' : 'No'}</td>
                  <td className="py-2 px-4 border-b">{pet.gender}</td>
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

export default PetPage;