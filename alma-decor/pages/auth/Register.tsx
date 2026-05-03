import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({ nume: '', email: '', password: '', telefon: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.status === 'success') {
        setSuccess(true);
        setTimeout(() => navigate('/cont/login'), 2000);
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
    <div className="pt-40 pb-20 px-6 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-[2.5rem] p-10 shadow-2xl border border-gray-100 dark:border-gray-700">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-tight mb-2">Creează Cont</h1>
          <p className="text-gray-500 text-sm">Alătură-te comunității Alma Decor</p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100">⚠️ {error}</div>}
        {success && <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-2xl text-xs font-bold border border-green-100">✅ Cont creat! Te redirecționăm...</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Nume Complet</label>
            <input 
              type="text" 
              required
              placeholder="Nume Prenume"
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-brand-yellow transition-all text-gray-900 dark:text-white"
              onChange={(e) => setFormData({...formData, nume: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email</label>
            <input 
              type="email" 
              required
              placeholder="exemplu@email.com"
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-brand-yellow transition-all text-gray-900 dark:text-white"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Telefon (opțional)</label>
            <input 
              type="text" 
              placeholder="07xx xxx xxx"
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-brand-yellow transition-all text-gray-900 dark:text-white"
              onChange={(e) => setFormData({...formData, telefon: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Parolă</label>
            <input 
              type="password" 
              required
              placeholder="Minimum 6 caractere"
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-brand-yellow transition-all text-gray-900 dark:text-white"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-brand-yellow text-gray-900 font-black py-4 rounded-2xl shadow-xl shadow-yellow-500/20 hover:bg-brand-yellow-dark transition-all transform active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'SE PROCESEAZĂ...' : 'ÎNREGISTRARE'}
            </button>
          </div>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">Ai deja un cont?</p>
          <Link to="/cont/login" className="text-brand-yellow font-black hover:underline mt-1 inline-block">Autentifică-te aici</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
