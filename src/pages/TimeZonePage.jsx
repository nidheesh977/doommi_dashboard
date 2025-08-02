import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TimeZonePage = () => {
  const [timeZones, setTimeZones] = useState([]);
  const [formData, setFormData] = useState({ code: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchTimeZones();
  }, []);

  const fetchTimeZones = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/time-zones/`);
      setTimeZones(response.data);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch time zones.';
      setError(errorMessage);
      console.error('Error fetching time zones:', errorMessage);
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
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/time-zones/${editingId}/`,
          formData);
        setSuccess('Time zone updated successfully!');
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/time-zones/`,
          formData
        );
        setSuccess('Time zone created successfully!');
      }
      setFormData({ code: '' });
      setEditingId(null);
      setError(null);
      fetchTimeZones();
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to save time zone.';
      setError(errorMessage);
      console.error('Error saving time zone:', errorMessage);
    }
  };

  const handleEdit = (timeZone) => {
    setFormData({ code: timeZone.code });
    setEditingId(timeZone.id);
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this time zone?')) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/time-zones/${id}/`
      );
      setSuccess('Time zone deleted successfully!');
      setError(null);
      fetchTimeZones();
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to delete time zone.';
      setError(errorMessage);
      console.error('Error deleting time zone:', errorMessage);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Time Zones Management</h2>
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
        <h3 className="text-lg font-semibold mb-2">{editingId ? 'Edit Time Zone' : 'Add New Time Zone'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Code</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter time zone code (e.g., UTC)"
              required
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingId ? 'Update Time Zone' : 'Add Time Zone'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setFormData({ code: '' });
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
              <th className="py-2 px-4 border-b text-left">Code</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {timeZones.length === 0 ? (
              <tr>
                <td colSpan="2" className="py-2 px-4 text-center text-gray-500">
                  No time zones found.
                </td>
              </tr>
            ) : (
              timeZones.map((timeZone) => (
                <tr key={timeZone.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{timeZone.code}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleEdit(timeZone)}
                      className="mr-2 p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(timeZone.id)}
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

export default TimeZonePage;