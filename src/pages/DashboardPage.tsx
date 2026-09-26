import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusCircle, TrendingUp, Clock, FolderOpen, ArrowRight,
  Paintbrush, Square, DoorOpen, LayoutGrid, ChevronRight
} from 'lucide-react';
import { useAuth, useAnalysis, useProjects, useLang } from '../context/AppContext';

const categoryCards = [
  {
    id: 'painting',
    title: 'Painting / Walls',
    desc: 'AI colour selection, wall area estimation, paint & primer BOM',
    image: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=400&q=75&auto=format&fit=crop',
    icon: <Paintbrush className="w-5 h-5" />,
    color: 'from-blue-400 to-indigo-500',
  },
  {
    id: 'ceiling',
    title: 'Ceiling',
    desc: 'False ceiling design, gypsum BOM, lighting recommendations',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=75&auto=format&fit=crop',
    icon: <Square className="w-5 h-5" />,
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 'doors',
    title: 'Doors & Windows',
    desc: 'Frame & glass selection, installation materials, design options',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=75&auto=format&fit=crop',
    icon: <DoorOpen className="w-5 h-5" />,
    color: 'from-emerald-400 to-green-500',
  },
  {
    id: 'furniture',
    title: 'Furniture',
    desc: 'Custom furniture planning, material BOM, placement ideas',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=75&auto=format&fit=crop',
    icon: <LayoutGrid className="w-5 h-5" />,
    color: 'from-rose-400 to-pink-500',
  },
];

const RECENT_BUDGETS = [
  { label: 'Total Saved', value: '₹38,400', trend: '+12%', positive: true },
  { label: 'Active Projects', value: '2', trend: '', positive: true },
  { label: 'Analyses Done', value: '5', trend: '+3 this month', positive: true },
];

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { setCategory, resetAnalysis } = useAnalysis();
  const { projects } = useProjects();
  const { t } = useLang();
  const navigate = useNavigate();

  const handleStartAnalysis = (cat: string) => {
    resetAnalysis();
    setCategory(cat as any);
    navigate('/analysis');
  };

  const recentProjects = projects.slice(0, 3);

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-charcoal-800">
            {t('dashboard.welcome')}, <span className="text-sage-600 capitalize">{firstName}!</span> 👋
          </h1>
          <p className="text-charcoal-700 opacity-70 mt-1">{t('dashboard.subtitle')}</p>
        </div>
        <button
          onClick={() => { resetAnalysis(); navigate('/analysis'); }}
          className="btn-primary flex-shrink-0"
          id="dashboard-new-analysis"
        >
          <PlusCircle className="w-4 h-4" /> New Analysis
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {RECENT_BUDGETS.map(stat => (
          <div key={stat.label} className="card p-5 flex items-center gap-4">
            <div className="flex-1">
              <p className="text-xs text-charcoal-700 opacity-60 font-medium">{stat.label}</p>
              <p className="text-2xl font-display font-bold text-charcoal-800 mt-0.5">{stat.value}</p>
            </div>
            {stat.trend && (
              <div className={`badge ${stat.positive ? 'badge-green' : 'bg-red-50 text-red-600'}`}>
                <TrendingUp className="w-3 h-3" />
                {stat.trend}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Category Cards */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-semibold text-charcoal-800">Start a New Analysis</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryCards.map(card => (
            <button
              key={card.id}
              id={`dashboard-cat-${card.id}`}
              onClick={() => handleStartAnalysis(card.id)}
              className="card-hover text-left overflow-hidden group"
            >
              <div className="relative h-36 overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent`} />
                <div className={`absolute top-3 right-3 w-8 h-8 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center text-white`}>
                  {card.icon}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-charcoal-800 mb-1">{card.title}</h3>
                <p className="text-xs text-charcoal-700 opacity-60 leading-relaxed mb-3">{card.desc}</p>
                <div className="flex items-center gap-1 text-sage-600 text-xs font-semibold">
                  Start Analysis <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-semibold text-charcoal-800">Recent Projects</h2>
          <Link to="/projects" className="text-sm text-sage-600 font-medium hover:text-sage-700 flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <div className="card p-10 text-center">
            <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-display font-semibold text-charcoal-800 mb-2">No Projects Yet</h3>
            <p className="text-sm text-charcoal-700 opacity-60 mb-4">Complete an analysis and save it to see your projects here.</p>
            <button onClick={() => { resetAnalysis(); navigate('/analysis'); }} className="btn-primary !text-sm">
              <PlusCircle className="w-4 h-4" /> Start First Analysis
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentProjects.map(p => (
              <div key={p.id} className="card-hover p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-cream-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {p.thumbnail ? (
                      <img src={p.thumbnail} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <FolderOpen className="w-5 h-5 text-charcoal-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-charcoal-800 text-sm truncate">{p.name}</h3>
                    <p className="text-xs text-charcoal-700 opacity-60 capitalize">{p.category}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-charcoal-700 opacity-60">Budget</span>
                    <p className="text-sm font-semibold text-sage-600">₹{p.budget.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
                <Link to={`/result?id=${p.id}`} className="mt-3 btn-outline !text-xs !py-1.5 w-full justify-center">
                  View Report
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
