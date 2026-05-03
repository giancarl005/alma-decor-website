import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.status === 'success') {
        localStorage.setItem('alma_customer_token', data.token);
        localStorage.setItem('alma_customer_user', JSON.stringify(data.user));
        navigate('/cont/dashboard');
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
    <div className="pt-40 pb-20 px-6 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-[2.5rem] p-10 shadow-2xl border border-gray-100 dark:border-gray-700">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-tight mb-2">Bun venit înapoi!</h1>
          <p className="text-gray-500 text-sm">Intră în contul tău Alma Decor</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100">
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
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-brand-yellow transition-all text-gray-900 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Parolă</label>
              <Link to="/cont/reset" className="text-[10px] font-bold text-brand-yellow hover:underline uppercase tracking-tighter">Ai uitat parola?</Link>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-brand-yellow transition-all text-gray-900 dark:text-white"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-brand-yellow text-gray-900 font-black py-4 rounded-2xl shadow-xl shadow-yellow-500/20 hover:bg-brand-yellow-dark transition-all transform active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'SE CONECTEAZĂ...' : 'AUTENTIFICARE'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">Nu ai încă un cont?</p>
          <Link to="/cont/register" className="text-brand-yellow font-black hover:underline mt-1 inline-block">Creează un cont nou</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
