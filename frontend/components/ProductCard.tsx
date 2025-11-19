import Link from 'next/link';
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function ProductCard({ product, small }: any) {
  const { colors } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState(0);
  const isSmall = !!small;

  const openImage = (e: React.MouseEvent) => {
    // prevent the Link navigation and open modal instead
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
  };

  return (
    <>
      <Link href={`/products/${product._id}`} className={`block group bg-white rounded-2xl p-4 border-4 border-${colors.border} shadow-lg hover:shadow-2xl transition-all hover:border-${colors.primary}`}>
        <div className={`${isSmall ? 'h-64' : 'h-80'} bg-gradient-to-br from-${colors.bgLight} to-${colors.bg} rounded-xl mb-4 flex items-center justify-center overflow-hidden relative border-2 border-${colors.border}`}>
          {product?.images && product.images.length > 0 ? (
            // display first image (supports data URLs or remote URLs)
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              onClick={openImage} 
              src={product.images[0]} 
              alt={product.name} 
              className="w-full h-full object-cover cursor-pointer group-hover:scale-110 transition-transform duration-500" 
            />
          ) : (
            <div className={`text-${colors.primary} font-semibold`}>Görsel Yok</div>
          )}
          <div className={`absolute inset-0 bg-${colors.primary} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
        </div>
        <div className="px-2">
          <h3 className={`font-bold text-${colors.text} mb-2 text-lg group-hover:text-${colors.primaryDark}`}>{product.name}</h3>
          <p className={`text-2xl font-bold text-${colors.primary}`}>${product.price}</p>
        </div>
        {product?.images && product.images.length > 1 && (
          <div className="flex gap-2 mt-3 px-2">
            {product.images.map((src: string, i: number) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                key={i} 
                src={src} 
                alt={`thumb-${i}`} 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrent(i); setShowModal(true); }} 
                className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 border-${colors.border} hover:border-${colors.primary} transition-all shadow-md`} 
              />
            ))}
          </div>
        )}
      </Link>

  {showModal && product?.images && product.images.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center" onClick={() => setShowModal(false)}>
          <div className="max-w-3xl max-h-[80vh] overflow-hidden relative" onClick={e => e.stopPropagation()}>
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.images[current]} alt={product.name} className="w-full h-auto rounded" />
              {product.images.length > 1 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); setCurrent((current - 1 + product.images.length) % product.images.length); }} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white w-12 h-12 flex items-center justify-center text-2xl rounded-full shadow-lg">‹</button>
                  <button onClick={(e) => { e.stopPropagation(); setCurrent((current + 1) % product.images.length); }} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white w-12 h-12 flex items-center justify-center text-2xl rounded-full shadow-lg">›</button>
                </>
              )}
            </div>
            <div className="flex gap-2 mt-2 justify-center">
              {product.images.map((src: string, i: number) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt={`thumb-${i}`} onClick={() => setCurrent(i)} className={`${isSmall ? 'w-10 h-10' : 'w-16 h-16'} object-cover rounded cursor-pointer ${i === current ? `ring-2 ring-${colors.primary}` : ''}`} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
