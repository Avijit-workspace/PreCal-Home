import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderOpen, Trash2, Eye, Plus, Search, Filter, Calendar,
  ArrowLeft, AlertTriangle, X, Check
} from 'lucide-react';
import { useProjects, useToast, useAnalysis } from '../context/AppContext';
import type { Project } from '../types';

const categoryColors: Record<string, string> = {
  painting: 'bg-blue-100 text-blue-700',
  ceiling: 'bg-amber-100 text-amber-700',
  doors: 'bg-emerald-100 text-emerald-700',
  windows: 'bg-sky-100 text-sky-700',
  furniture: 'bg-rose-100 text-rose-700',
};

const categoryLabels: Record<string, string> = {
  painting: 'Painting / Walls',
  ceiling: 'Ceiling',
  doors: 'Doors',
  windows: 'Windows',
  furniture: 'Furniture',
};

const ConfirmDialog: React.FC<{ name: string; onConfirm: () => void; onCancel: () => void }> = ({ name, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-premium animate-slide-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <h3 className="font-semibold text-charcoal-800">Delete Project?</h3>
          <p className="text-sm text-charcoal-700 opacity-70">This action cannot be undone.</p>
        </div>
      </div>
      <p className="text-sm text-charcoal-700 mb-5">
        Are you sure you want to delete <strong>"{name}"</strong>?
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="btn-secondary flex-1 justify-center">
          <X className="w-4 h-4" /> Cancel
        </button>
        <button onClick={onConfirm} className="flex-1 justify-center bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all">
          <Trash2 className="w-4 h-4" /> Delete
        </button>
      </div>
    </div>
  </div>
);

const ProjectCard: React.FC<{ project: Project; onView: () => void; onDelete: () => void }> = ({ project, onView, onDelete }) => (
  <div className="card-hover p-5">
    <div className="flex gap-4 mb-3">
      <div className="w-16 h-16 rounded-xl bg-cream-200 flex-shrink-0 overflow-hidden">
        {project.thumbnail ? (
          <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FolderOpen className="w-6 h-6 text-charcoal-400" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-charcoal-800 truncate mb-1">{project.name}</h3>
        {project.category && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[project.category] || 'bg-gray-100 text-gray-700'}`}>
            {categoryLabels[project.category] || project.category}
          </span>
        )}
      </div>
    </div>
    <div className="flex items-center justify-between mb-4">
      <div>
        <p className="text-xs text-charcoal-700 opacity-60">Estimated Budget</p>
        <p className="font-bold text-sage-700">₹{project.budget.toLocaleString('en-IN')}</p>
      </div>
      <div className="flex items-center gap-1 text-xs text-charcoal-700 opacity-60">
        <Calendar className="w-3 h-3" />
        {new Date(project.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
      </div>
    </div>
    <div className="flex gap-2">
      <button onClick={onView} className="btn-primary !text-xs !py-2 flex-1 justify-center">
        <Eye className="w-3.5 h-3.5" /> View Report
      </button>
      <button onClick={onDelete} className="p-2 rounded-xl border-2 border-red-100 text-red-400 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

export const MyProjectsPage: React.FC = () => {
  const { projects, deleteProject } = useProjects();
  const { setResult, resetAnalysis } = useAnalysis();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  const filtered = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || p.category === filterCat;
    return matchSearch && matchCat;
  });

  const handleView = (p: Project) => {
    setResult(p.result);
    navigate('/result');
  };

  const handleDelete = (p: Project) => {
    deleteProject(p.id);
    showToast('Project deleted.', 'info');
    setDeleteTarget(null);
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto animate-fade-in">
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-sm text-charcoal-700 hover:text-sage-600 mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-charcoal-800">My Projects</h1>
          <p className="text-charcoal-700 opacity-70 mt-1">{projects.length} saved {projects.length === 1 ? 'project' : 'projects'}</p>
        </div>
        <button
          onClick={() => { resetAnalysis(); navigate('/analysis'); }}
          className="btn-primary flex-shrink-0"
          id="new-project"
        >
          <Plus className="w-4 h-4" /> New Analysis
        </button>
      </div>

      {/* Filters */}
      {projects.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              className="form-input pl-9"
              placeholder="Search projects…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-charcoal-600" />
            <select
              className="form-input !w-auto !py-2.5"
              value={filterCat}
              onChange={e => setFilterCat(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="painting">Painting</option>
              <option value="ceiling">Ceiling</option>
              <option value="doors">Doors</option>
              <option value="windows">Windows</option>
              <option value="furniture">Furniture</option>
            </select>
          </div>
        </div>
      )}

      {/* Empty State */}
      {projects.length === 0 ? (
        <div className="card p-14 text-center">
          <FolderOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="font-display font-semibold text-xl text-charcoal-800 mb-2">No Projects Yet</h3>
          <p className="text-charcoal-700 opacity-60 mb-6 max-w-xs mx-auto">
            Run an AI renovation analysis and save it to build your project library.
          </p>
          <button
            onClick={() => { resetAnalysis(); navigate('/analysis'); }}
            className="btn-primary mx-auto"
          >
            <Plus className="w-4 h-4" /> Start First Analysis
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <Search className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <h3 className="font-semibold text-charcoal-800 mb-1">No results found</h3>
          <p className="text-sm text-charcoal-700 opacity-60">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <ProjectCard
              key={p.id}
              project={p}
              onView={() => handleView(p)}
              onDelete={() => setDeleteTarget(p)}
            />
          ))}
        </div>
      )}

      {deleteTarget && (
        <ConfirmDialog
          name={deleteTarget.name}
          onConfirm={() => handleDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};
