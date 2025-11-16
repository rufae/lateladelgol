import './globals.css';
import { Inter, Poppins } from 'next/font/google';
import Providers from '../components/Providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins'
});

export const metadata = {
  title: 'LaTelaDelGol ⚽ - Premium Sports Fashion',
  description: 'Catálogo deportivo premium con estilo, calidad y pasión en cada prenda',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
