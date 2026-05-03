import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Termeni și Condiții - Alma Decor',
  description: 'Regulile și reglementările pentru utilizarea website-ului Alma Decor.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0F1115] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <header className="mb-16">
          <h2 className="text-[11px] font-bold text-brand-yellow uppercase tracking-[0.4em] mb-4">Legal</h2>
          <h1 className="text-5xl md:text-6xl font-bold italic serif text-gray-900 dark:text-white tracking-tighter leading-none">
            Termeni și <br /> Condiții
          </h1>
          <div className="h-1 w-20 bg-brand-yellow mt-8" />
        </header>

        <div className="prose dark:prose-invert max-w-none space-y-8 text-gray-600 dark:text-gray-400 leading-relaxed">
          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Introducere</h3>
            <p>Bine ați venit pe almadecor.ro! Acești termeni și condiții conturează regulile și reglementările pentru utilizarea website-ului Alma Decor.</p>
            <p>Accesând acest website, presupunem că acceptați acești termeni și condiții în totalitate. Nu continuați să utilizați website-ul Alma Decor dacă nu acceptați toți termenii și condițiile menționate pe această pagină.</p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Drepturi de Proprietate Intelectuală</h3>
            <p>Cu excepția cazului în care se specifică altfel, Alma Decor și/sau licențiatorii săi dețin drepturile de proprietate intelectuală pentru tot materialul de pe almadecor.ro. Toate drepturile de proprietate intelectuală sunt rezervate. Puteți vizualiza și/sau imprima pagini de pe almadecor.ro pentru uzul dumneavoastră personal, sub rezerva restricțiilor stabilite în acești termeni și condiții.</p>
            <p>Nu aveți dreptul să:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Republicați material de pe almadecor.ro</li>
              <li>Vindeți, închiriați sau sub-licențiați material de pe almadecor.ro</li>
              <li>Reproduceți, duplicați sau copiați material de pe almadecor.ro</li>
              <li>Redistribuiți conținut de la Alma Decor (cu excepția cazului în care conținutul este creat special pentru redistribuire).</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Limitarea Răspunderii</h3>
            <p>Informațiile de pe acest website sunt furnizate "ca atare", fără nicio garanție. Deși ne străduim să asigurăm că informațiile de pe acest website sunt corecte, nu garantăm completitudinea sau acuratețea acestora; nici nu ne angajăm să asigurăm că website-ul rămâne disponibil sau că materialul de pe website este menținut la zi.</p>
            <p>În măsura maximă permisă de legea aplicabilă, excludem toate reprezentările, garanțiile și condițiile referitoare la website-ul nostru și la utilizarea acestui website. Nimic din această clauză de exonerare de răspundere nu va:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Limita sau exclude răspunderea noastră sau a dumneavoastră pentru fraudă sau denaturare frauduloasă.</li>
              <li>Limita oricare dintre răspunderile noastre sau ale dumneavoavoastră în orice mod care nu este permis de legea aplicabilă.</li>
              <li>Exclude oricare dintre răspunderile noastre sau ale dumneavoastră care nu pot fi excluse în conformitate cu legea aplicabilă.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Legislația Aplicabilă</h3>
            <p>Acești termeni și condiții vor fi guvernați și interpretați în conformitate cu legile din România, iar orice dispute legate de acești termeni și condiții vor fi supuse jurisdicției exclusive a instanțelor din România.</p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Contact</h3>
            <p>Pentru orice întrebări legate de acești Termeni și Condiții, ne puteți contacta la adresa de e-mail: <a href="mailto:Info@almadecor.ro" className="text-brand-yellow hover:underline font-bold tracking-tight">Info@almadecor.ro</a>.</p>
          </section>
        </div>

        <div className="mt-20 pt-10 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row gap-8 items-center justify-between">
          <Link href="/" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-brand-yellow transition-colors">
            ← ÎNAPOI PE SITE
          </Link>
          <div className="flex gap-8">
            <Link href="/politica-de-confidentialitate" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-brand-yellow transition-colors">
              CONFIDENȚIALITATE
            </Link>
            <Link href="/politica-de-cookies" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-brand-yellow transition-colors">
              COOKIES
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
