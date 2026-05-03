import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Icons from './AdminIcons';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark') || 
           localStorage.getItem('alma_admin_theme') === 'dark';
  });
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('alma_admin_sidebar_collapsed') === 'true';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('alma_admin_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('alma_admin_theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    if (isCollapsed) {
      document.documentElement.classList.add('sidebar-collapsed');
      localStorage.setItem('alma_admin_sidebar_collapsed', 'true');
    } else {
      document.documentElement.classList.remove('sidebar-collapsed');
      localStorage.setItem('alma_admin_sidebar_collapsed', 'false');
    }
  }, [isCollapsed]);

  const handleLogout = () => {
    localStorage.removeItem('alma_admin_token');
    localStorage.removeItem('alma_admin_user');
    navigate('/admin/login');
  };

  const [notifications, setNotifications] = useState({ pending_orders: 0, pending_reviews: 0 });

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/admin/notificari.php');
        const data = await res.json();
        if (data.status === 'success') {
          setNotifications(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', Icon: Icons.IconDashboard },
    { name: 'Produse', path: '/admin/produse', Icon: Icons.IconProducts },
    { name: 'Categorii', path: '/admin/categorii', Icon: Icons.IconCategories },
    { name: 'Comenzi', path: '/admin/comenzi', Icon: Icons.IconOrders },
    { name: 'Recenzii', path: '/admin/recenzii', Icon: Icons.IconReviews },
    { name: 'Import Feed', path: '/admin/import', Icon: Icons.IconImport },
    { name: 'Import Scraper', path: '/admin/scraper', Icon: Icons.IconDownload },
    { name: 'Blog', path: '/admin/blog', Icon: Icons.IconBlog },
    { name: 'SEO', path: '/admin/seo', Icon: Icons.IconSEO },
    { name: 'Pixeli & Cod', path: '/admin/pixeli', Icon: Icons.IconCode },
    { name: 'Email-uri', path: '/admin/emailuri', Icon: Icons.IconEmail },
    { name: 'Setări Site', path: '/admin/setari', Icon: Icons.IconSettings },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white dark:bg-brand-dark text-gray-900 dark:text-white flex flex-col fixed inset-y-0 z-50 border-r border-gray-100 dark:border-white/[0.03] transition-all duration-300 ease-in-out`}>
      <div className={`p-6 flex items-center justify-between ${isCollapsed ? 'flex-col gap-4' : ''}`}>
        {!isCollapsed && (
          <div>
            <h2 className="text-lg font-bold tracking-tighter serif italic">ALMA<span className="text-brand-yellow not-italic">DECOR</span></h2>
            <p className="text-[9px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-[0.2em] mt-1">Management System</p>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors text-gray-400"
        >
          {isCollapsed ? <Icons.IconMenu /> : <Icons.IconChevronLeft />}
        </button>
      </div>
      
      <nav className="flex-grow px-4 space-y-1 mt-6 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path}
              to={item.path} 
              title={isCollapsed ? item.name : ''}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold transition-all group relative overflow-hidden ${
                isActive 
                ? 'bg-brand-yellow text-gray-900 shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:white hover:bg-gray-50 dark:hover:bg-white/[0.03]'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <span className={`transition-transform duration-300 ${isActive ? 'scale-100' : 'opacity-70 group-hover:opacity-100'}`}>
                <item.Icon />
              </span>
              {!isCollapsed && <span className="tracking-tight uppercase text-[10px]">{item.name}</span>}
              
              {/* Notification Badges */}
              {item.name === 'Comenzi' && notifications.pending_orders > 0 && (
                <span className={`absolute ${isCollapsed ? 'top-2 right-2' : 'right-4'} flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-brand-dark`}>
                  {notifications.pending_orders > 9 ? '9+' : notifications.pending_orders}
                </span>
              )}
              {item.name === 'Recenzii' && notifications.pending_reviews > 0 && (
                <span className={`absolute ${isCollapsed ? 'top-2 right-2' : 'right-4'} flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-brand-dark`}>
                  {notifications.pending_reviews > 9 ? '9+' : notifications.pending_reviews}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className={`p-4 mt-auto space-y-2 ${isCollapsed ? 'items-center flex flex-col' : ''}`}>
        {/* Theme Switcher */}
        <button 
          onClick={() => setIsDark(!isDark)}
          title={isCollapsed ? (isDark ? 'Mod Luminos' : 'Mod Întunecat') : ''}
          className={`flex items-center gap-3 ${isCollapsed ? 'w-12 h-12 justify-center' : 'w-full px-4 py-3'} bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.03] rounded-2xl text-gray-500 dark:text-gray-400 hover:text-brand-yellow transition-all group shadow-sm`}
        >
          <div className="transition-transform duration-500 group-hover:rotate-12">
            {isDark ? <Icons.IconSun /> : <Icons.IconMoon />}
          </div>
          {!isCollapsed && <span className="text-[9px] font-bold uppercase tracking-widest">Mod {isDark ? 'Luminos' : 'Întunecat'}</span>}
        </button>

        {!isCollapsed && (
          <div className="p-4 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/[0.03]">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span className="text-[9px] font-bold uppercase text-gray-400 tracking-widest">System Active</span>
            </div>
          </div>
        )}
        
        <button 
          onClick={handleLogout}
          title={isCollapsed ? 'Ieșire Cont' : ''}
          className={`flex items-center gap-3 ${isCollapsed ? 'w-12 h-12 justify-center' : 'w-full px-4 py-2.5'} text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all`}
        >
          <Icons.IconLogout />
          {!isCollapsed && <span>Ieșire Cont</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
