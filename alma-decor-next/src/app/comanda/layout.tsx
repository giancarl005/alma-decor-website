import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Finalizare Comandă | Alma Decor',
  description: 'Finalizează comanda ta pe Alma Decor în doar câțiva pași simpli. Siguranță garantată și proces de plată rapid.',
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
