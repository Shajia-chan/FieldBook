import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout and Pages
import Layout from "./routes/Layout.jsx";
import Homepage from "./routes/Homepage.jsx";
import Booking from "./routes/Booking.jsx";
import Bookings from "./routes/Bookings.jsx";
import Login from "./routes/Login.jsx";
import Register from "./routes/Register.jsx";

// Search Component
import SearchFields from "./components/SearchFields.jsx";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Homepage (you can include SearchFields inside Homepage if desired) */}
          <Route 
            path="/" 
            element={
              <>
                <Homepage />
                <SearchFields /> {/* Show search directly on homepage */}
              </>
            } 
          />

          {/* Dedicated search page if you want separate route */}
          <Route path="/search" element={<SearchFields />} />

          {/* Booking routes */}
          <Route path="/booking" element={<Booking />} />
          <Route path="/bookings" element={<Bookings />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 404 Not Found page */}
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600">Page not found</p>
                </div>
              </div>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;

