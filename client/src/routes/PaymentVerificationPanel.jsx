import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const PaymentVerificationPanel = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('unpaid');
  const [verifyingId, setVerifyingId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/bookings/all', {
        headers: {
          Authorization: `Bearer ${token}`,
          userid: user._id,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (bookingId, verified) => {
    try {
      setVerifyingId(bookingId);
      setError('');
      setSuccess('');

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/bookings/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          userid: user._id,
        },
        body: JSON.stringify({
          bookingId,
          verified,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to verify payment');
      }

      setSuccess(verified ? 'Payment verified successfully!' : 'Payment rejected!');
      setShowVerifyModal(false);
      setSelectedBooking(null);
      await fetchBookings();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to process payment verification');
      setTimeout(() => setError(''), 3000);
    } finally {
      setVerifyingId(null);
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'unpaid':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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
    if (filter === 'all') return booking.transactionId;
    return booking.paymentStatus === filter && booking.transactionId;
  });

  if (!user || !['admin', 'staff'].includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-600 mt-2">You don't have permission to view this page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Verification</h1>
          <p className="text-gray-600">Review and verify pending payments from users</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-green-600">
            {success}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow p-2 mb-8 flex gap-2 overflow-x-auto">
          {[
            { value: 'all', label: 'All Pending', icon: '📋' },
            { value: 'unpaid', label: 'Unpaid', icon: '⏳' },
            { value: 'paid', label: 'Verified', icon: '✅' },
            { value: 'failed', label: 'Rejected', icon: '❌' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`flex-1 min-w-[120px] px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                filter === tab.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading payments...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">💳</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Payments Found</h3>
            <p className="text-gray-600">
              {filter === 'all'
                ? 'No payments to verify.'
                : `No ${filter} payments at the moment.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6 border-l-4 border-blue-500">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Order ID: {booking.orderId}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Field: <span className="font-semibold">{booking.field?.fieldName}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Player: <span className="font-semibold">{booking.player?.firstName} {booking.player?.lastName}</span>
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                      {booking.status.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPaymentStatusColor(booking.paymentStatus)}`}>
                      {booking.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-green-600">৳{booking.totalPrice}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Booking Date & Time</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(booking.bookingDate).toLocaleDateString()} {booking.timeSlot}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Payment Method</p>
                      <p className="text-sm font-semibold text-gray-900 uppercase">{booking.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Submitted At</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(booking.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Transaction ID */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-xs text-gray-500 font-medium mb-1">Transaction ID</p>
                  <p className="text-lg font-mono font-bold text-blue-600 break-all">{booking.transactionId}</p>
                  <p className="text-xs text-gray-500 mt-2">⚠️ Please verify this transaction ID with the payment provider before approving</p>
                </div>

                {/* Player Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Player Contact Information</p>
                  <div className="text-sm text-gray-600">
                    <p>📧 Email: {booking.player?.email}</p>
                    <p>📱 Phone: {booking.player?.mobile || 'Not provided'}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                {booking.paymentStatus === 'unpaid' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowVerifyModal(true);
                      }}
                      disabled={verifyingId === booking._id}
                      className="flex-1 px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {verifyingId === booking._id ? '⏳ Processing...' : '✅ Verify & Approve'}
                    </button>
                    <button
                      onClick={() => handleVerifyPayment(booking._id, false)}
                      disabled={verifyingId === booking._id}
                      className="flex-1 px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {verifyingId === booking._id ? '⏳ Processing...' : '❌ Reject'}
                    </button>
                  </div>
                )}

                {booking.paymentStatus === 'paid' && booking.paymentVerifiedAt && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                    <p className="text-green-800">
                      ✅ Verified by {booking.verifiedBy?.firstName} {booking.verifiedBy?.lastName} on{' '}
                      {new Date(booking.paymentVerifiedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Verify Confirmation Modal */}
      {showVerifyModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Confirm Payment Verification</h2>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ Before approving, please verify the transaction ID <strong className="font-mono">{selectedBooking.transactionId}</strong> with {selectedBooking.paymentMethod.toUpperCase()} payment provider.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Order ID: <strong>{selectedBooking.orderId}</strong></p>
                <p className="text-sm text-gray-600 mb-2">Amount: <strong className="text-lg text-green-600">৳{selectedBooking.totalPrice}</strong></p>
                <p className="text-sm text-gray-600">Player: <strong>{selectedBooking.player?.firstName} {selectedBooking.player?.lastName}</strong></p>
              </div>

              <p className="text-sm text-gray-600">
                Once you verify the transaction ID, the booking payment will be marked as <strong>PAID</strong>.
              </p>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowVerifyModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleVerifyPayment(selectedBooking._id, true)}
                disabled={verifyingId === selectedBooking._id}
                className="flex-1 px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {verifyingId === selectedBooking._id ? '⏳ Verifying...' : '✅ Verify & Approve'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentVerificationPanel;
