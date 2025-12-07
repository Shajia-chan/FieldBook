import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PlayerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
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
            <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Browse Fields
            </button>
            <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
              My Bookings
            </button>
            <button className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Find Players
            </button>
            <button className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
              Edit Profile
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
      </div>
    </div>
  );
};

export default PlayerDashboard;
