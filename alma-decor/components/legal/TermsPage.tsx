import React, { useEffect } from 'react';
import { XMarkIcon } from '../ui/Icon';

interface LegalPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsPage: React.FC<LegalPageProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup on component unmount
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
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-2xl font-bold text-brand-dark dark:text-gray-100">Termeni și Condiții</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Închide">
            <XMarkIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto space-y-4 text-gray-600 dark:text-gray-400">
          <h3 className="text-xl font-semibold text-brand-dark dark:text-gray-200">1. Introducere</h3>
          <p>Bine ați venit pe almadecor.ro! Acești termeni și condiții conturează regulile și reglementările pentru utilizarea website-ului Alma Decor.</p>
          <p>Accesând acest website, presupunem că acceptați acești termeni și condiții în totalitate. Nu continuați să utilizați website-ul Alma Decor dacă nu acceptați toți termenii și condițiile menționate pe această pagină.</p>

          <h3 className="text-xl font-semibold text-brand-dark dark:text-gray-200 mt-6">2. Drepturi de Proprietate Intelectuală</h3>
          <p>Cu excepția cazului în care se specifică altfel, Alma Decor și/sau licențiatorii săi dețin drepturile de proprietate intelectuală pentru tot materialul de pe almadecor.ro. Toate drepturile de proprietate intelectuală sunt rezervate. Puteți vizualiza și/sau imprima pagini de pe almadecor.ro pentru uzul dumneavoastră personal, sub rezerva restricțiilor stabilite în acești termeni și condiții.</p>
          <p>Nu aveți dreptul să:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Republicați material de pe almadecor.ro</li>
            <li>Vindeți, închiriați sau sub-licențiați material de pe almadecor.ro</li>
            <li>Reproduceți, duplicați sau copiați material de pe almadecor.ro</li>
            <li>Redistribuiți conținut de la Alma Decor (cu excepția cazului în care conținutul este creat special pentru redistribuire).</li>
          </ul>

          <h3 className="text-xl font-semibold text-brand-dark dark:text-gray-200 mt-6">3. Limitarea Răspunderii</h3>
          <p>Informațiile de pe acest website sunt furnizate "ca atare", fără nicio garanție. Deși ne străduim să asigurăm că informațiile de pe acest website sunt corecte, nu garantăm completitudinea sau acuratețea acestora; nici nu ne angajăm să asigurăm că website-ul rămâne disponibil sau că materialul de pe website este menținut la zi.</p>
          <p>În măsura maximă permisă de legea aplicabilă, excludem toate reprezentările, garanțiile și condițiile referitoare la website-ul nostru și la utilizarea acestui website. Nimic din această clauză de exonerare de răspundere nu va:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Limita sau exclude răspunderea noastră sau a dumneavoastră pentru fraudă sau denaturare frauduloasă.</li>
            <li>Limita oricare dintre răspunderile noastre sau ale dumneavoavoastră în orice mod care nu este permis de legea aplicabilă.</li>
            <li>Exclude oricare dintre răspunderile noastre sau ale dumneavoastră care nu pot fi excluse în conformitate cu legea aplicabilă.</li>
          </ul>

          <h3 className="text-xl font-semibold text-brand-dark dark:text-gray-200 mt-6">4. Legislația Aplicabilă</h3>
          <p>Acești termeni și condiții vor fi guvernați și interpretați în conformitate cu legile din România, iar orice dispute legate de acești termeni și condiții vor fi supuse jurisdicției exclusive a instanțelor din România.</p>

          <h3 className="text-xl font-semibold text-brand-dark dark:text-gray-200 mt-6">5. Contact</h3>
          <p>Pentru orice întrebări legate de acești Termeni și Condiții, ne puteți contacta la adresa de e-mail: <a href="mailto:Info@almadecor.ro" className="text-brand-yellow hover:underline">Info@almadecor.ro</a>.</p>
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

export default TermsPage;
