import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="glass-nav sticky top-0 z-50 w-full transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-brand-600 hover:text-brand-700 transition">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
              </svg>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-brand bg-clip-text text-transparent">
                Campus FindIt
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-slate-600 hover:text-brand-600 font-medium transition text-sm">
              Home
            </Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-slate-600 hover:text-brand-600 font-medium transition text-sm">
                  Dashboard
                </Link>
                <Link 
                  to="/create" 
                  className="bg-brand-500 hover:bg-brand-600 text-white font-medium px-4 py-2 rounded-lg text-sm transition btn-hover-effect"
                >
                  Report Item
                </Link>
                <div className="h-4 w-px bg-slate-200"></div>
                <div className="flex items-center space-x-3">
                  <span className="text-slate-700 font-semibold text-sm">
                    Hi, {user.name.split(' ')[0]}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="text-slate-500 hover:text-red-500 text-sm font-medium transition duration-200"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-brand-600 font-medium transition text-sm">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition btn-hover-effect"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-brand-600 hover:bg-slate-100 focus:outline-none transition"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden animate-fade-in" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-b border-slate-150">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50 transition"
            >
              Home
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50 transition"
                >
                  Dashboard
                </Link>
                <Link
                  to="/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium bg-brand-50 text-brand-600 hover:bg-brand-100 transition"
                >
                  Report Item
                </Link>
                <div className="border-t border-slate-100 my-2 pt-2"></div>
                <div className="px-3 py-1 text-slate-500 text-sm">
                  Logged in as <span className="font-semibold text-slate-700">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-slate-100 my-2 pt-2"></div>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium bg-brand-500 text-white hover:bg-brand-600 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
