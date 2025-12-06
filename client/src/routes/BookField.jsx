import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BookField = () => {
  const { fieldId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [field, setField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bookingData, setBookingData] = useState({
    bookingDate: '',
    timeSlot: '',
    numberOfPlayers: 1,
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [selectedPaymentOption, setSelectedPaymentOption] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [rentedEquipment, setRentedEquipment] = useState({});
  const [lockerBooked, setLockerBooked] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'Player') {
      navigate('/');
      return;
    }

    fetchField();
  }, [fieldId, user, navigate]);

  useEffect(() => {
    if (bookingData.bookingDate && field) {
      fetchAvailableSlots();
    }
  }, [bookingData.bookingDate, field]);

  const fetchField = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`http://localhost:3000/api/fields/${fieldId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch field: ${response.statusText}`);
      }

      const data = await response.json();
      setField(data.field);
    } catch (err) {
      setError(err.message || 'Failed to fetch field');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      setLoadingSlots(true);

      const response = await fetch(
        `http://localhost:3000/api/fields/${fieldId}/slots?date=${bookingData.bookingDate}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch slots: ${response.statusText}`);
      }

      const data = await response.json();
      setAvailableSlots(data.slots || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch available slots');
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: name === 'numberOfPlayers' ? parseInt(value) : value,
    }));
  };

  const handleEquipmentChange = (equipmentName, quantity) => {
    setRentedEquipment(prev => {
      const newEquipment = { ...prev };
      if (quantity > 0) {
        newEquipment[equipmentName] = quantity;
      } else {
        delete newEquipment[equipmentName];
      }
      return newEquipment;
    });
  };

  const calculateEquipmentCost = () => {
    if (!field || !field.equipment) return 0;
    return Object.entries(rentedEquipment).reduce((total, [name, quantity]) => {
      const equipment = field.equipment.find(e => e.name === name);
      return total + (equipment ? equipment.pricePerItem * quantity : 0);
    }, 0);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!bookingData.bookingDate || !bookingData.timeSlot) {
      setError('Please select a date and time slot');
      return;
    }

    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    if (paymentMethod === 'pay_now' && !selectedPaymentOption) {
      setError('Please select bKash or Nagad');
      return;
    }

    if (paymentMethod === 'pay_now' && !transactionId.trim()) {
      setError('Please enter transaction ID');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));

      // Calculate total price (fixed 3000 BDT per field, not multiplied by players)
      const fieldPrice = 3000;
      const equipmentCost = calculateEquipmentCost();
      const lockerCost = lockerBooked && field.lockerAvailable ? (field.lockerPrice || 200) : 0;
      const totalPrice = fieldPrice + equipmentCost + lockerCost;

      // Prepare rented equipment array
      const rentedEquipmentArray = Object.entries(rentedEquipment).map(([name, quantity]) => {
        const equipment = field.equipment.find(e => e.name === name);
        return {
          name,
          quantity,
          pricePerItem: equipment ? equipment.pricePerItem : 100,
        };
      });

      const bookingPayload = {
        field: fieldId,
        bookingDate: new Date(bookingData.bookingDate).toISOString(),
        timeSlot: bookingData.timeSlot,
        numberOfPlayers: bookingData.numberOfPlayers,
        totalPrice: totalPrice,
        paymentMethod: paymentMethod === 'pay_later' ? 'pay_later' : selectedPaymentOption,
        transactionId: paymentMethod === 'pay_now' ? transactionId : null,
        rentedEquipment: rentedEquipmentArray,
        lockerBooked: lockerBooked,
      };

      const response = await fetch(
        `http://localhost:3000/api/bookings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            userid: userData._id,
          },
          body: JSON.stringify(bookingPayload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to book field: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Booking response from backend:', data.booking);
      console.log('Booking status:', data.booking?.status);

      setSuccess('Booking request submitted! Awaiting admin confirmation. You will see the status in your bookings.');
      setTimeout(() => {
        navigate('/bookings');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to book field');
    }
  };

  if (!user || user.role !== 'Player') {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600 mt-2">Only players can book fields.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading field details...</p>
        </div>
      </div>
    );
  }

  if (!field) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Field Not Found</h1>
          <button
            onClick={() => navigate('/available-fields')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Fields
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/available-fields')}
          className="mb-6 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
        >
          ← Back to Fields
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Field Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
                <h1 className="text-3xl font-bold mb-2">{field.fieldName}</h1>
                <p className="text-blue-100">{field.fieldType}</p>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Location</p>
                    <p className="font-semibold text-gray-900">{field.fieldLocation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Capacity</p>
                    <p className="font-semibold text-gray-900">{field.fieldCapacity} players</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Price</p>
                    <p className="font-bold text-green-600">${field.pricePerHour}/hour</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      Available
                    </span>
                  </div>
                </div>

                {field.description && (
                  <div className="border-t border-gray-200 pt-6">
                    <h2 className="font-bold text-gray-900 mb-2">Description</h2>
                    <p className="text-gray-700">{field.description}</p>
                  </div>
                )}

                {field.amenities && field.amenities.length > 0 && (
                  <div className="border-t border-gray-200 pt-6">
                    <h2 className="font-bold text-gray-900 mb-3">Amenities</h2>
                    <div className="flex flex-wrap gap-2">
                      {field.amenities.map((amenity, idx) => (
                        <span
                          key={idx}
                          className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                        >
                          ✓ {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-6">
                  <h2 className="font-bold text-gray-900 mb-3">Owner Information</h2>
                  <p className="font-semibold text-gray-900">
                    {field.fieldOwner.firstName} {field.fieldOwner.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{field.fieldOwner.email}</p>
                  <p className="text-sm text-gray-600">{field.fieldOwner.mobile}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Book This Field</h2>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-3 py-2 rounded-lg text-sm">
                  {success}
                </div>
              )}

              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date *
                  </label>
                  <input
                    type="date"
                    name="bookingDate"
                    value={bookingData.bookingDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {loadingSlots && bookingData.bookingDate && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-2">Loading available slots...</p>
                  </div>
                )}

                {!loadingSlots && bookingData.bookingDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Time *
                    </label>
                    {availableSlots.length === 0 ? (
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        No available slots for this date
                      </p>
                    ) : (
                      <select
                        name="timeSlot"
                        value={bookingData.timeSlot}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select a time slot</option>
                        {availableSlots.map((slot, idx) => (
                          <option
                            key={idx}
                            value={slot.time}
                            disabled={slot.isBooked}
                          >
                            {slot.time} {slot.isBooked ? '(Booked)' : ''}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Players
                  </label>
                  <input
                    type="number"
                    name="numberOfPlayers"
                    value={bookingData.numberOfPlayers}
                    onChange={handleInputChange}
                    min="1"
                    max={field.fieldCapacity}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Max capacity: {field.fieldCapacity} players
                  </p>
                </div>

                {/* Equipment Rental Section */}
                {field.equipment && field.equipment.length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Rent Equipment (Optional)
                    </label>
                    <div className="space-y-3">
                      {field.equipment.filter(eq => eq.available).map((equipment, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{equipment.name}</p>
                            <p className="text-sm text-gray-600">৳{equipment.pricePerItem} per item</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleEquipmentChange(equipment.name, Math.max(0, (rentedEquipment[equipment.name] || 0) - 1))}
                              className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-medium">
                              {rentedEquipment[equipment.name] || 0}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleEquipmentChange(equipment.name, (rentedEquipment[equipment.name] || 0) + 1)}
                              className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {calculateEquipmentCost() > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700">
                          Equipment Cost: <span className="text-blue-600">৳{calculateEquipmentCost()}</span>
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Locker Booking Option */}
                {field.lockerAvailable && (
                  <div className="border-t border-gray-200 pt-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lockerBooked}
                        onChange={(e) => setLockerBooked(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Book Locker (+৳{field.lockerPrice || 200} BDT)
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1 ml-6">
                      Secure storage for your belongings during the game
                    </p>
                  </div>
                )}

                {/* Payment Method Selection */}
                <div className="border-t border-gray-200 pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payment Method *
                  </label>
                  
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod('pay_later');
                        setSelectedPaymentOption('');
                        setTransactionId('');
                      }}
                      className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                        paymentMethod === 'pay_later'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">Pay Later</span>
                        {paymentMethod === 'pay_later' && (
                          <span className="text-blue-600">✓</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Pay when you arrive at the field
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pay_now')}
                      className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                        paymentMethod === 'pay_now'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">Pay Now</span>
                        {paymentMethod === 'pay_now' && (
                          <span className="text-blue-600">✓</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Pay via bKash or Nagad
                      </p>
                    </button>
                  </div>

                  {/* Payment Options - Show when Pay Now is selected */}
                  {paymentMethod === 'pay_now' && (
                    <div className="mt-4 space-y-3">
                      <p className="text-sm font-medium text-gray-700">Select Payment Option:</p>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedPaymentOption('bkash')}
                          className={`p-3 border-2 rounded-lg transition-all ${
                            selectedPaymentOption === 'bkash'
                              ? 'border-pink-500 bg-pink-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-center">
                            <span className="font-bold text-pink-600">bKash</span>
                            {selectedPaymentOption === 'bkash' && (
                              <span className="block text-pink-600 mt-1">✓</span>
                            )}
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedPaymentOption('nagad')}
                          className={`p-3 border-2 rounded-lg transition-all ${
                            selectedPaymentOption === 'nagad'
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-center">
                            <span className="font-bold text-orange-600">Nagad</span>
                            {selectedPaymentOption === 'nagad' && (
                              <span className="block text-orange-600 mt-1">✓</span>
                            )}
                          </div>
                        </button>
                      </div>

                      {/* Transaction ID Input */}
                      {selectedPaymentOption && (
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Transaction ID *
                          </label>
                          <input
                            type="text"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            placeholder="Enter your transaction ID"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <p className="text-xs text-gray-600 mt-1">
                            Enter the transaction ID from your {selectedPaymentOption === 'bkash' ? 'bKash' : 'Nagad'} payment
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Field Price:</span>
                      <span className="font-semibold text-gray-900">৳3000</span>
                    </div>
                    {calculateEquipmentCost() > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Equipment:</span>
                        <span className="font-semibold text-gray-900">৳{calculateEquipmentCost()}</span>
                      </div>
                    )}
                    {lockerBooked && field.lockerAvailable && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Locker:</span>
                        <span className="font-semibold text-gray-900">৳{field.lockerPrice || 200}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-gray-900 font-medium">Total:</span>
                      <span className="text-2xl font-bold text-green-600">
                        ৳{3000 + calculateEquipmentCost() + (lockerBooked && field.lockerAvailable ? (field.lockerPrice || 200) : 0)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!bookingData.bookingDate || !bookingData.timeSlot || !paymentMethod}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Booking
                  </button>
                </div>

                <p className="text-xs text-gray-600 text-center">
                  You will receive a confirmation email shortly
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookField;
