import React from 'react';
import { User, Settings, Bell, Shield, Globe, CreditCard } from 'lucide-react';

export default function Profile() {
  return (
    <div className="max-w-4xl mx-auto p-6 pt-32 space-y-8 animate-fade-in">
      {/* Profile Header Card */}
      <div className="glass-panel rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 p-10">
        <div className="w-32 h-32 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-blue-500/20">
          A
        </div>
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Amrutha</h2>
          <p className="text-slate-500 font-medium">amrutha@gmail.com</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">Developer</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider">India</span>
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* App Preferences */}
        <div className="bento-card space-y-4">
          <h4 className="font-bold text-lg flex items-center gap-2 text-slate-800">
            <Settings size={20} className="text-blue-600" /> App Preferences
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
              <div className="flex items-center gap-3 text-slate-600">
                <CreditCard size={18}/>
                <span className="text-sm font-semibold">Currency</span>
              </div>
              <span className="font-black text-blue-600 uppercase">INR (₹)</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
              <div className="flex items-center gap-3 text-slate-600">
                <Globe size={18}/>
                <span className="text-sm font-semibold">Language</span>
              </div>
              <span className="font-black text-slate-900 uppercase">English</span>
            </div>
          </div>
        </div>

        {/* Security & Notifications */}
        <div className="space-y-6">
          <div className="bento-card">
            <h4 className="font-bold flex items-center gap-2 mb-4 text-slate-800">
              <Bell size={20} className="text-blue-600" /> Notifications
            </h4>
            <div className="space-y-2 text-sm text-slate-500 font-medium">
              <div className="flex justify-between"><span>Expense Alerts</span> <span className="text-emerald-500 font-bold uppercase">On</span></div>
              <div className="flex justify-between"><span>Weekly Reports</span> <span className="text-emerald-500 font-bold uppercase">On</span></div>
            </div>
          </div>
          
          <div className="bento-card">
            <h4 className="font-bold flex items-center gap-2 mb-4 text-slate-800">
              <Shield size={20} className="text-blue-600" /> Security
            </h4>
            <button className="text-blue-600 text-sm font-bold hover:underline transition-all">
              Change Account Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}