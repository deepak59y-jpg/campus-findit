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
        <div className="min-h-screen flex flex-col bg-darkBg text-white">
          <Navbar />
          
          <main className="flex-grow pt-24 pb-12">
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
          <footer className="bg-darkBg border-t border-white/5 py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-xs font-medium">
              &copy; {new Date().getFullYear()} Campus FindIt. Built for students, powered by community.
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}


export default App;
