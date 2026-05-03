import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contul Meu | Alma Decor',
  description: 'Gestionează comenzile și profilul tău în contul Alma Decor.',
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
