import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, cancelled

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');

      if (!user) {
        setError('Please log in to view bookings');
        return;
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/bookings?userId=${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          userid: user._id,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch bookings: ${response.statusText}`);
      }

      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(error.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const groupedBookings = filteredBookings.reduce((acc, booking) => {
    const date = new Date(booking.bookingDate).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(booking);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            All Bookings
          </h1>
          <p className="text-xl text-gray-600">
            View all football field reservations
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-md p-2 mb-8 flex gap-2 overflow-x-auto">
          {[
            { value: 'all', label: 'All Bookings', icon: '📋' },
            { value: 'pending', label: 'Pending', icon: '⏳' },
            { value: 'confirmed', label: 'Confirmed', icon: '✅' },
            { value: 'cancelled', label: 'Cancelled', icon: '❌' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`flex-1 min-w-[120px] px-4 py-3 rounded-lg font-medium transition-all ${
                filter === tab.value
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Bookings Found
            </h3>
            <p className="text-gray-600">
              {filter === 'all'
                ? 'No bookings have been made yet.'
                : `No ${filter} bookings at the moment.`}
            </p>
          </div>
        ) : (
          // Bookings List
          <div className="space-y-8">
            {Object.entries(groupedBookings).map(([date, dayBookings]) => (
              <div key={date} className="space-y-4">
                {/* Date Header */}
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                  <h2 className="text-lg font-bold text-gray-700 bg-white px-4 py-2 rounded-full shadow-sm">
                    {formatDate(dayBookings[0].bookingDate)}
                  </h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                </div>

                {/* Bookings Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dayBookings
                    .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot))
                    .map((booking) => (
                      <div
                        key={booking._id}
                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border-2 border-gray-100"
                      >
                        {/* Field Name and Time Slot */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium mb-1">Field</p>
                            <h3 className="font-bold text-lg text-gray-900">
                              {booking.field?.fieldName || 'N/A'}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              🕐 {booking.timeSlot}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {booking.status.toUpperCase()}
                          </span>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gray-200 mb-4"></div>

                        {/* Booking Details */}
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <span className="text-xl">📍</span>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                Location
                              </p>
                              <p className="text-sm font-semibold text-gray-900">
                                {booking.field?.fieldLocation || 'N/A'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <span className="text-xl">👥</span>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                Number of Players
                              </p>
                              <p className="text-sm font-semibold text-gray-900">
                                {booking.numberOfPlayers}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <span className="text-xl">💰</span>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                Total Price
                              </p>
                              <p className="text-sm font-semibold text-green-600">
                                ${booking.totalPrice}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <span className="text-xl">📅</span>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                Booked At
                              </p>
                              <p className="text-sm font-semibold text-gray-900">
                                {new Date(booking.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {!loading && bookings.length > 0 && (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-gray-900">
                {bookings.length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Bookings</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {bookings.filter((b) => b.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Pending</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-green-600">
                {bookings.filter((b) => b.status === 'confirmed').length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Confirmed</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-red-600">
                {bookings.filter((b) => b.status === 'cancelled').length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Cancelled</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
