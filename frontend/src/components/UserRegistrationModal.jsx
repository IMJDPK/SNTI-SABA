import React, { useState } from 'react';

const UserRegistrationModal = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    rollNumber: '',
    institution: '', // School or University name
    email: '',
    language: 'english' // Default language: english or urdu
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    // Phone validation (Pakistani format)
    const phoneRegex = /^03\d{9}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/[-\s]/g, ''))) {
      newErrors.phone = 'Enter valid Pakistani mobile (03XXXXXXXXX)';
    }

    // Age validation
    const ageNum = parseInt(formData.age, 10);
    if (!String(formData.age).trim()) {
      newErrors.age = 'Age is required';
    } else if (Number.isNaN(ageNum) || ageNum < 10 || ageNum > 100) {
      newErrors.age = 'Enter a valid age (10-100)';
    }

    // Roll number validation
    if (!formData.rollNumber.trim()) {
      newErrors.rollNumber = 'Roll number is required';
    }

    // Institution validation
    if (!formData.institution.trim()) {
      newErrors.institution = 'School/University name is required';
    } else if (formData.institution.trim().length < 3) {
      newErrors.institution = 'Institution name must be at least 3 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    // Language validation
    if (!formData.language || !['english', 'urdu'].includes(formData.language)) {
      newErrors.language = 'Please select a language';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Clean phone number
      const cleanedData = {
        ...formData,
        name: formData.name.trim(),
        phone: formData.phone.replace(/[-\s]/g, ''),
        age: parseInt(formData.age, 10),
        rollNumber: formData.rollNumber.trim(),
        institution: formData.institution.trim(),
        email: formData.email.trim().toLowerCase(),
        language: formData.language
      };

      await onSubmit(cleanedData);
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: 'Failed to register. Please try again.' });
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <span className="text-4xl">📋</span>
                Student Registration
              </h2>
              <p className="text-purple-100 text-sm">
                Please provide your information before starting the SNTI assessment
              </p>
            </div>
            {/* Close (X) Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close registration"
              className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-full w-10 h-10 flex items-center justify-center shadow-sm"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errors.submit && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700 text-sm flex items-center gap-2">
                <span>⚠️</span>
                {errors.submit}
              </p>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span>⚠</span> {errors.name}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="03XX-XXXXXXX"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span>⚠</span> {errors.phone}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span>⚠</span> {errors.email}
              </p>
            )}
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Age <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={10}
              max={100}
              placeholder="Enter your age"
              value={formData.age}
              onChange={(e) => handleChange('age', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                errors.age ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.age && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span>⚠</span> {errors.age}
              </p>
            )}
          </div>

          {/* Language Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Preferred Language / زبان <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleChange('language', 'english')}
                className={`py-3 px-4 rounded-lg font-semibold border-2 transition ${
                  formData.language === 'english'
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                }`}
                disabled={isSubmitting}
              >
                🇬🇧 English
              </button>
              <button
                type="button"
                onClick={() => handleChange('language', 'urdu')}
                className={`py-3 px-4 rounded-lg font-semibold border-2 transition ${
                  formData.language === 'urdu'
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                }`}
                disabled={isSubmitting}
              >
                🇵🇰 اردو
              </button>
            </div>
            {errors.language && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span>⚠</span> {errors.language}
              </p>
            )}
          </div>

          {/* Roll Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Roll Number / Student ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your roll number or student ID"
              value={formData.rollNumber}
              onChange={(e) => handleChange('rollNumber', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                errors.rollNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.rollNumber && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span>⚠</span> {errors.rollNumber}
              </p>
            )}
          </div>

          {/* School/University Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              School / University Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your school or university name"
              value={formData.institution}
              onChange={(e) => handleChange('institution', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                errors.institution ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.institution && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span>⚠</span> {errors.institution}
              </p>
            )}
          </div>

          {/* Privacy Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong className="text-blue-700">🔒 Privacy Notice:</strong> Your information will be used solely for the SNTI assessment and kept confidential. We respect your privacy and will never share your data without consent.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </>
              ) : (
                <>
                  🚀 Start SNTI Assessment
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            By proceeding, you agree to participate in the SNTI personality assessment
          </p>
        </form>
      </div>
    </div>
  );
};

export default UserRegistrationModal;
