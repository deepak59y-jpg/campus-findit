import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateItem = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Electronics', // Default categories
    location: '',
    type: 'lost',
    image: '',
  });

  const [uiError, setUiError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { title, description, category, location, type, image } = formData;

  const categories = [
    'Electronics',
    'Books & Stationary',
    'Clothing & Accessories',
    'IDs & Cards',
    'Keys',
    'Bags & Wallets',
    'Other',
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUiError(null);
    setSuccess(false);

    // Basic frontend checks
    if (!title.trim() || !description.trim() || !location.trim()) {
      setUiError('Title, description, and location are required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/items', {
        title,
        description,
        category,
        location,
        type,
        image,
      });

      if (res.data && res.data.success) {
        setSuccess(true);
        // Clear form
        setFormData({
          title: '',
          description: '',
          category: 'Electronics',
          location: '',
          type: 'lost',
          image: '',
        });
        
        // Redirect to details page or home after a brief delay
        setTimeout(() => {
          navigate(`/items/${res.data.item._id}`);
        }, 1500);
      }
    } catch (err) {
      setUiError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
        
        {/* Header */}
        <div className="border-b border-slate-100 pb-5 mb-6">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Report Lost/Found Item</h1>
          <p className="text-slate-500 mt-2 text-sm">
            Fill in the details below to publish this notice on the campus feed.
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm rounded-r-lg">
            <div className="flex">
              <svg className="w-5 h-5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-bold">Notice published successfully!</p>
                <p className="text-xs mt-0.5">Redirecting you to the details page...</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-slate-700 text-sm font-semibold mb-2" htmlFor="title">
                Item Name / Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition text-slate-800 placeholder-slate-450"
                placeholder="e.g. Black Leather Wallet, iPhone 13 Pro"
              />
            </div>

            {/* Type Dropdown */}
            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-2" htmlFor="type">
                Notice Type <span className="text-red-500">*</span>
              </label>
              <select
                id="type"
                name="type"
                value={type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition text-slate-800 bg-white"
              >
                <option value="lost">Lost Item</option>
                <option value="found">Found Item</option>
              </select>
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-2" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition text-slate-800 bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-2" htmlFor="location">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={location}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition text-slate-800 placeholder-slate-400"
                placeholder="e.g. Library 2nd Floor, Engineering Block Café"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-2" htmlFor="image">
                Image URL
              </label>
              <input
                id="image"
                name="image"
                type="text"
                value={image}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition text-slate-800 placeholder-slate-400"
                placeholder="e.g. https://images.unsplash.com/..."
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-slate-700 text-sm font-semibold mb-2" htmlFor="description">
                Description / Key details <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition text-slate-800 placeholder-slate-400 text-sm leading-relaxed"
                placeholder="Describe the item's key features (e.g. brand, color, custom stickers, content details for wallets, etc.). Avoid giving out extremely confidential details (like PINs/passwords)!"
              ></textarea>
            </div>

            {/* Image Preview Box */}
            {image && (
              <div className="md:col-span-2 bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center">
                <p className="text-xs font-semibold text-slate-400 mb-2 align-self-start">Live Preview:</p>
                <img
                  src={image}
                  alt="Item upload preview"
                  className="max-h-48 rounded-lg object-contain shadow-sm"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-50 transition flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 text-white rounded-xl font-bold text-sm transition btn-hover-effect flex-1 flex items-center justify-center space-x-2 ${
                isSubmitting ? 'bg-brand-400 cursor-not-allowed' : 'bg-gradient-brand'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Publishing...</span>
                </>
              ) : (
                <span>Publish Report</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default CreateItem;
