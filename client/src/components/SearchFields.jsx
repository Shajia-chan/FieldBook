// components/SearchFields.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import WeatherAlert from "../components/WeatherAlert";


const SearchFields = () => {
  const { t, i18n } = useTranslation(); // include i18n

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

  const timeSlots = [
    "06:00-08:00", "08:00-10:00", "10:00-12:00",
    "14:00-16:00", "16:00-18:00", "18:00-20:00"
  ];

  // ----------------- Bangla number conversion -----------------
  const toBanglaNumber = (num) => {
    const banglaDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    return num.toString().split('').map(d => banglaDigits[parseInt(d)] || d).join('');
  };

  const formatNumber = (num) => i18n.language === 'bn' ? toBanglaNumber(num) : num;
  // ------------------------------------------------------------

  useEffect(() => {
    loadAllFields();
  }, [i18n.language]); // reload fields on language change

  const loadAllFields = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/fields`);
      if (response.data.success) {
        setFields(response.data.data);
      } else {
        setError(t('search.failedToLoad'));
      }
    } catch (err) {
      console.error('Error loading fields:', err);
      setError(err.response?.data?.message || t('search.failedToConnect'));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (searchParams.location) params.append('location', searchParams.location);
      if (searchParams.minPrice) params.append('minPrice', searchParams.minPrice);
      if (searchParams.maxPrice) params.append('maxPrice', searchParams.maxPrice);
      if (searchParams.timeSlot) params.append('timeSlot', searchParams.timeSlot);
      if (searchParams.hasSwimmingPool) params.append('hasSwimmingPool', 'true');

      const response = await axios.get(`${API_BASE_URL}/fields/search?${params.toString()}`);

      if (response.data.success) {
        let sortedFields = response.data.data;
        if (sortBy === 'price-asc') sortedFields = [...sortedFields].sort((a, b) => a.pricePerHour - b.pricePerHour);
        else if (sortBy === 'price-desc') sortedFields = [...sortedFields].sort((a, b) => b.pricePerHour - a.pricePerHour);
        else if (sortBy === 'rating') sortedFields = [...sortedFields].sort((a, b) => b.rating - a.rating);

        setFields(sortedFields);
      } else {
        setError(response.data.message || t('search.searchFailed'));
      }
    } catch (err) {
      console.error('Error searching fields:', err);
      setError(err.response?.data?.message || t('search.searchFailedTryAgain'));
    } finally {
      setLoading(false);
    }
  };

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

  const handleSort = (e) => {
    const value = e.target.value;
    setSortBy(value);
    let sorted = [...fields];
    if (value === 'price-asc') sorted.sort((a, b) => a.pricePerHour - b.pricePerHour);
    else if (value === 'price-desc') sorted.sort((a, b) => b.pricePerHour - a.pricePerHour);
    else if (value === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    setFields(sorted);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
            {t('search.searchFootballFields')}
          </h1>
          <p style={{ color: '#6b7280' }}>{t('search.findAndBook')}</p>
        </div>

        {/* Filters Section */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
            {t('search.searchFilters')}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            {/* Location */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                {t('search.location')}
              </label>
              <input
                type="text"
                name="location"
                value={searchParams.location}
                onChange={handleInputChange}
                placeholder={t('search.locationPlaceholder')}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>

            {/* Min Price */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                {t('search.minPrice')}
              </label>
              <input
                type="number"
                name="minPrice"
                value={searchParams.minPrice}
                onChange={handleInputChange}
                placeholder={t('search.minPricePlaceholder')}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>

            {/* Max Price */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                {t('search.maxPrice')}
              </label>
              <input
                type="number"
                name="maxPrice"
                value={searchParams.maxPrice}
                onChange={handleInputChange}
                placeholder={t('search.maxPricePlaceholder')}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>

            {/* Time Slot */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                {t('search.timeSlot')}
              </label>
              <select
                name="timeSlot"
                value={searchParams.timeSlot}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
              >
                <option value="">{t('search.anyTime')}</option>
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>

            {/* Swimming Pool */}
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
                  {t('search.hasSwimmingPool')}
                </span>
              </label>
            </div>

            {/* Sort By */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                {t('search.sortBy')}
              </label>
              <select
                value={sortBy}
                onChange={handleSort}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
              >
                <option value="">{t('search.default')}</option>
                <option value="price-asc">{t('search.priceLowHigh')}</option>
                <option value="price-desc">{t('search.priceHighLow')}</option>
                <option value="rating">{t('search.highestRated')}</option>
              </select>
            </div>
          </div>

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
              {loading ? t('search.searching') : t('search.searchFields')}
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
              {t('search.resetFilters')}
            </button>
          </div>
        </div>

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

        {/* Fields List */}
        <div style={{ marginBottom: '16px' }}>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            {t('search.found')} <span style={{ fontWeight: '600', color: '#111827' }}>{formatNumber(fields.length)}</span> {t('search.fields')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          {fields.map(field => (
            <div key={field._id} style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <img src={field.imageUrl} alt={field.fieldName} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
              <div style={{ padding: '16px' }}>
                <h3 style={{ fontWeight: '600', fontSize: '18px', marginBottom: '8px' }}>{field.fieldName}</h3>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>{field.location}</p>
                <p style={{ fontWeight: '500', fontSize: '14px', marginBottom: '8px' }}>৳{formatNumber(field.pricePerHour)}/hour</p>
                <p style={{ fontSize: '14px', color: '#374151' }}>⭐ {formatNumber(field.rating)}</p>

                <WeatherAlert location={field.location} />

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchFields;




