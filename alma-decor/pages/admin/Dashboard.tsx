import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import * as Icons from '../../components/admin/AdminIcons';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('alma_admin_token');
    const user = localStorage.getItem('alma_admin_user');
    
    if (!token) {
      navigate('/admin/login');
    } else if (user) {
      setAdminName(JSON.parse(user).nume);
    }
  }, [navigate]);

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [statsData, setStatsData] = useState({
    totalSales: '0 RON',
    newOrders: '0',
    activeProducts: '0',
    conversionRate: '3.2%'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Orders
        const resOrders = await fetch('/api/admin/comenzi.php');
        const dataOrders = await resOrders.json();
        setRecentOrders(Array.isArray(dataOrders) ? dataOrders.slice(0, 3) : []);

        // Fetch Stats
        const resStats = await fetch('/api/admin/stats.php');
        const dataStats = await resStats.json();
        if (dataStats.status === 'success') {
          setStatsData(dataStats.data);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { name: 'Vânzări Lună', value: statsData.totalSales, Icon: Icons.IconDashboard, color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
    { name: 'Comenzi Noi', value: statsData.newOrders, Icon: Icons.IconOrders, color: 'text-amber-500', bg: 'bg-amber-500/5' },
    { name: 'Produse Active', value: statsData.activeProducts, Icon: Icons.IconProducts, color: 'text-indigo-500', bg: 'bg-indigo-500/5' },
    { name: 'Rată Conversie', value: statsData.conversionRate, Icon: Icons.IconImport, color: 'text-rose-500', bg: 'bg-rose-500/5' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-brand-dark text-gray-900 dark:text-white font-sans transition-colors duration-300">
      <AdminSidebar />

      {/* Main Content */}
      <main className="ml-64 flex-grow p-10 relative">
        <header className="flex justify-between items-end mb-12 relative z-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter mb-1 italic serif">
              Sărbătorim succesul, <span className="text-brand-yellow not-italic">{adminName}</span>.
            </h1>
            <p className="text-gray-500 text-sm max-w-md leading-relaxed font-medium">
              Analiza performanței magazinului tău pentru ziua de astăzi.
            </p>
          </div>
          <div className="flex gap-4">
            <Link to="/magazin" target="_blank" className="px-6 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white font-bold text-[9px] uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center gap-2 shadow-sm">
              <Icons.IconArrowRight /> View Storefront
            </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 relative z-10">
          {stats.map((stat, i) => (
            <div key={i} className="admin-card p-8 rounded-[2rem] group">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
                <stat.Icon />
              </div>
              <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mb-1">{stat.name}</p>
              <h3 className="text-2xl font-bold tracking-tighter text-gray-900 dark:text-white tabular-nums">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
          {/* Recent Orders */}
          <div className="lg:col-span-2 admin-card p-8 rounded-[2.5rem]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-bold serif italic">Comenzi Recente</h2>
              <Link to="/admin/comenzi" className="text-gray-900 dark:text-brand-yellow font-bold text-[9px] uppercase tracking-widest hover:underline flex items-center gap-2 transition-colors">
                Vezi tot <Icons.IconArrowRight />
              </Link>
            </div>
            
            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <p className="text-center py-10 text-gray-400 text-xs font-bold uppercase tracking-widest">Nu există comenzi recente</p>
              ) : recentOrders.map((order, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/[0.03] rounded-2xl hover:bg-gray-100 dark:hover:bg-white/[0.02] transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white dark:bg-white/5 border border-gray-200 dark:border-transparent rounded-xl flex items-center justify-center font-mono text-[10px] font-bold text-gray-900 dark:text-brand-yellow shadow-sm">
                      #{order.id}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-white">{order.customer_name}</p>
                      <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">{order.created_at ? new Date(order.created_at).toLocaleDateString('ro-RO') : 'N/A'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white tabular-nums text-sm mb-1">{order.total} RON</p>
                    <span className={`text-[8px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                      order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 
                      (order.status === 'processing' || order.status === 'proforma_sent') ? 'bg-gray-900/10 text-gray-900 dark:text-amber-400 border-gray-900/20 dark:border-amber-500/20' : 
                      order.status === 'pending' ? 'bg-blue-600/10 text-blue-600 border-blue-600/20' :
                      'bg-gray-500/10 text-gray-500 border-gray-500/20'
                    }`}>
                      {order.status === 'pending' ? 'Așteptare' : (order.status === 'processing' || order.status === 'proforma_sent') ? 'Procesare' : order.status === 'completed' ? 'Finalizată' : order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="admin-card p-8 rounded-[2.5rem] bg-brand-yellow/[0.02] border-brand-yellow/5">
              <h2 className="text-base font-bold mb-6 flex items-center gap-2 italic serif">Acțiuni Rapide</h2>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/admin/produse" className="p-4 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-transparent rounded-2xl text-center hover:bg-brand-yellow hover:text-gray-900 transition-all group">
                  <div className="flex justify-center mb-2 group-hover:scale-105 transition-transform text-gray-400 group-hover:text-gray-900">
                    <Icons.IconProducts />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest leading-tight">Adaugă Produs</span>
                </Link>
                <Link to="/admin/import" className="p-4 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-transparent rounded-2xl text-center hover:bg-brand-yellow hover:text-gray-900 transition-all group">
                  <div className="flex justify-center mb-2 group-hover:scale-105 transition-transform text-gray-400 group-hover:text-gray-900">
                    <Icons.IconImport />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest leading-tight">Sync Feed</span>
                </Link>
              </div>
            </div>

            <div className="admin-card p-8 rounded-[2.5rem]">
              <h2 className="text-base font-bold mb-6 italic serif">System Update</h2>
              <div className="space-y-4">
                <div className="border-l-2 border-brand-yellow pl-4">
                  <p className="text-[9px] font-bold text-gray-400 mb-1 uppercase tracking-widest">INFO</p>
                  <p className="font-semibold text-[11px] leading-snug text-gray-600 dark:text-gray-400">Toate sistemele funcționează la parametri optimi.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
