import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import * as Icons from '../../components/admin/AdminIcons';

interface Review {
  id: number;
  product_id: number;
  product_name: string;
  nume: string;
  rating: number;
  comentariu: string;
  imagini: string[];
  is_approved: number;
  created_at: string;
}

const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ nume: '', rating: 5, comentariu: '' });

  const fetchReviews = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/admin/recenzii.php');
      const data = await response.json();
      if (data.status === 'success') {
        setReviews(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError('Eroare la încărcarea recenziilor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleAction = async (id: number, action: 'approve' | 'delete' | 'unapprove' | 'update', extraData = {}) => {
    try {
      const response = await fetch('http://localhost:3001/api/admin/recenzii.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action, ...extraData })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setEditingId(null);
        fetchReviews();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Eroare la procesarea acțiunii');
    }
  };

  const startEditing = (review: Review) => {
    setEditingId(review.id);
    setEditForm({
      nume: review.nume,
      rating: review.rating,
      comentariu: review.comentariu
    });
  };

  const filteredReviews = reviews.filter(r => {
    if (filter === 'approved') return r.is_approved === 1;
    if (filter === 'pending') return r.is_approved === 0;
    return true;
  });

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-brand-dark transition-colors duration-300">
      <AdminSidebar />
      
      <main className="flex-grow ml-64 p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white italic serif tracking-tight">Gestionare Recenzii</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-2">Aprobă, editează sau moderează feedback-ul</p>
          </div>

          <div className="flex bg-white dark:bg-white/[0.03] p-1 rounded-2xl border border-gray-100 dark:border-white/5">
            {(['all', 'approved', 'pending'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === f 
                  ? 'bg-gray-900 dark:bg-brand-yellow text-white dark:text-gray-900 shadow-sm' 
                  : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {f === 'all' ? 'Toate' : f === 'approved' ? 'Aprobate' : 'În așteptare'}
              </button>
            ))}
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 dark:border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-500/10 p-6 rounded-2xl text-red-500 font-bold text-center border border-red-100 dark:border-red-500/20">
            {error}
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-white dark:bg-white/[0.02] p-20 rounded-[2.5rem] border border-gray-100 dark:border-white/5 text-center">
            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Nu există recenzii în această categorie</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-white dark:bg-white/[0.02] p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Left: Info / Edit Form */}
                  <div className="flex-grow">
                    {editingId === review.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <input 
                            type="text" 
                            value={editForm.nume}
                            onChange={e => setEditForm({...editForm, nume: e.target.value})}
                            className="bg-gray-50 dark:bg-white/5 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-600 dark:focus:ring-brand-yellow w-full"
                            placeholder="Nume"
                          />
                          <select 
                            value={editForm.rating}
                            onChange={e => setEditForm({...editForm, rating: parseInt(e.target.value)})}
                            className="bg-gray-50 dark:bg-white/5 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-600 dark:focus:ring-brand-yellow w-full"
                          >
                            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stele</option>)}
                          </select>
                        </div>
                        <textarea 
                          value={editForm.comentariu}
                          onChange={e => setEditForm({...editForm, comentariu: e.target.value})}
                          className="bg-gray-50 dark:bg-white/5 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-600 dark:focus:ring-brand-yellow w-full h-32"
                          placeholder="Comentariu"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-3">
                              {review.nume}
                              <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${
                                review.is_approved ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                              }`}>
                                {review.is_approved ? 'Aprobat' : 'În așteptare'}
                              </span>
                            </h3>
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">Produs: {review.product_name}</p>
                          </div>
                          <div className="text-[10px] text-gray-400 tabular-nums font-bold uppercase">{review.created_at}</div>
                        </div>

                        <div className="flex gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-sm ${i < review.rating ? 'text-blue-600 dark:text-brand-yellow' : 'text-gray-100 dark:text-gray-800'}`}>★</span>
                          ))}
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 italic leading-relaxed">"{review.comentariu}"</p>
                      </>
                    )}

                    {review.imagini && review.imagini.length > 0 && (
                      <div className="flex gap-3 mt-6">
                        {review.imagini.map((img, idx) => (
                          <img key={idx} src={`http://localhost:3001/uploads/recenzii/${img}`} className="w-20 h-20 object-cover rounded-xl border border-gray-100 dark:border-white/5" alt="Review" />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex lg:flex-col gap-3 justify-center min-w-[140px]">
                    {editingId === review.id ? (
                      <>
                        <button 
                          onClick={() => handleAction(review.id, 'update', editForm)}
                          className="px-6 py-3 bg-gray-900 dark:bg-brand-yellow text-white dark:text-gray-900 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-black dark:hover:bg-brand-yellow/80 transition-all shadow-lg"
                        >
                          Salvează
                        </button>
                        <button 
                          onClick={() => setEditingId(null)}
                          className="px-6 py-3 bg-gray-100 dark:bg-white/5 text-gray-500 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all"
                        >
                          Anulează
                        </button>
                      </>
                    ) : (
                      <>
                        {!review.is_approved ? (
                          <button 
                            onClick={() => handleAction(review.id, 'approve')}
                            className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                          >
                            Aprobă
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleAction(review.id, 'unapprove')}
                            className="px-6 py-3 bg-amber-500 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20"
                          >
                            Retrage
                          </button>
                        )}
                        <button 
                          onClick={() => startEditing(review)}
                          className="px-6 py-3 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all"
                        >
                          Editează
                        </button>
                        <button 
                          onClick={() => handleAction(review.id, 'delete')}
                          className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                        >
                          Șterge
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminReviews;
