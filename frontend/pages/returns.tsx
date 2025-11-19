export default function ReturnsPage() {
  return (
    <div className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-8">Returns & Exchanges</h1>
        
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-light text-gray-900 mb-4">Return Policy</h2>
            <p className="text-lg text-gray-600 font-light leading-relaxed mb-4">
              We want you to be completely satisfied with your purchase. You may return or exchange items within 30 days of delivery.
            </p>
            <ul className="list-disc list-inside space-y-2 text-lg text-gray-600 font-light ml-4">
              <li>Items must be in original condition with tags attached</li>
              <li>Items must be unworn, unused, and in original packaging</li>
              <li>Proof of purchase is required</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-light text-gray-900 mb-4">How to Return</h2>
            <div className="space-y-4 text-lg text-gray-600 font-light">
              <p>1. Contact us at support@playable.com or through your account</p>
              <p>2. We'll provide you with a return authorization and shipping label</p>
              <p>3. Package your item securely and ship it back to us</p>
              <p>4. Once received, we'll process your refund or exchange</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-light text-gray-900 mb-4">Refunds</h2>
            <p className="text-lg text-gray-600 font-light">
              Refunds will be processed to your original payment method within 5-10 business days after we receive your return. Shipping costs are non-refundable unless the item is defective or incorrect.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

