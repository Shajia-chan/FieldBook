import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminBookingPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  console.log('AdminBookingPanel rendering... User:', user);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState('pending');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:3000/bookings/all');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch bookings: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Fetched bookings:', data); // Debug log
      setBookings(data.bookings || []);
    } catch (err) {
      console.error('Error fetching bookings:', err); // Debug log
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'Admin') {
      console.log('Admin user detected, fetching bookings...');
      fetchBookings();
    } else {
      console.log('User role:', user?.role, 'User object:', user);
    }
  }, [user]);

  // Confirm booking
  const handleConfirmBooking = async (bookingId) => {
    try {
      setSuccessMessage('');
      const response = await fetch(`http://localhost:3000/bookings/${bookingId}/confirm`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to confirm booking');
      }

      setSuccessMessage('Booking confirmed successfully!');
      fetchBookings();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to confirm booking');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Reject booking
  const handleRejectBooking = async (bookingId) => {
    try {
      setSuccessMessage('');
      const response = await fetch(`http://localhost:3000/bookings/${bookingId}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: rejectReason || 'Rejected by admin' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reject booking');
      }

      setSuccessMessage('Booking rejected successfully!');
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedBooking(null);
      fetchBookings();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to reject booking');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Filter bookings
  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => (booking.status || '') === filter);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (user?.role !== 'Admin') {
    console.log('User is not admin, showing access denied. User role:', user?.role);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="bg-white rounded-lg shadow p-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You do not have permission to access the admin panel.</p>
          <p className="text-gray-500 text-sm mb-6">Your role: {user?.role || 'Not set'}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div style={{ position: 'fixed', top: '80px', right: '20px', background: 'white', padding: '10px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 40 }}>
        <p style={{ margin: 0, fontSize: '12px' }}>Debug: Admin={user?.role === 'Admin'}, Role={user?.role}</p>
      </div>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Booking Management</h1>
            <p className="text-gray-600 mt-2">Review and confirm field bookings</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/admin-dashboard')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Back to Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Filter */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {['pending', 'confirmed', 'cancelled', 'all'].map(status => {
            const count = status === 'all' 
              ? bookings.length 
              : bookings.filter(b => (b.status || '') === status).length;
            
            return (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
              </button>
            );
          })}
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-600">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              <p>No bookings found in the system</p>
              <p className="text-xs text-gray-500 mt-2">Total bookings: {bookings.length}</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              <p>No {filter} bookings found</p>
              <p className="text-xs text-gray-500 mt-2">Total bookings: {bookings.length}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Order ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Player</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Field</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Time</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Players</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map(booking => (
                    <tr key={booking._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                        {booking.orderId || `OLD-${booking._id.substring(0, 8)}`}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {booking.player?.firstName} {booking.player?.lastName}
                          </p>
                          <p className="text-gray-600 text-xs">{booking.player?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {booking.field?.fieldName}
                          </p>
                          <p className="text-gray-600 text-xs">{booking.field?.fieldLocation}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {booking.bookingDate ? formatDate(booking.bookingDate) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {booking.timeSlot || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {booking.numberOfPlayers || 0}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        ৳{(booking.totalPrice || 0).toFixed(0)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                          {(booking.status || 'unknown').charAt(0).toUpperCase() + (booking.status || 'unknown').slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {booking.status === 'pending' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleConfirmBooking(booking._id)}
                              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-medium"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => {
                                setSelectedBooking(booking._id);
                                setShowRejectModal(true);
                              }}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-medium"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-xs">No action</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow p-6 max-w-md w-full">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Reject Booking</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to reject this booking? Please provide a reason.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Rejection reason (optional)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                rows="3"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                    setSelectedBooking(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRejectBooking(selectedBooking)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookingPanel;
