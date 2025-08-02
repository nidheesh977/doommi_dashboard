import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EventFieldsPage = () => {
  const [eventFields, setEventFields] = useState([]);
  const [formData, setFormData] = useState({ title: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchEventFields();
  }, []);

  const fetchEventFields = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/event-fields/`);
      setEventFields(response.data);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch event fields.';
      setError(errorMessage);
      console.error('Error fetching event fields:', errorMessage);
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
        // Update existing event field
        await axios.put(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/event-fields/${editingId}/`,
          formData
        );
        setSuccess('Event field updated successfully!');
      } else {
        // Create new event field
        await axios.post(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/event-fields/`,
          formData
        );
        setSuccess('Event field created successfully!');
      }
      setFormData({ title: '' });
      setEditingId(null);
      setError(null);
      fetchEventFields(); // Refresh the list
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to save event field.';
      setError(errorMessage);
      console.error('Error saving event field:', errorMessage);
    }
  };

  const handleEdit = (eventField) => {
    setFormData({ title: eventField.title });
    setEditingId(eventField.id);
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event field?')) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/dashboard/event-fields/${id}/`
      );
      setSuccess('Event field deleted successfully!');
      setError(null);
      fetchEventFields(); // Refresh the list
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to delete event field.';
      setError(errorMessage);
      console.error('Error deleting event field:', errorMessage);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Event Fields Management</h2>

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
        <h3 className="text-lg font-semibold mb-2">{editingId ? 'Edit Event Field' : 'Add New Event Field'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter event field title (e.g., Birthday)"
              required
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingId ? 'Update Event Field' : 'Add Event Field'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setFormData({ title: '' });
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

      {/* Table for Listing Event Fields */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Title</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {eventFields.length === 0 ? (
              <tr>
                <td colSpan="2" className="py-2 px-4 text-center text-gray-500">
                  No event fields found.
                </td>
              </tr>
            ) : (
              eventFields.map((eventField) => (
                <tr key={eventField.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{eventField.title}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleEdit(eventField)}
                      className="mr-2 p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(eventField.id)}
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

export default EventFieldsPage;