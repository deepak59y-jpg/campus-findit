import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [uiError, setUiError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUiError(null);

    // Simple validation checks
    if (!name.trim() || !email.trim() || !password) {
      setUiError('All fields are required');
      return;
    }

    if (password.length < 6) {
      setUiError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setUiError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setUiError(err.message || 'Registration failed. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Floating Gradient Circles */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-indigo-655/10 blur-[100px] animate-pulse-glow pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-655/10 blur-[120px] animate-float pointer-events-none"></div>

      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="glass-card p-8 rounded-3xl border border-white/10 shadow-2xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight font-sans">
              Create Account
            </h2>
            <p className="text-gray-400 mt-2 text-xs font-semibold uppercase tracking-wider">
              Join FindIt to secure campus items
            </p>
          </div>

          {/* Form Alerts */}
          {uiError && (
            <div className="mb-6 p-4 bg-red-950/20 border border-red-500/30 text-red-250 text-xs font-semibold rounded-2xl">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{uiError}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all duration-300 text-white placeholder-gray-600 text-sm"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="email">
                Campus Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all duration-300 text-white placeholder-gray-600 text-sm"
                placeholder="student@campus.edu"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all duration-300 text-white placeholder-gray-600 text-sm"
                placeholder="••••••••"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all duration-300 text-white placeholder-gray-600 text-sm"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 shadow-[0_4px_20px_rgba(99,102,241,0.2)] hover:shadow-[0_4px_30px_rgba(99,102,241,0.4)] ${
                isSubmitting 
                  ? 'bg-indigo-700/50 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-500 hover:scale-[1.02]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Register</span>
              )}
            </button>
          </form>

          {/* Login Redirection */}
          <div className="text-center mt-6 border-t border-white/5 pt-5">
            <p className="text-gray-400 text-xs font-semibold">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition hover:underline">
                Login here
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
