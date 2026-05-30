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

  // Calculate statistics
  const totalListings = items.length;
  const lostItemsCount = items.filter(item => item.type === 'lost' && !item.resolved).length;
  const foundItemsCount = items.filter(item => item.type === 'found' && !item.resolved).length;
  const resolvedCount = items.filter(item => item.resolved).length;

  // Filter recently lost (limit 3)
  const recentlyLost = items.filter(item => item.type === 'lost' && !item.resolved).slice(0, 3);
  
  // Filter recently found (limit 3)
  const recentlyFound = items.filter(item => item.type === 'found' && !item.resolved).slice(0, 3);

  // Helper component for item card to maintain consistency
  const ItemCard = ({ item }) => (
    <div 
      key={item._id} 
      className="glass-card rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-[0_12px_40px_rgba(99,102,241,0.15)] group"
    >
      {/* Item Card Image */}
      <div className="relative h-52 w-full bg-gray-900/60 overflow-hidden shrink-0">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=80&w=400';
            }}
          />
        ) : (
          // Fallback graphic
          <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-950/20 text-indigo-400">
            <svg className="w-12 h-12 stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span className="text-[10px] font-semibold mt-2 text-indigo-300/60 tracking-wider uppercase">No Image</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {/* Lost / Found badge */}
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
              item.type === 'lost'
                ? 'bg-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                : 'bg-green-500 text-white shadow-[0_0_12px_rgba(34,197,94,0.5)]'
            }`}
          >
            {item.type}
          </span>

          {/* Resolved status badge */}
          {item.resolved && (
            <span className="bg-gray-900/90 backdrop-blur-sm text-gray-100 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(0,0,0,0.5)]">
              Resolved
            </span>
          )}
        </div>
      </div>

      {/* Item Card Body */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1.5">
          {item.category || 'Other'}
        </div>
        <h3 className="text-base font-bold text-white line-clamp-1 mb-2 hover:text-indigo-400 transition-colors duration-300">
          <Link to={`/items/${item._id}`}>{item.title}</Link>
        </h3>
        <p className="text-gray-400 text-xs line-clamp-2 mb-4 leading-relaxed flex-grow">
          {item.description}
        </p>

        {/* Card Meta footer */}
        <div className="border-t border-white/5 pt-4 mt-auto space-y-2">
          {/* Location Info */}
          <div className="flex items-center text-gray-400 text-xs">
            <svg className="w-3.5 h-3.5 mr-1.5 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span className="truncate font-medium">{item.location}</span>
          </div>

          {/* Date & Poster Info */}
          <div className="flex items-center justify-between text-gray-500 text-[11px]">
            <span className="flex items-center">
              <svg className="w-3 h-3 mr-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
            <span className="font-semibold text-gray-400">
              By: {item.user?.name ? item.user.name.split(' ')[0] : 'Anonymous'}
            </span>
          </div>
        </div>

        {/* View Details Button */}
        <Link
          to={`/items/${item._id}`}
          className="mt-4 w-full bg-white/5 hover:bg-indigo-600/20 border border-white/5 hover:border-indigo-500/30 text-gray-200 hover:text-indigo-400 font-bold py-2 px-4 rounded-xl text-center text-xs transition-all duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 animate-fade-in">
      
      {/* 1. Hero Banner Section */}
      <div className="relative min-h-[75vh] flex flex-col justify-center items-center text-center rounded-3xl border border-white/5 bg-gray-950/20 mb-16 overflow-hidden px-6 py-16 md:py-24">
        {/* Animated Background Mesh Orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-indigo-600/10 blur-[90px] animate-pulse-glow pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-600/10 blur-[100px] animate-float pointer-events-none"></div>
        <div className="absolute top-10 right-1/3 w-64 h-64 rounded-full bg-blue-600/5 blur-[80px] pointer-events-none"></div>

        <div className="max-w-3xl relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white via-gray-100 to-gray-450 bg-clip-text text-transparent leading-[1.1] font-sans">
            Lost Something?<br />
            FindIt Before It's Gone.
          </h1>
          <p className="text-gray-400 text-base sm:text-lg lg:text-xl mb-10 max-w-xl mx-auto font-medium">
            The fastest campus-powered lost & found network. Connect with fellow students to recover your missing gear.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/create"
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold px-8 py-4 rounded-full text-sm transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]"
            >
              Report Item
            </Link>
            <button
              onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white/10 hover:bg-white/15 text-white border border-white/10 font-bold px-8 py-4 rounded-full text-sm transition-all duration-300 backdrop-blur-md hover:scale-[1.03]"
            >
              Browse Items
            </button>
          </div>
        </div>
      </div>

      {/* 2. Floating Search Section */}
      <div id="search-section" className="scroll-mt-28 max-w-4xl mx-auto mb-16">
        <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-2xl flex flex-col md:flex-row items-center gap-4">
          {/* Search Input */}
          <div className="relative w-full flex-grow">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search items, categories, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-white/5 bg-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all duration-300 text-white placeholder-gray-500 text-sm"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex bg-white/5 p-1 rounded-xl w-full md:w-auto border border-white/5 shrink-0">
            {['all', 'lost', 'found'].map((filter) => (
              <button
                key={filter}
                onClick={() => setTypeFilter(filter)}
                className={`flex-1 md:flex-initial px-5 py-2.5 rounded-lg text-xs font-bold capitalize transition-all duration-300 ${
                  typeFilter === filter
                    ? 'bg-indigo-650 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Quick Stats Section */}
      <div className="mb-20">
        <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-6 text-center">Campus Network Activity</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Stat 1 */}
          <div className="glass-card p-5 rounded-2xl border border-white/5 flex items-center space-x-4 transition-all duration-300 hover:scale-[1.01] hover:border-indigo-500/20">
            <div className="bg-indigo-500/10 text-indigo-400 p-3 rounded-xl shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Total Listings</p>
              <p className="text-xl font-bold text-white mt-0.5">{totalListings}</p>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="glass-card p-5 rounded-2xl border border-white/5 flex items-center space-x-4 transition-all duration-300 hover:scale-[1.01] hover:border-indigo-500/20">
            <div className="bg-red-500/10 text-red-400 p-3 rounded-xl shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Lost Items</p>
              <p className="text-xl font-bold text-red-400 mt-0.5">{lostItemsCount}</p>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="glass-card p-5 rounded-2xl border border-white/5 flex items-center space-x-4 transition-all duration-300 hover:scale-[1.01] hover:border-indigo-500/20">
            <div className="bg-green-500/10 text-green-400 p-3 rounded-xl shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Found Items</p>
              <p className="text-xl font-bold text-green-400 mt-0.5">{foundItemsCount}</p>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="glass-card p-5 rounded-2xl border border-white/5 flex items-center space-x-4 transition-all duration-300 hover:scale-[1.01] hover:border-indigo-500/20">
            <div className="bg-purple-500/10 text-purple-400 p-3 rounded-xl shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Resolved Cases</p>
              <p className="text-xl font-bold text-purple-450 mt-0.5">{resolvedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="text-gray-400 mt-4 text-xs font-semibold uppercase tracking-wider">Retrieving database reports...</p>
        </div>
      )}

      {!loading && error && (
        <div className="max-w-md mx-auto p-6 text-center bg-red-950/20 border border-red-500/30 text-red-200 rounded-2xl shadow-xl">
          <svg className="w-10 h-10 mx-auto mb-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <p className="font-bold text-sm tracking-wide">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-650 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition duration-300"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Main lists (Render only when items exist and not loading/error) */}
      {!loading && !error && (
        <>
          {/* Conditional layout for default view (no search text) to show curated columns */}
          {!searchQuery && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
              
              {/* 4. Recently Lost */}
              <div>
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                  <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
                    <span>Recently Lost</span>
                  </h2>
                  <span className="text-[10px] font-semibold text-gray-500 tracking-wider uppercase">Missing gear</span>
                </div>
                {recentlyLost.length === 0 ? (
                  <div className="glass-card rounded-2xl p-8 text-center border border-white/5">
                    <span className="text-2xl block mb-2">📦</span>
                    <h4 className="font-bold text-sm text-gray-300">No lost items yet</h4>
                    <p className="text-xs text-gray-500 mt-1">Be the first to help someone recover their stuff.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
                    {recentlyLost.map(item => <ItemCard key={item._id} item={item} />)}
                  </div>
                )}
              </div>

              {/* 5. Recently Found */}
              <div>
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                  <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                    <span>Recently Found</span>
                  </h2>
                  <span className="text-[10px] font-semibold text-gray-500 tracking-wider uppercase">Safeguarded Items</span>
                </div>
                {recentlyFound.length === 0 ? (
                  <div className="glass-card rounded-2xl p-8 text-center border border-white/5">
                    <span className="text-2xl block mb-2">🛡️</span>
                    <h4 className="font-bold text-sm text-gray-300">No found items yet</h4>
                    <p className="text-xs text-gray-500 mt-1">Every campus corner is clean. Good job students!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
                    {recentlyFound.map(item => <ItemCard key={item._id} item={item} />)}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* 6. Community Feed Grid */}
          <div className="border-t border-white/5 pt-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Community Feed</h2>
                <p className="text-xs text-gray-550 mt-1 font-medium">
                  {searchQuery ? `Search results for "${searchQuery}"` : 'All campus listings in real-time'}
                </p>
              </div>
              <div className="text-[10px] font-semibold text-gray-500 tracking-widest uppercase">
                {filteredItems.length} active notices
              </div>
            </div>

            {/* Empty State */}
            {filteredItems.length === 0 && (
              <div className="text-center py-16 glass-card rounded-2xl border border-white/5 p-8 max-w-lg mx-auto shadow-xl">
                <div className="bg-white/5 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-lg">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-base font-bold text-white">No items found</h3>
                <p className="text-gray-400 mt-2 text-xs leading-relaxed max-w-xs mx-auto">
                  We couldn't find any reports matching your filters. Try adjusting your query or check back later!
                </p>
                <Link
                  to="/create"
                  className="mt-6 inline-block bg-indigo-650 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-full text-xs transition duration-300"
                >
                  Report Item
                </Link>
              </div>
            )}

            {/* Items Grid */}
            {filteredItems.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <ItemCard key={item._id} item={item} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
