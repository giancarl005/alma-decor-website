'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_BASE = 'http://127.0.0.1/Alma%20Decor%20Website';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ nume: '', email: '', password: '', telefon: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/api/auth/register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.status === 'success') {
        setSuccess(true);
        setTimeout(() => router.push('/cont/login'), 2000);
      } else {
        setError(data.message || 'Eroare la înregistrare');
      }
    } catch (err) {
      setError('Eroare server. Verifică serverul.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-40 pb-20 px-6 min-h-screen bg-gray-50 dark:bg-[#0F1115] flex items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-white/5 rounded-[2.5rem] p-10 shadow-2xl border border-gray-100 dark:border-white/10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-tight mb-2 text-gray-900 dark:text-white">Creează Cont</h1>
          <p className="text-gray-500 text-sm">Alătură-te comunității Alma Decor</p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl text-xs font-bold border border-red-100 dark:border-red-500/20">⚠️ {error}</div>}
        {success && <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl text-xs font-bold border border-emerald-100 dark:border-emerald-500/20">✅ Cont creat! Te redirecționăm...</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Nume Complet</label>
            <input 
              type="text" 
              required
              placeholder="Nume Prenume"
              className="w-full bg-gray-50 dark:bg-black/50 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-brand-yellow transition-all text-gray-900 dark:text-white"
              onChange={(e) => setFormData({...formData, nume: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email</label>
            <input 
              type="email" 
              required
              placeholder="exemplu@email.com"
              className="w-full bg-gray-50 dark:bg-black/50 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-brand-yellow transition-all text-gray-900 dark:text-white"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Telefon (opțional)</label>
            <input 
              type="text" 
              placeholder="07xx xxx xxx"
              className="w-full bg-gray-50 dark:bg-black/50 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-brand-yellow transition-all text-gray-900 dark:text-white"
              onChange={(e) => setFormData({...formData, telefon: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Parolă</label>
            <input 
              type="password" 
              required
              placeholder="Minimum 6 caractere"
              className="w-full bg-gray-50 dark:bg-black/50 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-brand-yellow transition-all text-gray-900 dark:text-white"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-brand-yellow text-gray-900 font-black py-4 rounded-2xl shadow-xl shadow-brand-yellow/20 hover:scale-[1.02] transition-all transform active:scale-[0.98] disabled:opacity-50 text-sm tracking-[0.2em] uppercase"
            >
              {loading ? 'SE PROCESEAZĂ...' : 'ÎNREGISTRARE'}
            </button>
          </div>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">Ai deja un cont?</p>
          <Link href="/cont/login" className="text-brand-yellow font-black hover:underline mt-1 inline-block">Autentifică-te aici</Link>
        </div>
      </div>
    </main>
  );
}
