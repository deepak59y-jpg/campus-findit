import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateItem from './pages/CreateItem';
import ItemDetails from './pages/ItemDetails';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/items/:id" element={<ItemDetails />} />
              
              {/* Protected Routes */}
              <Route
                path="/create"
                element={
                  <ProtectedRoute>
                    <CreateItem />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          
          {/* Footer Component */}
          <footer className="bg-white border-t border-slate-200/60 py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-xs font-semibold">
              &copy; {new Date().getFullYear()} Campus FindIt. Designed for premium student UX.
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
