import React, { useState } from 'react';
import { Plus, IndianRupee, X } from 'lucide-react';

export default function Expenses() {
  const [expenses, setExpenses] = useState([
    { id: 1, date: '2026-04-07', category: 'Food', note: 'Dinner at Taj', amount: '1200' }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ category: 'Food', note: '', amount: '' });

  const addExpense = (e) => {
    e.preventDefault();
    const newEntry = { ...form, id: Date.now(), date: new Date().toISOString().split('T')[0] };
    setExpenses([newEntry, ...expenses]);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-8 pt-32 animate-fade-in">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-5xl font-black text-white tracking-tight drop-shadow-lg">Expense Logs</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-500/80 backdrop-blur-md text-white px-8 py-4 rounded-3xl font-black shadow-2xl hover:bg-emerald-600 transition-all flex items-center gap-2 border border-emerald-400/50"
        >
          <Plus size={20} /> Add Entry
        </button>
      </div>

      {/* TABLE CONTAINER: Using bento-card for glass effect */}
      <div className="bento-card !p-0 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            {/* Removed bg-slate-50 to make it transparent */}
            <tr className="border-bottom border-white/10">
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/60">Date</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/60">Category</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/60">Note</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/60 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {expenses.map((exp) => (
              <tr key={exp.id} className="hover:bg-white/10 transition-colors group">
                <td className="p-6 font-bold text-white/70">{exp.date}</td>
                <td className="p-6">
                  {/* Category Pill with glass effect */}
                  <span className="bg-white/10 border border-white/20 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase">
                    {exp.category}
                  </span>
                </td>
                <td className="p-6 font-bold text-white">{exp.note}</td>
                <td className="p-6 text-right font-black text-emerald-400 text-lg">₹{exp.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD EXPENSE MODAL: Darkened backdrop for focus */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-xl">
          {/* Modal Container: Replacing bg-white with bento-card class */}
          <div className="bento-card w-full max-w-md relative border border-white/20">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-white/40 hover:text-white">
              <X />
            </button>
            
            <h3 className="text-2xl font-black mb-8 text-white">New Expense</h3>
            
            <form onSubmit={addExpense} className="space-y-5">
              <select 
                className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
                onChange={e => setForm({...form, category: e.target.value})}
              >
                <option className="bg-slate-900">Food</option>
                <option className="bg-slate-900">Transport</option>
                <option className="bg-slate-900">Stay</option>
                <option className="bg-slate-900">Shopping</option>
                <option className="bg-slate-900">Misc</option>
              </select>

              <input 
                required 
                className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
                placeholder="What did you buy?" 
                onChange={e => setForm({...form, note: e.target.value})} 
              />

              <div className="relative">
                <IndianRupee className="absolute left-4 top-4 text-white/40" size={20} />
                <input 
                  required 
                  type="number" 
                  className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 pl-12 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
                  placeholder="0.00" 
                  onChange={e => setForm({...form, amount: e.target.value})} 
                />
              </div>

              <button className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all">
                Add Expense
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}