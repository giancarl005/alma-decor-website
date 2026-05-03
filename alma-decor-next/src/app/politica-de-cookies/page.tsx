import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Politică de Cookies - Alma Decor',
  description: 'Informații despre utilizarea modulelor cookie pe website-ul Alma Decor.',
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0F1115] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <header className="mb-16">
          <h2 className="text-[11px] font-bold text-brand-yellow uppercase tracking-[0.4em] mb-4">Legal</h2>
          <h1 className="text-5xl md:text-6xl font-bold italic serif text-gray-900 dark:text-white tracking-tighter leading-none">
            Politică <br /> Cookies
          </h1>
          <div className="h-1 w-20 bg-brand-yellow mt-8" />
        </header>

        <div className="prose dark:prose-invert max-w-none space-y-8 text-gray-600 dark:text-gray-400 leading-relaxed text-lg font-light">
          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ce sunt Cookie-urile?</h3>
            <p>Website-ul almadecor.ro utilizează cookie-uri pentru a îmbunătăți experiența utilizatorului. Un "cookie" este un fișier text de mici dimensiuni salvat pe dispozitivul dumneavoastră care reține preferințele de navigare.</p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Cum Utilizăm Cookie-urile?</h3>
            <p>Utilizăm cookie-uri pentru funcționarea tehnică a site-ului, analiza traficului și personalizarea conținutului. Majoritatea cookie-urilor sunt necesare pentru a vă oferi o experiență fluidă pe site-ul nostru.</p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tipuri de Cookie-uri Folosite</h3>
            <ul className="list-disc list-inside space-y-4 pl-4">
              <li><strong>Cookie-uri Esențiale:</strong> Strict necesare pentru funcționarea site-ului (ex: reținerea temei vizuale).</li>
              <li><strong>Cookie-uri de Performanță:</strong> Ne ajută să înțelegem cum navighează vizitatorii pe site (ex: Google Analytics).</li>
              <li><strong>Cookie-uri de Funcționalitate:</strong> Rețin preferințele dumneavoastră pentru vizite ulterioare.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Controlul Cookie-urilor</h3>
            <p>Puteți controla sau șterge cookie-urile direct din setările browserului dumneavoastră. Dezactivarea anumitor cookie-uri poate afecta funcționalitatea anumitor părți ale site-ului.</p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact</h3>
            <p>Pentru orice întrebări despre utilizarea cookie-urilor, ne puteți scrie la <a href="mailto:Info@almadecor.ro" className="text-brand-yellow hover:underline font-bold tracking-tight">Info@almadecor.ro</a>.</p>
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
            <Link href="/politica-de-confidentialitate" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-brand-yellow transition-colors">
              CONFIDENȚIALITATE
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
