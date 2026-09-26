import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, Zap, Star, Users, LogIn, Globe } from 'lucide-react';
import { useAuth, useLang } from '../context/AppContext';

const languages = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'hi', label: 'हि', name: 'Hindi' },
  { code: 'bn', label: 'বা', name: 'Bengali' },
];

export const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLang();
  const navigate = useNavigate();
  const location = useLocation();

  const isLanding = location.pathname === '/';

  const navLinks = [
    { label: t('nav.home'), href: '/', icon: <Home className="w-4 h-4" /> },
    { label: t('nav.howItWorks'), href: '/#how-it-works', icon: <Zap className="w-4 h-4" /> },
    { label: t('nav.features'), href: '/#features', icon: <Star className="w-4 h-4" /> },
    { label: t('nav.professionals'), href: '/professionals', icon: <Users className="w-4 h-4" /> },
  ];

  const handleScrollLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
      e.preventDefault();
      const id = href.replace('/#', '');
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 300);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
      setMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isLanding ? 'glass border-b border-white/20' : 'bg-white border-b border-warm-100 shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-sage rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-display font-bold text-xl text-charcoal-800">
              PreCal <span className="text-sage-600">Home</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleScrollLink(e, link.href)}
                className="px-4 py-2 text-sm font-medium text-charcoal-700 hover:text-sage-600 hover:bg-sage-50 rounded-lg transition-all duration-150"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-charcoal-700 hover:text-sage-600 hover:bg-sage-50 rounded-lg transition-all"
              >
                <Globe className="w-4 h-4" />
                <span>{languages.find(l => l.code === language)?.label}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-premium border border-warm-100 py-1 min-w-[120px] animate-slide-up">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code as 'en' | 'hi' | 'bn'); setLangOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-sage-50 transition-colors ${language === lang.code ? 'text-sage-600 font-semibold' : 'text-charcoal-700'}`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard" className="btn-secondary !py-2 !px-4 !text-sm">Dashboard</Link>
                <button onClick={() => { logout(); navigate('/'); }} className="text-sm text-charcoal-700 hover:text-red-500 transition-colors">Logout</button>
              </div>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-charcoal-700 hover:text-sage-600 hover:bg-sage-50 rounded-lg transition-all">
                  <LogIn className="w-4 h-4" />
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="btn-primary !py-2 !px-4 !text-sm">
                  {t('nav.getStarted')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-charcoal-700 hover:bg-sage-50 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-warm-100 px-4 py-4 animate-slide-up">
          <div className="flex flex-col gap-1">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleScrollLink(e, link.href)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-charcoal-700 hover:text-sage-600 hover:bg-sage-50 transition-all"
              >
                {link.icon}
                {link.label}
              </a>
            ))}
            <div className="border-t border-warm-100 mt-2 pt-2 flex flex-col gap-2">
              {/* Language Selector Mobile */}
              <div className="flex items-center gap-2 px-4 py-2">
                <Globe className="w-4 h-4 text-charcoal-600" />
                <span className="text-sm text-charcoal-600 font-medium">Language:</span>
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as 'en' | 'hi' | 'bn')}
                    className={`px-2 py-0.5 text-sm rounded font-medium ${language === lang.code ? 'bg-sage-600 text-white' : 'text-charcoal-600 hover:bg-sage-50'}`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
              {user ? (
                <>
                  <Link to="/dashboard" className="btn-primary w-full justify-center" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                  <button onClick={() => { logout(); navigate('/'); setMenuOpen(false); }} className="w-full text-sm text-center text-red-500 py-2">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary w-full justify-center" onClick={() => setMenuOpen(false)}>{t('nav.login')}</Link>
                  <Link to="/register" className="btn-primary w-full justify-center" onClick={() => setMenuOpen(false)}>{t('nav.getStarted')}</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
