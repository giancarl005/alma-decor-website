'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_BASE = 'http://127.0.0.1/Alma%20Decor%20Website';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/api/auth/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.status === 'success') {
        localStorage.setItem('alma_customer_token', data.token);
        localStorage.setItem('alma_customer_user', JSON.stringify(data.user));
        router.push('/cont/dashboard');
      } else {
        setError(data.message || 'Email sau parolă incorectă');
      }
    } catch (err) {
      setError('Eroare la conectare. Verifică serverul.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-40 pb-20 px-6 min-h-screen bg-gray-50 dark:bg-[#0F1115] flex items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-white/5 rounded-[2.5rem] p-10 shadow-2xl border border-gray-100 dark:border-white/10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-tight mb-2 text-gray-900 dark:text-white">Bun venit înapoi!</h1>
          <p className="text-gray-500 text-sm">Intră în contul tău Alma Decor</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl text-xs font-bold border border-red-100 dark:border-red-500/20">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplu@email.com"
              className="w-full bg-gray-50 dark:bg-black/50 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-brand-yellow transition-all text-gray-900 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Parolă</label>
              <Link href="/cont/reset" className="text-[10px] font-bold text-brand-yellow hover:underline uppercase tracking-tighter">Ai uitat parola?</Link>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-50 dark:bg-black/50 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-brand-yellow transition-all text-gray-900 dark:text-white"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-brand-yellow text-gray-900 font-black py-4 rounded-2xl shadow-xl shadow-brand-yellow/20 hover:scale-[1.02] transition-all transform active:scale-[0.98] disabled:opacity-50 text-sm tracking-[0.2em] uppercase"
          >
            {loading ? 'SE CONECTEAZĂ...' : 'AUTENTIFICARE'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">Nu ai încă un cont?</p>
          <Link href="/cont/register" className="text-brand-yellow font-black hover:underline mt-1 inline-block">Creează un cont nou</Link>
        </div>
      </div>
    </main>
  );
}
