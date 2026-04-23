import React, { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';

export default function Reports() {
  const [expenses, setExpenses] = useState([]);

  // 🎨 Category Colors
  const categoryColors = {
    Food: "#10b981",
    Stay: "#3b82f6",
    Transport: "#f59e0b",
    Shopping: "#8b5cf6",
    Other: "#6b7280",
  };

  // ✅ Fetch expenses
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
    fetchExpenses();
  }, []);

  // ✅ TOTAL
  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  // ✅ CATEGORY GROUPING
  const categoryData = {};

  expenses.forEach((e) => {
    const cat = e.category || "Other";
    categoryData[cat] = (categoryData[cat] || 0) + Number(e.amount);
  });

  const categories = Object.keys(categoryData);

  // ✅ BUILD DYNAMIC PIE (IMPORTANT)
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

  // ✅ BAR DATA (fallback if no data)
  const monthlyData =
    categories.length > 0
      ? categories.map((cat) =>
          total ? (categoryData[cat] / total) * 100 : 10
        )
      : [20, 40, 60];

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
            style={{
              background: `conic-gradient(${gradient})`,
            }}
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

          {/* ✅ LEGEND */}
          <div className="flex gap-4 mt-8 flex-wrap justify-center">
            {categories.map((cat, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: categoryColors[cat] || "#ccc",
                  }}
                />
                <span className="text-xs font-bold">{cat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 📊 BAR CHART */}
        <div className="bento-card flex flex-col justify-between min-h-[400px]">
          <h3 className="text-lg font-black text-slate-700">
            Monthly Trend
          </h3>

          <div className="flex-1 flex items-end gap-2 px-4 pb-4">
            {monthlyData.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-lg transition-all"
                style={{
                  height: `${h}%`,
                  backgroundColor:
                    categoryColors[categories[i]] || "#3b82f6",
                }}
              />
            ))}
          </div>

          <div className="pt-4 border-t border-white/20 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 italic">
              Live data based on your expenses
            </span>
            <TrendingUp size={18} className="text-emerald-500" />
          </div>
        </div>

      </div>
    </div>
  );
}