import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./routes/Layout.jsx";
import Homepage from "./routes/Homepage.jsx";
import About from "./routes/About.jsx";
import Bookings from "./routes/Bookings.jsx";
import Login from "./routes/Login.jsx";
import Register from "./routes/Register.jsx";
import UserProfile from "./routes/UserProfile.jsx";
import PlayerDashboard from "./routes/PlayerDashboard.jsx";
import FieldOwnerDashboard from "./routes/FieldOwnerDashboard.jsx";
import AdminDashboard from "./routes/AdminDashboard.jsx";
import AdminBookingPanel from "./routes/AdminBookingPanel.jsx";
import AvailableFields from "./routes/AvailableFields.jsx";
import ManageFields from "./routes/ManageFields.jsx";
import BookField from "./routes/BookField.jsx";
import Tournaments from "./routes/Tournaments.jsx";
import AdminTournaments from "./routes/AdminTournaments.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const App = () => {
  console.log('App rendered');

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Each route should have its own unique component */}
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<About />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          
          {/* Field Booking Routes */}
          <Route path="/available-fields" element={<AvailableFields />} />
          <Route path="/manage-fields" element={<ProtectedRoute requiredRole="Field_Owner"><ManageFields /></ProtectedRoute>} />
          <Route path="/book-field/:fieldId" element={<ProtectedRoute requiredRole="Player"><BookField /></ProtectedRoute>} />
          
          {/* Tournament Routes */}
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/admin-tournaments" element={<ProtectedRoute requiredRole="Admin"><AdminTournaments /></ProtectedRoute>} />
          
          {/* Dashboard Routes */}
          <Route path="/player-dashboard" element={<ProtectedRoute requiredRole="Player"><PlayerDashboard /></ProtectedRoute>} />
          <Route path="/field-owner-dashboard" element={<ProtectedRoute requiredRole="Field_Owner"><FieldOwnerDashboard /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute requiredRole="Admin"><AdminDashboard /></ProtectedRoute>} />
          
          {/* Admin Booking Management */}
          <Route path="/admin-bookings" element={<ProtectedRoute requiredRole="Admin"><AdminBookingPanel /></ProtectedRoute>} />
          
          <Route path="*" element={
            <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600">Page not found</p>
              </div>
            </div>
          } />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;