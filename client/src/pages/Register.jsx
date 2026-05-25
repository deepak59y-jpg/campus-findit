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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8 bg-slate-50">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Create Account</h2>
            <p className="text-slate-500 mt-2 text-sm">Join FindIt to report lost & found campus items</p>
          </div>

          {/* Form Alerts */}
          {uiError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
              <div className="flex">
                <svg className="w-5 h-5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{uiError}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-1.5" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition text-slate-800 placeholder-slate-400"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-1.5" htmlFor="email">
                Campus Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition text-slate-800 placeholder-slate-400"
                placeholder="student@campus.edu"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition text-slate-800 placeholder-slate-400"
                placeholder="••••••••"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-1.5" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition text-slate-800 placeholder-slate-400"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-xl text-white font-semibold text-sm transition btn-hover-effect flex items-center justify-center space-x-2 ${
                isSubmitting ? 'bg-brand-400 cursor-not-allowed' : 'bg-gradient-brand hover:shadow-brand-500/20'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
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
          <div className="text-center mt-6">
            <p className="text-slate-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-500 hover:text-brand-600 font-semibold hover:underline">
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
