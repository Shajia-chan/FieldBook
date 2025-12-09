import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PlayerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingsError, setBookingsError] = useState('');

  useEffect(() => {
    fetchUserBookings();
  }, [user]);

  const fetchUserBookings = async () => {
    try {
      setLoadingBookings(true);
      setBookingsError('');

      if (!user) return;

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
      setBookingsError(error.message || 'Failed to fetch bookings');
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome, {user?.firstName} {user?.lastName}!
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Skill Level</h3>
            <p className="text-3xl font-bold text-blue-600">{user?.skillLevel || 'Not set'}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Preferred Sports</h3>
            <p className="text-sm text-gray-600">
              {user?.preferredSports?.length > 0 ? user.preferredSports.join(', ') : 'No sports selected'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
            <p className="text-sm text-gray-600 break-all">{user?.email}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/available-fields')}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Browse Fields
            </button>
            <button 
              onClick={() => navigate('/bookings')}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              My Bookings
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              Edit Profile
            </button>
            <button 
              onClick={handleLogout}
              className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Logout
            </button>
          </div>
        </div>

        {/* User Details */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Username</p>
              <p className="text-lg font-semibold text-gray-900">{user?.userID}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Mobile</p>
              <p className="text-lg font-semibold text-gray-900">{user?.mobile}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Account Status</p>
              <p className="text-lg font-semibold">
                <span className={user?.isActive ? 'text-green-600' : 'text-red-600'}>
                  {user?.isActive ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Verified</p>
              <p className="text-lg font-semibold">
                <span className={user?.isVerified ? 'text-green-600' : 'text-yellow-600'}>
                  {user?.isVerified ? 'Verified' : 'Not Verified'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* My Bookings Section */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h2>
          
          {bookingsError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{bookingsError}</p>
            </div>
          )}

          {loadingBookings ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No bookings yet. Start by booking a field!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookings.map((booking) => (
                <div key={booking._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{booking.field?.fieldName || 'Field'}</h3>
                      <p className="text-sm text-gray-600">{booking.field?.fieldLocation || 'Location'}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(booking.status)}`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">📅 Date:</span>
                      <span className="font-semibold">{formatDate(booking.bookingDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">🕐 Time:</span>
                      <span className="font-semibold">{booking.timeSlot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">👥 Players:</span>
                      <span className="font-semibold">{booking.numberOfPlayers}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                      <span className="text-gray-600">💰 Price:</span>
                      <span className="font-bold text-green-600">৳{booking.totalPrice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerDashboard;
