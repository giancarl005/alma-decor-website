import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';

interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  sku: string;
}

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_county: string;
  shipping_method: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  payment_method: string;
  notes: string;
  status: string;
  created_at: string;
  secure_hash?: string;
  items?: OrderItem[];
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Order | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/comenzi.php');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openModal = async (order: Order) => {
    try {
      const res = await fetch(`/api/admin/comenzi.php?id=${order.id}`);
      const data = await res.json();
      setEditForm(data);
      setIsModalOpen(true);
      setIsEditing(false);
    } catch (err) {
      alert('Eroare la încărcarea detaliilor comenzii');
    }
  };

  const handleUpdate = async () => {
    if (!editForm) return;
    const finalTotal = Number(editForm.subtotal || 0) + Number(editForm.shipping_cost || 0);
    const updatedForm = { ...editForm, total: finalTotal };

    try {
      const response = await fetch('/api/admin/comenzi.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedForm)
      });
      const data = await response.json();
      if (data.status === 'success') {
        setIsEditing(false);
        setIsModalOpen(false);
        fetchOrders();
      } else {
        alert(data.message || 'Eroare la salvare');
      }
    } catch (err) {
      alert('Eroare la conexiunea cu serverul');
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      await fetch('/api/admin/comenzi.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      fetchOrders();
    } catch (err) {
      alert('Eroare la actualizarea statusului');
    }
  };

  const deleteOrder = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/comenzi.php?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.status === 'success') {
        setIsModalOpen(false);
        setConfirmDeleteId(null);
        fetchOrders();
      } else {
        alert(data.message || 'Eroare la ștergere');
      }
    } catch (err) {
      alert('Eroare la conexiunea cu serverul');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/10 text-amber-700 dark:text-amber-400';
      case 'proforma_sent': return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400';
      case 'paid': return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
      case 'shipped': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'completed': return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'cancelled': return 'bg-rose-500/10 text-rose-700 dark:text-rose-400';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Așteptare';
      case 'proforma_sent': return 'Proformă Trimisă';
      case 'paid': return 'Plătită';
      case 'shipped': return 'Expediată';
      case 'completed': return 'Finalizată';
      case 'cancelled': return 'Anulată';
      default: return status;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-brand-dark text-gray-900 dark:text-white font-sans transition-colors duration-300">
      <AdminSidebar />

      <main className="ml-64 flex-grow p-10">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold italic serif tracking-tighter mb-2">Gestiune <span className="text-brand-yellow not-italic">Comenzi</span></h1>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{"Flux: Comandă -> Verificare -> Proformă -> Plată -> Livrare."}</p>
          </div>
          <div className="px-5 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm">
             <span className="w-1.5 h-1.5 bg-brand-yellow rounded-full animate-pulse"></span>
             {orders.filter(o => o.status === 'pending').length} Noi
          </div>
        </header>

        <div className="bg-white dark:bg-white/[0.02] rounded-[2rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/[0.02] text-gray-400 dark:text-gray-500 text-[9px] font-medium uppercase tracking-widest border-b border-gray-100 dark:border-white/[0.03]">
                <th className="px-8 py-5 font-medium">ID / Data</th>
                <th className="px-8 py-5 font-medium">Client</th>
                <th className="px-8 py-5 font-medium">Valoare Totală</th>
                <th className="px-8 py-5 text-center font-medium">Status Flux</th>
                <th className="px-8 py-5 text-right font-medium">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/[0.02]">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-all group">
                  <td className="px-8 py-5">
                    <div className="font-mono text-gray-900 dark:text-brand-yellow font-medium text-sm mb-0.5">#{o.id}</div>
                    <div className="text-[9px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-widest">
                      {o.created_at && !isNaN(new Date(o.created_at).getTime()) ? new Date(o.created_at).toLocaleDateString('ro-RO') : 'N/A'}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="font-medium text-gray-900 dark:text-white text-sm mb-0.5">{o.customer_name}</div>
                    <div className="text-[10px] text-gray-400 italic serif">{o.shipping_city || 'Fără locație'}</div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="font-medium text-gray-900 dark:text-white tabular-nums mb-0.5">{o.total} <span className="text-[9px] text-gray-400 dark:text-gray-500 uppercase">RON</span></div>
                    <div className="text-[9px] font-medium uppercase tracking-widest flex flex-col gap-0.5">
                      <span className="text-gray-900 dark:text-brand-yellow font-medium">{o.shipping_method === 'pickup' ? 'Ridicare Personală' : 'Livrare Alma Decor'}</span>
                      <span className="text-gray-400 dark:text-gray-500 text-[8px]">
                        {o.shipping_method === 'pickup' ? '0 RON' : (Number(o.shipping_cost) > 0 ? `Transport: ${o.shipping_cost} RON` : 'Așteaptă calcul')}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <select 
                      value={o.status} 
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className={`text-[8px] font-bold uppercase px-4 py-1.5 rounded-full outline-none border border-transparent focus:border-blue-500 cursor-pointer transition-all appearance-none text-center ${getStatusColor(o.status)}`}
                    >
                      <option value="pending">Așteptare</option>
                      <option value="proforma_sent">Proformă Trimisă</option>
                      <option value="paid">Plătită</option>
                      <option value="shipped">Expediată</option>
                      <option value="completed">Finalizată</option>
                      <option value="cancelled">Anulată</option>
                    </select>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openModal(o)}
                        className="px-4 py-2 bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-gray-900 dark:hover:bg-brand-yellow hover:text-white dark:hover:text-gray-900 transition-all border border-gray-200 dark:border-transparent shadow-sm"
                      >
                        Detalii
                      </button>
                      <button 
                        onClick={() => setConfirmDeleteId(o.id)}
                        className="w-8 h-8 flex items-center justify-center bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20"
                        title="Șterge Comanda"
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm" onClick={() => setConfirmDeleteId(null)}></div>
          <div className="relative bg-white dark:bg-brand-dark p-8 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-2xl max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Ești sigur?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">
              Această acțiune va șterge definitiv comanda din baza de date. Nu vei mai putea recupera aceste date.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => deleteOrder(confirmDeleteId)}
                className="w-full py-4 bg-rose-500 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20"
              >
                Da, șterge comanda
              </button>
              <button 
                onClick={() => setConfirmDeleteId(null)}
                className="w-full py-4 bg-gray-50 dark:bg-white/5 text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-gray-900 dark:hover:text-white transition-all"
              >
                Anulează
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adaptive Modal */}
      {isModalOpen && editForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-8">
          <div className="absolute inset-0 bg-gray-900/40 dark:bg-brand-dark/90 backdrop-blur-xl" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-brand-dark rounded-[2.5rem] border border-gray-200 dark:border-white/10 flex flex-col w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-10 py-8 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-white/[0.01]">
              <div>
                <h2 className="text-2xl font-bold serif italic tracking-tighter text-gray-900 dark:text-white">Comandă <span className="text-blue-600 dark:text-brand-yellow not-italic">#{editForm.id}</span></h2>
                <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">{isEditing ? 'MOD EDITARE DATE' : 'DETALII PROCESARE'}</p>
              </div>
              <div className="flex items-center gap-4">
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-gray-900 dark:bg-brand-yellow text-white dark:text-gray-900 rounded-lg text-[9px] font-black uppercase tracking-widest"
                  >
                    Editează / Adaugă Transport
                  </button>
                )}
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center hover:bg-gray-900 dark:hover:bg-brand-yellow hover:text-white dark:hover:text-gray-900 transition-all text-sm font-bold text-gray-400">✕</button>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-10 grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="space-y-10">
                <section>
                  <h3 className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Profil Client</h3>
                  <div className="p-6 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5 space-y-4">
                    <div>
                      <span className="text-gray-400 dark:text-gray-500 text-[9px] font-bold uppercase block mb-1">Nume</span>
                      {isEditing ? (
                        <input type="text" value={editForm.customer_name} onChange={e => setEditForm({...editForm, customer_name: e.target.value})} className="w-full bg-white dark:bg-white/5 border-none rounded-lg p-2 text-sm font-bold" />
                      ) : (
                        <span className="text-base font-bold text-gray-900 dark:text-white">{editForm.customer_name}</span>
                      )}
                    </div>
                    <div>
                      <span className="text-gray-400 dark:text-gray-500 text-[9px] font-bold uppercase block mb-1">Email</span>
                      {isEditing ? (
                        <input type="email" value={editForm.customer_email} onChange={e => setEditForm({...editForm, customer_email: e.target.value})} className="w-full bg-white dark:bg-white/5 border-none rounded-lg p-2 text-sm font-bold" />
                      ) : (
                        <span className="text-sm font-bold text-blue-600 dark:text-brand-yellow">{editForm.customer_email}</span>
                      )}
                    </div>
                    <div>
                      <span className="text-gray-400 dark:text-gray-500 text-[9px] font-bold uppercase block mb-1">Telefon</span>
                      {isEditing ? (
                        <input type="text" value={editForm.customer_phone} onChange={e => setEditForm({...editForm, customer_phone: e.target.value})} className="w-full bg-white dark:bg-white/5 border-none rounded-lg p-2 text-sm font-bold" />
                      ) : (
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{editForm.customer_phone}</span>
                      )}
                    </div>
                  </div>
                </section>
                <section>
                  <h3 className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Adresă Expediție</h3>
                  <div className="p-6 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5 space-y-4">
                    {isEditing ? (
                      <>
                        <input type="text" value={editForm.shipping_address} onChange={e => setEditForm({...editForm, shipping_address: e.target.value})} className="w-full bg-white dark:bg-white/5 border-none rounded-lg p-2 text-sm font-bold" placeholder="Adresa" />
                        <div className="grid grid-cols-2 gap-2">
                          <input type="text" value={editForm.shipping_city} onChange={e => setEditForm({...editForm, shipping_city: e.target.value})} className="w-full bg-white dark:bg-white/5 border-none rounded-lg p-2 text-sm font-bold" placeholder="Oraș" />
                          <input type="text" value={editForm.shipping_county} onChange={e => setEditForm({...editForm, shipping_county: e.target.value})} className="w-full bg-white dark:bg-white/5 border-none rounded-lg p-2 text-sm font-bold" placeholder="Județ" />
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-base font-bold italic serif leading-tight mb-1 text-gray-900 dark:text-white">{editForm.shipping_address}</p>
                        <p className="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-[10px]">{editForm.shipping_city}, {editForm.shipping_county}</p>
                      </>
                    )}
                  </div>
                </section>
              </div>

              <div className="md:col-span-2 space-y-10">
                <section>
                   <h3 className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Produse Comandate</h3>
                   <div className="bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
                     <table className="w-full text-left text-xs">
                       <thead>
                         <tr className="border-b border-gray-100 dark:border-white/5 text-[9px] uppercase font-bold text-gray-400 opacity-60">
                           <th className="px-6 py-4">Produs</th>
                           <th className="px-6 py-4">Cantitate</th>
                           <th className="px-6 py-4 text-right">Preț</th>
                           <th className="px-6 py-4 text-right">Total</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                         {editForm.items?.map((item, idx) => (
                           <tr key={idx} className="hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
                             <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{item.product_name}</td>
                             <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{item.quantity}</td>
                             <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-400">{item.price} RON</td>
                             <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-brand-yellow">{item.price * item.quantity} RON</td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <section>
                    <h3 className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Flux Status</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {['pending', 'proforma_sent', 'paid', 'shipped', 'completed', 'cancelled'].map(s => (
                        <button 
                          key={s}
                          onClick={() => setEditForm({...editForm, status: s})}
                          className={`p-4 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all border ${
                            editForm.status === s 
                            ? 'bg-gray-900 dark:bg-brand-yellow border-gray-900 dark:border-brand-yellow text-white dark:text-gray-900 shadow-sm' 
                            : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-transparent text-gray-400 dark:text-gray-500 hover:border-gray-200 dark:hover:border-white/10 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          {getStatusLabel(s)}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="p-8 bg-gray-900 dark:bg-white/5 text-white rounded-[2rem] shadow-sm space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest opacity-60">
                      <span>Metodă Livrare</span>
                      <span className="text-brand-yellow">{editForm.shipping_method === 'pickup' ? 'Ridicare Personală' : 'Transport Alma Decor'}</span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest opacity-60">
                      <span>Subtotal Produse</span>
                      <span>{editForm.subtotal} RON</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Cost Transport</span>
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            value={editForm.shipping_cost} 
                            onChange={e => setEditForm({...editForm, shipping_cost: Number(e.target.value)})} 
                            className="w-24 bg-white/10 border-none rounded-lg p-2 text-right text-sm font-bold text-brand-yellow"
                          />
                          <span className="text-[10px] font-bold">RON</span>
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-brand-yellow">{editForm.shipping_cost} RON</span>
                      )}
                    </div>

                    <div className="flex justify-between items-end border-t border-white/10 pt-6">
                      <span className="text-xl font-bold serif italic tracking-tighter text-brand-yellow">Total Final</span>
                      <span className="text-3xl font-bold tabular-nums tracking-tighter leading-none">
                        {Number(editForm.subtotal || 0) + Number(editForm.shipping_cost || 0)} <span className="text-[10px] uppercase opacity-60">RON</span>
                      </span>
                    </div>
                  </section>
                </div>
              </div>
            </div>

            <div className="px-10 py-6 border-t border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-white/[0.01]">
              <button 
                onClick={() => setConfirmDeleteId(editForm.id)}
                className="px-6 py-3 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl font-bold text-[9px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 shadow-sm"
              >
                Șterge Comanda
              </button>
              <div className="flex gap-3">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-3 font-bold text-[9px] uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all">Închide</button>
                <a 
                  href={`/api/admin/generate_proforma.php?id=${editForm.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-3 bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                >
                  Vezi PDF
                </a>
                <button
                  onClick={async () => {
                     try {
                       const res = await fetch('/api/admin/send_email_proforma.php', {
                         method: 'POST',
                         headers: {'Content-Type': 'application/json'},
                         body: JSON.stringify({order_id: editForm.id})
                       });
                       const data = await res.json();
                       if(data.status === 'success') { alert('Email trimis!'); setEditForm({...editForm, status: 'proforma_sent'}); }
                       else alert('Eroare: ' + data.message);
                     } catch(e) { alert('Eroare server'); }
                  }}
                  className="px-4 py-3 bg-blue-500/10 text-blue-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all"
                >
                  Email
                </button>
                <a 
                  href={`https://wa.me/40${editForm.customer_phone.replace(/\D/g, '').replace(/^0/, '')}?text=Salut%20${encodeURIComponent(editForm.customer_name)}!%20Factura%20proforma%20Alma%20Decor%20este%20aici:%20http://127.0.0.1/Alma%20Decor%20Website/api/uploads/proforme/Proforma_AD_${editForm.id}_${editForm.secure_hash}.pdf`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-3 bg-emerald-500/10 text-emerald-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all"
                >
                  WhatsApp
                </a>
                <button 
                  onClick={handleUpdate}
                  className="px-6 py-3 bg-gray-900 dark:bg-brand-yellow text-white dark:text-gray-900 rounded-xl font-black text-[9px] uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg"
                >
                  Salvează
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
