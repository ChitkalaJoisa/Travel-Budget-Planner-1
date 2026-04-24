import React, { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';

export default function Reports() {
  const [expenses, setExpenses] = useState([]);
  const [trips, setTrips] = useState([]);

  const categoryColors = {
    Food: "#10b981",
    Stay: "#3b82f6",
    Transport: "#f59e0b",
    Shopping: "#8b5cf6",
    Other: "#6b7280",
  };

  // ✅ Fetch Expenses
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("access");

      const res = await fetch("http://127.0.0.1:8000/api/expenses/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Fetch Trips
  const fetchTrips = async () => {
    try {
      const token = localStorage.getItem("access");

      const res = await fetch("http://127.0.0.1:8000/api/trips/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setTrips(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchTrips();
  }, []);

  // ✅ TOTAL
  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  // ✅ CATEGORY GROUPING (PIE)
  const categoryData = {};

  expenses.forEach((e) => {
    let cat = e.category || "Other";

    // 🔥 FIX: normalize
    if (cat === "Misc") cat = "Other";

    categoryData[cat] = (categoryData[cat] || 0) + Number(e.amount);
  });

  const categories = Object.keys(categoryData);

  // ✅ PIE GRADIENT
  let start = 0;

  const gradient = categories
    .map((cat) => {
      const value = categoryData[cat];
      const percent = total ? (value / total) * 100 : 0;
      const color = categoryColors[cat] || "#ccc";

      const slice = `${color} ${start}% ${start + percent}%`;
      start += percent;

      return slice;
    })
    .join(",");

  return (
    <div className="max-w-7xl mx-auto p-8 pt-32 space-y-8 animate-fade-in bg-transparent">
      <h2 className="text-4xl font-black text-slate-900">
        Expense Analytics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* 🔵 PIE CHART */}
        <div className="bento-card flex flex-col items-center justify-center min-h-[400px]">
          <h3 className="text-lg font-black mb-6 text-slate-700">
            Spending by Category
          </h3>

          <div
            className="w-48 h-48 rounded-full flex items-center justify-center"
            style={{ background: `conic-gradient(${gradient})` }}
          >
            <div className="bg-white w-32 h-32 rounded-full flex flex-col items-center justify-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                Total
              </p>
              <p className="text-2xl font-black text-slate-900">
                ₹{total}
              </p>
            </div>
          </div>

          {/* LEGEND */}
          <div className="flex gap-4 mt-8 flex-wrap justify-center">
            {categories.map((cat, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: categoryColors[cat] }}
                />
                <span className="text-xs font-bold">{cat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 📊 BAR CHART */}
        <div className="bento-card flex flex-col justify-between min-h-[400px]">
          <h3 className="text-lg font-black text-slate-700">
            Expenses by Trip & Category
          </h3>

          <div className="flex-1 flex items-end gap-6 px-4 pb-4 overflow-x-auto">

            {trips.map((trip) => {

              // ✅ Initialize all categories
              const tripData = {};
              Object.keys(categoryColors).forEach((cat) => {
                tripData[cat] = 0;
              });

              // ✅ Fill real data
              expenses
                .filter((e) => e.trip === trip.id)
                .forEach((e) => {
                  let cat = e.category || "Other";
                  if (cat === "Misc") cat = "Other";

                  tripData[cat] += Number(e.amount);
                });

              const maxValue = Math.max(...Object.values(tripData), 1);

              return (
                <div key={trip.id} className="flex flex-col items-center gap-2">

                  <div className="flex items-end gap-1 h-40">

                    {Object.keys(categoryColors).map((cat) => {
                      const value = tripData[cat];
                      const height = value === 0 ? 2 : (value / maxValue) * 100;

                      return (
                        <div
                          key={cat}
                          className="w-3 rounded-t-md"
                          style={{
                            height: `${height}%`,
                            backgroundColor: categoryColors[cat],
                          }}
                          title={`${cat}: ₹${value}`}
                        />
                      );
                    })}

                  </div>

                  <span className="text-xs font-bold">
                    {trip.name}
                  </span>

                </div>
              );
            })}
          </div>

          {/* LEGEND */}
          <div className="flex gap-4 flex-wrap justify-center pb-4">
            {Object.keys(categoryColors).map((cat) => (
              <div key={cat} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: categoryColors[cat] }}
                />
                <span className="text-xs font-bold">{cat}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/20 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 italic">
              Real expense comparison across trips
            </span>
            <TrendingUp size={18} className="text-emerald-500" />
          </div>
        </div>

      </div>
    </div>
  );
}