"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [checking, setChecking] = useState(true); // برای جلوگیری از نمایش فرم قبل از چک

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        window.location.href = "/admin/dashboard";
      } else {
        setChecking(false);
      }
    };
    checkUser();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("ورود ناموفق. ایمیل یا رمز عبور اشتباه است.");
    } else {
      window.location.href = "/admin/dashboard";
    }
    setLoading(false);
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-bg">
        <div className="w-6 h-6 border border-luxury-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-bg flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-luxury-text mb-2">
          Serviro
        </h1>
        <p className="text-center text-luxury-muted text-sm mb-6">
          ورود به پنل مدیریت
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-luxury-text mb-1">ایمیل</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-luxury-border text-sm focus:outline-none focus:border-luxury-accent transition-colors"
              placeholder="owner@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-luxury-text mb-1">رمز عبور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-luxury-border text-sm focus:outline-none focus:border-luxury-accent transition-colors"
              placeholder="••••••"
              required
            />
          </div>

          {message && (
            <p className="text-red-500 text-sm text-center">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-luxury-accent text-white rounded-xl font-medium hover:bg-luxury-accent-dark transition-colors disabled:opacity-50"
          >
            {loading ? "در حال ورود..." : "ورود"}
          </button>
        </form>
      </div>
    </div>
  );
}