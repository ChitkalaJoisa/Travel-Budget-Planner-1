import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Globe, X, Pencil, Trash2 } from 'lucide-react';

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [conflictTrip, setConflictTrip] = useState(null); // ✅ NEW

  // ✅ UPDATED FORM
  const [form, setForm] = useState({
    dest: '',
    start_date: '',
    end_date: '',
    budget: ''
  });

  const [expenseForm, setExpenseForm] = useState({
    category: '',
    amount: ''
  });

  const token = localStorage.getItem("access");

  // ✅ FETCH TRIPS
  const fetchTrips = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/trips/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTrips(Array.isArray(data) ? data : []);
  };

  // ✅ FETCH EXPENSES
  const fetchAllExpenses = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/expenses/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setExpenses(Array.isArray(data) ? data : []);
  };

  const fetchExpenses = async (tripId) => {
    const res = await fetch(
      `http://127.0.0.1:8000/api/expenses/?trip=${tripId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    setExpenses(Array.isArray(data) ? data : []);
  };

  // ✅ TOTAL EXPENSE
  const getTotalExpense = (tripId) => {
    return expenses
      .filter((e) => e.trip === tripId)
      .reduce((sum, e) => sum + Number(e.amount), 0);
  };

  // ✅ ADD / UPDATE TRIP
  const addTrip = async (e) => {
    e.preventDefault();

    // 🔥 VALIDATION 1
    if (form.end_date < form.start_date) {
      alert("End date cannot be before start date");
      return;
    }

    // 🔥 VALIDATION 2 (THIS IS WHAT YOU ARE MISSING)
    if (conflictTrip) {
      alert(`You already have a trip to ${conflictTrip.name}`);
      return; // ⛔ STOP HERE → prevents saving
    }

    const url = editId
      ? `http://127.0.0.1:8000/api/trips/${editId}/`
      : "http://127.0.0.1:8000/api/trips/";

    const method = editId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: form.dest,
        start_date: form.start_date,
        end_date: form.end_date,
        budget: parseFloat(form.budget),
      }),
    });

    fetchTrips();
    fetchAllExpenses();
    setIsModalOpen(false);
    setForm({ dest: '', start_date: '', end_date: '', budget: '' });
    setEditId(null);
  };

  // ✅ DELETE TRIP
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this trip?");
    if (!confirmDelete) return;

    await fetch(`http://127.0.0.1:8000/api/trips/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchTrips();
    fetchAllExpenses();
  };

  // ✅ EDIT TRIP
  const handleEdit = (trip) => {
    setForm({
      dest: trip.name,
      start_date: trip.start_date || '',
      end_date: trip.end_date || '',
      budget: trip.budget
    });

    setEditId(trip.id);
    setIsModalOpen(true);
  };

  const checkDateConflict = (start, end) => {
    if (!start || !end) return null;

    const newStart = new Date(start);
    const newEnd = new Date(end);

    for (let trip of trips) {
      // ignore same trip while editing
      if (editId && trip.id === editId) continue;

      if (!trip.start_date || !trip.end_date) continue;

      const existingStart = new Date(trip.start_date);
      const existingEnd = new Date(trip.end_date);

      if (newStart <= existingEnd && newEnd >= existingStart) {
        return trip;
      }
    }

    return null;
  };

  // ✅ 🔥 WATCH DATE CHANGE (NEW)
  useEffect(() => {
    const conflict = checkDateConflict(form.start_date, form.end_date);
    setConflictTrip(conflict);
  }, [form.start_date, form.end_date]);

  // ✅ ADD EXPENSE
  const addExpense = async (e) => {
    e.preventDefault();

    if (!selectedTrip) {
      alert("Select a trip first");
      return;
    }

    await fetch("http://127.0.0.1:8000/api/expenses/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        category: expenseForm.category,
        amount: parseFloat(expenseForm.amount),
        trip: selectedTrip.id,
      }),
    });

    fetchAllExpenses();
    fetchExpenses(selectedTrip.id);
    setExpenseForm({ category: '', amount: '' });
  };

  useEffect(() => {
    fetchTrips();
    fetchAllExpenses();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-8 pt-32 animate-fade-in">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-5xl font-black text-white">Journeys</h2>

        <button
          onClick={() => {
            setIsModalOpen(true);
            setEditId(null);
          }}
          className="bg-blue-600 text-white px-8 py-4 rounded-3xl font-black flex items-center gap-2"
        >
          <Plus size={20} /> New Trip
        </button>
      </div>

      {/* TRIPS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trips.map((trip) => {
          const spent = getTotalExpense(trip.id);
          const remaining = trip.budget - spent;
          const isExceeded = remaining < 0;

          return (
            <div
              key={trip.id}
              className="bento-card cursor-pointer text-white p-6 space-y-2 relative"
              onClick={() => {
                setSelectedTrip(trip);
                fetchExpenses(trip.id);
              }}
            >

              {/* ICONS */}
              <div className="absolute top-4 right-4 flex gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(trip);
                  }}
                  className="text-blue-400 hover:text-blue-600"
                >
                  <Pencil size={18} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(trip.id);
                  }}
                  className="text-red-400 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <Globe size={28} />

              <h3 className="text-xl font-bold">{trip.name}</h3>

              {/* ✅ DATE RANGE DISPLAY */}
              <p className="text-sm text-gray-300 flex items-center gap-2">
                <Calendar size={14} />
                {trip.start_date && trip.end_date
                  ? `${new Date(trip.start_date).toLocaleDateString()} → ${new Date(trip.end_date).toLocaleDateString()}`
                  : "No Dates"}
              </p>

              <p className="font-bold text-blue-400">
                Budget: ₹{trip.budget}
              </p>

              <p className={`font-bold ${isExceeded ? "text-red-500" : "text-emerald-400"}`}>
                Remaining: ₹{remaining}
              </p>

              {isExceeded && (
                <p className="text-red-400 text-sm font-bold">
                  ⚠ Budget Exceeded!
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* EXPENSES */}
      {selectedTrip && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Expenses for {selectedTrip.name}
          </h2>

          {expenses.length === 0 ? (
            <p className="text-white">No expenses yet</p>
          ) : (
            expenses.map((exp) => (
              <div key={exp.id} className="border p-3 rounded mb-2 text-white">
                {exp.category} - ₹{exp.amount}
              </div>
            ))
          )}

          <form onSubmit={addExpense} className="mt-6 flex gap-4 text-white">
            <select
              required
              className="input-glass"
              value={expenseForm.category}
              onChange={(e) =>
                setExpenseForm({ ...expenseForm, category: e.target.value })
              }
            >
              <option value="" className="text-black">Select Category</option>
              <option value="Food" className="text-black">Food</option>
              <option value="Transport" className="text-black">Transport</option>
              <option value="Stay" className="text-black">Stay</option>
              <option value="Shopping" className="text-black">Shopping</option>
              <option value="Other" className="text-black">Other</option>
            </select>

            <input
              required
              type="number"
              placeholder="Amount"
              className="input-glass"
              value={expenseForm.amount}
              onChange={(e) =>
                setExpenseForm({ ...expenseForm, amount: e.target.value })
              }
            />

            <button className="bg-blue-600 text-white px-6 rounded-xl">
              Add
            </button>
          </form>
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">

          <div className="bento-card w-full max-w-md relative">

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white"
            >
              <X />
            </button>

            <h3 className="text-2xl font-black text-white mb-6">
              {editId ? "Edit Trip" : "Add Trip"}
            </h3>

            <form onSubmit={addTrip} className="space-y-5">

              {/* DESTINATION */}
              <div className="space-y-1">
                <label className="text-sm text-white/70 font-bold">Destination</label>
                <input
                  required
                  placeholder="Enter destination"
                  className="input-glass w-full"
                  value={form.dest}
                  onChange={(e) => setForm({ ...form, dest: e.target.value })}
                />
              </div>

              {/* DATES SIDE BY SIDE */}
              <div className="grid grid-cols-2 gap-4">

                {/* START DATE */}
                <div className="space-y-1">
                  <label className="text-sm text-white/70 font-bold">Start Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      className="input-glass w-full pr-10"
                      value={form.start_date}
                      onChange={(e) =>
                        setForm({ ...form, start_date: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* END DATE */}
                <div className="space-y-1">
                  <label className="text-sm text-white/70 font-bold">End Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      className="input-glass w-full pr-10"
                      value={form.end_date}
                      onChange={(e) =>
                        setForm({ ...form, end_date: e.target.value })
                      }
                    />
                  </div>
                </div>

              </div>
              {/* ✅ WARNING UI */}
              {conflictTrip && (
                <div className="text-red-400 bg-red-500/10 p-2 rounded text-sm">
                  ⚠ Trip overlaps with <b>{conflictTrip.name}</b>
                </div>
              )}


              {/* BUDGET */}
              <div className="space-y-1">
                <label className="text-sm text-white/70 font-bold">Budget</label>
                <div className="relative">
                  <span className="absolute left-3 top-0 text-white/40">₹</span>
                  <input
                    required
                    type="number"
                    placeholder="Enter budget"
                    className="input-glass pl-8 w-full"
                    value={form.budget}
                    onChange={(e) =>
                      setForm({ ...form, budget: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* BUTTON */}
              <button
                disabled={conflictTrip}
                className={`w-full py-4 rounded-xl font-bold text-lg ${conflictTrip
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
              >
                Save Trip
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}