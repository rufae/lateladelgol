import './globals.css';
import { Inter, Poppins } from 'next/font/google';
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins'
});

export const metadata = {
  title: 'LaTelaDelGol - Tienda Deportiva Premium',
  description: 'Las mejores equipaciones deportivas retro y modernas',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="scroll-smooth">
        <head />
        {/* suppressHydrationWarning added because some browser extensions mutate the DOM
          (inject attributes) between server HTML and client hydration which triggers
          React hydration mismatch warnings. It's best to test without extensions,
          but this reduces noisy errors in dev when extensions are present. */}
        <body suppressHydrationWarning={true} className={`${inter.variable} ${poppins.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}