import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserItems = async () => {
      try {
        const res = await api.get('/items');
        if (res.data && res.data.items) {
          // Filter items posted by the logged-in user
          const filtered = res.data.items.filter(
            (item) =>
              item.user &&
              (item.user._id === user.id || item.user.id === user.id || item.user._id === user._id)
          );
          setUserItems(filtered);
        }
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserItems();
    }
  }, [user]);

  // Calculations for stats
  const totalPosts = userItems.length;
  const resolvedCount = userItems.filter((i) => i.resolved).length;
  const unresolvedCount = totalPosts - resolvedCount;

  // Toggle resolve status from dashboard
  const handleToggleResolve = async (id, currentStatus) => {
    try {
      const res = await api.put(`/items/${id}`, { resolved: !currentStatus });
      if (res.data && res.data.success) {
        // Update local state list
        setUserItems(
          userItems.map((item) => (item._id === id ? res.data.item : item))
        );
      }
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  // Delete notice from dashboard
  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice permanently?')) {
      return;
    }
    try {
      await api.delete(`/items/${id}`);
      setUserItems(userItems.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete report');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="text-gray-400 mt-4 text-xs font-semibold uppercase tracking-wider">Synchronizing user dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 animate-fade-in">
      
      {/* 1. Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Your Dashboard</h1>
          <p className="text-gray-400 mt-1 text-xs sm:text-sm font-medium">
            Welcome back, <span className="font-bold text-indigo-400">{user?.name}</span>. Manage your campus notices.
          </p>
        </div>
        <Link
          to="/create"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-5 rounded-full text-xs transition duration-300 shadow-[0_4px_12px_rgba(79,70,229,0.3)] hover:scale-105"
        >
          Report Another Item
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-950/20 border border-red-500/30 text-red-250 text-xs font-semibold rounded-2xl">
          {error}
        </div>
      )}

      {/* 2. Top Bento Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Bento Stat 1: Total Notices */}
        <div className="glass-card p-6 rounded-3xl border border-white/5 relative overflow-hidden flex items-center justify-between group transition-all duration-300 hover:border-indigo-500/20">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Reports</p>
            <p className="text-4xl font-bold text-white font-sans">{totalPosts}</p>
          </div>
          <div className="bg-indigo-500/10 text-indigo-400 p-4 rounded-2xl group-hover:scale-110 transition duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 00-2 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
          </div>
        </div>

        {/* Bento Stat 2: Active Reports */}
        <div className="glass-card p-6 rounded-3xl border border-white/5 relative overflow-hidden flex items-center justify-between group transition-all duration-300 hover:border-indigo-500/20">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Claims</p>
            <p className="text-4xl font-bold text-orange-550 font-sans">{unresolvedCount}</p>
          </div>
          <div className="bg-orange-500/10 text-orange-400 p-4 rounded-2xl group-hover:scale-110 transition duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>

        {/* Bento Stat 3: Resolved Items */}
        <div className="glass-card p-6 rounded-3xl border border-white/5 relative overflow-hidden flex items-center justify-between group transition-all duration-300 hover:border-indigo-500/20">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Resolved Cases</p>
            <p className="text-4xl font-bold text-green-550 font-sans">{resolvedCount}</p>
          </div>
          <div className="bg-green-500/10 text-green-400 p-4 rounded-2xl group-hover:scale-110 transition duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Middle Bento Grid: Recent Activity & Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Bento Block Left: Recent activity log (2/3 width) */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-white/5 flex flex-col justify-between min-h-[260px]">
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Account Milestones & Activity</h3>
              <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">Updates</span>
            </div>
            
            {userItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <svg className="w-10 h-10 text-gray-600 mb-2 stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-gray-500">No activity logged. Create a notice to view updates.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start space-x-3 text-xs">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0"></div>
                  <div>
                    <span className="text-gray-400">Total active listings checked. You have </span>
                    <span className="font-bold text-white">{unresolvedCount} items pending resolution</span>
                    <span className="text-gray-500 block text-[10px] mt-0.5">Updated just now</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3 text-xs">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0"></div>
                  <div>
                    <span className="text-gray-400">Dashboard setup complete. Primary campus credentials verified.</span>
                    <span className="text-gray-500 block text-[10px] mt-0.5">Automatic configuration</span>
                  </div>
                </div>
                {resolvedCount > 0 && (
                  <div className="flex items-start space-x-3 text-xs">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 shrink-0"></div>
                    <div>
                      <span className="text-gray-400">Great job! You have helped resolve </span>
                      <span className="font-bold text-white">{resolvedCount} cases</span>
                      <span className="text-gray-400"> and restored lost items to the campus community.</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="text-[10px] text-gray-550 mt-4 border-t border-white/5 pt-3">
            Realtime database synchronizer active.
          </div>
        </div>

        {/* Bento Block Right: Guidelines & safe exchange (1/3 width) */}
        <div className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col justify-between min-h-[260px]">
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Safe Exchange Protocol</h3>
              <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">Safety</span>
            </div>
            
            <ul className="space-y-3 text-xs text-gray-400">
              <li className="flex items-start">
                <svg className="w-4 h-4 mr-2 text-indigo-400 shrink-0 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4"></path>
                </svg>
                <span>Exchange items in public campus areas (e.g. Student Union or library).</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 mr-2 text-indigo-400 shrink-0 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4"></path>
                </svg>
                <span>Verify item characteristics by asking questions before transferring.</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 mr-2 text-indigo-400 shrink-0 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4"></path>
                </svg>
                <span>Never share passwords or credentials.</span>
              </li>
            </ul>
          </div>

          <div className="text-[10px] text-gray-500 font-medium">
            Contact campus safety for urgent matters.
          </div>
        </div>
      </div>

      {/* 4. Bottom Bento Block: My Listings control panel */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white mb-6">Manage Your Reported Notices</h2>

        {userItems.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 glass-card rounded-3xl border border-white/5 p-8 max-w-lg mx-auto shadow-xl">
            <div className="bg-white/5 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-lg">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 00-2 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"></path>
              </svg>
            </div>
            <h3 className="text-base font-bold text-white">No notices posted yet</h3>
            <p className="text-gray-400 mt-2 text-xs leading-relaxed max-w-xs mx-auto">
              You haven't reported any lost or found items. If you find or lose something on campus, post a new notice!
            </p>
            <Link
              to="/create"
              className="mt-6 inline-block bg-indigo-650 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-full text-xs transition duration-300"
            >
              Report Item
            </Link>
          </div>
        ) : (
          /* Items List Glass Table */
          <div className="glass-card border border-white/5 rounded-3xl shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                    <th className="py-4.5 px-6">Item</th>
                    <th className="py-4.5 px-6">Type</th>
                    <th className="py-4.5 px-6">Location</th>
                    <th className="py-4.5 px-6">Date</th>
                    <th className="py-4.5 px-6">Status</th>
                    <th className="py-4.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs text-gray-300">
                  {userItems.map((item) => (
                    <tr key={item._id} className="hover:bg-white/[0.02] transition duration-200">
                      {/* Item Details Link */}
                      <td className="py-4 px-6 font-bold text-white hover:text-indigo-400 transition-colors">
                        <Link to={`/items/${item._id}`}>{item.title}</Link>
                      </td>
                      
                      {/* Notice Type */}
                      <td className="py-4 px-6 capitalize">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.type === 'lost' 
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                            : 'bg-green-500/10 text-green-400 border border-green-500/20'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      
                      {/* Location */}
                      <td className="py-4 px-6 font-medium text-gray-400 max-w-[180px] truncate">
                        {item.location}
                      </td>
                      
                      {/* Date */}
                      <td className="py-4 px-6 text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      
                      {/* Resolution Status */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          item.resolved ? 'bg-white/5 text-gray-400' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            item.resolved ? 'bg-gray-600' : 'bg-amber-400 animate-pulse'
                          }`}></span>
                          {item.resolved ? 'Resolved' : 'Active'}
                        </span>
                      </td>
                      
                      {/* Actions */}
                      <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleResolve(item._id, item.resolved)}
                          className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition duration-300 ${
                            item.resolved 
                              ? 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'
                              : 'bg-indigo-600/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-650 hover:text-white'
                          }`}
                        >
                          {item.resolved ? 'Re-open' : 'Resolve'}
                        </button>
                        <Link
                          to={`/items/${item._id}`}
                          className="inline-block text-[10px] font-bold px-3 py-1.5 border border-white/5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition duration-300"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDeleteItem(item._id)}
                          className="text-[10px] font-bold px-3 py-1.5 border border-red-500/20 bg-red-500/5 hover:bg-red-650 hover:text-white text-red-400 rounded-lg transition duration-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
