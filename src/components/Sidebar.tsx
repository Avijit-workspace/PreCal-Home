import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, PlusCircle, FolderOpen, History, Users, UserCircle, LogOut, X, Leaf
} from 'lucide-react';
import { useAuth } from '../context/AppContext';

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'New Analysis', href: '/analysis', icon: <PlusCircle className="w-4 h-4" /> },
  { label: 'My Projects', href: '/projects', icon: <FolderOpen className="w-4 h-4" /> },
  { label: 'Analysis History', href: '/projects', icon: <History className="w-4 h-4" /> },
  { label: 'Find Professionals', href: '/professionals', icon: <Users className="w-4 h-4" /> },
  { label: 'Profile & Settings', href: '/profile', icon: <UserCircle className="w-4 h-4" /> },
];

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="w-64 bg-white h-full flex flex-col border-r border-warm-100 shadow-sm">
      {/* Header */}
      <div className="p-5 border-b border-warm-100">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-sage rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-display font-bold text-lg text-charcoal-800">
              PreCal <span className="text-sage-600">Home</span>
            </span>
          </Link>
          {onClose && (
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors md:hidden">
              <X className="w-4 h-4 text-charcoal-600" />
            </button>
          )}
        </div>

        {/* User info */}
        {user && (
          <div className="mt-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-sage rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-sm">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-charcoal-800 truncate">{user.name}</p>
              <p className="text-xs text-charcoal-700 opacity-60 truncate">{user.email}</p>
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item, i) => {
            const isActive = location.pathname === item.href && (item.label !== 'Analysis History' || location.pathname === '/projects');
            return (
              <Link
                key={i}
                to={item.href}
                onClick={onClose}
                className={isActive ? 'sidebar-link-active' : 'sidebar-link'}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Quick Start */}
        <div className="mt-6 p-4 bg-gradient-sage rounded-2xl text-white">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="w-4 h-4" />
            <span className="text-sm font-semibold">Quick Start</span>
          </div>
          <p className="text-xs opacity-80 mb-3">Start a new AI analysis in seconds</p>
          <Link
            to="/analysis"
            onClick={onClose}
            className="block w-full text-center bg-white text-sage-700 text-xs font-semibold py-2 rounded-lg hover:bg-cream-100 transition-colors"
          >
            + New Analysis
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-warm-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};
