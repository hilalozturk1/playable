import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600 mb-12 font-light">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input 
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea 
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              rows={6}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all resize-none"
              placeholder="Your message"
            />
          </div>
          <div>
            <button 
              type="submit"
              className="w-full px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
            >
              Send Message
            </button>
          </div>
          {submitted && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center">
              Thank you! Your message has been sent.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

