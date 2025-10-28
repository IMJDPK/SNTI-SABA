import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const WhatsAppIntegration = () => {
  const [qrCode, setQrCode] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  const connectWhatsApp = async () => {
    setIsLoading(true);
    console.log('Attempting to connect WhatsApp...');
    try {
      const response = await fetch('http://localhost:3001/qr');
      console.log('QR fetch response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('QR response data:', data ? 'data received' : 'no data');
        console.log('QR field present:', !!data.qr);
        if (data.qr) {
          console.log('Setting QR code with length:', data.qr.length);
          setQrCode(data.qr);
        } else {
          console.log('No QR code in response');
        }
      } else {
        console.error('QR fetch failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching QR code:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    // Socket event listeners
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setConnectionStatus('connected');
      // Automatically try to get QR code when connected
      if (!isConnected && !qrCode) {
        setTimeout(() => connectWhatsApp(), 1000);
      }
    });

    newSocket.on('qr', (qrData) => {
      console.log('QR Code received:', qrData ? 'QR data available' : 'No QR data');
      console.log('QR data length:', qrData ? qrData.length : 0);
      setQrCode(qrData);
      setIsConnected(false);
      setIsLoading(false);
    });

    newSocket.on('ready', () => {
      console.log('WhatsApp connected');
      setIsConnected(true);
      setQrCode(null);
      setIsLoading(false);
      setConnectionStatus('whatsapp-connected');
    });

    newSocket.on('message', (message) => {
      console.log('WhatsApp message received:', message);
      setMessages(prev => [...prev, {
        id: Date.now(),
        from: message.from,
        body: message.body,
        timestamp: new Date().toISOString(),
        type: 'received'
      }]);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnectionStatus('disconnected');
    });

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const disconnectWhatsApp = async () => {
    try {
      const response = await fetch('http://localhost:3001/disconnect-whatsapp', {
        method: 'POST'
      });
      if (response.ok) {
        setIsConnected(false);
        setQrCode(null);
        setMessages([]);
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      console.error('Error disconnecting WhatsApp:', error);
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-blue-600';
      case 'whatsapp-connected': return 'text-green-600';
      case 'disconnected': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Server Connected';
      case 'whatsapp-connected': return 'WhatsApp Connected';
      case 'disconnected': return 'Disconnected';
      default: return 'Unknown';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">WhatsApp Integration</h1>
        <p className="text-gray-600">
          Connect your WhatsApp to automatically handle MBTI assessments and psychology consultations
        </p>
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Connection Status</h3>
            <p className={`text-sm ${getStatusColor()}`}>
              <span className="inline-block w-2 h-2 rounded-full bg-current mr-2"></span>
              {getStatusText()}
            </p>
          </div>
          <div className="flex gap-2">
            {!isConnected && !qrCode && (
              <button
                onClick={connectWhatsApp}
                disabled={isLoading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Connecting...' : 'Connect WhatsApp'}
              </button>
            )}
            {isConnected && (
              <button
                onClick={disconnectWhatsApp}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Disconnect
              </button>
            )}
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      {qrCode && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan QR Code</h3>
          <div className="text-center">
            <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
              <img 
                src={`data:image/png;base64,${qrCode}`} 
                alt="WhatsApp QR Code"
                className="mx-auto"
              />
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Open WhatsApp on your phone → Settings → Linked Devices → Link a Device → Scan this QR code
            </p>
          </div>
        </div>
      )}

      {/* Connected Status */}
      {isConnected && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-green-800">WhatsApp Connected Successfully!</h3>
              <p className="text-green-700">
                Your WhatsApp is now connected. All incoming messages will be automatically handled by SABA AI for MBTI assessments and psychology consultations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Messages */}
      {messages.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Messages</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {messages.slice(-10).map((message) => (
              <div key={message.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {message.from.replace('@s.whatsapp.net', '').replace(/\D/g, '')}
                    </p>
                    <p className="text-gray-700">{message.body}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Automated Features</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-blue-800">MBTI Assessment</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Automatic greeting and assessment initiation</li>
              <li>• Progressive questioning with 20 MBTI questions</li>
              <li>• Personality type calculation and detailed report</li>
              <li>• Personalized learning recommendations</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-blue-800">AI Psychology Support</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 24/7 empathetic response system</li>
              <li>• Academic and career guidance</li>
              <li>• Stress management and emotional support</li>
              <li>• Goal setting and progress tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppIntegration;
