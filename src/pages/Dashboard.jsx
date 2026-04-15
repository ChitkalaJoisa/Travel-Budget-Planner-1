import React, { useState } from 'react';
import { Wallet, Zap, Plus, X, MapPin, Calendar, IndianRupee } from 'lucide-react';

export default function Dashboard() {
  const [showTripModal, setShowTripModal] = useState(false);
  const [trips, setTrips] = useState([
    { destination: 'Paris', budget: '150000', date: '2026-05-10' }
  ]);

  const [newTrip, setNewTrip] = useState({ destination: '', budget: '', date: '' });

  const handleAddTrip = (e) => {
    e.preventDefault();
    setTrips([...trips, newTrip]);
    setShowTripModal(false);
    setNewTrip({ destination: '', budget: '', date: '' });
  };

  return (
    <div className="max-w-7xl mx-auto p-8 pt-32 space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-5xl font-black tracking-tight text-slate-900">Overview</h2>
          <p className="text-slate-500 font-bold italic mt-2">Welcome back, Amrutha</p>
        </div>
      </div>

      {/* Stats Cards [cite: 98, 99] */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bento-card bg-blue-600 text-white border-none shadow-2xl shadow-blue-500/20">
          <Wallet className="mb-4 opacity-60" size={32} />
          <p className="text-xs font-black uppercase tracking-widest opacity-80">Total Budget</p>
          <h3 className="text-4xl font-black">₹50,000</h3>
        </div>
        <div className="bento-card">
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Spent</p>
          <h3 className="text-4xl font-black text-slate-900">₹12,450</h3>
        </div>
        <div className="bento-card">
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Remaining</p>
          <h3 className="text-4xl font-black text-emerald-600">₹37,550</h3>
        </div>
      </div>

      {/* Quick Actions [cite: 44-46] */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <button 
          onClick={() => setShowTripModal(true)}
          className="bento-card group flex items-center gap-6 hover:border-blue-400 text-left"
        >
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
            <Zap size={28} />
          </div>
          <div>
            <h4 className="text-2xl font-black text-slate-900">New Journey</h4>
            <p className="text-slate-500 font-medium">Click to plan a new destination</p>
          </div>
        </button>

        <button className="bento-card group flex items-center gap-6 hover:border-emerald-400 text-left">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
            <Plus size={28} />
          </div>
          <div>
            <h4 className="text-2xl font-black text-slate-900">Add Expense</h4>
            <p className="text-slate-500 font-medium">Log a new spending entry</p>
          </div>
        </button>
      </div>

      {/* Recent Trips List [cite: 52-54] */}
      <div className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900">Upcoming Trips</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trips.map((trip, i) => (
            <div key={i} className="bento-card animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex items-center gap-3 mb-4 text-blue-600">
                <MapPin size={20} />
                <span className="font-black uppercase tracking-tighter">{trip.destination}</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Estimated</p>
                  <p className="text-2xl font-black text-slate-900">₹{trip.budget}</p>
                </div>
                <div className="text-right">
                  <Calendar size={16} className="text-slate-300 ml-auto mb-1" />
                  <p className="text-xs font-bold text-slate-500">{trip.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TRIP MODAL [cite: 51-63] */}
      {showTripModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/20 backdrop-blur-md">
          <div className="bento-card w-full max-w-lg bg-white relative shadow-2xl">
            <button onClick={() => setShowTripModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900">
              <X size={24} />
            </button>
            <h3 className="text-3xl font-black text-slate-900 mb-8">Create New Trip</h3>
            <form onSubmit={handleAddTrip} className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Destination</label>
                <input 
                  required
                  className="input-glass mt-1" 
                  placeholder="e.g. Switzerland"
                  value={newTrip.destination}
                  onChange={(e) => setNewTrip({...newTrip, destination: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Budget (₹)</label>
                  <input 
                    required
                    type="number"
                    className="input-glass mt-1" 
                    placeholder="50000"
                    value={newTrip.budget}
                    onChange={(e) => setNewTrip({...newTrip, budget: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Date</label>
                  <input 
                    required
                    type="date"
                    className="input-glass mt-1"
                    value={newTrip.date}
                    onChange={(e) => setNewTrip({...newTrip, date: e.target.value})}
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">
                Save Journey
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}