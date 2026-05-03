import React, { useState, useEffect } from 'react';

interface Review {
  id: number;
  nume: string;
  rating: number;
  comentariu: string;
  created_at: string;
}

interface ProductReviewsProps {
  productId: number;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ nume: '', rating: 5, comentariu: '' });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedImages([...selectedImages, ...files]);
      
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/recenzii.php?product_id=${productId}`);
      const data = await res.json();
      if (data.status === 'success') {
        setReviews(data.data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const form = new FormData();
      form.append('product_id', productId.toString());
      form.append('nume', formData.nume);
      form.append('rating', formData.rating.toString());
      form.append('comentariu', formData.comentariu);
      
      selectedImages.forEach((img) => {
        form.append('images[]', img);
      });

      const res = await fetch('/api/recenzii.php', {
        method: 'POST',
        body: form // fetch handles boundary automatically for FormData
      });
      const data = await res.json();

      if (data.status === 'success') {
        setMessage({ type: 'success', text: 'Recenzia ta a fost adăugată!' });
        setFormData({ nume: '', rating: 5, comentariu: '' });
        setSelectedImages([]);
        setPreviews([]);
        fetchReviews();
        setTimeout(() => setShowForm(false), 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'A apărut o eroare.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Eroare de conexiune.' });
    } finally {
      setSubmitting(false);
    }
  };

  const [showForm, setShowForm] = useState(false);

  const calculateStats = () => {
    if (reviews.length === 0) return null;
    
    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = (sum / total).toFixed(1);
    
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach(r => {
      distribution[r.rating - 1]++;
    });

    const recommended = reviews.filter(r => r.rating >= 4).length;
    const recPercent = Math.round((recommended / total) * 100);

    return { avg, total, distribution: distribution.reverse(), recPercent };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-16">
      {/* Review Summary Header (eMAG Style) - STYLIZED 1000px */}
      {stats && (
        <div className="bg-white dark:bg-white/[0.02] p-10 md:p-12 rounded-3xl border border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center gap-12">
            {/* Average Score */}
            <div className="text-center md:border-r border-gray-100 dark:border-white/5 pr-0 md:pr-12 py-2 min-w-[180px]">
              <div className="text-7xl font-bold text-gray-900 dark:text-white tabular-nums mb-3">{stats.avg}</div>
              <div className="flex justify-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-xl ${i < Math.round(Number(stats.avg)) ? 'text-brand-yellow' : 'text-gray-200 dark:text-gray-800'}`}>★</span>
                ))}
              </div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stats.total} recenzii</div>
            </div>

            {/* Distribution Bars */}
            <div className="flex-grow space-y-2.5 md:border-r border-gray-100 dark:border-white/5 md:pr-12 py-2">
              {stats.distribution.map((count, i) => {
                const stars = 5 - i;
                const percent = (count / stats.total) * 100;
                return (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="text-[10px] font-medium text-gray-400 w-14 whitespace-nowrap">{stars} stele</span>
                    <div className="flex-grow h-1.5 bg-gray-50 dark:bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-yellow transition-all duration-1000" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-gray-900 dark:text-white w-6 tabular-nums">{count}</span>
                  </div>
                );
              })}
            </div>

            {/* Recommendation & CTA */}
            <div className="flex flex-col items-center gap-6 py-2 min-w-[200px]">
               <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="text-emerald-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    {stats.recPercent}%
                  </div>
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center mt-1">Recomandă acest produs</div>
               </div>

              <button 
                onClick={() => setShowForm(!showForm)}
                className="px-8 py-3.5 bg-brand-yellow text-gray-900 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all shadow-lg shadow-brand-yellow/10"
              >
                {showForm ? 'Anulează' : 'Adaugă un review'}
              </button>
            </div>
        </div>
      )}

      {/* Review Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-16 items-start">
        {/* Form Overlay - Show only when triggered */}
        {showForm && (
          <div className="animate-in zoom-in-95 fade-in duration-300">
            <div className="bg-gray-50 dark:bg-white/[0.02] p-8 md:p-12 rounded-[2.5rem] border border-gray-100 dark:border-white/5 relative overflow-hidden">
              <div className="absolute top-8 right-8">
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white text-xl">✕</button>
              </div>
              <h3 className="text-xl font-bold italic serif tracking-tight mb-8">Lasă o recenzie</h3>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className={`text-3xl transition-all ${star <= formData.rating ? 'text-brand-yellow scale-110' : 'text-gray-200 dark:text-gray-800'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Numele tău</label>
                    <input
                      required
                      type="text"
                      value={formData.nume}
                      onChange={(e) => setFormData({ ...formData, nume: e.target.value })}
                      className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-brand-yellow/20 focus:border-brand-yellow transition-all"
                      placeholder="Ex: Popescu Ion"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Imagini Produs</label>
                    <div className="flex flex-wrap gap-4">
                      {previews.map((src, index) => (
                        <div key={src} className="relative w-20 h-20 rounded-xl overflow-hidden group">
                          <img src={src} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <label className="w-20 h-20 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 hover:border-brand-yellow hover:bg-white dark:hover:bg-gray-800 cursor-pointer transition-all">
                        <span className="text-2xl text-gray-400">+</span>
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-8 flex flex-col">
                  <div className="space-y-2 flex-grow">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Comentariu</label>
                    <textarea
                      required
                      rows={6}
                      value={formData.comentariu}
                      onChange={(e) => setFormData({ ...formData, comentariu: e.target.value })}
                      className="w-full h-[180px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-brand-yellow/20 focus:border-brand-yellow transition-all resize-none"
                      placeholder="Spune-ne părerea ta despre acest produs..."
                    />
                  </div>

                  <button
                    disabled={submitting}
                    type="submit"
                    className="w-full bg-gray-900 dark:bg-brand-yellow text-white dark:text-gray-900 h-14 rounded-full font-black text-[11px] uppercase tracking-[0.3em] hover:bg-brand-yellow hover:text-gray-900 dark:hover:bg-white transition-all shadow-xl shadow-black/5"
                  >
                    {submitting ? 'SE TRIMITE...' : 'TRIMITE RECENZIA'}
                  </button>
                </div>
              </form>

              {message && (
                <div className={`mt-6 p-4 rounded-2xl text-xs font-bold text-center ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {message.text}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
             <h3 className="text-xl font-bold italic serif tracking-tight text-gray-900 dark:text-white">Recenzii Clienți</h3>
             <span className="px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest">{reviews.length} total</span>
          </div>
          
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2].map(i => <div key={i} className="h-24 bg-gray-50 dark:bg-white/5 rounded-2xl" />)}
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white dark:bg-white/[0.01] p-8 rounded-[2rem] border border-gray-50 dark:border-white/5 space-y-6 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-brand-yellow transition-colors">{review.nume}</span>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-[10px] ${i < review.rating ? 'text-brand-yellow' : 'text-gray-200 dark:text-gray-800'}`}>★</span>
                        ))}
                      </div>
                    </div>
                    <span className="text-[9px] text-gray-300 uppercase tracking-widest">{new Date(review.created_at).toLocaleDateString('ro-RO')}</span>
                  </div>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed italic">"{review.comentariu}"</p>

                  {review.imagini && review.imagini.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {review.imagini.map((img: string, i: number) => (
                        <div key={i} className="w-16 h-16 rounded-lg overflow-hidden border border-gray-100 dark:border-white/5">
                          <img src={img} alt="User upload" className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : !showForm && (
            <div className="text-center py-20 bg-gray-50 dark:bg-white/[0.02] rounded-[3rem] border border-dashed border-gray-200 dark:border-white/10">
              <p className="text-gray-400 italic text-sm mb-6">Fii primul care lasă o recenzie pentru acest produs!</p>
              <button 
                onClick={() => setShowForm(true)}
                className="text-[10px] font-bold text-brand-yellow uppercase tracking-widest hover:underline"
              >
                Incepe tu →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
