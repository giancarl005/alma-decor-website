import React, { useState, useEffect } from 'react';
import { MailIcon, PhoneIcon, LocationMarkerIcon, ClockIcon } from './ui/Icon';

interface ContactProps {
  onLegalLinkClick: (page: 'terms' | 'privacy' | 'cookies') => void;
}

const Contact: React.FC<ContactProps> = ({ onLegalLinkClick }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [message, setMessage] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ success: boolean; message: string } | null>(null);

  // Form errors state
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    captcha: '',
    terms: ''
  });

  // CAPTCHA states
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

  // Generic handler to update state and clear errors
  const handleInputChange = <T extends string | number>(
    setter: React.Dispatch<React.SetStateAction<T>>,
    field: keyof typeof errors
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setter(e.target.value as T);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmissionResult(null);

    if (!validateForm()) {
      // If captcha was the only error and it was wrong, regenerate it.
      if (errors.captcha && !errors.name && !errors.email && !errors.phone && !errors.service && !errors.message && !errors.terms) {
        generateCaptcha();
        setCaptchaAnswer('');
      }
      return; // Stop submission
    }

    setIsSubmitting(true);
    
    const WEB3FORMS_ACCESS_KEY = "69804b61-c6df-42c7-9918-71dbda49755a";

    const formData = {
      access_key: WEB3FORMS_ACCESS_KEY,
      name: name,
      email: email,
      phone: phone,
      service: service,
      message: message,
      subject: `Mesaj nou de pe almadecor.ro de la ${name}`,
    };

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      
      if (json.success) {
        setSubmissionResult({ success: true, message: "Mesajul tău a fost trimis cu succes! Te vom contacta în curând." });
        setName('');
        setEmail('');
        setPhone('');
        setService('');
        setMessage('');
        setCaptchaAnswer('');
        setTermsAccepted(false);
        generateCaptcha();
      } else {
        console.error("API Error from Web3Forms:", json);
        setSubmissionResult({ success: false, message: json.message || "A apărut o eroare. Te rugăm să încerci din nou." });
        generateCaptcha();
        setCaptchaAnswer('');
      }
    } catch (error) {
      console.error("Network Error:", error);
      setSubmissionResult({ success: false, message: "A apărut o eroare de rețea. Verifică conexiunea și încearcă din nou." });
      generateCaptcha();
      setCaptchaAnswer('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Contact Info Column */}
          <div>
            <h2 className="text-4xl font-extrabold text-brand-dark dark:text-gray-100">Contactează-ne</h2>
            <p className="mt-8 text-lg text-gray-600 dark:text-gray-400">
              Ai un proiect în minte sau doar vrei să ne saluți? Ne-ar plăcea să auzim de la tine. Completează formularul și te vom contacta în cel mai scurt timp.
            </p>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Fie că ești la începutul unui proiect de renovare sau cauți piesa finală care să completeze designul, echipa noastră este aici pentru a te ghida. Oferim consultanță personalizată și soluții adaptate bugetului și stilului tău.
            </p>
            <div className="mt-12 space-y-8">
              <a href="mailto:Info@almadecor.ro" className="flex items-center space-x-4 group">
                <MailIcon className="w-8 h-8 text-brand-yellow flex-shrink-0" />
                <span className="text-lg text-gray-700 dark:text-gray-300 font-medium group-hover:text-brand-yellow transition-colors">Info@almadecor.ro</span>
              </a>
              <a href="tel:0770612470" className="flex items-center space-x-4 group">
                <PhoneIcon className="w-8 h-8 text-brand-yellow flex-shrink-0" />
                <span className="text-lg text-gray-700 dark:text-gray-300 font-medium group-hover:text-brand-yellow transition-colors">0770 612 470</span>
              </a>
              <div className="flex items-center space-x-4">
                <ClockIcon className="w-8 h-8 text-brand-yellow flex-shrink-0" />
                <span className="text-lg text-gray-700 dark:text-gray-300 font-medium">Program: Luni - Vineri, 09:00 - 18:00</span>
              </div>
              <div className="flex items-start space-x-4">
                <LocationMarkerIcon className="w-8 h-8 text-brand-yellow flex-shrink-0 mt-1" />
                <span className="text-lg text-gray-700 dark:text-gray-300 font-medium">Strada 1 Decembrie 1918 13, Roșu, Ilfov</span>
              </div>
            </div>
          </div>
          
          {/* Form Column */}
          <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
             <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nume</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required 
                    value={name}
                    onChange={handleInputChange(setName, 'name')}
                    className={`mt-1 block w-full px-4 py-3 border rounded-md shadow-sm dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ${errors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-brand-yellow focus:border-brand-yellow'}`}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && <p id="name-error" className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    value={email}
                    onChange={handleInputChange(setEmail, 'email')}
                    className={`mt-1 block w-full px-4 py-3 border rounded-md shadow-sm dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-brand-yellow focus:border-brand-yellow'}`}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && <p id="email-error" className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Telefon</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    required 
                    maxLength={10} 
                    pattern="[0-9]{10}"
                    title="Introduceți un număr de telefon valid de 10 cifre."
                    value={phone}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/[^0-9]/g, '');
                      setPhone(numericValue);
                      if (errors.phone) setErrors(prev => ({...prev, phone: ''}));
                    }}
                    className={`mt-1 block w-full px-4 py-3 border rounded-md shadow-sm dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ${errors.phone ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-brand-yellow focus:border-brand-yellow'}`}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                  />
                  {errors.phone && <p id="phone-error" className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>}
                </div>
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tip Serviciu</label>
                  <select 
                    id="service" 
                    name="service" 
                    required 
                    value={service}
                    onChange={handleInputChange(setService, 'service')}
                    className={`mt-1 block w-full px-4 py-3 border rounded-md shadow-sm dark:bg-gray-700 dark:text-white ${errors.service ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-brand-yellow focus:border-brand-yellow'}`}
                    aria-invalid={!!errors.service}
                    aria-describedby={errors.service ? 'service-error' : undefined}
                  >
                    <option value="" disabled>Selectează serviciul dorit</option>
                    <option value="Design Interior">Design Interior</option>
                    <option value="Amenajari Exterioare">Amenajări Exterioare</option>
                    <option value="Produse Specifice - Parchet">Produse Specifice - Parchet</option>
                    <option value="Produse Specifice - Tapet">Produse Specifice - Tapet</option>
                    <option value="Produse Specifice - Perdele/Draperii">Produse Specifice - Perdele/Draperii</option>
                    <option value="Produse Specifice - Profile Decorative">Produse Specifice - Profile Decorative</option>
                    <option value="Altele">Altele</option>
                  </select>
                  {errors.service && <p id="service-error" className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.service}</p>}
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mesaj</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={4} 
                    required 
                    placeholder="Oferiți-ne mai multe detalii despre proiectul dumneavoastră..."
                    value={message}
                    onChange={handleInputChange(setMessage, 'message')}
                    className={`mt-1 block w-full px-4 py-3 border rounded-md shadow-sm dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ${errors.message ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-brand-yellow focus:border-brand-yellow'}`}></textarea>
                    {errors.message && <p id="message-error" className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.message}</p>}
                </div>
                
                {/* CAPTCHA Field */}
                <div>
                  <label htmlFor="captcha" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Verificare Anti-Spam</label>
                  <div className="mt-1 grid grid-cols-2 gap-4">
                    <span className="flex items-center justify-center w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200 font-mono text-lg select-none">
                      {captchaNum1} + {captchaNum2} = ?
                    </span>
                    <input 
                      type="number" 
                      id="captcha" 
                      name="captcha" 
                      required 
                      value={captchaAnswer}
                      onChange={handleInputChange(setCaptchaAnswer, 'captcha')}
                      className={`block w-full px-4 py-3 border rounded-md shadow-sm dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ${errors.captcha ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-brand-yellow focus:border-brand-yellow'}`}
                      aria-label="Răspuns la întrebarea anti-spam"
                      aria-invalid={!!errors.captcha}
                      aria-describedby={errors.captcha ? 'captcha-error' : undefined}
                    />
                  </div>
                  {errors.captcha && <p id="captcha-error" className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.captcha}</p>}
                </div>
                
                {/* Terms and Conditions Checkbox */}
                <div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => {
                          setTermsAccepted(e.target.checked);
                          if (errors.terms) {
                            setErrors(prev => ({ ...prev, terms: '' }));
                          }
                        }}
                        className={`w-4 h-4 text-brand-yellow bg-gray-100 border-gray-300 rounded focus:ring-brand-yellow dark:focus:ring-brand-yellow dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 ${errors.terms ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                        required
                        aria-invalid={!!errors.terms}
                        aria-describedby={errors.terms ? 'terms-error' : undefined}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="terms" className="text-gray-700 dark:text-gray-300">
                        Sunt de acord cu{' '}
                        <button
                          type="button"
                          onClick={() => onLegalLinkClick('terms')}
                          className="font-medium text-brand-yellow hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-brand-yellow rounded-sm"
                        >
                          Termenii și Condițiile
                        </button>
                        .
                      </label>
                    </div>
                  </div>
                  {errors.terms && <p id="terms-error" className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.terms}</p>}
                </div>
                
                {submissionResult && (
                  <div className={`text-center p-3 rounded-md text-sm font-medium ${
                    submissionResult.success 
                      ? 'bg-green-100 dark:bg-green-900/50 border border-green-400 text-green-800 dark:text-green-300' 
                      : 'bg-red-100 dark:bg-red-900/50 border border-red-400 text-red-800 dark:text-red-300'
                  }`}>
                    {submissionResult.message}
                  </div>
                )}
                
                <div>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-brand-yellow text-gray-900 font-bold py-3 px-6 rounded-lg text-lg hover:bg-brand-yellow-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-wait"
                  >
                    {isSubmitting ? 'Se trimite...' : 'TRIMITE MESAJUL'}
                  </button>
                </div>
              </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
