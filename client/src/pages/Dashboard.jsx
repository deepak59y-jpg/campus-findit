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
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
        <p className="text-slate-500 mt-4 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Header and Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Your Dashboard</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Welcome back, <span className="font-bold text-slate-700">{user?.name}</span>. Manage your reported notices.
          </p>
        </div>
        <Link
          to="/create"
          className="bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2.5 px-5 rounded-xl text-sm transition btn-hover-effect shrink-0 w-fit"
        >
          Report Another Item
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
          {error}
        </div>
      )}

      {/* Stats Widgets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        
        {/* Card 1: Total Posts */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center">
          <div className="bg-blue-50 text-blue-500 p-3.5 rounded-xl mr-4 shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 00-2 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Notices</p>
            <p className="text-2xl font-extrabold text-slate-800 mt-0.5">{totalPosts}</p>
          </div>
        </div>

        {/* Card 2: Active Posts */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center">
          <div className="bg-orange-50 text-orange-500 p-3.5 rounded-xl mr-4 shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Reports</p>
            <p className="text-2xl font-extrabold text-orange-600 mt-0.5">{unresolvedCount}</p>
          </div>
        </div>

        {/* Card 3: Resolved Posts */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center">
          <div className="bg-green-50 text-green-500 p-3.5 rounded-xl mr-4 shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Resolved Items</p>
            <p className="text-2xl font-extrabold text-green-600 mt-0.5">{resolvedCount}</p>
          </div>
        </div>

      </div>

      {/* User Items List Section */}
      <h2 className="text-xl font-bold text-slate-850 mb-4">Your Item Notices</h2>

      {userItems.length === 0 ? (
        /* Empty State */
        <div className="bg-white text-center py-16 rounded-2xl border border-slate-100 p-8 shadow-sm">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800">No notices posted yet</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto text-sm">
            You haven't reported any lost or found items. If you find or lose something on campus, post a new notice!
          </p>
          <Link
            to="/create"
            className="mt-6 inline-block bg-brand-500 hover:bg-brand-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition btn-hover-effect"
          >
            Report an Item
          </Link>
        </div>
      ) : (
        /* Items List Table/Layout */
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Item</th>
                  <th className="py-4 px-6">Type</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {userItems.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 transition duration-150">
                    {/* Item Details Link */}
                    <td className="py-4.5 px-6 font-bold text-slate-850 hover:text-brand-500">
                      <Link to={`/items/${item._id}`}>{item.title}</Link>
                    </td>
                    
                    {/* Notice Type */}
                    <td className="py-4.5 px-6 capitalize">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        item.type === 'lost' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    
                    {/* Location */}
                    <td className="py-4.5 px-6 font-medium text-slate-500 max-w-[200px] truncate">
                      {item.location}
                    </td>
                    
                    {/* Date */}
                    <td className="py-4.5 px-6 text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    
                    {/* Resolution Status */}
                    <td className="py-4.5 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        item.resolved ? 'bg-slate-100 text-slate-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          item.resolved ? 'bg-slate-400' : 'bg-amber-500'
                        }`}></span>
                        {item.resolved ? 'Resolved' : 'Active'}
                      </span>
                    </td>
                    
                    {/* Dashboard Actions */}
                    <td className="py-4.5 px-6 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleResolve(item._id, item.resolved)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                          item.resolved 
                            ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            : 'bg-brand-50 border-brand-100 text-brand-600 hover:bg-brand-100'
                        }`}
                      >
                        {item.resolved ? 'Re-open' : 'Resolve'}
                      </button>
                      <Link
                        to={`/items/${item._id}`}
                        className="inline-block text-xs font-semibold px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="text-xs font-semibold px-3 py-1.5 border border-red-100 hover:bg-red-50 text-red-650 rounded-lg transition"
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
  );
};

export default Dashboard;
