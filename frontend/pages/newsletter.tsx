import { useState } from 'react';

export default function NewsletterPage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <div className="py-12 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">Newsletter</h1>
        <p className="text-lg text-gray-600 mb-12 font-light">
          Stay updated with our latest products, exclusive offers, and special promotions.
        </p>
        
        {!subscribed ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input 
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-6 py-4 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all text-center text-lg"
                placeholder="Enter your email address"
              />
            </div>
            <div>
              <button 
                type="submit"
                className="w-full px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
              >
                Subscribe
              </button>
            </div>
          </form>
        ) : (
          <div className="p-8 bg-green-50 border border-green-200 rounded-lg">
            <h2 className="text-2xl font-light text-green-900 mb-2">Thank You!</h2>
            <p className="text-lg text-green-700 font-light">
              You've successfully subscribed to our newsletter. Check your email for a confirmation message.
            </p>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-500 font-light">
            We respect your privacy. Unsubscribe at any time by clicking the link in our emails.
          </p>
        </div>
      </div>
    </div>
  );
}

