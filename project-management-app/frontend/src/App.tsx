import { BrowserRouter, Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from './store';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import TeamManagement from './pages/TeamManagement';
import Enquiries from './pages/Enquiries';
import EnquiryModal from './components/EnquiryModal';

const NavBar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showEnquiry, setShowEnquiry] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded text-sm font-medium ${isActive ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-600'}`;

  return (
    <>
      <nav className="bg-indigo-800 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-bold text-lg">TaskManager</span>
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/projects" className={linkClass}>Projects</NavLink>
          {user?.role === 'admin' && (
            <>
              <NavLink to="/team" className={linkClass}>Team</NavLink>
              <NavLink to="/enquiries" className={linkClass}>Enquiries</NavLink>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowEnquiry(true)}
            className="text-sm bg-white text-indigo-700 hover:bg-indigo-50 px-4 py-1.5 rounded-lg font-semibold"
          >
            Enquire Now
          </button>
          <span className="text-sm text-indigo-200">
            {user?.username} <span className="bg-indigo-600 px-2 py-0.5 rounded text-xs ml-1">{user?.role}</span>
          </span>
          <button onClick={handleLogout} className="text-sm bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded">
            Logout
          </button>
        </div>
      </nav>
      {showEnquiry && <EnquiryModal onClose={() => setShowEnquiry(false)} />}
    </>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuthStore();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50">
    <NavBar />
    <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><Layout><Projects /></Layout></ProtectedRoute>} />
        <Route path="/projects/:id" element={<ProtectedRoute><Layout><ProjectDetail /></Layout></ProtectedRoute>} />
        <Route path="/team" element={<ProtectedRoute><Layout><TeamManagement /></Layout></ProtectedRoute>} />
        <Route path="/enquiries" element={<ProtectedRoute><Layout><Enquiries /></Layout></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
