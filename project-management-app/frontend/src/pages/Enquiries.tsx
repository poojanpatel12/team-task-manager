import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store';

interface Enquiry {
  _id: string;
  fullName: string;
  companyName: string;
  workEmail: string;
  phoneNumber: string;
  teamSize: string;
  message: string;
  createdAt: string;
}

export default function Enquiries() {
  const { user } = useAuthStore();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/enquiries')
      .then(({ data }) => setEnquiries(data))
      .finally(() => setLoading(false));
  }, []);

  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  if (loading) return <div className="text-center py-12 text-gray-400">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Enquiries</h1>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{enquiries.length} total</span>
      </div>

      {enquiries.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl">No enquiries yet.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Company</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Team Size</th>
                <th className="px-4 py-3 text-left">Message</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {enquiries.map((e) => (
                <tr key={e._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{e.fullName}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{e.companyName}</td>
                  <td className="px-4 py-3 text-gray-600">{e.workEmail}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{e.phoneNumber}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-medium">{e.teamSize}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{e.message || '—'}</td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs">
                    {new Date(e.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
