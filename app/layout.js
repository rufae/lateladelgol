import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LaTelaDelGol ⚽ - Catálogo Deportivo",
  description: "Tu destino deportivo. Estilo, calidad y pasión en cada prenda. Catálogo de chaquetas, chándales, camisetas y moda deportiva.",
  keywords: "ropa deportiva, chaquetas, chándales, camisetas, moda deportiva, LaTelaDelGol",
  authors: [{ name: "LaTelaDelGol" }],
  openGraph: {
    title: "LaTelaDelGol ⚽ - Catálogo Deportivo",
    description: "Tu destino deportivo. Estilo, calidad y pasión en cada prenda.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
