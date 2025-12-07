import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ManageFields = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSlotsModal, setShowSlotsModal] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [formData, setFormData] = useState({
    fieldName: '',
    fieldLocation: '',
    fieldType: 'Football',
    fieldCapacity: '',
    pricePerHour: '',
    description: '',
    amenities: '',
  });
  const [slotsData, setSlotsData] = useState({
    date: '',
    slots: '',
  });

  // Redirect if not field owner
  useEffect(() => {
    if (user && user.role !== 'Field_Owner') {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));

      const response = await fetch('http://localhost:3000/fields/owner', {
        headers: {
          Authorization: `Bearer ${token}`,
          userid: userData._id,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch fields: ${response.statusText}`);
      }

      const data = await response.json();

      setFields(data.fields || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch fields');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateField = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));

      const fieldPayload = {
        ...formData,
        fieldCapacity: parseInt(formData.fieldCapacity),
        pricePerHour: parseFloat(formData.pricePerHour),
        amenities: formData.amenities
          .split(',')
          .map(a => a.trim())
          .filter(a => a),
      };

      const response = await fetch('http://localhost:3000/fields/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          userid: userData._id,
        },
        body: JSON.stringify(fieldPayload),
      });

      if (!response.ok) {
        throw new Error(`Failed to create field: ${response.statusText}`);
      }

      const data = await response.json();

      setFields([...fields, data.field]);
      setShowCreateModal(false);
      setFormData({
        fieldName: '',
        fieldLocation: '',
        fieldType: 'Football',
        fieldCapacity: '',
        pricePerHour: '',
        description: '',
        amenities: '',
      });
    } catch (err) {
      setError(err.message || 'Failed to create field');
    }
  };

  const handleAddSlots = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));

      const slots = slotsData.slots
        .split(',')
        .map(s => s.trim())
        .filter(s => s);

      const response = await fetch(
        `http://localhost:3000/fields/${selectedField._id}/slots/add`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            userid: userData._id,
          },
          body: JSON.stringify({
            date: new Date(slotsData.date).toISOString(),
            slots,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to add slots: ${response.statusText}`);
      }

      const data = await response.json();

      const updatedFields = fields.map(f =>
        f._id === selectedField._id ? data.field : f
      );
      setFields(updatedFields);
      setShowSlotsModal(false);
      setSlotsData({ date: '', slots: '' });
      setSelectedField(null);
    } catch (err) {
      setError(err.message || 'Failed to add slots');
    }
  };

  const handleDeleteField = async (fieldId) => {
    if (!window.confirm('Are you sure you want to delete this field?')) return;

    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));

      const response = await fetch(
        `http://localhost:3000/fields/${fieldId}/delete`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            userid: userData._id,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete field');
      }

      setFields(fields.filter(f => f._id !== fieldId));
    } catch (err) {
      setError(err.message || 'Failed to delete field');
    }
  };

  if (!user || user.role !== 'Field_Owner') {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600 mt-2">Only field owners can manage fields.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading fields...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Manage Fields</h1>
            <p className="text-gray-600 mt-2">Create and manage your sports fields</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            + Add New Field
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Fields List */}
        {fields.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Fields Yet</h2>
            <p className="text-gray-600 mb-6">Create your first field to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Create Your First Field
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {fields.map(field => (
              <div
                key={field._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                  <h3 className="text-xl font-bold mb-1">{field.fieldName}</h3>
                  <p className="text-blue-100 text-sm">{field.fieldType}</p>
                </div>

                <div className="p-6 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-semibold text-gray-900">{field.fieldLocation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Capacity</p>
                      <p className="font-semibold text-gray-900">{field.fieldCapacity} players</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Price/Hour</p>
                      <p className="font-bold text-green-600">${field.pricePerHour}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${field.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {field.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {field.availableSlots && field.availableSlots.length > 0 && (
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">
                        {field.availableSlots.length} date(s) with available slots
                      </p>
                    </div>
                  )}

                  <div className="pt-4 flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedField(field);
                        setShowSlotsModal(true);
                      }}
                      className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition-colors"
                    >
                      Add Time Slots
                    </button>
                    <button
                      onClick={() => handleDeleteField(field._id)}
                      className="flex-1 px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Field Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Create New Field</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-2xl font-bold hover:text-blue-200"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateField} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field Name *
                  </label>
                  <input
                    type="text"
                    name="fieldName"
                    value={formData.fieldName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field Type *
                  </label>
                  <select
                    name="fieldType"
                    value={formData.fieldType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Football">Football</option>
                    <option value="Cricket">Cricket</option>
                    <option value="Badminton">Badminton</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Volleyball">Volleyball</option>
                    <option value="Tennis">Tennis</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="fieldLocation"
                    value={formData.fieldLocation}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity (Players) *
                  </label>
                  <input
                    type="number"
                    name="fieldCapacity"
                    value={formData.fieldCapacity}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Per Hour ($) *
                  </label>
                  <input
                    type="number"
                    name="pricePerHour"
                    value={formData.pricePerHour}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amenities (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="amenities"
                    value={formData.amenities}
                    onChange={handleInputChange}
                    placeholder="Parking, Water, Lights..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Create Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Slots Modal */}
      {showSlotsModal && selectedField && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-xl w-full">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Add Time Slots</h2>
              <button
                onClick={() => {
                  setShowSlotsModal(false);
                  setSelectedField(null);
                }}
                className="text-2xl font-bold hover:text-blue-200"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddSlots} className="p-6 space-y-4">
              <div>
                <p className="font-semibold text-gray-900 mb-2">{selectedField.fieldName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  value={slotsData.date}
                  onChange={(e) =>
                    setSlotsData(prev => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Slots (comma-separated) *
                </label>
                <input
                  type="text"
                  value={slotsData.slots}
                  onChange={(e) =>
                    setSlotsData(prev => ({
                      ...prev,
                      slots: e.target.value,
                    }))
                  }
                  placeholder="09:00-10:00, 10:00-11:00, 11:00-12:00"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-600 mt-1">Format: HH:MM-HH:MM</p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowSlotsModal(false);
                    setSelectedField(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Add Slots
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFields;
