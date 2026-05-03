import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
      });
      const data = await res.json();

      if (data.status === 'success') {
        localStorage.setItem('alma_admin_token', data.token);
        localStorage.setItem('alma_admin_user', JSON.stringify(data.user));
        navigate('/admin/dashboard');
      } else {
        setError('Date de acces invalide.');
      }
    } catch (err) {
      setError('Eroare de conexiune la server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1115] flex items-center justify-center p-6 font-sans">
      <div className="grain-overlay opacity-10"></div>
      
      <div className="w-full max-w-md animate-staggered-fade">
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1.5 bg-brand-yellow/10 border border-brand-yellow/20 rounded-full mb-6">
            <span className="text-brand-yellow text-[10px] font-bold uppercase tracking-[0.3em]">Alma Decor HQ</span>
          </div>
          <h1 className="text-4xl font-bold text-white italic serif tracking-tighter mb-3">Autentificare <span className="text-brand-yellow not-italic">Admin</span></h1>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">Acces securizat panou control</p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-8">
            {error && (
              <div className="bg-rose-500/10 text-rose-400 text-[10px] font-bold uppercase tracking-widest p-4 rounded-2xl border border-rose-500/20 text-center">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div className="relative group">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Utilizator</label>
                <input 
                  type="text" 
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand-yellow transition-all group-hover:border-white/20"
                  placeholder="nume_utilizator"
                  required
                />
              </div>

              <div className="relative group">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Cheie Acces</label>
                <input 
                  type="password" 
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand-yellow transition-all group-hover:border-white/20"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-brand-yellow text-gray-900 font-bold py-5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-brand-yellow/10 flex items-center justify-center gap-3 text-[11px] uppercase tracking-widest"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin"></div>
              ) : (
                'Inițializează Sesiunea'
              )}
            </button>
          </form>
          <div className="mt-12 text-center">
            <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">
              Securizat prin Criptare End-to-End Alma Decor
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
