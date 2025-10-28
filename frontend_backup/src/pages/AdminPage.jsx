import React, { useState, useEffect } from 'react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('whatsapp');
  const [qrCode, setQrCode] = useState(null);
  const [isWhatsAppConnected, setIsWhatsAppConnected] = useState(false);
  const [whatsAppStatus, setWhatsAppStatus] = useState('Disconnected');

  const API_BASE = 'http://localhost:3001';

  useEffect(() => {
    checkWhatsAppConnection();
    const interval = setInterval(checkWhatsAppConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkWhatsAppConnection = async () => {
    try {
      const response = await fetch(`${API_BASE}/status`);
      const data = await response.json();
      setIsWhatsAppConnected(data.isConnected);
      setWhatsAppStatus(data.isConnected ? 'Connected' : 'Disconnected');
      if (data.qr) {
        setQrCode(data.qr);
      }
    } catch {
      setIsWhatsAppConnected(false);
      setWhatsAppStatus('Server Error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8">
            <h1 className="text-4xl font-bold mb-2">🔧 SABA Admin Dashboard</h1>
            <p className="text-purple-100 text-lg">System Management & Analytics</p>
          </div>

          <div className="border-b border-gray-200 bg-gray-50">
            <nav className="flex space-x-1 px-6">
              {['whatsapp', 'students', 'system'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-6 rounded-t-xl font-medium text-sm transition-all duration-200 ${
                    activeTab === tab
                      ? 'bg-white text-blue-600 border-b-2 border-blue-500 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                  }`}
                >
                  {tab === 'whatsapp' && '📱 WhatsApp'}
                  {tab === 'students' && '�� Students'}
                  {tab === 'system' && '⚙️ System'}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'whatsapp' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                  <h3 className="text-2xl font-semibold mb-4">📱 WhatsApp Connection</h3>
                  <div className="flex items-center gap-4">
                    <span className={`w-4 h-4 rounded-full ${
                      isWhatsAppConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                    }`}></span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      isWhatsAppConnected 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {whatsAppStatus}
                    </span>
                  </div>
                </div>

                {qrCode && (
                  <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
                    <h4 className="text-lg font-semibold mb-4">Scan QR Code to Connect WhatsApp</h4>
                    <div className="bg-gray-100 p-4 rounded-lg inline-block">
                      <img src={qrCode} alt="WhatsApp QR Code" className="w-64 h-64" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'students' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold">👥 Student Management</h3>
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <p className="text-gray-600">Student data will be loaded here.</p>
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold">⚙️ System Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl border border-green-200 text-center">
                    <div className="text-3xl mb-2">📱</div>
                    <h4 className="font-semibold">WhatsApp</h4>
                    <p className={`text-lg font-bold ${isWhatsAppConnected ? 'text-green-600' : 'text-red-600'}`}>
                      {isWhatsAppConnected ? 'Connected' : 'Disconnected'}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200 text-center">
                    <div className="text-3xl mb-2">🧩</div>
                    <h4 className="font-semibold">MBTI Backend</h4>
                    <p className="text-lg font-bold text-green-600">Online</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200 text-center">
                    <div className="text-3xl mb-2">💻</div>
                    <h4 className="font-semibold">Frontend</h4>
                    <p className="text-lg font-bold text-green-600">Online</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
