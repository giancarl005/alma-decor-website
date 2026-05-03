import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Despre Noi - Povestea Alma Decor',
  description: 'Află povestea Alma Decor, experiența de peste 20 de ani în design interior și angajamentul nostru pentru excelență și calitate premium.',
};

const portfolioItems = [
  {
    category: 'Apartament Modern',
    title: 'Living Spațios și Luminos',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress,format&cs=tinysrgb&w=800&h=600&dpr=1',
  },
  {
    category: 'Stil Scandinav',
    title: 'Bucătărie Minimalistă',
    image: 'https://images.pexels.com/photos/3926542/pexels-photo-3926542.jpeg?auto=compress,format&cs=tinysrgb&w=800&h=600&dpr=1',
  },
  {
    category: 'Design Industrial',
    title: 'Birou Acasă Funcțional',
    image: 'https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress,format&cs=tinysrgb&w=800&h=600&dpr=1',
  },
  {
    category: 'Amenajare Terasă',
    title: 'Oază de Relaxare Exterioară',
    image: 'https://images.pexels.com/photos/220769/pexels-photo-220769.jpeg?auto=compress,format&cs=tinysrgb&w=800&h=600&dpr=1',
  },
  {
    category: 'Clasic Contemporan',
    title: 'Dormitor Elegant',
    image: 'https://images.pexels.com/photos/376531/pexels-photo-376531.jpeg?auto=compress,format&cs=tinysrgb&w=800&h=600&dpr=1',
  },
  {
    category: 'Spațiu Comercial',
    title: 'Cafenea Primitoare',
    image: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress,format&cs=tinysrgb&w=800&h=600&dpr=1',
  },
];

const benefits = [
  {
    title: 'Prețuri Preferențiale',
    description: 'Beneficiază de discounturi speciale, create pentru a-ți oferi un avantaj competitiv pe piață.'
  },
  {
    title: 'Comisioane Atractive',
    description: 'Recompensăm colaborările de succes. Oferim un sistem de comisionare motivant pentru fiecare proiect.'
  },
  {
    title: 'Acces la Portofoliu Premium',
    description: 'Impresionează-ți clienții cu selecția noastră vastă de produse de la branduri de top.'
  },
  {
    title: 'Suport Tehnic Dedicat',
    description: 'Echipa noastră îți stă la dispoziție cu mostre, consultanță tehnică și soluții rapide pentru proiectul tău.'
  }
];

export default function DespreNoiPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0F1115]">
      {/* Hero Section */}
      <section className="pt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative h-[70vh] flex items-center overflow-hidden rounded-[2rem]">
            <div className="absolute inset-0 z-0">
              <Image 
                src="/about_us_hero_1777581284752.png" 
                alt="Alma Decor Luxury Interior"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/60" />
            </div>
            
            <div className="relative z-10 px-12 md:px-24">
              <div className="max-w-3xl space-y-6">
                <h1 className="text-6xl md:text-8xl font-bold italic serif text-white tracking-tighter leading-none animate-slide-up">
                  Povestea Noastră <span className="text-brand-yellow not-italic">.</span>
                </h1>
                <p className="text-xl text-gray-200 max-w-xl font-medium animate-slide-up delay-100">
                  Pasiune pentru design interior, excelență în execuție și materiale premium de peste două decenii.
                </p>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
              <div className="w-px h-12 bg-white" />
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-[11px] font-bold text-brand-yellow uppercase tracking-[0.4em]">Experiență și Tradiție</h2>
                <h3 className="text-4xl md:text-5xl font-bold italic serif text-gray-900 dark:text-white tracking-tighter">
                  Pasiune pentru Design de Peste 20 de Ani
                </h3>
              </div>
              
              <div className="space-y-6 text-gray-500 dark:text-gray-400 text-lg leading-relaxed font-medium">
                <p>
                  De peste două decenii, Alma Decor transformă casele în cămine și spațiile comerciale în experiențe memorabile. Fondată din pasiune pentru estetică și calitate, compania noastră a crescut constant, devenind un nume de referință în designul interior și exterior din România.
                </p>
                <p>
                  Misiunea noastră este simplă: să aducem frumusețea, funcționalitatea și durabilitatea în fiecare proiect, cu o atenție desăvârșită la detalii.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-gray-100 dark:border-white/5">
                <div className="space-y-2">
                  <span className="text-3xl font-bold italic serif text-brand-yellow tracking-tighter">20+</span>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ani de Excelență</p>
                </div>
                <div className="space-y-2">
                  <span className="text-3xl font-bold italic serif text-brand-yellow tracking-tighter">1000+</span>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Proiecte Realizate</p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                <Image 
                  src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1920&auto=format,compress&fit=crop"
                  alt="Alma Decor Team and Projects"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-brand-yellow text-gray-900 p-8 rounded-2xl shadow-xl hidden lg:block">
                <p className="text-4xl font-bold italic serif tracking-tighter leading-none mb-2">Standard</p>
                <p className="text-[10px] font-bold uppercase tracking-widest">Premium de Calitate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-32 bg-gray-50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-[11px] font-bold text-brand-yellow uppercase tracking-[0.4em]">Inspirație</h2>
            <h3 className="text-4xl md:text-5xl font-bold italic serif text-gray-900 dark:text-white tracking-tighter">
              Portofoliu de Proiecte
            </h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Descoperă o selecție a lucrărilor noastre de referință. Fiecare proiect reflectă pasiunea noastră pentru design și atenția la detalii.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioItems.map((item, index) => (
              <div key={index} className="group relative h-[400px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                <Image 
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-[10px] font-bold text-brand-yellow uppercase tracking-widest mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{item.category}</p>
                  <h4 className="text-xl font-bold text-white tracking-tight">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaborate Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-[#0A0C10] rounded-[2rem] overflow-hidden shadow-2xl relative border border-white/5">
            <div className="absolute inset-0 opacity-10">
              <Image 
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1920&auto=format,compress&fit=crop"
                alt="Partnership Background"
                fill
                className="object-cover grayscale"
              />
            </div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 p-12 lg:p-24 items-center">
              <div className="space-y-8 text-white">
                <div className="space-y-4">
                  <h2 className="text-[11px] font-bold text-brand-yellow uppercase tracking-[0.4em]">Parteneriate</h2>
                  <h3 className="text-4xl md:text-5xl font-bold italic serif tracking-tighter">
                    Ești Arhitect sau Designer?
                  </h3>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed font-medium max-w-xl">
                  Alma Decor este partenerul tău de încredere. Înțelegem exigențele profesioniștilor și am creat un program special pentru a-ți susține viziunea și a-ți maximiza succesul.
                </p>
                <div className="pt-4">
                  <Link href="/contact" className="inline-block bg-brand-yellow text-gray-900 font-black py-5 px-10 rounded-xl hover:bg-white hover:scale-105 transition-all duration-300 text-sm tracking-widest">
                    DEVINO PARTENER
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="bg-white/[0.03] backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:bg-white/[0.06] transition-all group">
                    <h4 className="text-brand-yellow font-bold text-sm uppercase tracking-widest mb-3 group-hover:scale-105 transition-transform origin-left">{benefit.title}</h4>
                    <p className="text-gray-300 text-xs leading-relaxed font-medium">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showroom CTA Section */}
      <section className="py-32 bg-brand-yellow text-gray-900">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          <h2 className="text-5xl md:text-7xl font-bold italic serif tracking-tighter max-w-4xl mx-auto leading-none">
            Vizitează-ne showroom-ul pentru o experiență senzorială completă.
          </h2>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
            <Link href="/contact" className="bg-gray-900 text-white font-black py-5 px-12 rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-300 text-sm tracking-widest">
              PROGRAMEAZĂ O VIZITĂ
            </Link>
            <p className="text-sm font-bold uppercase tracking-widest flex items-center gap-3">
              <span className="w-8 h-px bg-gray-900" />
              Strada 1 Decembrie 1918 13, Ilfov
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
