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
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
        <p className="text-slate-500 mt-4 font-medium">Fetching details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl">
          <p className="font-semibold text-lg">{error}</p>
          <Link to="/" className="mt-4 inline-block text-brand-500 hover:text-brand-600 font-semibold text-sm">
            &larr; Back to Campus Feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      {/* Back button */}
      <Link to="/" className="inline-flex items-center text-slate-500 hover:text-brand-600 text-sm font-semibold mb-6 transition">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to Campus Feed
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {isEditing ? (
          /* Inline Edit Form Layout */
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6">
              Edit Report: {item.title}
            </h2>

            {editError && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 border-l-4 border-red-500 text-sm rounded-r-lg">
                {editError}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-slate-700 text-sm font-semibold mb-1.5">Item Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition text-slate-800"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-slate-700 text-sm font-semibold mb-1.5">Notice Type</label>
                  <select
                    name="type"
                    value={editForm.type}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition text-slate-800 bg-white"
                  >
                    <option value="lost">Lost</option>
                    <option value="found">Found</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-slate-700 text-sm font-semibold mb-1.5">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={editForm.category}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition text-slate-800"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-slate-700 text-sm font-semibold mb-1.5">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={editForm.location}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition text-slate-800"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-slate-700 text-sm font-semibold mb-1.5">Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={editForm.image}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition text-slate-800"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-slate-700 text-sm font-semibold mb-1.5">Description</label>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition text-slate-800 text-sm"
                  ></textarea>
                </div>
              </div>

              {/* Form buttons */}
              <div className="flex gap-4 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-50 transition flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className={`px-5 py-2.5 text-white rounded-xl font-bold text-sm transition btn-hover-effect flex-1 flex items-center justify-center space-x-2 ${
                    isUpdating ? 'bg-brand-400 cursor-not-allowed' : 'bg-gradient-brand'
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
            <div className="w-full md:w-1/2 bg-slate-50 relative min-h-[300px] flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
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
                <div className="flex flex-col items-center justify-center p-8 text-brand-400">
                  <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span className="font-semibold text-sm mt-3 text-slate-400">No Image Provided</span>
                </div>
              )}

              {/* Status Badges on Image */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow ${
                  item.type === 'lost' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                }`}>
                  {item.type}
                </span>
                
                {item.resolved && (
                  <span className="bg-slate-800/90 backdrop-blur-sm text-slate-100 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow">
                    Resolved
                  </span>
                )}
              </div>
            </div>

            {/* Information side */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
              <div>
                
                {/* Category & Date */}
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                  <span>Category: {item.category || 'Other'}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-extrabold text-slate-800 mb-4 leading-tight">{item.title}</h1>

                {/* Location Box */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center mb-6">
                  <div className="bg-brand-50 p-2.5 rounded-xl text-brand-500 mr-4 shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Reported Location</p>
                    <p className="text-slate-800 font-bold mt-0.5">{item.location}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Notice details:</h3>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{item.description}</p>
                </div>

                <hr className="border-slate-100 my-6" />

                {/* Reporter information */}
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Reported By:</h3>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 font-bold flex items-center justify-center mr-3.5 shrink-0">
                      {item.user?.name ? item.user.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div>
                      <p className="text-slate-800 font-bold text-sm">{item.user?.name || 'Anonymous user'}</p>
                      
                      {/* Only expose contact email if user is logged in, to prevent spam */}
                      {user ? (
                        <p className="text-slate-500 text-xs mt-0.5">
                          Email: <a href={`mailto:${item.user?.email}`} className="text-brand-500 font-semibold hover:underline">{item.user?.email || 'N/A'}</a>
                        </p>
                      ) : (
                        <p className="text-slate-400 text-xs mt-0.5">
                          <Link to="/login" className="text-brand-500 font-semibold hover:underline">Log in</Link> to view contact email.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Owner actions section */}
              {isOwner && (
                <div className="border-t border-slate-100 pt-6 mt-6 space-y-3">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 px-4 py-2.5 border border-slate-200 hover:border-brand-200 text-slate-700 hover:text-brand-600 rounded-xl font-semibold text-xs transition duration-200 flex items-center justify-center space-x-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                      </svg>
                      <span>Edit details</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex-1 px-4 py-2.5 border border-red-200 hover:bg-red-50 text-red-600 rounded-xl font-semibold text-xs transition duration-200 flex items-center justify-center space-x-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      <span>{isDeleting ? 'Deleting...' : 'Delete Notice'}</span>
                    </button>
                  </div>
                  
                  <button
                    onClick={handleToggleResolve}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition duration-200 ${
                      item.resolved
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-brand-50 hover:bg-brand-100 text-brand-600'
                    }`}
                  >
                    {item.resolved ? 'Mark as Unresolved / Re-open' : 'Mark as Resolved / Found Owner'}
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
