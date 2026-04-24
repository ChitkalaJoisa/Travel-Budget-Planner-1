import React, { useState, useEffect } from 'react';
import { Wallet, Zap, MapPin, Calendar } from 'lucide-react';

export default function Dashboard({ setView }) {

  const [trips, setTrips] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // ✅ FETCH TRIPS
  const fetchTrips = async () => {
    try {
      const token = localStorage.getItem("access");

      const res = await fetch("http://127.0.0.1:8000/api/trips/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setTrips(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ FETCH EXPENSES
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("access");

      const res = await fetch("http://127.0.0.1:8000/api/expenses/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTrips();
    fetchExpenses();
  }, []);

  // ✅ CALCULATIONS
  const totalBudget = trips.reduce((sum, t) => sum + t.budget, 0);
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = totalBudget - totalSpent;

  return (
    <div className="max-w-7xl mx-auto p-8 pt-32 space-y-10 animate-fade-in">

      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-5xl font-black tracking-tight text-slate-900">Overview</h2>
          <p className="text-slate-500 font-bold italic mt-2">Welcome back</p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        <div className="bento-card bg-blue-600 text-white border-none shadow-2xl shadow-blue-500/20">
          <Wallet className="mb-4 opacity-60" size={32} />
          <p className="text-xs font-black uppercase tracking-widest opacity-80">Total Budget</p>
          <h3 className="text-4xl font-black">₹{totalBudget}</h3>
        </div>

        <div className="bento-card">
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Spent</p>
          <h3 className="text-4xl font-black text-slate-900">₹{totalSpent}</h3>
        </div>

        <div className="bento-card">
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Remaining</p>
          <h3 className="text-4xl font-black text-emerald-600">₹{remaining}</h3>
        </div>

      </div>

      {/* ACTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* ✅ FIXED BUTTON */}
        <button 
          onClick={() => setView("trips")}
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

      </div>

      {/* TRIPS */}
      <div className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900">Upcoming Trips</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div key={trip.id} className="bento-card">

              <div className="flex items-center gap-3 mb-4 text-blue-600">
                <MapPin size={20} />
                <span className="font-black uppercase tracking-tighter">
                  {trip.name}
                </span>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Budget</p>
                  <p className="text-2xl font-black text-slate-900">₹{trip.budget}</p>
                </div>

                <div className="text-right">
                  <Calendar size={16} className="text-slate-300 ml-auto mb-1" />
                  <p className="text-xs font-bold text-slate-500">
                    {trip.start_date && trip.end_date
                      ? `${new Date(trip.start_date).toLocaleDateString()} → ${new Date(trip.end_date).toLocaleDateString()}`
                      : "N/A"}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}