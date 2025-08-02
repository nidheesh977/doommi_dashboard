import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NGOAccountPage = () => {
  const [ngoAccounts, setNGOAccounts] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    user: '',
    ngo_name: '',
    contact_name: '',
    email: '',
    phone: '',
    registration_proof: null,
    address: '',
    pincode: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    fetchNGOAccounts();
    fetchUsers();
  }, []);

  const fetchNGOAccounts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/ngo-accounts/`);
      setNGOAccounts(response.data);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch NGO accounts.';
      setError(errorMessage);
      console.error('Error fetching NGO accounts:', errorMessage);
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

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setFormData({ ...formData, registration_proof: file });
      if (file && file.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(file));
      } else {
        setFilePreview(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('user', formData.user);
      formDataToSend.append('ngo_name', formData.ngo_name);
      formDataToSend.append('contact_name', formData.contact_name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      if (formData.registration_proof instanceof File) {
        formDataToSend.append('registration_proof', formData.registration_proof);
      } else if (!editingId) {
        formDataToSend.append('registration_proof', ''); // Ensure empty string for null
      }
      formDataToSend.append('address', formData.address);
      formDataToSend.append('pincode', formData.pincode);

      if (editingId) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/ngo-accounts/${editingId}/`,
          formDataToSend,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setSuccess('NGO Account updated successfully!');
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/ngo-accounts/`,
          formDataToSend,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setSuccess('NGO Account created successfully!');
      }

      setFormData({
        user: '',
        ngo_name: '',
        contact_name: '',
        email: '',
        phone: '',
        registration_proof: null,
        address: '',
        pincode: '',
      });
      setFilePreview(null);
      setEditingId(null);
      setError(null);
      fetchNGOAccounts();
    } catch (err) {
      const errorMessage = err.response?.data || 'Failed to save NGO account.';
      setError(JSON.stringify(errorMessage));
      console.error('Error saving NGO account:', errorMessage);
    }
  };

  const handleEdit = (ngo) => {
    setFormData({
      user: ngo.user || '',
      ngo_name: ngo.ngo_name || '',
      contact_name: ngo.contact_name || '',
      email: ngo.email || '',
      phone: ngo.phone || '',
      registration_proof: null, // File input starts empty
      address: ngo.address || '',
      pincode: ngo.pincode || '',
    });
    setFilePreview(ngo.registration_proof_url || null);
    setEditingId(ngo.id);
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this NGO account?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/ngo-accounts/${id}/`);
      setSuccess('NGO Account deleted successfully!');
      setError(null);
      fetchNGOAccounts();
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to delete NGO account.';
      setError(errorMessage);
      console.error('Error deleting NGO account:', errorMessage);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">NGO Accounts Management</h2>
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
        <h3 className="text-lg font-semibold mb-2">{editingId ? 'Edit NGO Account' : 'Add New NGO Account'}</h3>
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
            <label className="block text-sm font-medium text-gray-700">NGO Name</label>
            <input
              type="text"
              name="ngo_name"
              value={formData.ngo_name}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter NGO name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Name</label>
            <input
              type="text"
              name="contact_name"
              value={formData.contact_name}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter contact name"
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
            <label className="block text-sm font-medium text-gray-700">Registration Proof</label>
            <input
              type="file"
              name="registration_proof"
              accept="*/*"
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {filePreview && (
              <div className="mt-2">
                <img
                  src={filePreview}
                  alt="Registration Proof Preview"
                  className="h-24 w-24 object-cover rounded"
                  onError={() => setFilePreview(null)}
                />
              </div>
            )}
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
            <label className="block text-sm font-medium text-gray-700">Pincode</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter pincode"
              required
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingId ? 'Update NGO Account' : 'Add NGO Account'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    user: '',
                    ngo_name: '',
                    contact_name: '',
                    email: '',
                    phone: '',
                    registration_proof: null,
                    address: '',
                    pincode: '',
                  });
                  setFilePreview(null);
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
              <th className="py-2 px-4 border-b text-left">NGO Name</th>
              <th className="py-2 px-4 border-b text-left">User</th>
              <th className="py-2 px-4 border-b text-left">Contact Name</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">Phone</th>
              <th className="py-2 px-4 border-b text-left">Registration Proof</th>
              <th className="py-2 px-4 border-b text-left">Address</th>
              <th className="py-2 px-4 border-b text-left">Pincode</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ngoAccounts.length === 0 ? (
              <tr>
                <td colSpan="9" className="py-2 px-4 text-center text-gray-500">
                  No NGO accounts found.
                </td>
              </tr>
            ) : (
              ngoAccounts.map((ngo) => (
                <tr key={ngo.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{ngo.ngo_name}</td>
                  <td className="py-2 px-4 border-b">
                    {users.find((u) => u.id === ngo.user)?.phone || 'N/A'}
                  </td>
                  <td className="py-2 px-4 border-b">{ngo.contact_name}</td>
                  <td className="py-2 px-4 border-b">{ngo.email}</td>
                  <td className="py-2 px-4 border-b">{ngo.phone}</td>
                  <td className="py-2 px-4 border-b">
                    {ngo.registration_proof_url ? (
                      <a
                        href={import.meta.env.VITE_BACKEND_DOMAIN+ngo.registration_proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View File
                      </a>
                    ) : (
                      'No File'
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">{ngo.address}</td>
                  <td className="py-2 px-4 border-b">{ngo.pincode}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleEdit(ngo)}
                      className="mr-2 p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ngo.id)}
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

export default NGOAccountPage;