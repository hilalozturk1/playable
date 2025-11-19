import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="py-12 px-6 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-8xl md:text-9xl font-light text-gray-900 mb-6">404</h1>
        <h2 className="text-3xl md:text-4xl font-light text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8 font-light max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/" 
            className="inline-block px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
          >
            Go Home
          </Link>
          <Link 
            href="/products" 
            className="inline-block px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-full font-medium hover:bg-gray-900 hover:text-white transition-all"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}

