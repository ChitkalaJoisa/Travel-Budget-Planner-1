import React, { useState } from 'react';
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

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setView('dashboard');
  };

  return (
    <div className="relative min-h-screen w-full bg-transparent">
      
      {/* Navigation - Only visible when the user is logged in */}
      {isLoggedIn && view !== 'landing' && view !== 'auth' && (
        <Navbar active={view} setActive={setView} />
      )}

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* VIEW 1: Landing Page */}
        {view === 'landing' && (
          <Landing onStart={() => setView('auth')} />
        )}

        {/* VIEW 2: Auth (Login/Signup) */}
        {view === 'auth' && (
          <Auth onLogin={handleLoginSuccess} />
        )}

        {/* PROTECTED VIEWS: Dashboard & Analytics */}
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