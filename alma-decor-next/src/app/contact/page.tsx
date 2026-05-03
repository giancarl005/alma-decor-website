'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [message, setMessage] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ success: boolean; message: string } | null>(null);

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    captcha: '',
    terms: ''
  });

  const [captchaNum1, setCaptchaNum1] = useState(0);
  const [captchaNum2, setCaptchaNum2] = useState(0);
  const [captchaAnswer, setCaptchaAnswer] = useState('');

  const generateCaptcha = () => {
    setCaptchaNum1(Math.floor(Math.random() * 10) + 1);
    setCaptchaNum2(Math.floor(Math.random() * 10) + 1);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const validateForm = (): boolean => {
    const newErrors = { name: '', email: '', phone: '', service: '', message: '', captcha: '', terms: '' };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Numele este obligatoriu.';
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Adresa de email este obligatorie.';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Adresa de email nu este validă.';
      isValid = false;
    }

    if (!phone.trim()) {
      newErrors.phone = 'Numărul de telefon este obligatoriu.';
      isValid = false;
    } else if (phone.length !== 10) {
      newErrors.phone = 'Numărul de telefon trebuie să conțină exact 10 cifre.';
      isValid = false;
    }

    if (!service) {
      newErrors.service = 'Te rugăm să selectezi un serviciu.';
      isValid = false;
    }

    if (!message.trim()) {
      newErrors.message = 'Mesajul este obligatoriu.';
      isValid = false;
    }
    
    if (!captchaAnswer.trim()) {
      newErrors.captcha = 'Te rugăm să completezi verificarea.';
      isValid = false;
    } else if (parseInt(captchaAnswer, 10) !== captchaNum1 + captchaNum2) {
      newErrors.captcha = 'Răspuns incorect. Te rugăm să încerci din nou.';
      isValid = false;
    }
    
    if (!termsAccepted) {
      newErrors.terms = 'Trebuie să accepți termenii și condițiile.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmissionResult(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    const WEB3FORMS_ACCESS_KEY = "69804b61-c6df-42c7-9918-71dbda49755a";

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name,
          email,
          phone,
          service,
          message,
          subject: `Mesaj nou de pe almadecor.ro de la ${name}`,
        }),
      });

      const json = await res.json();
      
      if (json.success) {
        setSubmissionResult({ success: true, message: "Mesajul tău a fost trimis cu succes! Te vom contacta în curând." });
        setName(''); setEmail(''); setPhone(''); setService(''); setMessage(''); setCaptchaAnswer(''); setTermsAccepted(false);
        generateCaptcha();
      } else {
        setSubmissionResult({ success: false, message: "A apărut o eroare. Te rugăm să încerci din nou." });
      }
    } catch (error) {
      setSubmissionResult({ success: false, message: "A apărut o eroare de rețea." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#0F1115] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="max-w-3xl mb-24 space-y-6">
          <h1 className="text-6xl md:text-8xl font-bold italic serif text-gray-900 dark:text-white tracking-tighter leading-none">
            Contact <span className="text-brand-yellow not-italic">.</span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
            Ai un proiect în minte sau vrei să vizitezi showroom-ul nostru? Suntem aici să te ghidăm în procesul de amenajare.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          {/* Contact Details & Info */}
          <div className="lg:col-span-5 space-y-16">
            <div className="grid grid-cols-1 gap-12">
              <div className="space-y-4 group">
                <h3 className="text-[10px] font-bold text-brand-yellow uppercase tracking-[0.4em]">Telefon</h3>
                <a href="tel:0770612470" className="text-3xl font-bold italic serif text-gray-900 dark:text-white hover:text-brand-yellow transition-colors tracking-tighter">
                  0770 612 470
                </a>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Luni - Vineri, 09:00 - 18:00</p>
              </div>

              <div className="space-y-4 group">
                <h3 className="text-[10px] font-bold text-brand-yellow uppercase tracking-[0.4em]">Email</h3>
                <a href="mailto:Info@almadecor.ro" className="text-3xl font-bold italic serif text-gray-900 dark:text-white hover:text-brand-yellow transition-colors tracking-tighter">
                  Info@almadecor.ro
                </a>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Răspundem în maximum 24h</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-brand-yellow uppercase tracking-[0.4em]">Showroom</h3>
                <p className="text-2xl font-bold italic serif text-gray-900 dark:text-white leading-tight tracking-tighter">
                  Strada 1 Decembrie 1918 13,<br />
                  Roșu, Ilfov, România
                </p>
              </div>
            </div>

            {/* Google Maps Placeholder/Integration */}
            <div className="relative h-[300px] rounded-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-white/5 grayscale hover:grayscale-0 transition-all duration-700">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.817544078862!2d25.9961!3d44.4534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDI3JzEyLjIiTiAyNcKwNTknNDYuMCJF!5e0!3m2!1sro!2sro!4v1651323600000!5m2!1sro!2sro" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-gray-50 dark:bg-white/[0.02] p-12 md:p-16 rounded-[2rem] border border-gray-100 dark:border-white/5">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Nume Complet</label>
                  <input 
                    type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border-b border-gray-200 dark:border-white/10 py-4 text-gray-900 dark:text-white outline-none focus:border-brand-yellow transition-colors font-medium"
                    placeholder="Ion Popescu"
                  />
                  {errors.name && <p className="text-[10px] text-red-500 font-bold uppercase mt-1">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Adresă Email</label>
                  <input 
                    type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b border-gray-200 dark:border-white/10 py-4 text-gray-900 dark:text-white outline-none focus:border-brand-yellow transition-colors font-medium"
                    placeholder="ion@exemplu.ro"
                  />
                  {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Telefon</label>
                  <input 
                    type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full bg-transparent border-b border-gray-200 dark:border-white/10 py-4 text-gray-900 dark:text-white outline-none focus:border-brand-yellow transition-colors font-medium"
                    placeholder="07xx xxx xxx"
                    maxLength={10}
                  />
                  {errors.phone && <p className="text-[10px] text-red-500 font-bold uppercase mt-1">{errors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="service" className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Serviciu Interes</label>
                  <select 
                    id="service" value={service} onChange={(e) => setService(e.target.value)}
                    className="w-full bg-transparent border-b border-gray-200 dark:border-white/10 py-4 text-gray-900 dark:text-white outline-none focus:border-brand-yellow transition-colors font-medium appearance-none"
                  >
                    <option value="" className="bg-white dark:bg-brand-dark">Selectează serviciul</option>
                    <option value="Design Interior" className="bg-white dark:bg-brand-dark">Design Interior</option>
                    <option value="Magazin Online" className="bg-white dark:bg-brand-dark">Produse Magazin</option>
                    <option value="Colaborare" className="bg-white dark:bg-brand-dark">Parteneriat Arhitect</option>
                  </select>
                  {errors.service && <p className="text-[10px] text-red-500 font-bold uppercase mt-1">{errors.service}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Mesajul Tău</label>
                <textarea 
                  id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={4}
                  className="w-full bg-transparent border-b border-gray-200 dark:border-white/10 py-4 text-gray-900 dark:text-white outline-none focus:border-brand-yellow transition-colors font-medium resize-none"
                  placeholder="Cum te putem ajuta?"
                />
                {errors.message && <p className="text-[10px] text-red-500 font-bold uppercase mt-1">{errors.message}</p>}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="bg-white dark:bg-white/5 px-6 py-3 rounded-xl border border-gray-100 dark:border-white/10 font-bold italic serif">
                    {captchaNum1} + {captchaNum2} = ?
                  </div>
                  <input 
                    type="number" value={captchaAnswer} onChange={(e) => setCaptchaAnswer(e.target.value)}
                    className="w-24 bg-transparent border-b border-gray-200 dark:border-white/10 py-3 text-center text-gray-900 dark:text-white outline-none focus:border-brand-yellow transition-colors font-bold"
                  />
                </div>
                {errors.captcha && <p className="text-[10px] text-red-500 font-bold uppercase mt-1">{errors.captcha}</p>}
              </div>

              <div className="flex items-start gap-3">
                <input 
                  type="checkbox" id="terms" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-brand-yellow focus:ring-brand-yellow"
                />
                <label htmlFor="terms" className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                  Sunt de acord cu prelucrarea datelor mele personale conform Termenilor și Condițiilor Alma Decor.
                </label>
              </div>
              {errors.terms && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.terms}</p>}

              <button 
                type="submit" disabled={isSubmitting}
                className="w-full bg-brand-yellow text-gray-900 font-black py-6 rounded-2xl hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all duration-500 text-sm tracking-[0.2em] shadow-xl shadow-brand-yellow/10"
              >
                {isSubmitting ? 'SE TRIMITE...' : 'TRIMITE MESAJUL'}
              </button>

              {submissionResult && (
                <div className={`p-4 rounded-xl text-center text-xs font-bold uppercase tracking-widest ${submissionResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {submissionResult.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
