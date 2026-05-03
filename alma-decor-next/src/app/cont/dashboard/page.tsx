'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { API_BASE } from '@/lib/api';

export default function UserDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('alma_customer_token');
    if (!token) {
      router.push('/cont/login');
      return;
    }

    fetch(`${API_BASE}/api/auth/profile.php`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(res => {
      if (res.status === 'success') setData(res);
      else {
        localStorage.removeItem('alma_customer_token');
        router.push('/cont/login');
      }
    })
    .catch(() => setLoading(false))
    .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('alma_customer_token');
    localStorage.removeItem('alma_customer_user');
    router.push('/cont/login');
  };

  if (loading) return <div className="pt-40 text-center min-h-screen text-gray-500">Se încarcă detaliile contului...</div>;
  if (!data) return null;

  return (
    <main className="pt-40 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full md:w-64 space-y-4 shrink-0">
          <div className="bg-white dark:bg-white/5 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-white/10">
            <div className="w-20 h-20 bg-brand-yellow rounded-full flex items-center justify-center text-3xl mb-4 mx-auto">
              👤
            </div>
            <h2 className="text-center font-black text-xl text-gray-900 dark:text-white">{data.user.nume}</h2>
            <p className="text-center text-xs text-gray-500 mt-1">{data.user.email}</p>
          </div>
          
          <nav className="space-y-2">
            <button className="w-full text-left px-6 py-4 bg-brand-yellow text-gray-900 rounded-2xl font-black flex items-center gap-3 shadow-sm hover:scale-[1.02] transition-transform">
              📦 Comenzile Mele
            </button>
            <button className="w-full text-left px-6 py-4 bg-white dark:bg-white/5 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-2xl font-bold flex items-center gap-3 transition-all border border-transparent hover:border-gray-100 dark:hover:border-white/10">
              🏠 Adrese Salvate
            </button>
            <button onClick={handleLogout} className="w-full text-left px-6 py-4 bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 rounded-2xl font-bold flex items-center gap-3 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all">
              🚪 Ieșire din cont
            </button>
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-grow space-y-10">
          <section>
            <h3 className="text-2xl font-black mb-6 tracking-tight text-gray-900 dark:text-white">Istoric Comenzi</h3>
            
            {data.orders.length === 0 ? (
              <div className="bg-white dark:bg-white/5 p-12 rounded-[2.5rem] text-center border-2 border-dashed border-gray-100 dark:border-white/10">
                <p className="text-gray-500 mb-6">Nu ai nicio comandă plasată momentan.</p>
                <Link href="/magazin" className="inline-block bg-brand-yellow text-gray-900 px-8 py-4 rounded-xl font-black text-sm tracking-[0.2em] uppercase hover:scale-[1.02] transition-transform shadow-xl shadow-brand-yellow/20">
                  Mergi la Cumpărături
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {data.orders.map((order: any) => (
                  <div key={order.id} className="bg-white dark:bg-white/5 p-8 rounded-[2rem] border border-gray-100 dark:border-white/10 flex flex-wrap justify-between items-center gap-6 group hover:border-brand-yellow dark:hover:border-brand-yellow transition-all shadow-sm hover:shadow-xl hover:shadow-brand-yellow/5">
                    <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Comanda #{order.id}</div>
                      <div className="font-bold text-gray-900 dark:text-white">{new Date(order.created_at).toLocaleDateString('ro-RO')}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</div>
                      <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full tracking-widest ${order.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-brand-yellow/20 text-gray-900 dark:text-brand-yellow'}`}>
                        {order.status === 'pending' ? 'În așteptare' : order.status === 'processing' ? 'În lucru' : order.status === 'completed' ? 'Finalizată' : 'Anulată'}
                      </span>
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total</div>
                      <div className="font-black text-gray-900 dark:text-white text-lg">{order.total} RON</div>
                    </div>
                    <button className="text-brand-yellow font-black text-[10px] tracking-widest uppercase hover:underline">VEZI DETALII →</button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
