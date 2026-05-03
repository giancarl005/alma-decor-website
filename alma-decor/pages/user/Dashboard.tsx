import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const UserDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('alma_customer_token');
    if (!token) {
      navigate('/cont/login');
      return;
    }

    fetch('/api/auth/profile.php', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(res => {
      if (res.status === 'success') setData(res);
      else {
        localStorage.removeItem('alma_customer_token');
        navigate('/cont/login');
      }
    })
    .catch(() => setLoading(false))
    .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('alma_customer_token');
    localStorage.removeItem('alma_customer_user');
    navigate('/cont/login');
  };

  if (loading) return <div className="pt-40 text-center">Se încarcă...</div>;
  if (!data) return null;

  return (
    <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full md:w-64 space-y-4">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-20 h-20 bg-brand-yellow rounded-full flex items-center justify-center text-3xl mb-4 mx-auto">
              👤
            </div>
            <h2 className="text-center font-black text-xl">{data.user.nume}</h2>
            <p className="text-center text-xs text-gray-500 mt-1">{data.user.email}</p>
          </div>
          
          <nav className="space-y-2">
            <button className="w-full text-left px-6 py-4 bg-brand-yellow text-gray-900 rounded-2xl font-black flex items-center gap-3">
              📦 Comenzile Mele
            </button>
            <button className="w-full text-left px-6 py-4 bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-2xl font-bold flex items-center gap-3 transition-all">
              🏠 Adrese Salvate
            </button>
            <button onClick={handleLogout} className="w-full text-left px-6 py-4 bg-red-50 text-red-500 rounded-2xl font-bold flex items-center gap-3 hover:bg-red-100 transition-all">
              🚪 Ieșire din cont
            </button>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-grow space-y-10">
          <section>
            <h3 className="text-2xl font-black mb-6 tracking-tight">Istoric Comenzi</h3>
            
            {data.orders.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 p-12 rounded-[2.5rem] text-center border-2 border-dashed border-gray-100 dark:border-gray-700">
                <p className="text-gray-500 mb-6">Nu ai nicio comandă plasată momentan.</p>
                <Link to="/magazin" className="bg-brand-yellow text-gray-900 px-8 py-3 rounded-xl font-black">Mergi la Cumpărături</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {data.orders.map((order: any) => (
                  <div key={order.id} className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 flex flex-wrap justify-between items-center gap-6 group hover:border-brand-yellow transition-all shadow-sm hover:shadow-xl hover:shadow-yellow-500/5">
                    <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Comanda #{order.id}</div>
                      <div className="font-bold text-gray-900 dark:text-white">{new Date(order.created_at).toLocaleDateString('ro-RO')}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</div>
                      <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {order.status === 'pending' ? 'În așteptare' : order.status === 'processing' ? 'În lucru' : order.status === 'completed' ? 'Finalizată' : 'Anulată'}
                      </span>
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total</div>
                      <div className="font-black text-gray-900 dark:text-white">{order.total} RON</div>
                    </div>
                    <button className="text-brand-yellow font-black text-xs hover:underline">VEZI DETALII →</button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
