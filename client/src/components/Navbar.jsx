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
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl z-50 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-300">
      <div className="px-6 py-1">
        <div className="flex justify-between h-14 items-center">
          {/* Logo Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-all duration-300">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
              </svg>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-sans">
                FindIt
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-300 hover:text-white font-medium transition duration-300 text-sm">
              Home
            </Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-white font-medium transition duration-300 text-sm">
                  Dashboard
                </Link>
                <Link 
                  to="/create" 
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-full text-xs transition duration-300 shadow-[0_4px_12px_rgba(79,70,229,0.3)] hover:shadow-[0_4px_20px_rgba(79,70,229,0.5)] hover:scale-105"
                >
                  Report Item
                </Link>
                <div className="h-4 w-px bg-white/10"></div>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-200 font-medium text-sm flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <span>{user.name.split(' ')[0]}</span>
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-red-400 text-xs font-semibold transition duration-300"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white font-medium transition duration-300 text-sm">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-full text-xs transition duration-300 shadow-[0_4px_12px_rgba(79,70,229,0.3)] hover:shadow-[0_4px_20px_rgba(79,70,229,0.5)] hover:scale-105"
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
              className="inline-flex items-center justify-center p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none transition duration-300"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="block h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden animate-fade-in absolute top-16 left-0 right-0 rounded-3xl border border-white/10 bg-[#0B0F19]/95 backdrop-blur-xl shadow-2xl p-4 mx-2" id="mobile-menu">
          <div className="space-y-1.5">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-2xl text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 transition duration-300"
            >
              Home
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-2xl text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 transition duration-300"
                >
                  Dashboard
                </Link>
                <Link
                  to="/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-2xl text-base font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition duration-300"
                >
                  Report Item
                </Link>
                <div className="border-t border-white/5 my-2 pt-2"></div>
                <div className="px-4 py-1 text-gray-400 text-sm flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <span>Logged in as <span className="font-semibold text-white">{user.name}</span></span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2.5 rounded-2xl text-base font-medium text-red-400 hover:bg-red-500/10 transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-white/5 my-2 pt-2"></div>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-2xl text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 transition duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-2xl text-base font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition duration-300"
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


