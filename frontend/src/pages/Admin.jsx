import { useState } from 'react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data
  const stats = {
    totalUsers: 1247,
    assessmentsCompleted: 892,
    chatSessions: 1564,
    averageScore: 8.4
  };

  const recentAssessments = [
    { id: 1, user: 'User#001', type: 'INFP', date: '2025-08-06', score: 8.7 },
    { id: 2, user: 'User#002', type: 'ESTJ', date: '2025-08-06', score: 9.1 },
    { id: 3, user: 'User#003', type: 'ISFJ', date: '2025-08-05', score: 8.3 },
    { id: 4, user: 'User#004', type: 'ENTP', date: '2025-08-05', score: 7.9 },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Assessments</h3>
          <p className="text-3xl font-bold text-green-600">{stats.assessmentsCompleted}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chat Sessions</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.chatSessions}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Avg Score</h3>
          <p className="text-3xl font-bold text-orange-600">{stats.averageScore}</p>
        </div>
      </div>

      {/* Recent Assessments */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Assessments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentAssessments.map((assessment) => (
                <tr key={assessment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {assessment.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {assessment.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {assessment.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {assessment.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">User Management</h3>
      </div>
      <div className="p-6">
        <p className="text-gray-600">User management features would be implemented here.</p>
      </div>
    </div>
  );



  const renderSettings = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Settings</h3>
      </div>
      <div className="p-6">
        <p className="text-gray-600">Application settings would be implemented here.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'users', name: 'Users' },
              { id: 'settings', name: 'Settings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
}
