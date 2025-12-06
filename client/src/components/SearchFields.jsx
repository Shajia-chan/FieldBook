// components/SearchFields.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchFields = () => {
  // API Base URL - UPDATE THIS WITH YOUR BACKEND URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  const [searchParams, setSearchParams] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    timeSlot: '',
    hasSwimmingPool: false
  });

  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [selectedField, setSelectedField] = useState(null);

  const timeSlots = [
    "06:00-08:00", "08:00-10:00", "10:00-12:00",
    "14:00-16:00", "16:00-18:00", "18:00-20:00"
  ];

  // Load all fields on component mount
  useEffect(() => {
    loadAllFields();
  }, []);

  // Load all fields
  const loadAllFields = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${API_BASE_URL}/fields`);
      
      if (response.data.success) {
        setFields(response.data.data);
      } else {
        setError('Failed to load fields');
      }
    } catch (err) {
      console.error('Error loading fields:', err);
      setError(err.response?.data?.message || 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle search with filters
  const handleSearch = async () => {
    setLoading(true);
    setError('');

    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      if (searchParams.location) {
        params.append('location', searchParams.location);
      }
      if (searchParams.minPrice) {
        params.append('minPrice', searchParams.minPrice);
      }
      if (searchParams.maxPrice) {
        params.append('maxPrice', searchParams.maxPrice);
      }
      if (searchParams.timeSlot) {
        params.append('timeSlot', searchParams.timeSlot);
      }
      if (searchParams.hasSwimmingPool) {
        params.append('hasSwimmingPool', 'true');
      }

      console.log('Search URL:', `${API_BASE_URL}/fields/search?${params.toString()}`);

      const response = await axios.get(`${API_BASE_URL}/fields/search?${params.toString()}`);

      if (response.data.success) {
        let sortedFields = response.data.data;
        
        // Apply sorting if selected
        if (sortBy === 'price-asc') {
          sortedFields = [...sortedFields].sort((a, b) => a.pricePerHour - b.pricePerHour);
        } else if (sortBy === 'price-desc') {
          sortedFields = [...sortedFields].sort((a, b) => b.pricePerHour - a.pricePerHour);
        } else if (sortBy === 'rating') {
          sortedFields = [...sortedFields].sort((a, b) => b.rating - a.rating);
        }
        
        setFields(sortedFields);
      } else {
        setError(response.data.message || 'Search failed');
      }
    } catch (err) {
      console.error('Error searching fields:', err);
      setError(err.response?.data?.message || 'Failed to search fields. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle reset
  const handleReset = () => {
    setSearchParams({
      location: '',
      minPrice: '',
      maxPrice: '',
      timeSlot: '',
      hasSwimmingPool: false
    });
    setSortBy('');
    loadAllFields();
  };

  // Handle sorting
  const handleSort = (e) => {
    const value = e.target.value;
    setSortBy(value);
    
    let sorted = [...fields];
    if (value === 'price-asc') {
      sorted.sort((a, b) => a.pricePerHour - b.pricePerHour);
    } else if (value === 'price-desc') {
      sorted.sort((a, b) => b.pricePerHour - a.pricePerHour);
    } else if (value === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating);
    }
    setFields(sorted);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
            Search Football Fields
          </h1>
          <p style={{ color: '#6b7280' }}>Find and book the perfect field for your game</p>
        </div>

        {/* Search Filters */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
            Search Filters
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            {/* Location */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                Location
              </label>
              <input
                type="text"
                name="location"
                value={searchParams.location}
                onChange={handleInputChange}
                placeholder="e.g., Dhaka, Gulshan"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>

            {/* Min Price */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                Min Price (BDT/hour)
              </label>
              <input
                type="number"
                name="minPrice"
                value={searchParams.minPrice}
                onChange={handleInputChange}
                placeholder="e.g., 1000"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>

            {/* Max Price */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                Max Price (BDT/hour)
              </label>
              <input
                type="number"
                name="maxPrice"
                value={searchParams.maxPrice}
                onChange={handleInputChange}
                placeholder="e.g., 3000"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>

            {/* Time Slot */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                Time Slot
              </label>
              <select
                name="timeSlot"
                value={searchParams.timeSlot}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
              >
                <option value="">Any Time</option>
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>

            {/* Swimming Pool Filter */}
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="hasSwimmingPool"
                  checked={searchParams.hasSwimmingPool}
                  onChange={handleInputChange}
                  style={{ width: '16px', height: '16px', marginRight: '8px' }}
                />
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  Has Swimming Pool
                </span>
              </label>
            </div>

            {/* Sort By */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={handleSort}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
              >
                <option value="">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleSearch}
              disabled={loading}
              style={{
                padding: '10px 24px',
                backgroundColor: loading ? '#9ca3af' : '#16a34a',
                color: 'white',
                borderRadius: '6px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                fontSize: '14px'
              }}
            >
              {loading ? 'Searching...' : 'Search Fields'}
            </button>
            <button
              onClick={handleReset}
              style={{
                padding: '10px 24px',
                backgroundColor: '#e5e7eb',
                color: '#374151',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px'
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            color: '#991b1b',
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: '24px'
          }}>
            {error}
          </div>
        )}

        {/* Results Count */}
        <div style={{ marginBottom: '16px' }}>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Found <span style={{ fontWeight: '600', color: '#111827' }}>{fields.length}</span> field{fields.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Fields Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{
              display: 'inline-block',
              width: '48px',
              height: '48px',
              border: '4px solid #e5e7eb',
              borderTopColor: '#16a34a',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ marginTop: '16px', color: '#6b7280' }}>Loading fields...</p>
          </div>
        ) : fields.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '48px',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
              No Fields Found
            </h3>
            <p style={{ color: '#6b7280' }}>Try adjusting your search filters to find more results.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {fields.map(field => (
              <div key={field._id} style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                transition: 'box-shadow 0.3s'
              }}>
                <img
                  src={field.imageUrl}
                  alt={field.fieldName}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
                
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
                    {field.fieldName}
                  </h3>
                  
                  <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
                    📍 {field.location}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '12px' }}>
                    <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#16a34a' }}>
                      ৳{field.pricePerHour}
                    </span>
                    <span style={{ color: '#6b7280', marginLeft: '4px', fontSize: '14px' }}>/hour</span>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                      <span style={{ color: '#fbbf24', marginRight: '4px' }}>⭐</span>
                      <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                        {field.rating}
                      </span>
                    </div>
                  </div>

                  {/* Facilities */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                    {field.hasLocker && (
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                        fontSize: '12px',
                        borderRadius: '12px'
                      }}>
                        Locker
                      </span>
                    )}
                    {field.hasSwimmingPool && (
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: '#cffafe',
                        color: '#0e7490',
                        fontSize: '12px',
                        borderRadius: '12px'
                      }}>
                        Pool
                      </span>
                    )}
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: '#f3e8ff',
                      color: '#6b21a8',
                      fontSize: '12px',
                      borderRadius: '12px'
                    }}>
                      {field.capacity} players
                    </span>
                  </div>

                  {/* Available Slots */}
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Available Time Slots:
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {field.availableTimeSlots.filter(slot => !slot.isBooked).slice(0, 3).map((slot, idx) => (
                        <span key={idx} style={{
                          padding: '4px 8px',
                          backgroundColor: '#dcfce7',
                          color: '#166534',
                          fontSize: '11px',
                          borderRadius: '4px'
                        }}>
                          {slot.time}
                        </span>
                      ))}
                      {field.availableTimeSlots.filter(slot => !slot.isBooked).length > 3 && (
                        <span style={{
                          padding: '4px 8px',
                          backgroundColor: '#f3f4f6',
                          color: '#4b5563',
                          fontSize: '11px',
                          borderRadius: '4px'
                        }}>
                          +{field.availableTimeSlots.filter(slot => !slot.isBooked).length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedField(field)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: '#16a34a',
                      color: 'white',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '14px'
                    }}
                  >
                    View Details & Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Field Details Modal */}
        {selectedField && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                    {selectedField.fieldName}
                  </h2>
                  <button
                    onClick={() => setSelectedField(null)}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      fontSize: '24px',
                      color: '#6b7280',
                      cursor: 'pointer'
                    }}
                  >
                    ✕
                  </button>
                </div>

                <img
                  src={selectedField.imageUrl}
                  alt={selectedField.fieldName}
                  style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }}
                />

                <div style={{ marginBottom: '16px' }}>
                  <p style={{ color: '#6b7280', marginBottom: '8px' }}>📍 {selectedField.location}</p>
                  <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#16a34a' }}>
                    ৳{selectedField.pricePerHour} <span style={{ fontSize: '16px', color: '#6b7280' }}>/hour</span>
                  </p>
                </div>

                {selectedField.description && (
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ color: '#374151', lineHeight: '1.6' }}>{selectedField.description}</p>
                  </div>
                )}

                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Facilities:</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedField.facilities.map((facility, idx) => (
                      <span key={idx} style={{
                        padding: '6px 12px',
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        borderRadius: '16px',
                        fontSize: '14px'
                      }}>
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                    All Available Time Slots:
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {selectedField.availableTimeSlots.map((slot, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '8px',
                          borderRadius: '4px',
                          textAlign: 'center',
                          backgroundColor: slot.isBooked ? '#fee2e2' : '#dcfce7',
                          color: slot.isBooked ? '#991b1b' : '#166534',
                          textDecoration: slot.isBooked ? 'line-through' : 'none'
                        }}
                      >
                        {slot.time} {slot.isBooked && '(Booked)'}
                      </div>
                    ))}
                  </div>
                </div>

                <button style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '16px'
                }}>
                  Proceed to Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default SearchFields;

