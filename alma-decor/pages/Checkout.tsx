import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customerType, setCustomerType] = useState<'individual' | 'business'>('individual');
  const [diffBilling, setDiffBilling] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    cui: '',
    regCom: '',
    address: '',
    city: '',
    county: '',
    billingAddress: '',
    billingCity: '',
    billingCounty: '',
    shippingMethod: 'delivery',
    paymentMethod: 'transfer',
    notes: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('alma_customer_user');
    if (userData) {
      const user = JSON.parse(userData);
      const nameParts = user.nume.split(' ');
      setFormData(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.telefon || '',
        address: user.adresa || '',
        city: user.oras || '',
        county: user.judet || ''
      }));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Coșul este gol!");
    
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert("Te rugăm să introduci un număr de telefon valid (10 cifre).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Te rugăm să introduci o adresă de email validă.");
      return;
    }

    setLoading(true);
    const orderData = {
      customerType,
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        companyName: customerType === 'business' ? formData.companyName : null,
        cui: customerType === 'business' ? formData.cui : null,
        regCom: customerType === 'business' ? formData.regCom : null
      },
      shipping: {
        address: formData.address,
        city: formData.city,
        county: formData.county,
        method: formData.shippingMethod
      },
      billing: diffBilling ? {
        address: formData.billingAddress,
        city: formData.billingCity,
        county: formData.billingCounty
      } : null,
      paymentMethod: 'transfer',
      notes: formData.notes,
      total: cartTotal,
      items: cart
    };

    try {
      const res = await fetch('/api/comanda.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const data = await res.json();
      if (data.status === 'success') {
        clearCart();
        navigate(`/comanda/confirmare/${data.order_id}`, { state: { orderId: data.order_id } });
      } else {
        alert("Eroare: " + data.message);
      }
    } catch (err) {
      alert("Eroare la procesarea comenzii. Vă rugăm să reîncercați.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-20">
        {/* Summary */}
        <div className="lg:order-last">
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.08)] sticky top-32">
            <h2 className="text-[13px] font-black text-gray-900 mb-10 tracking-[0.2em] uppercase">Comanda ta</h2>
            <div className="space-y-8 mb-12 max-h-[450px] overflow-y-auto pr-2 scrollbar-hide">
              {cart.map(item => (
                <div key={`${item.id}-${item.variation_id}`} className="flex gap-6 items-center">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-white border border-gray-50 p-2">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-[14px] font-bold text-gray-900 leading-snug mb-1 line-clamp-2">{item.name}</p>
                    <p className="text-[12px] text-gray-400 font-medium">{item.quantity} × {item.sale_price || item.price} RON</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-50 pt-10 space-y-4">
              <div className="flex justify-between text-gray-500 text-[14px]">
                <span className="font-medium">Subtotal</span>
                <span className="font-bold text-gray-900">{cartTotal} RON</span>
              </div>
              <div className="flex justify-between text-gray-500 text-[14px]">
                <span className="font-medium">Transport</span>
                <span className={formData.shippingMethod === 'pickup' ? "text-emerald-500 font-bold" : "text-gray-900 font-bold"}>
                  {formData.shippingMethod === 'pickup' ? 'Gratuit' : 'Vom reveni cu detalii'}
                </span>
              </div>
              
              <div className="pt-6">
                <div className="flex gap-2">
                  <input placeholder="COD REDUCERE" className="flex-grow bg-white border border-gray-100 rounded-xl px-4 py-3 text-[11px] font-bold tracking-widest outline-none focus:border-gray-900 transition-all placeholder:text-gray-300 uppercase" />
                  <button className="bg-gray-900 text-white px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-colors">APLICĂ</button>
                </div>
              </div>

              <div className="flex justify-between items-end pt-10 border-t border-gray-50 mt-6">
                <div>
                  <p className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em] mb-1">Total final</p>
                  <p className="text-[10px] text-gray-400 font-medium">TVA inclus în preț</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-black text-gray-900 tabular-nums tracking-tighter">{cartTotal} <span className="text-base font-bold">RON</span></p>
                </div>
              </div>
            </div>

            {/* Security badges */}
            <div className="mt-12 flex justify-between items-center px-2 py-4 bg-gray-50/50 rounded-2xl">
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2-2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Plată Securizată</span>
                </div>
                <div className="w-px h-4 bg-gray-200"></div>
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Date Protejate</span>
                </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:order-first max-w-2xl">
          <h1 className="text-5xl font-black text-gray-900 mb-20 tracking-tighter">Checkout</h1>
          
          <form onSubmit={handleSubmit} className="space-y-20">
            {/* Step 01 */}
            <section className="space-y-12">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b-2 border-gray-900 pb-5">
                <div className="flex items-center gap-5">
                  <span className="text-[13px] font-black text-gray-900 bg-gray-50 w-8 h-8 rounded-full flex items-center justify-center">1</span>
                  <h2 className="text-[15px] font-black text-gray-900 uppercase tracking-[0.2em]">Informații client</h2>
                </div>
                <div className="flex bg-gray-50 p-1.5 rounded-full border border-gray-100">
                  <button 
                    type="button" onClick={() => setCustomerType('individual')}
                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${customerType === 'individual' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    Persoană Fizică
                  </button>
                  <button 
                    type="button" onClick={() => setCustomerType('business')}
                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${customerType === 'business' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    Persoană Juridică
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-12">
                {customerType === 'business' && (
                  <>
                    <div className="sm:col-span-2 group">
                      <label className="block text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-2 transition-colors group-focus-within:text-brand-yellow">Nume Companie</label>
                      <input required name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full bg-transparent border-b-2 border-gray-100 py-2 focus:border-gray-900 outline-none transition-all text-[15px] font-bold placeholder:text-gray-200" />
                    </div>
                    <div className="group">
                      <label className="block text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-2">CUI / CIF</label>
                      <input required name="cui" value={formData.cui} onChange={handleInputChange} className="w-full bg-transparent border-b-2 border-gray-100 py-2 focus:border-gray-900 outline-none transition-all text-[15px] font-bold" />
                    </div>
                    <div className="group">
                      <label className="block text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-2">Registrul Comerțului</label>
                      <input required name="regCom" placeholder="J40/0000/0000" value={formData.regCom} onChange={handleInputChange} className="w-full bg-transparent border-b-2 border-gray-100 py-2 focus:border-gray-900 outline-none transition-all text-[15px] font-bold" />
                    </div>
                  </>
                )}
                <div className="group">
                  <label className="block text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-2">Prenume</label>
                  <input required name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-transparent border-b-2 border-gray-100 py-2 focus:border-gray-900 outline-none transition-all text-[15px] font-bold" />
                </div>
                <div className="group">
                  <label className="block text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-2">Nume familie</label>
                  <input required name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-transparent border-b-2 border-gray-100 py-2 focus:border-gray-900 outline-none transition-all text-[15px] font-bold" />
                </div>
                <div className="group">
                  <label className="block text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-2">Adresă de Email</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-transparent border-b-2 border-gray-100 py-2 focus:border-gray-900 outline-none transition-all text-[15px] font-bold" />
                </div>
                <div className="group">
                  <label className="block text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-2">Număr de Telefon</label>
                  <input required type="tel" name="phone" pattern="[0-9]{10}" value={formData.phone} onChange={handleInputChange} className="w-full bg-transparent border-b-2 border-gray-100 py-2 focus:border-gray-900 outline-none transition-all text-[15px] font-bold" />
                </div>
              </div>
            </section>

            {/* Step 02 */}
            <section className="space-y-12">
              <div className="flex items-center gap-5 border-b-2 border-gray-900 pb-5">
                <span className="text-[13px] font-black text-gray-900 bg-gray-50 w-8 h-8 rounded-full flex items-center justify-center">2</span>
                <h2 className="text-[15px] font-black text-gray-900 uppercase tracking-[0.2em]">Adresa de livrare</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-12">
                <div className="sm:col-span-2 group">
                  <label className="block text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-2">Adresă completă livrare</label>
                  <input required name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-transparent border-b-2 border-gray-100 py-2 focus:border-gray-900 outline-none transition-all text-[15px] font-bold" />
                </div>
                <div className="group">
                  <label className="block text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-2">Oraș / Localitate</label>
                  <input required name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-transparent border-b-2 border-gray-100 py-2 focus:border-gray-900 outline-none transition-all text-[15px] font-bold" />
                </div>
                <div className="group">
                  <label className="block text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-2">Județ</label>
                  <input required name="county" value={formData.county} onChange={handleInputChange} className="w-full bg-transparent border-b-2 border-gray-100 py-2 focus:border-gray-900 outline-none transition-all text-[15px] font-bold" />
                </div>
              </div>

              <div className="pt-6">
                <label className="flex items-center gap-4 cursor-pointer group">
                  <input type="checkbox" checked={diffBilling} onChange={() => setDiffBilling(!diffBilling)} className="w-5 h-5 accent-gray-900 border-2 border-gray-200 rounded-none" />
                  <span className="text-[12px] font-black text-gray-900 uppercase tracking-widest">Facturare la altă adresă</span>
                </label>
              </div>

              {diffBilling && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-12 pt-10 animate-fadeIn">
                  <div className="sm:col-span-2 group">
                    <label className="block text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-2">Adresă facturare</label>
                    <input required name="billingAddress" value={formData.billingAddress} onChange={handleInputChange} className="w-full bg-transparent border-b-2 border-gray-100 py-2 focus:border-gray-900 outline-none transition-all text-[15px] font-bold" />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-2">Oraș facturare</label>
                    <input required name="billingCity" value={formData.billingCity} onChange={handleInputChange} className="w-full bg-transparent border-b-2 border-gray-100 py-2 focus:border-gray-900 outline-none transition-all text-[15px] font-bold" />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-2">Județ facturare</label>
                    <input required name="billingCounty" value={formData.billingCounty} onChange={handleInputChange} className="w-full bg-transparent border-b-2 border-gray-100 py-2 focus:border-gray-900 outline-none transition-all text-[15px] font-bold" />
                  </div>
                </div>
              )}
            </section>

            {/* Step 03 */}
            <section className="space-y-12">
              <div className="flex items-center gap-5 border-b-2 border-gray-900 pb-5">
                <span className="text-[13px] font-black text-gray-900 bg-gray-50 w-8 h-8 rounded-full flex items-center justify-center">3</span>
                <h2 className="text-[15px] font-black text-gray-900 uppercase tracking-[0.2em]">Livrare & Plată</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <label className={`flex flex-col gap-4 p-8 border-2 transition-all cursor-pointer ${formData.shippingMethod === 'pickup' ? 'border-gray-900 bg-gray-50' : 'border-gray-100'}`}>
                  <div className="flex justify-between items-start">
                    <input type="radio" name="shippingMethod" value="pickup" checked={formData.shippingMethod === 'pickup'} onChange={() => setFormData({...formData, shippingMethod: 'pickup'})} className="w-5 h-5 accent-gray-900" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Gratuit</span>
                  </div>
                  <div>
                    <span className="block text-[15px] font-black text-gray-900 uppercase tracking-tight mb-1">Ridicare Depozit</span>
                    <span className="text-[12px] text-gray-400 font-medium">De luni până vineri, 08:00 - 17:00</span>
                  </div>
                </label>
                <label className={`flex flex-col gap-4 p-8 border-2 transition-all cursor-pointer ${formData.shippingMethod === 'delivery' ? 'border-gray-900 bg-gray-50' : 'border-gray-100'}`}>
                  <div className="flex justify-between items-start">
                    <input type="radio" name="shippingMethod" value="delivery" checked={formData.shippingMethod === 'delivery'} onChange={() => setFormData({...formData, shippingMethod: 'delivery'})} className="w-5 h-5 accent-gray-900" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Calculat</span>
                  </div>
                  <div>
                    <span className="block text-[15px] font-black text-gray-900 uppercase tracking-tight mb-1">Transport Alma Decor</span>
                    <span className="text-[12px] text-gray-400 font-medium">Calculat manual după plasare</span>
                  </div>
                </label>
              </div>

              <div className="p-8 border-2 border-gray-900 flex items-center gap-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                </div>
                <div className="w-14 h-14 bg-gray-900 text-white flex items-center justify-center text-[12px] font-black tracking-tighter shrink-0">OP</div>
                <div>
                  <p className="text-[15px] font-black text-gray-900 uppercase tracking-tight mb-1">Ordin de Plată (Transfer)</p>
                  <p className="text-[12px] text-gray-500 font-medium leading-relaxed">Primești factura proformă pe email imediat după confirmare.</p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <label className="block text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-2">Observații privind comanda</label>
              <textarea 
                name="notes" rows={2} value={formData.notes} onChange={handleInputChange}
                placeholder="Preferințe orare, instrucțiuni livrare, etc..."
                className="w-full bg-transparent border-b-2 border-gray-100 py-3 focus:border-gray-900 outline-none transition-all resize-none text-[15px] font-bold" 
              />
            </section>

            <div className="space-y-12">
              <div className="flex items-start gap-5">
                <input type="checkbox" required className="mt-1 w-5 h-5 accent-gray-900" id="terms" />
                <label htmlFor="terms" className="text-[13px] text-gray-600 leading-relaxed font-medium">
                  Confirm că am citit și sunt pe deplin de acord cu <Link to="/termeni" target="_blank" className="text-gray-900 font-black underline decoration-2 underline-offset-4 decoration-brand-yellow">Termenii și Condițiile</Link> Alma Decor.
                </label>
              </div>

              <button 
                type="submit" disabled={loading}
                className="w-full bg-orange-500 text-white font-black text-[14px] uppercase tracking-[0.3em] py-5 rounded-2xl hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-500/20 transition-all active:scale-[0.98] flex justify-center items-center gap-4"
              >
                {loading ? 'PROCESARE...' : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2-2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Confirmă Comanda
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
