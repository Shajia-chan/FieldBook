import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AvailableFields = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    fieldType: '',
    location: '',
    maxPrice: '',
    minCapacity: '',
  });
  const [selectedField, setSelectedField] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchFields();
  }, [filters]);

  const fetchFields = async () => {
    try {
      setLoading(true);
      setError('');

      const query = new URLSearchParams();
      if (filters.fieldType) query.append('fieldType', filters.fieldType);
      if (filters.location) query.append('location', filters.location);
      if (filters.maxPrice) query.append('maxPrice', filters.maxPrice);
      if (filters.minCapacity) query.append('minCapacity', filters.minCapacity);

      const url = `http://localhost:3000/fields/all?${query.toString()}`;
      console.log('Fetching from:', url);
      
      const response = await fetch(url);
      console.log('Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch fields: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Fields data:', data);
      setFields(data.fields || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to fetch fields');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleViewDetails = (field) => {
    setSelectedField(field);
    setShowDetailsModal(true);
  };

  const handleBookField = (field) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/book-field/${field._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Available Fields</h1>
          <p className="text-gray-600">Browse and book sports fields in your area</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Field Type
              </label>
              <select
                name="fieldType"
                value={filters.fieldType}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="Football">Football</option>
                <option value="Cricket">Cricket</option>
                <option value="Badminton">Badminton</option>
                <option value="Basketball">Basketball</option>
                <option value="Volleyball">Volleyball</option>
                <option value="Tennis">Tennis</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Search location..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price/Hour
              </label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max price..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Capacity
              </label>
              <input
                type="number"
                name="minCapacity"
                value={filters.minCapacity}
                onChange={handleFilterChange}
                placeholder="Min capacity..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Fields Grid */}
        {fields.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600 text-lg">No fields found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map(field => (
              <div key={field._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                {/* Field Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                  <h3 className="text-xl font-bold mb-2">{field.fieldName}</h3>
                  <p className="text-blue-100">{field.fieldType}</p>
                </div>

                {/* Field Info */}
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-semibold text-gray-900">{field.fieldLocation}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-semibold text-gray-900">{field.fieldCapacity} players</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Price/Hour:</span>
                    <span className="font-bold text-green-600">${field.pricePerHour}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Owner:</span>
                    <span className="text-sm text-gray-900">
                      {field.fieldOwner.firstName} {field.fieldOwner.lastName}
                    </span>
                  </div>

                  {field.averageRating > 0 && (
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <span className="text-gray-600">Rating:</span>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-semibold">{field.averageRating.toFixed(1)}</span>
                        <span className="text-sm text-gray-500">({field.totalReviews})</span>
                      </div>
                    </div>
                  )}

                  {field.description && (
                    <p className="text-sm text-gray-600 pt-2">{field.description}</p>
                  )}

                  {field.amenities.length > 0 && (
                    <div className="pt-2">
                      <p className="text-xs font-semibold text-gray-600 mb-1">Amenities:</p>
                      <div className="flex flex-wrap gap-1">
                        {field.amenities.map((amenity, idx) => (
                          <span
                            key={idx}
                            className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="px-6 pb-6 flex gap-3">
                  <button
                    onClick={() => handleViewDetails(field)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleBookField(field)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedField && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">{selectedField.fieldName}</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-2xl font-bold hover:text-blue-200"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">
                  {selectedField.description || 'No description available'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Field Type</p>
                  <p className="font-semibold text-gray-900">{selectedField.fieldType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold text-gray-900">{selectedField.fieldLocation}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Capacity</p>
                  <p className="font-semibold text-gray-900">{selectedField.fieldCapacity} players</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Price/Hour</p>
                  <p className="font-semibold text-green-600">${selectedField.pricePerHour}</p>
                </div>
              </div>

              {selectedField.amenities.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedField.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Owner Information</h3>
                <p className="text-gray-700">
                  {selectedField.fieldOwner.firstName} {selectedField.fieldOwner.lastName}
                </p>
                <p className="text-sm text-gray-600">{selectedField.fieldOwner.email}</p>
                <p className="text-sm text-gray-600">{selectedField.fieldOwner.mobile}</p>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleBookField(selectedField);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableFields;
