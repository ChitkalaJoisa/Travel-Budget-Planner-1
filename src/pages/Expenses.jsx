import React, { useState, useEffect } from 'react';
import { Plus, IndianRupee, X } from 'lucide-react';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [trips, setTrips] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    category: 'Food',
    amount: '',
    trip: ''
  });

  const token = localStorage.getItem("access");

  // ✅ FETCH EXPENSES
  const fetchExpenses = async () => {
    try {
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

  // ✅ FETCH TRIPS (for dropdown)
  const fetchTrips = async () => {
    try {
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

  // ✅ ADD EXPENSE
  const addExpense = async (e) => {
    e.preventDefault();

    try {
      await fetch("http://127.0.0.1:8000/api/expenses/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ IMPORTANT
        },
        body: JSON.stringify({
          category: form.category,
          amount: parseFloat(form.amount),
          trip: form.trip,
        }),
      });

      fetchExpenses();
      setIsModalOpen(false);
      setForm({ category: 'Food', amount: '', trip: '' });

    } catch (err) {
      console.error(err);
    }
  };

  // ✅ LOAD DATA
  useEffect(() => {
    fetchExpenses();
    fetchTrips();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-8 pt-32">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-5xl font-black text-white">Expense Logs</h2>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-500 text-white px-8 py-4 rounded-3xl font-black flex items-center gap-2"
        >
          <Plus size={20} /> Add Entry
        </button>
      </div>

      {/* TABLE */}
      <div className="bento-card !p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10">
              <th className="p-6 text-white/60 text-xs">Category</th>
              <th className="p-6 text-white/60 text-xs">Amount</th>
              <th className="p-6 text-white/60 text-xs">Trip</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(expenses) && expenses.map((exp) => (
              <tr key={exp.id} className="border-b border-white/10">
                <td className="p-6 text-white">{exp.category}</td>
                <td className="p-6 text-emerald-400 font-bold">₹{exp.amount}</td>
                <td className="p-6 text-white/70">{exp.trip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">

          <div className="bento-card w-full max-w-md relative">

            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-6 right-6 text-white"
            >
              <X />
            </button>

            <h3 className="text-2xl font-black text-white mb-6">
              Add Expense
            </h3>

            <form onSubmit={addExpense} className="space-y-4">

              {/* TRIP SELECT */}
              <select
                required
                className="input-glass"
                value={form.trip}
                onChange={(e) =>
                  setForm({ ...form, trip: e.target.value })
                }
              >
                <option value="">Select Trip</option>
                {Array.isArray(trips) && trips.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>

              {/* CATEGORY */}
              <select
                className="input-glass"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                <option>Food</option>
                <option>Transport</option>
                <option>Stay</option>
                <option>Shopping</option>
                <option>Misc</option>
              </select>

              {/* AMOUNT */}
              <div className="relative">
                <IndianRupee className="absolute left-4 top-4 text-white/40" />
                <input
                  required
                  type="number"
                  className="input-glass pl-10"
                  placeholder="Amount"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({ ...form, amount: e.target.value })
                  }
                />
              </div>

              <button className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold">
                Save Expense
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}