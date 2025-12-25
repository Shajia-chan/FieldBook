import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Handle navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  // Check if on homepage
  const isHomepage = location.pathname === '/';
  // Use white theme when on homepage and not scrolled, otherwise use dark theme
  const useWhiteTheme = isHomepage && !scrolled;

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled || !isHomepage ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="/logo.png" 
              alt="FieldBook Logo" 
              className="h-10 w-10 object-contain transition-transform group-hover:scale-110"
            />
            <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              FieldBook
            </span>
          </Link>

          {/* Main Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { path: '/', label: 'Home' },
              { path: '/available-fields', label: 'Available Fields' },
              { path: '/tournaments', label: 'Tournaments' },
              { path: '/bookings', label: 'View Bookings' },
              { path: '/about', label: 'About' }
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === path
                    ? useWhiteTheme 
                      ? 'bg-white/20 text-white backdrop-blur-sm'
                      : 'bg-green-50 text-green-700'
                    : useWhiteTheme
                      ? 'text-white hover:bg-white/10'
                      : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Search Button */}
            <button className={`p-2 rounded-lg transition-colors ${
              useWhiteTheme ? 'hover:bg-white/10' : 'hover:bg-gray-100'
            }`}>
              <svg className={`w-5 h-5 transition-colors ${
                useWhiteTheme ? 'text-white' : 'text-gray-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Auth Section */}
            {isAuthenticated() ? (
              // Logged In - User Menu
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    useWhiteTheme ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-green-600 flex items-center justify-center text-white text-sm font-bold">
                    {user?.firstName?.charAt(0).toUpperCase()}
                  </div>
                  <span className={`text-sm font-medium ${
                    useWhiteTheme ? 'text-white' : 'text-gray-700'
                  }`}>{user?.firstName}</span>
                  <svg className={`w-4 h-4 transition-transform ${
                    useWhiteTheme ? 'text-white' : 'text-gray-500'
                  } ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Header with Gradient */}
                    <div className="px-5 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-lg font-bold border-2 border-white/30">
                          {user?.firstName?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate">{user?.firstName} {user?.lastName}</p>
                          <p className="text-xs text-green-100 truncate">{user?.email}</p>
                        </div>
                      </div>
                      <div className="inline-flex items-center px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                        <span className="text-xs font-semibold">{user?.role?.replace('_', ' ')}</span>
                      </div>
                    </div>

                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 transition-all group"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-blue-500 flex items-center justify-center transition-all">
                          <svg className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <span className="group-hover:text-green-700 transition-colors">My Profile</span>
                      </Link>

                      {user?.role === 'Player' && (
                        <Link
                          to="/player-dashboard"
                          className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 transition-all group"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-blue-500 flex items-center justify-center transition-all">
                            <svg className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <span className="group-hover:text-green-700 transition-colors">Player Dashboard</span>
                        </Link>
                      )}

                      {user?.role === 'Field_Owner' && (
                        <>
                          <Link
                            to="/manage-fields"
                            className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 transition-all group"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-blue-500 flex items-center justify-center transition-all">
                              <svg className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                              </svg>
                            </div>
                            <span className="group-hover:text-green-700 transition-colors">Manage Fields</span>
                          </Link>
                          <Link
                            to="/field-owner-dashboard"
                            className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 transition-all group"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-blue-500 flex items-center justify-center transition-all">
                              <svg className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                            </div>
                            <span className="group-hover:text-green-700 transition-colors">Owner Dashboard</span>
                          </Link>
                        </>
                      )}

                      {user?.role === 'Admin' && (
                        <>
                          <Link
                            to="/admin-dashboard"
                            className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 transition-all group"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-blue-500 flex items-center justify-center transition-all">
                              <svg className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <span className="group-hover:text-green-700 transition-colors">Admin Dashboard</span>
                          </Link>
                          <Link
                            to="/admin-tournaments"
                            className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 transition-all group"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-blue-500 flex items-center justify-center transition-all">
                              <svg className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                              </svg>
                            </div>
                            <span className="group-hover:text-green-700 transition-colors">Manage Tournaments</span>
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="border-t border-gray-100 my-2" />

                    <div className="px-2 pb-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-all">
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </div>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Not Logged In - Auth Buttons
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    useWhiteTheme 
                      ? 'text-white hover:bg-white/10' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              className={`p-2 rounded-lg transition-colors md:hidden ${
                useWhiteTheme ? 'hover:bg-white/10' : 'hover:bg-gray-100'
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className={`w-6 h-6 ${
                useWhiteTheme ? 'text-white' : 'text-gray-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden">
              <div className="px-4 py-2 space-y-1">
                {[
                  { path: '/', label: 'Home' },
                  { path: '/available-fields', label: 'Available Fields' },
                  { path: '/tournaments', label: 'Tournaments' },
                  { path: '/bookings', label: 'View Bookings' },
                  { path: '/about', label: 'About' }
                ].map(({ path, label }) => (
                  <Link
                    key={path}
                    to={path}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
                {isAuthenticated() && (
                  <>
                    <div className="border-t border-gray-200 my-2" />
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      👤 My Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      🚪 Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
