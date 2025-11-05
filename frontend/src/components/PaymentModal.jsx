import React, { useState } from 'react';
import JazzCashQR from '../assets/jazzcash-qr.png';

const PaymentModal = ({ 
  serviceType, // 'report' or 'ai-session'
  personalityType,
  testResults,
  onClose,
  onSubmit 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    transactionId: '',
    serviceType: serviceType,
    personalityType: personalityType
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      await onSubmit(formData);
    } catch (err) {
      setError('Failed to submit payment details. Please try again.');
      setIsSubmitting(false);
    }
  };

  const serviceDetails = {
    report: {
      title: 'Get Your Detailed Personality Report',
      icon: '📄',
      description: 'Comprehensive analysis emailed to you within 24-48 hours',
      features: [
        'Complete personality breakdown',
        'Strengths and growth areas',
        'Career recommendations',
        'Relationship insights',
        'Personalized advice'
      ]
    },
    'ai-session': {
      title: 'Consult AI Psychologist',
      icon: '🤖',
      description: 'Ask 4 questions to our AI psychologist powered by Gemini',
      features: [
        'Personalized guidance',
        'Based on your personality type',
        '4 questions per session',
        'Instant AI responses',
        'Professional psychological insights'
      ]
    }
  };

  const service = serviceDetails[serviceType];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              {service.icon} {service.title}
            </h2>
            <p className="text-gray-600 mt-1">{service.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Your Results */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Your Personality Type</p>
            <p className="text-2xl font-bold text-blue-600">{personalityType}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column: Features & Payment Info */}
            <div>
              <h3 className="font-semibold text-lg mb-3">What You'll Get:</h3>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-4xl font-bold text-green-600">PKR 50</p>
                <p className="text-xs text-gray-500 mt-1">One-time payment via JazzCash</p>
              </div>
            </div>

            {/* Right Column: QR Code & Form */}
            <div>
              {/* Step 1: Payment */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <h3 className="font-semibold text-lg">Scan & Pay PKR 50</h3>
                </div>
                
                <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 text-center">
                  <img 
                    src={JazzCashQR} 
                    alt="JazzCash QR Code" 
                    className="mx-auto w-64 h-64 object-contain"
                  />
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <img 
                      src="https://www.jazzcash.com.pk/assets/themes/jazzcash/img/logo.png" 
                      alt="JazzCash" 
                      className="h-6"
                    />
                    <span className="text-sm text-gray-600">Scan with JazzCash app</span>
                  </div>
                </div>
              </div>

              {/* Step 2: Submit Details */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <h3 className="font-semibold text-lg">Submit Payment Details</h3>
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your Full Name *"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  <input
                    type="tel"
                    placeholder="Mobile Number (03XX-XXXXXXX) *"
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    required
                    pattern="[0-9]{11}"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  <input
                    type="text"
                    placeholder="JazzCash Transaction ID *"
                    value={formData.transactionId}
                    onChange={(e) => setFormData({...formData, transactionId: e.target.value})}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Payment'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>⏱️ Verification Time:</strong> Your payment will be verified within 24 hours. 
              You'll receive a confirmation email once approved.
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Make sure to enter the correct transaction ID from your JazzCash payment receipt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
