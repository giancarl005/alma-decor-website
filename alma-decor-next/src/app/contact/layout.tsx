import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact - Showroom Alma Decor',
  description: 'Ai un proiect în minte? Contactează experții Alma Decor sau vizitează showroom-ul nostru pentru a descoperi materiale premium.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
