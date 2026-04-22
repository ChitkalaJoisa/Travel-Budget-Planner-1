import React, { useState, useEffect } from 'react';
import Navbar from './components/Layout/Navbar';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Trips from './pages/Trips';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import Profile from './pages/Profile';

export default function App() {
  const [view, setView] = useState('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ 🔥 CHECK TOKEN ON PAGE LOAD
  useEffect(() => {
    const token = localStorage.getItem("access");

    if (token) {
      setIsLoggedIn(true);
      setView('dashboard');  // auto redirect after refresh
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setView('dashboard');
  };

  return (
    <div className="relative min-h-screen w-full bg-transparent">
      
      {/* Navbar */}
      {isLoggedIn && view !== 'landing' && view !== 'auth' && (
        <Navbar active={view} setActive={setView} />
      )}

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Landing */}
        {view === 'landing' && (
          <Landing onStart={() => setView('auth')} />
        )}

        {/* Auth */}
        {view === 'auth' && (
          <Auth onLogin={handleLoginSuccess} />
        )}

        {/* Protected Views */}
        {isLoggedIn && (
          <div className="pt-24 pb-12 animate-fade-in">
            {view === 'dashboard' && <Dashboard setView={setView} />}
            {view === 'trips' && <Trips />}
            {view === 'expenses' && <Expenses />}
            {view === 'reports' && <Reports />}
            {view === 'profile' && <Profile />}
          </div>
        )}
      </main>
    </div>
  );
}