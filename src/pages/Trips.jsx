import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Globe, X } from 'lucide-react';

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ dest: '', date: '', budget: '' });

  const [expenseForm, setExpenseForm] = useState({
    category: '',
    amount: ''
  });

  const token = localStorage.getItem("access");

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

  // ✅ FETCH EXPENSES BY TRIP
  const fetchExpenses = async (tripId) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/expenses/?trip=${tripId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ ADD TRIP
  const addTrip = async (e) => {
    e.preventDefault();

    try {
      await fetch("http://127.0.0.1:8000/api/trips/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.dest,
          budget: parseFloat(form.budget),
        }),
      });

      fetchTrips();
      setIsModalOpen(false);
      setForm({ dest: '', date: '', budget: '' });

    } catch (err) {
      console.error(err);
    }
  };

  // ✅ ADD EXPENSE
  const addExpense = async (e) => {
    e.preventDefault();

    if (!selectedTrip) {
      alert("Select a trip first");
      return;
    }

    try {
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

      fetchExpenses(selectedTrip.id);
      setExpenseForm({ category: '', amount: '' });

    } catch (err) {
      console.error(err);
    }
  };

  // ✅ LOAD TRIPS
  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-8 pt-32 animate-fade-in">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-5xl font-black text-white">Journeys</h2>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-3xl font-black flex items-center gap-2"
        >
          <Plus size={20} /> New Trip
        </button>
      </div>

      {/* TRIPS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.isArray(trips) && trips.map((trip) => (
          <div 
            key={trip.id}
            className="bento-card cursor-pointer text-white"
            onClick={() => {
              setSelectedTrip(trip);
              fetchExpenses(trip.id);
            }}
          >
            <Globe size={28} className="mb-4" />

            <h3 className="text-xl font-bold">{trip.name}</h3>

            <p className="text-sm text-gray-300 flex items-center gap-2">
              <Calendar size={14} /> {trip.date || "No Date"}
            </p>

            <p className="mt-4 font-bold text-blue-400">
              ₹{trip.budget}
            </p>
          </div>
        ))}
      </div>

      {/* EXPENSES DISPLAY */}
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

          {/* ADD EXPENSE FORM */}
          <form onSubmit={addExpense} className="mt-6 flex gap-4 text-white">

            <input
              required
              placeholder="Category"
              className="input-glass"
              value={expenseForm.category}
              onChange={(e) =>
                setExpenseForm({ ...expenseForm, category: e.target.value })
              }
            />

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
              Add Trip
            </h3>

            <form onSubmit={addTrip} className="space-y-4">

              <input
                required
                placeholder="Destination"
                className="input-glass"
                value={form.dest}
                onChange={(e) => setForm({ ...form, dest: e.target.value })}
              />

              <input
                type="date"
                className="input-glass"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />

              <input
                required
                type="number"
                placeholder="Budget"
                className="input-glass"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
              />

              <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">
                Save
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}