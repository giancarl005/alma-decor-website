import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog Alma Decor - Inspirație și Sfaturi de Design',
  description: 'Fii la curent cu ultimele tendințe în design interior. Sfaturi practice, ghiduri și inspirație pentru amenajarea casei tale.',
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
