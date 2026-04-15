import React, { useState } from 'react';
import { Plus, MapPin, Calendar, Globe, X } from 'lucide-react';

export default function Trips() {
  const [trips, setTrips] = useState([
    { id: 1, dest: 'Paris', date: '2026-05-12', budget: '150000' }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ dest: '', date: '', budget: '' });
  
  const [expenses, setExpenses] = useState([]);
const [selectedTrip, setSelectedTrip] = useState(null);

const fetchExpenses = async (tripId) => {
  const res = await fetch(`http://127.0.0.1:8000/api/expenses/?trip=${tripId}`);
  const data = await res.json();
  setExpenses(data);
};
  const addTrip = (e) => {
    e.preventDefault();
    setTrips([...trips, { ...form, id: Date.now() }]);
    setIsModalOpen(false);
    setForm({ dest: '', date: '', budget: '' });
  };

  return (
    <div className="max-w-7xl mx-auto p-8 pt-32 animate-fade-in">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-5xl font-black text-slate-900 tracking-tight">Journeys</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-3xl font-black shadow-xl hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <Plus size={20} /> New Trip
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trips.map((trip) => (
          <div key={trip.id} className="bento-card group hover:border-blue-300">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Globe size={28} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">{trip.dest}</h3>
            <div className="flex items-center gap-2 text-slate-400 font-bold text-sm mb-6">
              <Calendar size={16} /> {trip.date}
            </div>
            <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Budget</span>
              <span className="text-xl font-black text-blue-600">₹{trip.budget}</span>
            </div>
          </div>
        ))}
      </div>

      {/* NEW TRIP MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
          <div className="bento-card w-full max-w-md bg-white relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400"><X /></button>
            <h3 className="text-2xl font-black mb-8">Add Journey</h3>
            <form onSubmit={addTrip} className="space-y-5">
              <input required className="input-glass" placeholder="Destination" onChange={e => setForm({...form, dest: e.target.value})} />
              <input required type="date" className="input-glass" onChange={e => setForm({...form, date: e.target.value})} />
              <input required type="number" className="input-glass" placeholder="Budget (₹)" onChange={e => setForm({...form, budget: e.target.value})} />
              <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black">Save Trip</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}