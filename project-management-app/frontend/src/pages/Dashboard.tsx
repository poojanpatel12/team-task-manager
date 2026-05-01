import { useEffect, useState } from 'react';
import api from '../services/api';
import { DashboardStats } from '../types';
import { useAuthStore } from '../store';

const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className={`bg-white rounded-xl shadow-sm p-5 border-l-4 ${color}`}>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    api.get('/dashboard')
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-400">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Dashboard</h1>
      <p className="text-gray-500 mb-6">Welcome back, {user?.username}</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard label="Projects" value={stats?.projectCount ?? 0} color="border-indigo-500" />
        <StatCard label="Total Tasks" value={stats?.total ?? 0} color="border-blue-500" />
        <StatCard label="Pending" value={stats?.pending ?? 0} color="border-yellow-500" />
        <StatCard label="In Progress" value={stats?.inProgress ?? 0} color="border-orange-500" />
        <StatCard label="Completed" value={stats?.completed ?? 0} color="border-green-500" />
        <StatCard label="Overdue" value={stats?.overdue ?? 0} color="border-red-500" />
      </div>

      {stats && stats.total > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-600 mb-3">Task Progress</h2>
          <div className="flex h-4 rounded-full overflow-hidden gap-0.5">
            {stats.completed > 0 && (
              <div className="bg-green-500 transition-all" style={{ width: `${(stats.completed / stats.total) * 100}%` }} title="Completed" />
            )}
            {stats.inProgress > 0 && (
              <div className="bg-orange-400 transition-all" style={{ width: `${(stats.inProgress / stats.total) * 100}%` }} title="In Progress" />
            )}
            {stats.pending > 0 && (
              <div className="bg-yellow-300 transition-all" style={{ width: `${(stats.pending / stats.total) * 100}%` }} title="Pending" />
            )}
          </div>
          <div className="flex gap-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full inline-block" />Completed</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-orange-400 rounded-full inline-block" />In Progress</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-yellow-300 rounded-full inline-block" />Pending</span>
          </div>
        </div>
      )}
    </div>
  );
}
