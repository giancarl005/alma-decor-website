'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../../contexts/CartContext';
import { TrashIcon, ShieldCheckIcon, CheckIcon } from '../../components/ui/Icon';

import { API_BASE } from '../../lib/api';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [customerType, setCustomerType] = useState<'individual' | 'business'>('individual');
  const [diffBilling, setDiffBilling] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [formData, setFormData] = useState({
    customer_id: null as number | null,
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
    setMounted(true);
    const userData = localStorage.getItem('alma_customer_user');
    if (userData) {
      const user = JSON.parse(userData);
      const nameParts = (user.nume || '').split(' ');
      setFormData(prev => ({
        ...prev,
        customer_id: user.id || null,
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

  const getFullUrl = (url: string | null) => {
    if (!url) return 'https://via.placeholder.com/400x500?text=Alma+Decor';
    return url.startsWith('http') ? url : `${API_BASE}${url}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Coșul este gol!");
    
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert("Te rugăm să introduci un număr de telefon valid (10 cifre).");
      return;
    }

    setLoading(true);
    const orderData = {
      customerType,
      customer_id: formData.customer_id,
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
      paymentMethod: formData.paymentMethod,
      notes: formData.notes,
      total: cartTotal,
      items: cart
    };

    try {
      const res = await fetch(`${API_BASE}/api/comanda.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const data = await res.json();
      if (data.status === 'success') {
        clearCart();
        router.push(`/comanda/confirmare?id=${data.order_id}`);
      } else {
        alert("Eroare: " + data.message);
      }
    } catch (err) {
      alert("Eroare la procesarea comenzii. Vă rugăm să reîncercați.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-white dark:bg-[#0F1115] pt-40 pb-24 flex items-center justify-center">
        <div className="text-center">
           <h1 className="text-3xl font-bold italic serif text-gray-900 dark:text-white mb-8">Coșul tău este gol</h1>
           <Link href="/magazin" className="bg-brand-yellow text-gray-900 font-black py-4 px-10 rounded-xl hover:bg-gray-900 hover:text-white transition-all text-xs tracking-widest uppercase shadow-xl">
             Înapoi la magazin
           </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#0F1115] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-20">
          
          {/* Form Side */}
          <div className="max-w-2xl">
            <header className="mb-16">
              <h2 className="text-[11px] font-bold text-brand-yellow uppercase tracking-[0.4em] mb-4">Checkout</h2>
              <h1 className="text-5xl md:text-6xl font-bold italic serif text-gray-900 dark:text-white tracking-tighter leading-none">
                Finalizare <br /> Comandă
              </h1>
              <div className="h-1 w-20 bg-brand-yellow mt-8" />
            </header>

            <form onSubmit={handleSubmit} className="space-y-20">
              {/* Step 1: Customer Info */}
              <section className="space-y-12">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b-2 border-gray-900 dark:border-white pb-5">
                  <div className="flex items-center gap-5">
                    <span className="text-[13px] font-black text-white bg-gray-900 dark:bg-brand-yellow dark:text-gray-900 w-8 h-8 rounded-full flex items-center justify-center italic serif">1</span>
                    <h2 className="text-[15px] font-black text-gray-900 dark:text-white uppercase tracking-[0.2em]">Informații client</h2>
                  </div>
                  <div className="flex bg-gray-50 dark:bg-white/5 p-1 rounded-full border border-gray-100 dark:border-white/10">
                    <button 
                      type="button" onClick={() => setCustomerType('individual')}
                      className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${customerType === 'individual' ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                    >
                      Persoană Fizică
                    </button>
                    <button 
                      type="button" onClick={() => setCustomerType('business')}
                      className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${customerType === 'business' ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                    >
                      Persoană Juridică
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-12">
                  {customerType === 'business' && (
                    <>
                      <div className="sm:col-span-2 group">
                        <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2 group-focus-within:text-brand-yellow transition-colors">Nume Companie</label>
                        <input required name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full bg-transparent border-b-2 border-gray-100 dark:border-white/10 py-2 focus:border-gray-900 dark:focus:border-brand-yellow outline-none transition-all text-[15px] font-bold text-gray-900 dark:text-white placeholder:text-gray-200 dark:placeholder:text-gray-800" />
                      </div>
                      <div className="group">
                        <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2">CUI / CIF</label>
                        <input required name="cui" value={formData.cui} onChange={handleInputChange} className="w-full bg-transparent border-b-2 border-gray-100 dark:border-white/10 py-2 focus:border-gray-900 dark:focus:border-brand-yellow outline-none transition-all text-[15px] font-bold text-gray-900 dark:text-white" />
                      </div>
                      <div className="group">
                        <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2">Reg. Comerțului</label>
                        <input required name="regCom" placeholder="J40/0000/0000" value={formData.regCom} onChange={handleInputChange} className="w-full bg-transparent border-b-2 border-gray-100 dark:border-white/10 py-2 focus:border-gray-900 dark:focus:border-brand-yellow outline-none transition-all text-[15px] font-bold text-gray-900 dark:text-white" />
                      </div>
                    </>
                  )}
                  <div className="group">
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2">Prenume</label>
                    <input required name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-transparent border-b-2 border-gray-100 dark:border-white/10 py-2 focus:border-gray-900 dark:focus:border-brand-yellow outline-none transition-all text-[15px] font-bold text-gray-900 dark:text-white" />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2">Nume de Familie</label>
                    <input required name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-transparent border-b-2 border-gray-100 dark:border-white/10 py-2 focus:border-gray-900 dark:focus:border-brand-yellow outline-none transition-all text-[15px] font-bold text-gray-900 dark:text-white" />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2">Adresă Email</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-transparent border-b-2 border-gray-100 dark:border-white/10 py-2 focus:border-gray-900 dark:focus:border-brand-yellow outline-none transition-all text-[15px] font-bold text-gray-900 dark:text-white" />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2">Număr Telefon</label>
                    <input required type="tel" name="phone" pattern="[0-9]{10}" value={formData.phone} onChange={handleInputChange} className="w-full bg-transparent border-b-2 border-gray-100 dark:border-white/10 py-2 focus:border-gray-900 dark:focus:border-brand-yellow outline-none transition-all text-[15px] font-bold text-gray-900 dark:text-white" />
                  </div>
                </div>
              </section>

              {/* Step 2: Shipping */}
              <section className="space-y-12">
                <div className="flex items-center gap-5 border-b-2 border-gray-900 dark:border-white pb-5">
                  <span className="text-[13px] font-black text-white bg-gray-900 dark:bg-brand-yellow dark:text-gray-900 w-8 h-8 rounded-full flex items-center justify-center italic serif">2</span>
                  <h2 className="text-[15px] font-black text-gray-900 dark:text-white uppercase tracking-[0.2em]">Adresa de livrare</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-12">
                  <div className="sm:col-span-2 group">
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2">Adresă completă</label>
                    <input required name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-transparent border-b-2 border-gray-100 dark:border-white/10 py-2 focus:border-gray-900 dark:focus:border-brand-yellow outline-none transition-all text-[15px] font-bold text-gray-900 dark:text-white" />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2">Oraș / Localitate</label>
                    <input required name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-transparent border-b-2 border-gray-100 dark:border-white/10 py-2 focus:border-gray-900 dark:focus:border-brand-yellow outline-none transition-all text-[15px] font-bold text-gray-900 dark:text-white" />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2">Județ</label>
                    <input required name="county" value={formData.county} onChange={handleInputChange} className="w-full bg-transparent border-b-2 border-gray-100 dark:border-white/10 py-2 focus:border-gray-900 dark:focus:border-brand-yellow outline-none transition-all text-[15px] font-bold text-gray-900 dark:text-white" />
                  </div>
                </div>

                <div className="pt-6">
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input type="checkbox" checked={diffBilling} onChange={() => setDiffBilling(!diffBilling)} className="w-6 h-6 border-2 border-gray-200 dark:border-white/10 rounded-lg appearance-none checked:bg-brand-yellow checked:border-brand-yellow transition-all cursor-pointer" />
                      {diffBilling && <CheckIcon className="w-4 h-4 text-gray-900 absolute pointer-events-none" />}
                    </div>
                    <span className="text-[12px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Vreau factură pe altă adresă</span>
                  </label>
                </div>

                {diffBilling && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-12 pt-10 animate-fadeIn">
                    <div className="sm:col-span-2 group">
                      <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2">Adresă facturare</label>
                      <input required name="billingAddress" value={formData.billingAddress} onChange={handleInputChange} className="w-full bg-transparent border-b-2 border-gray-100 dark:border-white/10 py-2 focus:border-gray-900 dark:focus:border-brand-yellow outline-none transition-all text-[15px] font-bold text-gray-900 dark:text-white" />
                    </div>
                    <div className="group">
                      <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2">Oraș facturare</label>
                      <input required name="billingCity" value={formData.billingCity} onChange={handleInputChange} className="w-full bg-transparent border-b-2 border-gray-100 dark:border-white/10 py-2 focus:border-gray-900 dark:focus:border-brand-yellow outline-none transition-all text-[15px] font-bold text-gray-900 dark:text-white" />
                    </div>
                    <div className="group">
                      <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2">Județ facturare</label>
                      <input required name="billingCounty" value={formData.billingCounty} onChange={handleInputChange} className="w-full bg-transparent border-b-2 border-gray-100 dark:border-white/10 py-2 focus:border-gray-900 dark:focus:border-brand-yellow outline-none transition-all text-[15px] font-bold text-gray-900 dark:text-white" />
                    </div>
                  </div>
                )}
              </section>

              {/* Step 3: Payment */}
              <section className="space-y-12">
                  <div className="flex items-center gap-5 border-b-2 border-gray-900 dark:border-white pb-5">
                    <span className="text-[13px] font-black text-white bg-gray-900 dark:bg-brand-yellow dark:text-gray-900 w-8 h-8 rounded-full flex items-center justify-center italic serif">3</span>
                    <h2 className="text-[15px] font-black text-gray-900 dark:text-white uppercase tracking-[0.2em]">Metodă Livrare</h2>
                  </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <label className={`flex flex-col gap-4 p-8 border-2 transition-all cursor-pointer rounded-2xl ${formData.shippingMethod === 'pickup' ? 'border-brand-yellow bg-brand-yellow/5' : 'border-gray-100 dark:border-white/5'}`}>
                    <div className="flex justify-between items-start">
                      <input type="radio" name="shippingMethod" value="pickup" checked={formData.shippingMethod === 'pickup'} onChange={() => setFormData({...formData, shippingMethod: 'pickup'})} className="w-5 h-5 accent-brand-yellow" />
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Gratuit</span>
                    </div>
                    <div>
                      <span className="block text-[15px] font-black text-gray-900 dark:text-white uppercase tracking-tight mb-1">Ridicare Depozit</span>
                      <span className="text-[11px] text-gray-400 font-medium">Str. 1 Decembrie 1918 13, Roșu</span>
                    </div>
                  </label>
                  <label className={`flex flex-col gap-4 p-8 border-2 transition-all cursor-pointer rounded-2xl ${formData.shippingMethod === 'delivery' ? 'border-brand-yellow bg-brand-yellow/5' : 'border-gray-100 dark:border-white/5'}`}>
                    <div className="flex justify-between items-start">
                      <input type="radio" name="shippingMethod" value="delivery" checked={formData.shippingMethod === 'delivery'} onChange={() => setFormData({...formData, shippingMethod: 'delivery'})} className="w-5 h-5 accent-brand-yellow" />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Calculat Manual</span>
                    </div>
                    <div>
                      <span className="block text-[15px] font-black text-gray-900 dark:text-white uppercase tracking-tight mb-1">Transport Alma Decor</span>
                      <span className="text-[11px] text-gray-400 font-medium">Vom reveni cu oferta de transport</span>
                    </div>
                  </label>
                </div>

                <div className="p-10 border-2 border-gray-900 dark:border-brand-yellow rounded-3xl relative overflow-hidden group bg-gray-50 dark:bg-brand-yellow/5">
                  <div className="flex items-center gap-8">
                    <div className="w-14 h-14 bg-gray-900 dark:bg-brand-yellow text-white dark:text-gray-900 flex items-center justify-center text-[12px] font-black tracking-tighter shrink-0 rounded-xl italic serif">?</div>
                    <div>
                      <p className="text-[15px] font-black text-gray-900 dark:text-white uppercase tracking-tight mb-1">Confirmare Telefonică</p>
                      <p className="text-[12px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Te vom contacta pentru a stabili detaliile de plată și livrare după ce verificăm stocul.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-8">
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Observații Comandă</label>
                  <textarea 
                    name="notes" rows={2} value={formData.notes} onChange={handleInputChange}
                    placeholder="Preferințe orare, instrucțiuni livrare, etc..."
                    className="w-full bg-transparent border-b-2 border-gray-100 dark:border-white/10 py-3 focus:border-gray-900 dark:focus:border-brand-yellow outline-none transition-all resize-none text-[15px] font-bold text-gray-900 dark:text-white" 
                  />
                </div>

                <div className="pt-10 border-t border-gray-100 dark:border-white/5 space-y-12">
                  <label className="flex items-start gap-5 cursor-pointer group">
                    <div className="relative flex items-center justify-center shrink-0 mt-1">
                      <input type="checkbox" required className="w-6 h-6 border-2 border-gray-200 dark:border-white/10 rounded-lg appearance-none checked:bg-brand-yellow checked:border-brand-yellow transition-all cursor-pointer" id="terms" />
                      <CheckIcon className="w-4 h-4 text-gray-900 absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                      Confirm că am citit și sunt pe deplin de acord cu <Link href="/termeni-si-conditii" target="_blank" className="text-gray-900 dark:text-white font-black underline decoration-2 underline-offset-4 decoration-brand-yellow">Termenii și Condițiile</Link> Alma Decor.
                    </span>
                  </label>

                  <button 
                    type="submit" disabled={loading}
                    className="w-full bg-orange-500 text-white font-black text-[14px] uppercase tracking-[0.3em] py-6 rounded-2xl hover:bg-orange-600 hover:shadow-2xl hover:shadow-orange-500/20 transition-all active:scale-[0.98] flex justify-center items-center gap-4 disabled:opacity-50"
                  >
                    {loading ? 'PROCESARE COMANDĂ...' : 'FINALIZEAZĂ COMANDA'}
                  </button>
                </div>
              </section>
            </form>
          </div>

          {/* Summary Side */}
          <div className="lg:sticky lg:top-32 h-fit">
            <div className="bg-gray-50 dark:bg-white/[0.02] p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm">
              <h2 className="text-[11px] font-black text-gray-400 dark:text-gray-500 mb-10 tracking-[0.3em] uppercase">Sumar Comandă</h2>
              
              <div className="space-y-8 mb-12 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                {cart.map(item => (
                  <div key={`${item.id}-${item.variation_id}`} className="flex gap-5 items-center">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-white dark:bg-white/5 border border-gray-50 dark:border-white/10 p-2">
                      <img src={getFullUrl(item.image)} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-grow space-y-1">
                      <p className="text-[13px] font-bold text-gray-900 dark:text-white leading-tight line-clamp-2">{item.name}</p>
                      <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{item.quantity} × {Number(item.sale_price || item.price).toFixed(2)} Lei</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-100 dark:border-white/5 pt-10 space-y-5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-500">Subtotal</span>
                  <span className="font-bold text-gray-900 dark:text-white">{cartTotal.toFixed(2)} Lei</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-500">Transport</span>
                  <span className={formData.shippingMethod === 'pickup' ? "text-emerald-500 font-bold uppercase text-[10px] tracking-widest" : "text-gray-400 font-bold text-[10px] uppercase tracking-widest italic"}>
                    {formData.shippingMethod === 'pickup' ? 'Gratuit' : 'Calculat Manual'}
                  </span>
                </div>
                
                <div className="flex justify-between items-end pt-10 border-t border-gray-100 dark:border-white/5 mt-10">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total de plată</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase italic">TVA inclus</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-black text-gray-900 dark:text-brand-yellow tabular-nums tracking-tighter">
                      {cartTotal.toFixed(2)}
                      <span className="text-sm font-bold ml-1 tracking-normal">Lei</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Security badges */}
              <div className="mt-12 flex justify-between items-center px-6 py-5 bg-white dark:bg-white/5 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3">
                  <ShieldCheckIcon className="w-5 h-5 text-brand-yellow" />
                  <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Garanție Alma Decor</span>
                </div>
                <div className="w-px h-5 bg-gray-100 dark:bg-white/10"></div>
                <div className="flex items-center gap-3">
                  <CheckIcon className="w-5 h-5 text-brand-yellow" />
                  <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Confidențialitate</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
