import React, { useEffect } from 'react';
import { XMarkIcon } from '../ui/Icon';

interface LegalPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const CookiesPage: React.FC<LegalPageProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-2xl font-bold text-brand-dark dark:text-gray-100">Politică Cookies</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Închide">
            <XMarkIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto space-y-4 text-gray-600 dark:text-gray-400">
          <h3 className="text-xl font-semibold text-brand-dark dark:text-gray-200">Ce sunt Cookie-urile?</h3>
          <p>Website-ul almadecor.ro, la fel ca majoritatea site-urilor profesionale, utilizează cookie-uri. Un "cookie" este un fișier text de mici dimensiuni pe care un site îl salvează pe computerul sau dispozitivul dumneavoastră mobil atunci când îl vizitați. Acesta permite website-ului să rețină acțiunile și preferințele dumneavoastră (cum ar fi limba, dimensiunea fontului și alte preferințe de afișare) pe o perioadă de timp, astfel încât să nu fie necesar să le reintroduceți de fiecare dată când reveniți pe site sau navigați de la o pagină la alta.</p>

          <h3 className="text-xl font-semibold text-brand-dark dark:text-gray-200 mt-6">Cum Utilizăm Cookie-urile?</h3>
          <p>Utilizăm cookie-uri pentru diverse motive, detaliate mai jos. Din păcate, în majoritatea cazurilor, nu există opțiuni standard în industrie pentru dezactivarea cookie-urilor fără a dezactiva complet funcționalitatea și caracteristicile pe care le adaugă acestui site. Se recomandă să lăsați toate cookie-urile activate dacă nu sunteți sigur dacă aveți nevoie de ele, în cazul în care sunt utilizate pentru a furniza un serviciu pe care îl folosiți.</p>

          <h3 className="text-xl font-semibold text-brand-dark dark:text-gray-200 mt-6">Tipuri de Cookie-uri Folosite</h3>
          <ul className="list-disc list-inside space-y-4 pl-4">
              <li>
                  <strong>Cookie-uri Esențiale:</strong> Acestea sunt strict necesare pentru funcționarea corectă a website-ului. De exemplu, ele pot reține preferința dumneavoastră pentru tema vizuală (luminoasă/întunecată). Fără aceste cookie-uri, anumite părți ale site-ului nu vor funcționa.
              </li>
              <li>
                  <strong>Cookie-uri de Performanță și Analiză:</strong> Aceste cookie-uri ne permit să recunoaștem și să numărăm vizitatorii și să vedem cum navighează aceștia pe website. Acest lucru ne ajută să îmbunătățim modul în care funcționează website-ul nostru, de exemplu, asigurându-ne că utilizatorii găsesc ușor ceea ce caută. Putem utiliza servicii terțe, precum Google Analytics, în acest scop.
              </li>
              <li>
                  <strong>Cookie-uri de Funcționalitate:</strong> Acestea sunt utilizate pentru a vă recunoaște atunci când reveniți pe website-ul nostru. Acest lucru ne permite să personalizăm conținutul pentru dumneavoastră și să ne amintim preferințele dumneavoastră.
              </li>
          </ul>

          <h3 className="text-xl font-semibold text-brand-dark dark:text-gray-200 mt-6">Cum Puteți Controla Cookie-urile?</h3>
          <p>Puteți controla și/sau șterge cookie-urile după cum doriți – pentru detalii, consultați aboutcookies.org. Puteți șterge toate cookie-urile care sunt deja pe computerul dumneavoastră și puteți seta majoritatea browserelor pentru a preveni plasarea lor. Dacă faceți acest lucru, este posibil să trebuiască să ajustați manual unele preferințe de fiecare dată când vizitați un site, iar unele servicii și funcționalități s-ar putea să nu funcționeze.</p>
          <p>Mai jos găsiți link-uri către instrucțiunile de gestionare a cookie-urilor pentru cele mai populare browsere:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-brand-yellow hover:underline">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/ro/kb/cookie-urile-activarea-si-dezactivarea" target="_blank" rel="noopener noreferrer" className="text-brand-yellow hover:underline">Mozilla Firefox</a></li>
              <li><a href="https://support.microsoft.com/ro-ro/windows/ștergerea-și-gestionarea-modulelor-cookie-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" className="text-brand-yellow hover:underline">Microsoft Edge</a></li>
              <li><a href="https://support.apple.com/ro-ro/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-brand-yellow hover:underline">Safari</a></li>
          </ul>

          <h3 className="text-xl font-semibold text-brand-dark dark:text-gray-200 mt-6">Contact</h3>
          <p>Dacă aveți întrebări suplimentare despre modul în care folosim cookie-urile, ne puteți contacta la <a href="mailto:Info@almadecor.ro" className="text-brand-yellow hover:underline">Info@almadecor.ro</a>.</p>
        </div>
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 text-right flex-shrink-0">
            <button 
                onClick={onClose}
                className="bg-brand-yellow text-gray-900 font-bold py-2 px-6 rounded-lg hover:bg-brand-yellow-dark transition-all duration-300"
            >
                Închide
            </button>
        </div>
      </div>
       <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale {
          animation: fadeInScale 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CookiesPage;
