import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtering & searching states
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'lost', 'found'

  // Fetch all items from API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get('/items');
        if (res.data && res.data.items) {
          setItems(res.data.items);
        }
      } catch (err) {
        setError(err.message || 'Failed to load items. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Filter items based on user choice and search string
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || item.type === typeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Hero Banner Section */}
      <div className="bg-gradient-brand text-white rounded-3xl p-8 md:p-12 mb-10 shadow-lg relative overflow-hidden">
        <div className="max-w-xl relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Campus Lost & Found
          </h1>
          <p className="text-brand-100 text-lg mb-6 font-medium">
            Lost something? Found something? Report it here to connect with fellow students and get items back to their owners.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/create"
              className="bg-white text-brand-600 font-bold px-6 py-3 rounded-xl transition duration-300 hover:bg-brand-50 hover:shadow-lg text-sm"
            >
              Report an Item
            </Link>
          </div>
        </div>
        
        {/* Subtle decorative circles */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-white/5 rounded-full -mr-20 -mb-20 pointer-events-none"></div>
        <div className="absolute right-20 top-0 w-40 h-40 bg-white/5 rounded-full -mt-10 pointer-events-none"></div>
      </div>

      {/* Control Panel: Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        
        {/* Filter buttons */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit border border-slate-200">
          {['all', 'lost', 'found'].map((filter) => (
            <button
              key={filter}
              onClick={() => setTypeFilter(filter)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold capitalize transition ${
                typeFilter === filter
                  ? 'bg-white text-brand-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative max-w-md w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search items, categories, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition text-slate-800 placeholder-slate-400 text-sm"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
          <p className="text-slate-500 mt-4 font-medium">Loading items...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="p-6 text-center max-w-lg mx-auto bg-red-50 border border-red-200 text-red-700 rounded-2xl">
          <svg className="w-12 h-12 mx-auto mb-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <p className="font-semibold text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredItems.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800">No items found</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto text-sm">
            We couldn't find any items matching your filters. Try adjusting your search query or check back later!
          </p>
          <Link
            to="/create"
            className="mt-6 inline-block bg-brand-500 hover:bg-brand-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition btn-hover-effect"
          >
            Report an Item
          </Link>
        </div>
      )}

      {/* Items Grid */}
      {!loading && !error && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item._id} 
              className="glass-card rounded-2xl overflow-hidden flex flex-col h-full transition duration-300 hover:shadow-md hover:-translate-y-0.5"
            >
              {/* Item Card Image */}
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden shrink-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition duration-500 hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=80&w=400';
                    }}
                  />
                ) : (
                  // Fallback beautiful graphic
                  <div className="w-full h-full flex flex-col items-center justify-center bg-brand-50/50 text-brand-500">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span className="text-xs font-semibold mt-2 text-brand-400">No Image Provided</span>
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {/* Lost / Found badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm ${
                      item.type === 'lost'
                        ? 'bg-red-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}
                  >
                    {item.type}
                  </span>

                  {/* Resolved status badge */}
                  {item.resolved && (
                    <span className="bg-slate-800/90 backdrop-blur-sm text-slate-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm">
                      Resolved
                    </span>
                  )}
                </div>
              </div>

              {/* Item Card Body */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  {item.category || 'Other'}
                </div>
                <h3 className="text-lg font-bold text-slate-800 line-clamp-1 mb-2 hover:text-brand-600 transition">
                  <Link to={`/items/${item._id}`}>{item.title}</Link>
                </h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-grow">
                  {item.description}
                </p>

                {/* Card Meta footer */}
                <div className="border-t border-slate-100 pt-4 mt-auto space-y-2">
                  {/* Location Info */}
                  <div className="flex items-center text-slate-500 text-xs font-medium">
                    <svg className="w-4 h-4 mr-1.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span className="truncate">At: {item.location}</span>
                  </div>

                  {/* Date & Poster Info */}
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span className="flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <span className="font-medium text-slate-500">
                      By: {item.user?.name || 'Anonymous'}
                    </span>
                  </div>
                </div>

                {/* Link details Button */}
                <Link
                  to={`/items/${item._id}`}
                  className="mt-4 w-full bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-200 text-slate-700 hover:text-brand-600 font-semibold py-2.5 px-4 rounded-xl text-center text-xs transition duration-200"
                >
                  View Details
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
