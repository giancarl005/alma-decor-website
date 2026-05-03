import React, { useEffect } from 'react';
import { XMarkIcon } from '../ui/Icon';

interface LegalPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPage: React.FC<LegalPageProps> = ({ isOpen, onClose }) => {
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
          <h2 className="text-2xl font-bold text-brand-dark dark:text-gray-100">Politică de Confidențialitate (GDPR)</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Închide">
            <XMarkIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto space-y-4 text-gray-600 dark:text-gray-400">
          <p>Data intrării în vigoare: {new Date().toLocaleDateString('ro-RO')}</p>
          <p className="mt-4">La Alma Decor, ne angajăm să protejăm confidențialitatea și securitatea datelor dumneavoastră personale. Această Politică de Confidențialitate descrie modul în care colectăm, utilizăm, prelucrăm și protejăm informațiile dumneavoastră în conformitate cu Regulamentul (UE) 2016/679 (Regulamentul General privind Protecția Datelor - GDPR).</p>

          <h3 className="text-xl font-semibold text-brand-dark dark:text-gray-200 mt-6">1. Operatorul de Date</h3>
          <p>Operatorul datelor dumneavoastră cu caracter personal este Alma Decor, cu sediul în Strada 1 Decembrie 1918 13, Roșu, Ilfov. Ne puteți contacta la adresa de e-mail: <a href="mailto:Info@almadecor.ro" className="text-brand-yellow hover:underline">Info@almadecor.ro</a>.</p>

          <h3 className="text-xl font-semibold text-brand-dark dark:text-gray-200 mt-6">2. Tipurile de Date Colectate</h3>
          <p>Colectăm date cu caracter personal atunci când utilizați formularul nostru de contact. Datele pe care le putem colecta includ:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Nume și prenume</li>
            <li>Adresă de e-mail</li>
            <li>Număr de telefon</li>
            <li>Preferințe (informații despre produsele de interes)</li>
            <li>Mesajul dumneavoastră și orice alte informații pe care alegeți să ni le furnizați.</li>
          </ul>
          <p>De asemenea, putem colecta automat date tehnice (ex: adresa IP, tipul browser-ului) prin intermediul cookie-urilor, în conformitate cu Politica noastră de Cookies.</p>

          <h3 className="text-xl font-semibold text-brand-dark dark:text-gray-200 mt-6">3. Scopul și Temeiul Juridic al Prelucrării</h3>
          <p>Prelucrăm datele dumneavoastră personale în următoarele scopuri:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Pentru a răspunde solicitărilor dumneavoastră:</strong> Utilizăm datele furnizate prin formularul de contact pentru a vă răspunde la întrebări și a vă oferi informațiile solicitate. Temeiul juridic este consimțământul dumneavoastră (Art. 6(1)(a) GDPR) și interesul nostru legitim de a comunica cu potențiali clienți (Art. 6(1)(f) GDPR).</li>
            <li><strong>Pentru a îmbunătăți serviciile noastre:</strong> Putem analiza datele în mod anonimizat pentru a înțelege nevoile clienților și a ne îmbunătăți website-ul și serviciile. Temeiul juridic este interesul nostru legitim (Art. 6(1)(f) GDPR).</li>
          </ul>

          <h3 className="text-xl font-semibold text-brand-dark dark:text-gray-200 mt-6">4. Perioada de Stocare</h3>
          <p>Vom stoca datele dumneavoastră cu caracter personal doar pe perioada necesară îndeplinirii scopurilor pentru care au fost colectate, sau conform cerințelor legale. Datele din corespondență vor fi păstrate pe o perioadă rezonabilă pentru a gestiona eventualele solicitări viitoare.</p>

          <h3 className="text-xl font-semibold text-brand-dark dark:text-gray-200 mt-6">5. Drepturile Dumneavoastră</h3>
          <p>Conform GDPR, aveți următoarele drepturi:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Dreptul la informare și acces:</strong> Puteți solicita informații despre datele pe care le deținem despre dumneavoastră.</li>
            <li><strong>Dreptul la rectificare:</strong> Puteți solicita corectarea datelor inexacte.</li>
            <li><strong>Dreptul la ștergere ("dreptul de a fi uitat"):</strong> Puteți solicita ștergerea datelor dumneavoastră în anumite condiții.</li>
            <li><strong>Dreptul la restricționarea prelucrării:</strong> Puteți solicita limitarea modului în care prelucrăm datele dumneavoastră.</li>
            <li><strong>Dreptul la portabilitatea datelor:</strong> Puteți solicita transferul datelor dumneavoastră către un alt operator.</li>
            <li><strong>Dreptul de a vă retrage consimțământul:</strong> Vă puteți retrage consimțământul în orice moment, fără a afecta legalitatea prelucrării efectuate înainte de retragere.</li>
            <li><strong>Dreptul de a depune o plângere:</strong> Aveți dreptul de a depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP).</li>
          </ul>
          <p>Pentru a vă exercita aceste drepturi, vă rugăm să ne contactați la <a href="mailto:Info@almadecor.ro" className="text-brand-yellow hover:underline">Info@almadecor.ro</a>.</p>

          <h3 className="text-xl font-semibold text-brand-dark dark:text-gray-200 mt-6">6. Securitatea Datelor</h3>
          <p>Am implementat măsuri tehnice și organizatorice adecvate pentru a proteja datele dumneavoastră cu caracter personal împotriva distrugerii, pierderii, modificării, divulgării neautorizate sau accesului neautorizat.</p>
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

export default PrivacyPage;
