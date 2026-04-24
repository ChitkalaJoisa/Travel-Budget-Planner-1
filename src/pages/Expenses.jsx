import React, { useState, useEffect } from 'react';
import { Plus, IndianRupee, X, Pencil, Trash2 } from 'lucide-react';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [trips, setTrips] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔥 NEW (for edit)
  const [editId, setEditId] = useState(null);

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

  // ✅ FETCH TRIPS
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

  // ✅ ADD / UPDATE EXPENSE (no logic changed, only extended)
  const addExpense = async (e) => {
    e.preventDefault();

    try {
      const url = editId
        ? `http://127.0.0.1:8000/api/expenses/${editId}/`
        : "http://127.0.0.1:8000/api/expenses/";

      const method = editId ? "PUT" : "POST";

      await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
      setEditId(null);

    } catch (err) {
      console.error(err);
    }
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this expense?");
    if (!confirmDelete) return;

    await fetch(`http://127.0.0.1:8000/api/expenses/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchExpenses();
  };

  // ✅ EDIT
  const handleEdit = (exp) => {
    setForm({
      category: exp.category,
      amount: exp.amount,
      trip: exp.trip
    });

    setEditId(exp.id);
    setIsModalOpen(true);
  };

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
          onClick={() => {
            setIsModalOpen(true);
            setEditId(null);
          }}
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
              <th className="p-6 text-white/60 text-xs text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(expenses) && expenses.map((exp) => (
              <tr key={exp.id} className="border-b border-white/10">
                <td className="p-6 text-white">{exp.category}</td>
                <td className="p-6 text-emerald-400 font-bold">₹{exp.amount}</td>
                <td className="p-6 text-white/70">
                  {trips.find(t => t.id === exp.trip)?.name || "Unknown"}
                </td>

                {/* ✅ ACTIONS */}
                <td className="p-6 flex justify-center gap-4">
                  <button
                    onClick={() => handleEdit(exp)}
                    className="text-blue-400 hover:text-blue-600"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
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
              {editId ? "Edit Expense" : "Add Expense"}
            </h3>

            <form onSubmit={addExpense} className="space-y-5">

              {/* TRIP SELECT */}
              <div className="space-y-1">
                <label className="text-sm text-white/70 font-bold">Trip</label>
                <select
                  required
                  className="input-glass w-full"
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
              </div>

              {/* CATEGORY SELECT */}
              <div className="space-y-1">
                <label className="text-sm text-white/70 font-bold">Category</label>
                <select
                  className="input-glass w-full"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  <option>Food</option>
                  <option>Transport</option>
                  <option>Stay</option>
                  <option>Shopping</option>
                  <option>Other</option>
                </select>
              </div>

              {/* AMOUNT */}
              <div className="space-y-1">
                <label className="text-sm text-white/70 font-bold">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-0 text-white/40">₹</span>
                  <input
                    required
                    type="number"
                    className="input-glass pl-10 w-full"
                    placeholder="Enter amount"
                    value={form.amount}
                    onChange={(e) =>
                      setForm({ ...form, amount: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* BUTTON */}
              <button className="w-full bg-emerald-500 hover:bg-emerald-600 transition text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/20">
                {editId ? "Update Expense" : "Save Expense"}
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}