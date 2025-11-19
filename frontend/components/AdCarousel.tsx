import React, { useEffect, useState } from 'react';

type AdCarouselProps = {
  images?: { src: string; href?: string; alt?: string }[];
  interval?: number; // ms
};

export default function AdCarousel({ images, interval = 3000 }: AdCarouselProps) {
  const defaultImages = images || [
    { src: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=600&fit=crop', href: '#', alt: 'Pijama Takımı 1' },
    { src: 'https://images.unsplash.com/photo-1583496669737-4b305f773b0a?w=400&h=600&fit=crop', href: '#', alt: 'Pijama Takımı 2' },
    { src: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=600&fit=crop', href: '#', alt: 'Pijama Takımı 3' },
  ];

  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % defaultImages.length), interval);
    return () => clearInterval(id);
  }, [defaultImages.length, interval]);

  return (
    <aside className="hidden md:block fixed left-6 top-24 w-56 z-40">
      <div className="rounded-xl overflow-hidden shadow-2xl bg-black border border-black text-white">
        <a href={defaultImages[index].href || '#'} target="_blank" rel="noreferrer">
          <img src={defaultImages[index].src} alt={defaultImages[index].alt} className="w-full h-72 object-cover" />
        </a>
        <div className="p-3 text-center text-sm font-bold bg-black text-white border-t border-white/10">Pijama Koleksiyonu</div>
        <div className="flex items-center justify-center gap-2 p-3 bg-black">
          {defaultImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Show ad ${i + 1}`}
              className={`w-3 h-3 rounded-full ${i === index ? 'bg-white' : 'bg-white/30'}`}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
