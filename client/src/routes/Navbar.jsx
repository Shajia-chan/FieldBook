import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { i18n } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-sm shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img src="/" alt="react" className="h-16 w-16 transition-transform group-hover:scale-110"/>
              <div className="absolute inset-0 bg-blue-500/20 rounded-full filter blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">FieldBook</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {[ 
              { path: '/', label: 'Home' },
              { path: '/booking', label: 'Book Field' },
              { path: '/bookings', label: 'View Bookings' },
              { path: '/about', label: 'About' }
            ].map(({ path, label }) => (
              <Link key={path} to={path} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                location.pathname === path ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'
              }`}>{label}</Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex gap-2">
              <button onClick={() => changeLanguage('en')} className="px-2 py-1 border rounded">EN</button>
              <button onClick={() => changeLanguage('bn')} className="px-2 py-1 border rounded">বাংলা</button>
            </div>

            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <div className="flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">Log in</Link>
              <Link to="/booking" className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-sm">Book Now</Link>
            </div>

            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden">
              <div className="px-4 py-2 space-y-1">
                {[ 
                  { path: '/', label: 'Home' },
                  { path: '/booking', label: 'Book Field' },
                  { path: '/bookings', label: 'View Bookings' },
                  { path: '/about', label: 'About' }
                ].map(({ path, label }) => (
                  <Link key={path} to={path} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>{label}</Link>
                ))}

                <div className="flex gap-2 mt-2">
                  <button onClick={() => changeLanguage('en')} className="px-2 py-1 border rounded">EN</button>
                  <button onClick={() => changeLanguage('bn')} className="px-2 py-1 border rounded">বাংলা</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;


