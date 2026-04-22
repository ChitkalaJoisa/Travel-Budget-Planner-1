import React, { useState } from 'react';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const payload = {
      first_name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirm_password: formData.get("confirmPassword"),
    };

    const url = isLogin
      ? "http://127.0.0.1:8000/api/auth/login/"
      : "http://127.0.0.1:8000/api/auth/register/";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        isLogin
          ? { email: payload.email, password: payload.password }
          : payload
      ),
    });

    const data = await response.json();

    if (response.ok) {
      // Store JWT token
      localStorage.setItem("access", data.tokens.access);
      localStorage.setItem("refresh", data.tokens.refresh);

      alert("Login Successful!");
      onLogin();
    } else {
      const errorMsg =
        data.non_field_errors?.[0] ||
        data.password?.[0] ||
        data.error ||
        "Something went wrong";
      alert(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50/50">
      <div className="bento-card w-full max-w-md animate-fade-in">
        <h2 className="text-4xl font-black mb-2 text-slate-900">
          {isLogin ? 'Welcome Back' : 'Join Us'}
        </h2>
        <p className="text-slate-500 mb-8 font-medium">
          {isLogin ? 'Login to manage your trips' : 'Create an account to start planning'}
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && <input name="name" type="text" placeholder="Full Name" className="input-field" required />}
          <input name="email" type="email" placeholder="Email Address" className="input-field" required />
          <input name="password" type="password" placeholder="Password" className="input-field" required />
          {!isLogin && <input name="confirmPassword" type="password" placeholder="Confirm Password" className="input-field" required />}

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