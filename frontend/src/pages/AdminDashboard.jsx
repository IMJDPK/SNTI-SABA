import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('PAYMENTS'); // PAYMENTS | SESSIONS
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState('PENDING');
  const [sessions, setSessions] = useState([]);
  const [sessionScope, setSessionScope] = useState('ALL'); // ALL | ACTIVE | COMPLETED
  const [sessionPayment, setSessionPayment] = useState('ALL'); // ALL | VERIFIED | PENDING | REJECTED | NONE
  const [sessionPersonality, setSessionPersonality] = useState('ALL'); // ALL | INTJ | INTP | ENTJ | ... (16 types)
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState(null);
  const [adminEmail, setAdminEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    const email = localStorage.getItem('adminEmail');
    
    if (!token || !email) {
      navigate('/admin');
      return;
    }
    
    setAdminEmail(email);
    fetchUserStats();
    if (activeTab === 'PAYMENTS') {
      fetchPayments();
    } else {
      fetchSessions();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, activeTab, sessionScope, sessionPayment, sessionPersonality, navigate]);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/admin/payments?status=${filter}`, {
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}` 
        }
      });
      
      const data = await response.json();
      setPayments(data.payments || []);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const resp = await fetch(`${API_URL}/api/admin/user-stats`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      const data = await resp.json();
      if (data.success) setUserStats(data);
    } catch (e) {
      console.error('Failed to fetch user stats', e);
    }
  }

  const handleApprove = async (paymentId) => {
    if (!confirm('Are you sure you want to approve this payment?')) return;
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/admin/verify-payment`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ paymentId, action: 'APPROVE' })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ Payment approved successfully!');
        fetchPayments();
      } else {
        alert('Failed to approve payment: ' + data.error);
      }
    } catch (error) {
      console.error('Approval error:', error);
      alert('Failed to approve payment');
    }
  };

  const handleReject = async (paymentId) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/admin/verify-payment`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ paymentId, action: 'REJECT', rejectionReason: reason })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('❌ Payment rejected');
        fetchPayments();
      } else {
        alert('Failed to reject payment: ' + data.error);
      }
    } catch (error) {
      console.error('Rejection error:', error);
      alert('Failed to reject payment');
    }
  };

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const params = new URLSearchParams({ 
        scope: sessionScope, 
        payment: sessionPayment,
        personality: sessionPersonality 
      });
      const response = await fetch(`${API_URL}/api/admin/sessions?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    navigate('/admin');
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      VERIFIED: 'bg-green-100 text-green-800 border-green-300',
      REJECTED: 'bg-red-100 text-red-800 border-red-300'
    };
    return styles[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getServiceIcon = (serviceType) => {
    return serviceType === 'report' ? '📄' : '🤖';
  };

  const getServiceName = (serviceType) => {
    return serviceType === 'report' ? 'Detailed Report' : 'AI Consultation';
  };

  const paymentStats = {
    pending: payments.filter(p => p.status === 'PENDING').length,
    verified: payments.filter(p => p.status === 'VERIFIED').length,
    rejected: payments.filter(p => p.status === 'REJECTED').length,
    total: payments.length
  };

  const sessionStats = {
    active: sessions.filter(s => s.state !== 'TEST_COMPLETE').length,
    completed: sessions.filter(s => s.state === 'TEST_COMPLETE').length,
    paid: sessions.filter(s => s.paymentStatus === 'VERIFIED').length,
    unpaid: sessions.filter(s => s.paymentStatus !== 'VERIFIED').length,
    total: sessions.length
  };

  // 16 MBTI personality types
  const PERSONALITY_TYPES = [
    'ALL', 'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <span>🔐</span>
                SNTI Admin Dashboard
              </h1>
              <p className="text-blue-100 text-sm mt-1">Payments & Test Sessions Management</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-blue-100">Logged in as</p>
                <p className="text-white font-semibold">{adminEmail}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
              >
                <span>🚪</span>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Tabs */}
        <div className="flex gap-3 mb-6">
          {['PAYMENTS', 'SESSIONS'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg font-semibold transition ${
                activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-700 border'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Global Stats Cards */}
        {userStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-blue-600">{userStats.totals.totalUsers}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
              <p className="text-sm text-gray-600 mb-1">Tests Started</p>
              <p className="text-3xl font-bold text-indigo-600">{userStats.totals.totalTestsStarted}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <p className="text-sm text-gray-600 mb-1">Tests Completed</p>
              <p className="text-3xl font-bold text-green-600">{userStats.totals.totalTestsCompleted}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-500">
              <p className="text-sm text-gray-600 mb-1">Active Tests</p>
              <p className="text-3xl font-bold text-amber-600">{userStats.totals.activeTests}</p>
            </div>
          </div>
        )}

        {/* Tab-specific Stats Cards */}
        {activeTab === 'PAYMENTS' ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{paymentStats.pending}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <p className="text-sm text-gray-600 mb-1">Verified</p>
              <p className="text-3xl font-bold text-green-600">{paymentStats.verified}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
              <p className="text-sm text-gray-600 mb-1">Rejected</p>
              <p className="text-3xl font-bold text-red-600">{paymentStats.rejected}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-3xl font-bold text-blue-600">{paymentStats.total}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
              <p className="text-sm text-gray-600 mb-1">Active</p>
              <p className="text-3xl font-bold text-indigo-600">{sessionStats.active}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-600">{sessionStats.completed}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-emerald-500">
              <p className="text-sm text-gray-600 mb-1">Paid</p>
              <p className="text-3xl font-bold text-emerald-600">{sessionStats.paid}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-500">
              <p className="text-sm text-gray-600 mb-1">Unpaid</p>
              <p className="text-3xl font-bold text-amber-600">{sessionStats.unpaid}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-3xl font-bold text-blue-600">{sessionStats.total}</p>
            </div>
          </div>
        )}

        {/* Filter Controls */}
        {activeTab === 'PAYMENTS' ? (
          <div className="bg-white rounded-lg shadow mb-6 p-4">
            <div className="flex flex-wrap gap-3">
              {['PENDING', 'VERIFIED', 'REJECTED', 'ALL'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-6 py-2 rounded-lg font-semibold transition ${
                    filter === status 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                  {status !== 'ALL' && (
                    <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                      {status === 'PENDING' && paymentStats.pending}
                      {status === 'VERIFIED' && paymentStats.verified}
                      {status === 'REJECTED' && paymentStats.rejected}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow mb-6 p-4">
            <div className="flex flex-wrap gap-3 items-center mb-3">
              <span className="text-sm font-semibold text-gray-700">Scope:</span>
              {['ALL', 'ACTIVE', 'COMPLETED'].map(s => (
                <button
                  key={s}
                  onClick={() => setSessionScope(s)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
                    sessionScope === s ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
              <span className="mx-2 h-6 w-px bg-gray-300" />
              <span className="text-sm font-semibold text-gray-700">Payment:</span>
              {['ALL', 'VERIFIED', 'PENDING', 'REJECTED', 'NONE'].map(s => (
                <button
                  key={s}
                  onClick={() => setSessionPayment(s)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
                    sessionPayment === s ? 'bg-emerald-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 items-center pt-3 border-t border-gray-200">
              <span className="text-sm font-semibold text-gray-700">Personality Type:</span>
              {PERSONALITY_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => setSessionPersonality(type)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    sessionPersonality === type 
                      ? 'bg-purple-600 text-white shadow-lg ring-2 ring-purple-300' 
                      : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Table */}
        {activeTab === 'PAYMENTS' ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading payments...</p>
              </div>
            ) : payments.length === 0 ? (
              <div className="p-12 text-center">
                <span className="text-6xl mb-4 block">📭</span>
                <p className="text-gray-600 text-lg">No {filter.toLowerCase()} payments found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">User Details</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Service</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Transaction</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Personality</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map(payment => (
                      <tr key={payment.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">{payment.name}</p>
                            <p className="text-sm text-gray-600">{payment.email}</p>
                            <p className="text-sm text-gray-500">{payment.mobile}</p>
                            <p className="text-xs text-gray-400 mt-1">{new Date(payment.submittedAt).toLocaleString()}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{getServiceIcon(payment.serviceType)}</span>
                            <div>
                              <p className="font-medium text-gray-900">{getServiceName(payment.serviceType)}</p>
                              <p className="text-sm font-bold text-green-600">PKR {payment.amount}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-mono text-sm bg-gray-100 px-3 py-1 rounded border border-gray-300">{payment.transactionId}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-bold text-sm">{payment.personalityType}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(payment.status)}`}>{payment.status}</span>
                          {payment.verifiedAt && (<p className="text-xs text-gray-500 mt-1">{new Date(payment.verifiedAt).toLocaleString()}</p>)}
                          {payment.rejectionReason && (<p className="text-xs text-red-600 mt-1">Reason: {payment.rejectionReason}</p>)}
                        </td>
                        <td className="px-6 py-4">
                          {payment.status === 'PENDING' ? (
                            <div className="flex flex-col gap-2">
                              <button onClick={() => handleApprove(payment.id)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2">✓ Approve</button>
                              <button onClick={() => handleReject(payment.id)} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2">✗ Reject</button>
                            </div>
                          ) : (
                            <div className="text-center text-gray-400 text-sm">{payment.status === 'VERIFIED' ? '✅ Completed' : '❌ Declined'}</div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading sessions...</p>
              </div>
            ) : sessions.length === 0 ? (
              <div className="p-12 text-center">
                <span className="text-6xl mb-4 block">🗂️</span>
                <p className="text-gray-600 text-lg">No sessions found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Institution</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Session</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Progress</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Result</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Payment</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Dates</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sessions.map(s => (
                      <tr key={s.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">{s.name || '—'}</p>
                            <p className="text-sm text-gray-600">{s.email || '—'}</p>
                            <p className="text-sm text-gray-500">{s.phone || '—'}</p>
                            {s.age !== null && s.age !== undefined && (
                              <p className="text-sm text-gray-700">Age: {s.age}</p>
                            )}
                            {s.rollNumber && (<p className="text-xs text-gray-400 mt-1">Roll: {s.rollNumber}</p>)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-800">{s.institution || '—'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-mono text-xs bg-gray-100 inline-block px-2 py-1 rounded border">{s.id}</p>
                            <p className="text-xs text-gray-500 mt-1">{s.state}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-800">{s.progress || '—'}</p>
                        </td>
                        <td className="px-6 py-4">
                          {s.mbtiType ? (
                            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-bold text-sm">{s.mbtiType}</span>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(s.paymentStatus)}`}>{s.paymentStatus}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-gray-600">Start: {s.createdAt ? new Date(s.createdAt).toLocaleString() : '—'}</p>
                          <p className="text-xs text-gray-500">Update: {s.updatedAt ? new Date(s.updatedAt).toLocaleString() : '—'}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>💡 Tip:</strong> Always verify the transaction ID in your JazzCash Business account before approving payments.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
