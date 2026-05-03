import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Politică de Confidențialitate - Alma Decor',
  description: 'Modul în care colectăm, utilizăm și protejăm datele dumneavoastră personale.',
};

export default function PrivacyPage() {
  const lastUpdate = new Date().toLocaleDateString('ro-RO');

  return (
    <main className="min-h-screen bg-white dark:bg-[#0F1115] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <header className="mb-16">
          <h2 className="text-[11px] font-bold text-brand-yellow uppercase tracking-[0.4em] mb-4">Legal</h2>
          <h1 className="text-5xl md:text-6xl font-bold italic serif text-gray-900 dark:text-white tracking-tighter leading-none">
            Politică de <br /> Confidențialitate
          </h1>
          <p className="mt-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ultima actualizare: {lastUpdate}</p>
          <div className="h-1 w-20 bg-brand-yellow mt-4" />
        </header>

        <div className="prose dark:prose-invert max-w-none space-y-8 text-gray-600 dark:text-gray-400 leading-relaxed text-lg font-light">
          <p>La Alma Decor, ne angajăm să protejăm confidențialitatea și securitatea datelor dumneavoastră personale. Această Politică de Confidențialitate descrie modul în care colectăm, utilizăm, prelucrăm și protejăm informațiile dumneavoastră în conformitate cu Regulamentul (UE) 2016/679 (GDPR).</p>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Operatorul de Date</h3>
            <p>Operatorul datelor dumneavoastră cu caracter personal este Alma Decor, cu sediul în Strada 1 Decembrie 1918 13, Roșu, Ilfov. Ne puteți contacta la adresa de e-mail: <a href="mailto:Info@almadecor.ro" className="text-brand-yellow hover:underline font-bold tracking-tight">Info@almadecor.ro</a>.</p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Tipurile de Date Colectate</h3>
            <p>Colectăm date cu caracter personal atunci când utilizați formularul nostru de contact. Datele pe care le putem colecta includ:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Nume și prenume</li>
              <li>Adresă de e-mail</li>
              <li>Număr de telefon</li>
              <li>Preferințe (informații despre produsele de interes)</li>
              <li>Mesajul dumneavoastră și orice alte informații pe care alegeți să ni le furnizați.</li>
            </ul>
            <p className="mt-4">De asemenea, putem colecta automat date tehnice (ex: adresa IP, tipul browser-ului) prin intermediul cookie-urilor.</p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Scopul și Temeiul Juridic</h3>
            <p>Prelucrăm datele dumneavoastră personale în următoarele scopuri:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>Pentru a răspunde solicitărilor:</strong> Utilizăm datele furnizate prin formularul de contact pentru a vă oferi informațiile solicitate.</li>
              <li><strong>Pentru îmbunătățirea serviciilor:</strong> Analizăm datele anonimizat pentru a înțelege nevoile clienților și a ne îmbunătăți website-ul.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Perioada de Stocare</h3>
            <p>Vom stoca datele dumneavoastră cu caracter personal doar pe perioada necesară îndeplinirii scopurilor pentru care au fost colectate, sau conform cerințelor legale.</p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Drepturile Dumneavoastră</h3>
            <p>Conform GDPR, aveți dreptul la informare, acces, rectificare, ștergere ("dreptul de a fi uitat"), restricționarea prelucrării și portabilitatea datelor.</p>
            <p className="mt-4">Pentru a vă exercita aceste drepturi, vă rugăm să ne contactați la <a href="mailto:Info@almadecor.ro" className="text-brand-yellow hover:underline font-bold tracking-tight">Info@almadecor.ro</a>.</p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Securitatea Datelor</h3>
            <p>Am implementat măsuri tehnice și organizatorice adecvate pentru a proteja datele dumneavoastră împotriva oricărui acces neautorizat sau divulgări.</p>
          </section>
        </div>

        <div className="mt-20 pt-10 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row gap-8 items-center justify-between">
          <Link href="/" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-brand-yellow transition-colors">
            ← ÎNAPOI PE SITE
          </Link>
          <div className="flex gap-8">
            <Link href="/termeni-si-conditii" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-brand-yellow transition-colors">
              TERMENI ȘI CONDIȚII
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
