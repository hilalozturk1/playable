export default function ShippingPage() {
  return (
    <div className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-8">Shipping Information</h1>
        
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-light text-gray-900 mb-4">Shipping Options</h2>
            <div className="space-y-4 text-lg text-gray-600 font-light">
              <p><strong className="text-gray-900">Standard Shipping:</strong> 5-7 business days - Free on orders over $50</p>
              <p><strong className="text-gray-900">Express Shipping:</strong> 2-3 business days - $15</p>
              <p><strong className="text-gray-900">Overnight Shipping:</strong> Next business day - $25</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-light text-gray-900 mb-4">Processing Time</h2>
            <p className="text-lg text-gray-600 font-light">
              Orders are typically processed within 1-2 business days. You'll receive a confirmation email once your order ships with tracking information.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-light text-gray-900 mb-4">International Shipping</h2>
            <p className="text-lg text-gray-600 font-light">
              We currently ship to select international destinations. Shipping times and costs vary by location. Please contact us for specific rates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

