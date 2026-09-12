import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Briefcase, TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 transition-transform hover:-translate-y-1">
    <div className={`p-4 rounded-lg ${colorClass}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState({ stats: null, rates: null, recentApplications: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setData(response.data);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-center py-10 text-gray-500">Loading dashboard...</div>;
  if (error) return <div className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>;

  const { stats, rates, recentApplications } = data;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <Link 
          to="/applications"
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          View All Applications
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Applications" 
          value={stats?.total || 0} 
          icon={Briefcase} 
          colorClass="bg-blue-100 text-blue-600"
        />
        <StatCard 
          title="Interviewing" 
          value={stats?.Interview || 0} 
          icon={Clock} 
          colorClass="bg-yellow-100 text-yellow-600"
        />
        <StatCard 
          title="Offers" 
          value={stats?.Offer || 0} 
          icon={CheckCircle} 
          colorClass="bg-green-100 text-green-600"
        />
        <StatCard 
          title="Rejected" 
          value={stats?.Rejected || 0} 
          icon={XCircle} 
          colorClass="bg-red-100 text-red-600"
        />
      </div>

      {/* Rates & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Insights / Rates */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            Insights
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Interview Rate</span>
                <span className="font-medium text-gray-900">{rates?.interviewRate}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${rates?.interviewRate}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Offer Rate</span>
                <span className="font-medium text-gray-900">{rates?.offerRate}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${rates?.offerRate}%` }}></div>
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-100 text-sm text-primary-800">
            <strong>Tip:</strong> Keep refining your resume for roles where your interview rate is low.
          </div>
        </div>

        {/* Recent Applications */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          {recentApplications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No applications yet. Start tracking!</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Company</th>
                    <th className="pb-3 font-medium">Role</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentApplications.map(app => (
                    <tr key={app._id} className="hover:bg-gray-50/50">
                      <td className="py-3 font-medium text-gray-900">{app.company}</td>
                      <td className="py-3 text-gray-600">{app.role}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${app.status === 'Applied' ? 'bg-blue-50 text-blue-700' : 
                            app.status === 'Interview' ? 'bg-yellow-50 text-yellow-700' :
                            app.status === 'Assessment' ? 'bg-purple-50 text-purple-700' :
                            app.status === 'Offer' ? 'bg-green-50 text-green-700' :
                            'bg-red-50 text-red-700'}
                        `}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 text-right text-gray-500 whitespace-nowrap">
                        {new Date(app.appliedDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
