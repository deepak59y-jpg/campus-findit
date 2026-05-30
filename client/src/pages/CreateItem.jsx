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
    <div className="max-w-6xl mx-auto px-4 py-4 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Container (Left Column) */}
        <div className="lg:col-span-7">
          <div className="glass-card rounded-3xl border border-white/10 p-6 md:p-8 shadow-2xl">
            
            {/* Header */}
            <div className="border-b border-white/5 pb-5 mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                Report Campus Item
              </h1>
              <p className="text-gray-400 mt-2 text-xs font-semibold uppercase tracking-wider">
                Fill details to publish notice on the feed
              </p>
            </div>

            {/* Success Alert */}
            {success && (
              <div className="mb-6 p-4 bg-green-950/20 border border-green-500/30 text-green-250 text-xs font-semibold rounded-2xl flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-bold">Notice published successfully!</p>
                  <p className="text-[10px] text-green-400 mt-0.5">Redirecting to details page...</p>
                </div>
              </div>
            )}

            {/* Error Alert */}
            {uiError && (
              <div className="mb-6 p-4 bg-red-950/20 border border-red-500/30 text-red-250 text-xs font-semibold rounded-2xl flex items-center space-x-2">
                <svg className="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{uiError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="title">
                    Item Title / Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition text-white placeholder-gray-600 text-sm"
                    placeholder="e.g. Leather Wallet, iPhone 13 Pro"
                  />
                </div>

                {/* Type Dropdown */}
                <div>
                  <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="type">
                    Notice Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-white/5 bg-[#111827] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition text-white text-sm"
                  >
                    <option value="lost">Lost Item</option>
                    <option value="found">Found Item</option>
                  </select>
                </div>

                {/* Category Dropdown */}
                <div>
                  <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="category">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-white/5 bg-[#111827] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition text-white text-sm"
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
                  <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="location">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition text-white placeholder-gray-600 text-sm"
                    placeholder="e.g. Library 2nd Floor, Café"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="image">
                    Image URL
                  </label>
                  <input
                    id="image"
                    name="image"
                    type="text"
                    value={image}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition text-white placeholder-gray-600 text-sm"
                    placeholder="e.g. https://images.unsplash.com/..."
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="description">
                    Description & Key details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition text-white placeholder-gray-600 text-sm leading-relaxed"
                    placeholder="Describe the item (brand, color, markings). Do not post sensitive keys/PINs."
                  ></textarea>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-6 py-3 border border-white/5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex-1 flex items-center justify-center space-x-2 shadow-[0_4px_20px_rgba(99,102,241,0.2)] ${
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

        {/* Live Preview & Drag-Drop UI (Right Column) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28 lg:h-fit">
          <div className="glass-card rounded-3xl border border-white/10 p-6 shadow-2xl">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">Live Preview</h3>
            
            {/* Render dynamic preview card */}
            <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-full border border-white/10">
              <div className="relative h-48 w-full bg-gray-900/60 overflow-hidden shrink-0">
                {image ? (
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-950/20 text-indigo-400">
                    <svg className="w-12 h-12 stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span className="text-[10px] font-bold mt-2 text-indigo-350 tracking-widest uppercase">Preview Image</span>
                  </div>
                )}
                
                {/* Badges */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase shadow-md ${
                      type === 'lost'
                        ? 'bg-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                        : 'bg-green-500 text-white shadow-[0_0_12px_rgba(34,197,94,0.5)]'
                    }`}
                  >
                    {type}
                  </span>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <div className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-1.5">
                  {category || 'Other'}
                </div>
                <h4 className="text-sm font-bold text-white line-clamp-1 mb-1.5">
                  {title || 'Untitled Item'}
                </h4>
                <p className="text-gray-400 text-xs line-clamp-2 mb-4 leading-relaxed">
                  {description || 'Provide a detailed description of your item on the left form...'}
                </p>

                <div className="border-t border-white/5 pt-4 mt-auto space-y-2">
                  {/* Location Info */}
                  <div className="flex items-center text-gray-400 text-[11px]">
                    <svg className="w-3.5 h-3.5 mr-1.5 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    </svg>
                    <span className="truncate font-medium">At: {location || 'Not Specified'}</span>
                  </div>
                  
                  {/* Footer Meta */}
                  <div className="flex items-center justify-between text-gray-500 text-[10px]">
                    <span>Today</span>
                    <span>By: You</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drag-drop Style Appearance Box */}
            <div className="mt-6 border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-white/[0.01]">
              <svg className="w-8 h-8 text-gray-500 mb-2 stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
              </svg>
              <h5 className="text-xs font-bold text-white mb-1">Upload files or drag here</h5>
              <p className="text-[10px] text-gray-500 max-w-[200px]">
                Currently, we only support remote image links. Paste your link in the "Image URL" field.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CreateItem;
