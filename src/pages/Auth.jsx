import React, { useState } from 'react';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true); // Toggles between Login and Register [cite: 21, 31]

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50/50">
      <div className="bento-card w-full max-w-md animate-fade-in">
        <h2 className="text-4xl font-black mb-2 text-slate-900">
          {isLogin ? 'Welcome Back' : 'Join Us'}
        </h2>
        <p className="text-slate-500 mb-8 font-medium">
          {isLogin ? 'Login to manage your trips' : 'Create an account to start planning'}
        </p>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
          {!isLogin && <input type="text" placeholder="Full Name" className="input-field" required />}
          <input type="email" placeholder="Email Address" className="input-field" required />
          <input type="password" placeholder="Password" className="input-field" required />
          {!isLogin && <input type="password" placeholder="Confirm Password" className="input-field" required />}
          
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-500/20 transition-all active:scale-95">
            {isLogin ? 'LOGIN' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-bold text-blue-600 hover:underline"
          >
            {isLogin ? "Don't have an account? Register here" : "Already have an account? Login here"}
          </button>
        </div>
      </div>
    </div>
  );
}