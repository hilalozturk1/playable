export default function HelpPage() {
  const faqs = [
    {
      question: "How do I place an order?",
      answer: "Browse our products, add items to your cart, and proceed to checkout. You'll need to create an account or log in to complete your purchase."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards and other secure payment methods. All transactions are processed securely."
    },
    {
      question: "How long does shipping take?",
      answer: "Shipping times vary depending on your location. Typically, orders are processed within 1-2 business days and arrive within 5-7 business days."
    },
    {
      question: "Can I return or exchange items?",
      answer: "Yes, we offer returns and exchanges within 30 days of purchase. Items must be in original condition with tags attached."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can use this to track your package's journey."
    }
  ];

  return (
    <div className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">Help Center</h1>
        <p className="text-lg text-gray-600 mb-12 font-light">Find answers to common questions</p>
        
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-6 bg-white border border-gray-100 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{faq.question}</h3>
              <p className="text-gray-600 font-light leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

