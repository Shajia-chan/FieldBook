import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFields: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refundRequests, setRefundRequests] = useState([]);
  const [loadingRefunds, setLoadingRefunds] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);

  useEffect(() => {
    if (user && token) {
      fetchStats();
      fetchRefundRequests();
    }
  }, [user, token]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const API_URL = 'http://localhost:3000/api';

      const headers = {
        'Content-Type': 'application/json',
        'userid': user._id,
        'Authorization': `Bearer ${token}`
      };

      // Fetch all stats in parallel
      const [usersRes, fieldsRes, bookingsRes] = await Promise.all([
        fetch(`${API_URL}/users/count`, { headers }),
        fetch(`${API_URL}/fields/count`, { headers }),
        fetch(`${API_URL}/bookings/stats`, { headers }),
      ]);

      const usersData = await usersRes.json();
      const fieldsData = await fieldsRes.json();
      const bookingsData = await bookingsRes.json();

      console.log('Stats fetched:', { usersData, fieldsData, bookingsData });

      setStats({
        totalUsers: usersData.count || 0,
        totalFields: fieldsData.count || 0,
        totalBookings: bookingsData.stats?.totalBookings || 0,
        totalRevenue: bookingsData.stats?.totalRevenue || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRefundRequests = async () => {
    try {
      setLoadingRefunds(true);
      const headers = {
        'Content-Type': 'application/json',
        'userid': user._id,
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch('http://localhost:3000/api/bookings/refund-requests', { headers });
      const data = await response.json();

      if (data.success) {
        setRefundRequests(data.refundRequests || []);
      }
    } catch (error) {
      console.error('Error fetching refund requests:', error);
    } finally {
      setLoadingRefunds(false);
    }
  };

  const handleProcessRefund = async (bookingId, status) => {
    const confirmMessage = status === 'approved' 
      ? 'Are you sure you want to approve this refund? Make sure you have transferred the money to the user\'s Bkash account.' 
      : 'Are you sure you want to reject this refund request?';
    
    if (!window.confirm(confirmMessage)) return;

    try {
      const headers = {
        'Content-Type': 'application/json',
        'userid': user._id,
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch(`http://localhost:3000/api/bookings/${bookingId}/process-refund`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Refund ${status} successfully!`);
        fetchRefundRequests(); // Refresh the list
      } else {
        alert(data.message || 'Failed to process refund');
      }
    } catch (error) {
      console.error('Error processing refund:', error);
      alert('Failed to process refund');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const pendingRefunds = refundRequests.filter(r => r.refundRequest.status === 'pending');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Gradient */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl shadow-2xl mb-10 p-8">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="admin-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="2" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#admin-pattern)" />
            </svg>
          </div>
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold text-white">
                  Admin Dashboard
                </h1>
              </div>
              <p className="text-white/90 text-lg">Manage your platform and monitor activities</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold border-2 border-white/30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all hover:scale-105">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white/90">Total Users</h3>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-4xl font-bold text-white mb-2">
                {loading ? '--' : stats.totalUsers}
              </p>
              <p className="text-sm text-white/80">Registered accounts</p>
            </div>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all hover:scale-105">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white/90">Total Fields</h3>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <p className="text-4xl font-bold text-white mb-2">
                {loading ? '--' : stats.totalFields}
              </p>
              <p className="text-sm text-white/80">Available facilities</p>
            </div>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all hover:scale-105">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white/90">Total Bookings</h3>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-4xl font-bold text-white mb-2">
                {loading ? '--' : stats.totalBookings}
              </p>
              <p className="text-sm text-white/80">All time reservations</p>
            </div>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all hover:scale-105">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white/90">Total Revenue</h3>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-4xl font-bold text-white mb-2">
                {loading ? '৳--' : `৳${stats.totalRevenue.toLocaleString()}`}
              </p>
              <p className="text-sm text-white/80">Total earnings</p>
            </div>
          </div>
        </div>

        {/* Refund Requests Section */}
        {pendingRefunds.length > 0 && (
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl shadow-xl border-2 border-red-200 p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  Pending Refund Requests
                </span>
              </h2>
              <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
                {pendingRefunds.length} pending
              </span>
            </div>

            <div className="space-y-4">
              {pendingRefunds.map((booking) => (
                <div key={booking._id} className="bg-white border-2 border-red-200 rounded-2xl p-6 hover:shadow-xl transition-all hover:border-red-300">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-semibold text-gray-900">Order: {booking.orderId}</span>
                        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-medium">Cancelled</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600">Player: <span className="font-semibold text-gray-900">{booking.player?.firstName} {booking.player?.lastName}</span></p>
                          <p className="text-gray-600">Mobile: <span className="font-semibold text-gray-900">{booking.player?.mobile}</span></p>
                        </div>
                        <div>
                          <p className="text-gray-600">Field: <span className="font-semibold text-gray-900">{booking.field?.fieldName}</span></p>
                          <p className="text-gray-600">Booking Date: <span className="font-semibold text-gray-900">{formatDate(booking.bookingDate)}</span></p>
                        </div>
                      </div>

                      <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-700">Total Paid:</span>
                          <span className="font-bold text-gray-900">Tk {booking.totalPrice}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-700">Cancellation Fee (20%):</span>
                          <span className="font-semibold text-red-600">- Tk {(booking.totalPrice * 0.2).toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between text-base pt-2 border-t border-orange-300">
                          <span className="font-semibold text-gray-900">Refund Amount:</span>
                          <span className="font-bold text-green-600 text-lg">Tk {booking.refundRequest.refundAmount}</span>
                        </div>
                      </div>

                      <div className="mt-3 bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Bkash Number:</span> 
                          <span className="ml-2 font-mono text-blue-900 font-bold">{booking.refundRequest.bkashNumber}</span>
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Requested: {formatDate(booking.refundRequest.requestedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex lg:flex-col gap-3">
                      <button
                        onClick={() => handleProcessRefund(booking._id, 'approved')}
                        className="flex-1 lg:flex-none px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl whitespace-nowrap flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Approve
                      </button>
                      <button
                        onClick={() => handleProcessRefund(booking._id, 'rejected')}
                        className="flex-1 lg:flex-none px-5 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold rounded-xl hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl whitespace-nowrap flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-5 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl shadow-lg">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-sm text-yellow-900">
                  <strong className="font-bold">Important:</strong> Before approving a refund, ensure you have transferred the refund amount to the user's Bkash number manually.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Management Actions */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6 flex items-center gap-3">
            <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="group flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="font-semibold">Manage Users</span>
            </button>

            <button className="group flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-sm hover:shadow-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="font-semibold">Manage Fields</span>
            </button>

            <button 
              onClick={() => navigate('/admin-bookings')}
              className="group flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-semibold">Manage Bookings</span>
            </button>

            <button 
              onClick={() => navigate('/admin-tournaments')}
              className="group flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span className="font-semibold">Manage Tournaments</span>
            </button>

            <button className="group flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all shadow-sm hover:shadow-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="font-semibold">Revenue Reports</span>
            </button>

            <button className="group flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-sm hover:shadow-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-semibold">System Settings</span>
            </button>

            <button className="group flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all shadow-sm hover:shadow-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="font-semibold">Logs & Analytics</span>
            </button>
          </div>
        </div>

        {/* Admin Profile */}
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl shadow-xl border-2 border-blue-200 p-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 flex items-center gap-3">
            <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Admin Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 bg-white rounded-xl border-2 border-blue-200 shadow-md">
              <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Admin Name
              </p>
              <p className="text-lg font-bold text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
            <div className="p-5 bg-white rounded-xl border-2 border-purple-200 shadow-md">
              <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                Username
              </p>
              <p className="text-lg font-bold text-gray-900">{user?.userID}</p>
            </div>
            <div className="p-5 bg-white rounded-xl border-2 border-pink-200 shadow-md">
              <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </p>
              <p className="text-lg font-bold text-gray-900 break-all">{user?.email}</p>
            </div>
            <div className="p-5 bg-white rounded-xl border-2 border-green-200 shadow-md">
              <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Role
              </p>
              <p className="text-lg font-bold">
                <span className="inline-flex items-center px-3 py-1.5 text-sm font-bold text-white bg-gradient-to-r from-green-600 to-blue-600 rounded-lg shadow-md">
                  {user?.role}
                </span>
              </p>
            </div>
            <div className="p-5 bg-white rounded-xl border-2 border-indigo-200 shadow-md">
              <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Mobile
              </p>
              <p className="text-lg font-bold text-gray-900">{user?.mobile}</p>
            </div>
            <div className="p-5 bg-white rounded-xl border-2 border-teal-200 shadow-md">
              <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Account Status
              </p>
              <p className="text-lg font-bold">
                <span className={`inline-flex items-center px-3 py-1.5 text-sm font-bold rounded-lg shadow-md ${user?.isActive ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'}`}>
                  {user?.isActive ? '● Active' : '● Inactive'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
