import React, { useState, useEffect } from 'react';

const Booking = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    date: '',
    timeSlot: '',
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  // Fetch available slots when date changes
  useEffect(() => {
    if (formData.date) {
      fetchAvailableSlots(formData.date);
    }
  }, [formData.date]);

  const fetchAvailableSlots = async (date) => {
    try {
      const response = await fetch(
        `http://localhost:3000/bookings/available-slots?date=${date}`
      );
      const data = await response.json();

      if (data.success) {
        setAvailableSlots(data.data);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      setMessage({ type: 'error', text: 'Failed to load available slots' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Reset time slot when date changes
    if (name === 'date') {
      setFormData((prev) => ({ ...prev, timeSlot: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('http://localhost:3000/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: 'success',
          text: 'Booking created successfully! We will contact you soon.',
        });
        setFormData({
          name: '',
          phoneNumber: '',
          date: '',
          timeSlot: '',
        });
        setAvailableSlots([]);
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      console.error('Booking error:', error);
      setMessage({ type: 'error', text: 'Failed to create booking' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Book Your Field
          </h1>
          <p className="text-xl text-gray-600">
            Reserve your football field in just a few clicks
          </p>
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                placeholder="Enter your full name"
              />
            </div>

            {/* Phone Number Input */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Phone Number *
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                pattern="[0-9]{10,15}"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                placeholder="Enter your phone number"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter 10-15 digit phone number
              </p>
            </div>

            {/* Date Input */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Select Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={today}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Time Slot Selection */}
            {formData.date && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Time Slot *
                </label>
                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto p-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, timeSlot: slot }))
                        }
                        className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                          formData.timeSlot === slot
                            ? 'bg-green-600 text-white border-green-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-green-500'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <p className="text-yellow-800">
                      No available slots for this date
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Message Display */}
            {message.text && (
              <div
                className={`p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formData.timeSlot}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-lg rounded-lg hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all shadow-lg"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </form>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">📋 Booking Information</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Each booking slot is for 1 hour</li>
            <li>• You will receive a confirmation call shortly</li>
            <li>• Please arrive 10 minutes before your slot</li>
            <li>• Payment can be made at the venue</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Booking;
