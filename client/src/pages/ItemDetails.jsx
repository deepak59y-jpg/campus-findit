import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../services/api';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form states
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    type: '',
    image: '',
  });
  const [editError, setEditError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch item details
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/items/${id}`);
        if (res.data && res.data.item) {
          setItem(res.data.item);
          // Pre-populate edit form fields
          const i = res.data.item;
          setEditForm({
            title: i.title,
            description: i.description,
            category: i.category || 'Other',
            location: i.location || '',
            type: i.type,
            image: i.image || '',
          });
        }
      } catch (err) {
        setError(err.message || 'Failed to load item details.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Submit updated item info
  const handleUpdate = async (e) => {
    e.preventDefault();
    setEditError(null);
    setIsUpdating(true);

    if (!editForm.title.trim() || !editForm.description.trim() || !editForm.location.trim()) {
      setEditError('Title, description, and location are required fields');
      setIsUpdating(false);
      return;
    }

    try {
      const res = await api.put(`/items/${id}`, editForm);
      if (res.data && res.data.success) {
        setItem(res.data.item);
        setIsEditing(false);
      }
    } catch (err) {
      setEditError(err.message || 'Failed to update item report.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Mark item as resolved
  const handleToggleResolve = async () => {
    try {
      const updatedResolvedState = !item.resolved;
      const res = await api.put(`/items/${id}`, { resolved: updatedResolvedState });
      if (res.data && res.data.success) {
        setItem(res.data.item);
      }
    } catch (err) {
      alert(err.message || 'Failed to update resolution status.');
    }
  };

  // Delete item report
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this lost/found notice permanently?')) {
      return;
    }
    setIsDeleting(true);
    try {
      await api.delete(`/items/${id}`);
      navigate('/');
    } catch (err) {
      alert(err.message || 'Failed to delete item report.');
      setIsDeleting(false);
    }
  };

  // Safely check ownership
  const isOwner =
    user &&
    item &&
    item.user &&
    (user.id === item.user._id || user.id === item.user.id || user._id === item.user._id);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="text-gray-400 mt-4 text-xs font-semibold uppercase tracking-wider">Loading report details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-red-950/20 border border-red-500/30 text-red-250 p-6 rounded-2xl">
          <p className="font-bold text-sm">{error}</p>
          <Link to="/" className="mt-4 inline-block text-indigo-400 hover:text-indigo-300 font-bold text-xs uppercase tracking-wider">
            &larr; Back to Campus Feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 animate-fade-in">
      {/* Back button */}
      <Link to="/" className="inline-flex items-center text-gray-400 hover:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6 transition duration-300">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to Campus Feed
      </Link>

      <div className="glass-card rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
        {isEditing ? (
          /* Inline Edit Form Layout */
          <div className="p-6 md:p-8">
            <h2 className="text-xl font-bold text-white border-b border-white/5 pb-4 mb-6">
              Edit Report: {item.title}
            </h2>

            {editError && (
              <div className="mb-6 p-4 bg-red-955/20 border border-red-550/30 text-red-250 text-xs font-semibold rounded-2xl">
                {editError}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">Item Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition text-white text-sm"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">Notice Type</label>
                  <select
                    name="type"
                    value={editForm.type}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 rounded-xl border border-white/5 bg-[#111827] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition text-white text-sm"
                  >
                    <option value="lost">Lost</option>
                    <option value="found">Found</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={editForm.category}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition text-white text-sm"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={editForm.location}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition text-white text-sm"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={editForm.image}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition text-white text-sm"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">Description</label>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition text-white text-sm"
                  ></textarea>
                </div>
              </div>

              {/* Form buttons */}
              <div className="flex gap-4 pt-4 border-t border-white/5 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 border border-white/5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className={`px-6 py-3 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex-1 flex items-center justify-center space-x-2 shadow-[0_4px_20px_rgba(99,102,241,0.2)] ${
                    isUpdating 
                      ? 'bg-indigo-700/50 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-500'
                  }`}
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Read View Details Layout */
          <div className="flex flex-col md:flex-row">
            
            {/* Image side */}
            <div className="w-full md:w-1/2 bg-gray-950/40 relative min-h-[300px] md:min-h-[450px] flex items-center justify-center border-b md:border-b-0 md:border-r border-white/5">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover max-h-[500px]"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=80&w=400';
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-indigo-400">
                  <svg className="w-16 h-16 stroke-[1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span className="font-semibold text-xs mt-3 text-gray-500 uppercase tracking-widest">No Image Provided</span>
                </div>
              )}

              {/* Status Badges on Image */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  item.type === 'lost' 
                    ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
                    : 'bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]'
                }`}>
                  {item.type}
                </span>
                
                {item.resolved && (
                  <span className="bg-gray-900/90 backdrop-blur-sm text-gray-100 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md">
                    Resolved
                  </span>
                )}
              </div>
            </div>

            {/* Information side */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
              <div>
                
                {/* Category & Date */}
                <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                  <span>Category: {item.category || 'Other'}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight font-sans">
                  {item.title}
                </h1>

                {/* Location Box */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center mb-6">
                  <div className="bg-indigo-500/10 p-3 rounded-xl text-indigo-400 mr-4 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Reported Location</p>
                    <p className="text-white font-bold text-sm mt-0.5">{item.location}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Notice Details</h3>
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line font-medium">
                    {item.description}
                  </p>
                </div>

                <hr className="border-white/5 my-6" />

                {/* Reporter information */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-gray-550 uppercase tracking-wider mb-3.5">Reported By</h3>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center mr-3.5 shrink-0">
                      {item.user?.name ? item.user.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{item.user?.name || 'Anonymous User'}</p>
                      
                      {/* Only expose contact email if user is logged in, to prevent spam */}
                      {user ? (
                        <p className="text-gray-400 text-xs mt-1 flex items-center">
                          <svg className="w-3.5 h-3.5 mr-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <a href={`mailto:${item.user?.email}`} className="text-indigo-400 font-semibold hover:underline">
                            {item.user?.email || 'N/A'}
                          </a>
                        </p>
                      ) : (
                        <p className="text-gray-500 text-xs mt-1">
                          <Link to="/login" className="text-indigo-400 font-semibold hover:underline">Log in</Link> to view contact email.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Owner actions section */}
              {isOwner && (
                <div className="border-t border-white/5 pt-6 mt-6 space-y-3">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 px-4 py-2.5 border border-white/5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-bold text-xs uppercase tracking-wider transition duration-300 flex items-center justify-center space-x-1.5"
                    >
                      <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                      </svg>
                      <span>Edit Details</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex-1 px-4 py-2.5 border border-red-500/20 bg-red-500/5 hover:bg-red-650 hover:text-white text-red-400 rounded-xl font-bold text-xs uppercase tracking-wider transition duration-300 flex items-center justify-center space-x-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      <span>{isDeleting ? 'Deleting...' : 'Delete Notice'}</span>
                    </button>
                  </div>
                  
                  <button
                    onClick={handleToggleResolve}
                    className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition duration-300 ${
                      item.resolved
                        ? 'bg-white/5 border border-white/5 text-gray-300 hover:bg-white/10'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_4px_15px_rgba(99,102,241,0.3)]'
                    }`}
                  >
                    {item.resolved ? 'Mark as Active / Re-open' : 'Mark as Resolved / Found Owner'}
                  </button>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetails;
