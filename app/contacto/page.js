import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'Contacto - LaTelaDelGol',
  description: 'Escríbenos tu pregunta sobre camisetas y más.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Pregúntanos por una camiseta</h1>
          <p className="text-gray-600 mt-2">Dinos tu nombre, tu correo y la camiseta que buscas. Te ayudamos a conseguirla.</p>
        </div>

        <section className="bg-white rounded-2xl p-8 shadow-md border">
          <ContactForm />
        </section>
      </main>
      <Footer />
    </div>
  );
}
