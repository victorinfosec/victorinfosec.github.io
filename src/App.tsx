import React, { useState, useEffect } from 'react';
import { Mail, Menu, X } from 'lucide-react';

// Sample images - replace with your actual image URLs
const images = [
  { src: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800', caption: 'Danseuses' },
  { src: 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&q=80&w=800', caption: 'Danseuses de dos' },
  { src: 'https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?auto=format&fit=crop&q=80&w=800', caption: 'Holy Mary' },
  { src: 'https://images.unsplash.com/photo-1482160549825-59d1b23cb208?auto=format&fit=crop&q=80&w=800', caption: 'Neige 1' },
  { src: 'https://images.unsplash.com/photo-1482160549825-59d1b23cb208?auto=format&fit=crop&q=80&w=800', caption: 'Neige 2' },
  { src: 'https://images.unsplash.com/photo-1482160549825-59d1b23cb208?auto=format&fit=crop&q=80&w=800', caption: 'Neige 3' }
];

interface ModalProps {
  image: { src: string; caption: string } | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const Modal: React.FC<ModalProps> = ({ image, onClose, onNext, onPrev }) => {
  if (!image) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
         onClick={onClose}>
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }}
              className="absolute left-4 text-white text-4xl hover:text-gray-300">
        ‹
      </button>
      <div className="max-w-4xl max-h-[90vh] p-4">
        <img src={image.src} 
             alt={image.caption}
             className="max-h-[80vh] w-auto mx-auto"
             onClick={(e) => e.stopPropagation()} />
        <p className="text-white text-center mt-4 text-2xl font-serif">{image.caption}</p>
      </div>
      <button onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="absolute right-4 text-white text-4xl hover:text-gray-300">
        ›
      </button>
    </div>
  );
};

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<{ src: string; caption: string } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (image: typeof images[0], index: number) => {
    setCurrentImage(image);
    setCurrentIndex(index);
  };

  const closeModal = () => setCurrentImage(null);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setCurrentImage(images[(currentIndex + 1) % images.length]);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setCurrentImage(images[(currentIndex - 1 + images.length) % images.length]);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed w-full bg-white/90 backdrop-blur-sm shadow-md z-40">
        <div className="container mx-auto flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold text-gray-900">Marie Zdziarek</h1>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>

          <nav className="hidden md:flex space-x-6 text-lg">
            {['À propos', 'Galerie', 'Animation', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="relative group text-gray-900"
              >
                {item}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red-500 transition-all group-hover:w-full" />
              </a>
            ))}
          </nav>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-4 py-2 space-y-2">
            {['À propos', 'Galerie', 'Animation', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="block py-2 px-4 text-center bg-rose-950 text-white rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-center bg-cover"
               style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=2000)' }}>
        <div className="absolute inset-0 bg-black/15 backdrop-blur-sm" />
        <div className="relative z-10 p-6 text-center">
          <h1 className="text-7xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white font-serif 
                        bg-gradient-to-r from-white via-stone-50 to-white bg-clip-text text-transparent 
                        drop-shadow-[0_0_25px_rgba(255,255,255,0.9)] 
                        md:drop-shadow-[0_0_30px_rgba(255,255,255,1)] 
                        tracking-wider animate-slide-up">
            Marie <br className="sm:hidden" /> Zdziarek
          </h1>
        </div>
      </section>

      <main className="container mx-auto px-4">
        {/* About Section */}
        <section id="à-propos" className="text-center py-24">
          <h2 className="text-4xl font-bold mb-6 text-gray-950">À propos</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Les techniques de dessin et de gravure, telles que le croquis au fusain et l'eau-forte,
            permettent de capturer des détails fins et des textures uniques sur le papier. Ces méthodes
            traditionnelles exigent patience et précision, offrant des œuvres d'art intemporelles qui
            révèlent la maîtrise et la sensibilité de l'artiste.
          </p>
        </section>

        {/* Gallery Section */}
        <section id="galerie" className="py-24">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-950">Galerie</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg cursor-pointer transform hover:scale-105 transition-all duration-300"
                onClick={() => openModal(image, index)}
              >
                <img
                  src={image.src}
                  alt={image.caption}
                  className="w-full h-60 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="absolute bottom-4 left-4 text-white text-lg">{image.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="text-center py-24">
          <h2 className="text-4xl font-bold mb-6 text-gray-950">Contact</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
            Si vous souhaitez en savoir plus sur mon travail ou discuter d'une collaboration,
            n'hésitez pas à me contacter. Je serais ravie de discuter de vos idées et projets.
          </p>
          <a
            href="mailto:contact@mariezdziarek.com"
            className="inline-flex items-center gap-2 px-8 py-3 bg-rose-950 text-white rounded-full
                     hover:bg-rose-900 transition-colors text-lg font-medium"
          >
            <Mail className="w-5 h-5" />
            Me Contacter
          </a>
        </section>
      </main>

      <footer className="text-center py-8 text-gray-500">
        <p>&copy; {new Date().getFullYear()} Marie Zdziarek. Tous droits réservés.</p>
      </footer>

      {/* Image Modal */}
      <Modal
        image={currentImage}
        onClose={closeModal}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </div>
  );
}

export default App;