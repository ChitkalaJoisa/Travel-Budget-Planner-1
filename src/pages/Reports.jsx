import React from 'react';
import { BarChart3, PieChart as PieIcon, TrendingUp } from 'lucide-react';

export default function Reports() {
  return (
    <div className="max-w-7xl mx-auto p-8 pt-32 space-y-8 animate-fade-in bg-transparent">
      <h2 className="text-4xl font-black text-slate-900">Expense Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Spending Breakdown */}
        <div className="bento-card flex flex-col items-center justify-center min-h-[400px]">
          <h3 className="text-lg font-black mb-6 text-slate-700">Spending by Category</h3>
          <div className="w-48 h-48 rounded-full border-[15px] border-blue-500 border-t-emerald-500 flex items-center justify-center relative">
             <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Total</p>
                <p className="text-2xl font-black text-slate-900">₹3,600</p>
             </div>
          </div>
          <div className="flex gap-4 mt-8">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"/> <span className="text-xs font-bold">Food</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full"/> <span className="text-xs font-bold">Transport</span></div>
          </div>
        </div>

        {/* Right Side: Monthly Trend (The missing box) */}
        <div className="bento-card flex flex-col justify-between min-h-[400px]">
          <h3 className="text-lg font-black text-slate-700">Monthly Trend</h3>
          <div className="flex-1 flex items-end gap-2 px-4 pb-4">
            {/* Visual Bar Chart Placeholder */}
            {[40, 70, 45, 90, 65, 80].map((h, i) => (
              <div key={i} className="flex-1 bg-blue-500/40 rounded-t-lg transition-all hover:bg-blue-500" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="pt-4 border-t border-white/20 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 italic">Spending increased by 12% this month</span>
            <TrendingUp size={18} className="text-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
}