import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download, Save, Plus, Users, Edit2, ChevronDown, ChevronUp,
  Calendar, Tag, MapPin, Sparkles, Info, CheckCircle, Printer
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useAnalysis, useProjects, useToast, useLang } from '../context/AppContext';
import type { DesignRecommendation, MaterialItem, BudgetBreakdown } from '../types';

// ---- Color Swatch ----
const ColorSwatch: React.FC<{ hex: string; name: string; size?: 'sm' | 'lg' }> = ({ hex, name, size = 'sm' }) => (
  <div className="flex flex-col items-center gap-1">
    <div
      className={`rounded-xl border border-warm-100 shadow-sm ${size === 'lg' ? 'w-14 h-14' : 'w-10 h-10'}`}
      style={{ backgroundColor: hex }}
    />
    <span className="text-[10px] text-charcoal-700 opacity-70 text-center leading-tight max-w-[48px]">{name}</span>
    <span className="text-[9px] text-gray-400 font-mono">{hex}</span>
  </div>
);

// ---- Recommendation Card ----
const RecommendationCard: React.FC<{ rec: DesignRecommendation; i: number }> = ({ rec, i }) => {
  const labelColor = rec.label === 'Recommended'
    ? 'badge-green'
    : rec.label === 'Alternative 1'
    ? 'badge-blue'
    : 'bg-purple-50 text-purple-700 badge';

  return (
    <div className={`card p-5 ${i === 0 ? 'ring-2 ring-sage-500' : ''}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <h4 className="font-display font-semibold text-charcoal-800">{rec.title}</h4>
        <span className={labelColor}>{rec.label}</span>
      </div>
      <p className="text-sm text-charcoal-700 opacity-70 leading-relaxed mb-4">{rec.description}</p>

      {/* Colors */}
      {rec.primaryColorHex && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-charcoal-700 mb-2">Colour Palette</p>
          <div className="flex gap-3 flex-wrap">
            {rec.primaryColorHex && (
              <ColorSwatch hex={rec.primaryColorHex} name={rec.primaryColor || 'Primary'} size="lg" />
            )}
            {rec.complementaryColors?.map(c => (
              <ColorSwatch key={c.hex} hex={c.hex} name={c.name} />
            ))}
          </div>
        </div>
      )}

      {/* Details */}
      <div className="flex flex-wrap gap-2">
        {rec.finish && (
          <span className="text-xs bg-cream-100 text-charcoal-700 px-2.5 py-1 rounded-full">Finish: {rec.finish}</span>
        )}
        {rec.material && (
          <span className="text-xs bg-cream-100 text-charcoal-700 px-2.5 py-1 rounded-full">Material: {rec.material}</span>
        )}
        {rec.tags.map(tag => (
          <span key={tag} className="badge badge-green !text-[10px]">{tag}</span>
        ))}
      </div>
    </div>
  );
};

// ---- Material Table ----
const MaterialTable: React.FC<{ items: MaterialItem[] }> = ({ items }) => {
  const total = items.reduce((s, i) => s + i.totalPrice, 0);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-warm-100">
            <th className="text-left py-3 px-3 text-xs font-semibold text-charcoal-700 opacity-70">#</th>
            <th className="text-left py-3 px-3 text-xs font-semibold text-charcoal-700 opacity-70">Material Name</th>
            <th className="text-left py-3 px-3 text-xs font-semibold text-charcoal-700 opacity-70 hidden md:table-cell">Specification</th>
            <th className="text-right py-3 px-3 text-xs font-semibold text-charcoal-700 opacity-70">Qty</th>
            <th className="text-left py-3 px-3 text-xs font-semibold text-charcoal-700 opacity-70">Unit</th>
            <th className="text-right py-3 px-3 text-xs font-semibold text-charcoal-700 opacity-70">Unit Price</th>
            <th className="text-right py-3 px-3 text-xs font-semibold text-charcoal-700 opacity-70">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={item.id} className={`border-b border-warm-50 hover:bg-cream-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-cream-50/30'}`}>
              <td className="py-3 px-3 text-gray-400 text-xs">{i + 1}</td>
              <td className="py-3 px-3 font-medium text-charcoal-800">{item.name}</td>
              <td className="py-3 px-3 text-charcoal-700 opacity-60 text-xs hidden md:table-cell">{item.specification}</td>
              <td className="py-3 px-3 text-right text-charcoal-800">{item.quantity}</td>
              <td className="py-3 px-3 text-charcoal-700 opacity-60">{item.unit}</td>
              <td className="py-3 px-3 text-right text-charcoal-700">₹{item.unitPrice.toLocaleString('en-IN')}</td>
              <td className="py-3 px-3 text-right font-semibold text-charcoal-800">₹{item.totalPrice.toLocaleString('en-IN')}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-warm-200 bg-cream-100">
            <td colSpan={5} className="py-3 px-3 font-semibold text-charcoal-800 text-sm">Total Material Cost</td>
            <td />
            <td className="py-3 px-3 text-right font-bold text-sage-700 text-base">₹{total.toLocaleString('en-IN')}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

// ---- Budget Chart ----
const CHART_COLORS = ['#4a7c4a', '#d4a017', '#7a9bb5', '#c17f5c', '#9fbf9f'];
const BudgetChart: React.FC<{ breakdown: BudgetBreakdown }> = ({ breakdown }) => {
  const data = [
    { name: 'Materials', value: breakdown.material },
    { name: 'Labour', value: breakdown.labour },
    { name: 'Transport', value: breakdown.transport },
    { name: 'Miscellaneous', value: breakdown.misc },
    { name: 'Contingency', value: breakdown.contingency },
  ];
  const fmt = (v: number) => `₹${v.toLocaleString('en-IN')}`;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={3} dataKey="value">
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v: number) => fmt(v)} />
        <Legend iconType="circle" iconSize={8} formatter={(value) => <span className="text-xs text-charcoal-700">{value}</span>} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const AnalysisResultPage: React.FC = () => {
  const { result } = useAnalysis();
  const { saveProject, projects } = useProjects();
  const { showToast } = useToast();
  const { t } = useLang();
  const navigate = useNavigate();
  const [showDetailedCost, setShowDetailedCost] = useState(false);
  const [saved, setSaved] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  if (!result) {
    return (
      <div className="p-8 text-center">
        <p className="text-charcoal-700 mb-4">No analysis result found. Please complete an analysis first.</p>
        <button onClick={() => navigate('/analysis')} className="btn-primary">Start Analysis</button>
      </div>
    );
  }

  const { budgetBreakdown: bd } = result;
  const categoryLabel = result.category ? result.category.charAt(0).toUpperCase() + result.category.slice(1) : '';

  const handleSave = () => {
    saveProject({
      id: result.id,
      name: result.projectName,
      category: result.category,
      thumbnail: result.imagePreviewUrl,
      budget: bd.total,
      createdAt: result.createdAt,
      result,
    });
    setSaved(true);
    showToast(t('toast.projectSaved'), 'success');
  };

  const handleDownload = () => {
    const content = `
PreCal Home Analysis Report
======================
Project: ${result.projectName}
Category: ${categoryLabel}
Budget Tier: ${result.budget}
Property Type: ${result.propertyType}
Date: ${new Date(result.createdAt).toLocaleDateString('en-IN')}

DESIGN RECOMMENDATIONS
----------------------
${result.recommendations.map(r => `${r.label}: ${r.title}\n${r.description}`).join('\n\n')}

BILL OF MATERIALS (BOM)
-----------------------
${result.materials.map((m, i) => `${i + 1}. ${m.name} - ${m.quantity} ${m.unit} @ ₹${m.unitPrice} = ₹${m.totalPrice}`).join('\n')}

BUDGET BREAKDOWN
----------------
Materials:     ₹${bd.material.toLocaleString('en-IN')}
Labour:        ₹${bd.labour.toLocaleString('en-IN')}
Transport:     ₹${bd.transport.toLocaleString('en-IN')}
Miscellaneous: ₹${bd.misc.toLocaleString('en-IN')}
Contingency:   ₹${bd.contingency.toLocaleString('en-IN')}
TOTAL:         ₹${bd.total.toLocaleString('en-IN')}

Note: All prices are approximate and for demonstration purposes only.
Generated by PreCal Home · precal.home
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PreCal-Home-Report-${result.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Report downloaded!', 'success');
  };

  return (
    <div ref={reportRef} className="p-6 lg:p-8 max-w-5xl mx-auto animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-green">Analysis Complete</span>
            <span className="badge bg-amber-50 text-amber-700">Demo Mode</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-charcoal-800">{result.projectName}</h1>
          <p className="text-sm text-charcoal-700 opacity-60 mt-1">
            {new Date(result.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => navigate('/analysis')} className="btn-secondary !text-xs !py-2">
            <Edit2 className="w-3.5 h-3.5" /> Edit Preferences
          </button>
          <button onClick={handleDownload} className="btn-secondary !text-xs !py-2">
            <Download className="w-3.5 h-3.5" /> Download Report
          </button>
        </div>
      </div>

      {/* SECTION A: Project Summary */}
      <div className="card p-6">
        <h2 className="font-display font-semibold text-lg text-charcoal-800 mb-4 flex items-center gap-2">
          <Tag className="w-4 h-4 text-sage-600" /> Project Summary
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {[
            { label: 'Category', value: categoryLabel },
            { label: 'Budget Tier', value: result.budget ? result.budget.charAt(0).toUpperCase() + result.budget.slice(1) : '–' },
            { label: 'Property Type', value: result.propertyType ? result.propertyType.charAt(0).toUpperCase() + result.propertyType.slice(1) : '–' },
            { label: 'Design Style', value: result.preferences?.designStyle || 'Not specified' },
          ].map(item => (
            <div key={item.label} className="bg-cream-50 rounded-xl p-3">
              <p className="text-xs text-charcoal-700 opacity-60 mb-0.5">{item.label}</p>
              <p className="font-semibold text-charcoal-800 text-sm">{item.value}</p>
            </div>
          ))}
        </div>
        {result.imagePreviewUrl && (
          <div className="mt-2">
            <p className="text-xs font-semibold text-charcoal-700 mb-2">Uploaded Image</p>
            <img src={result.imagePreviewUrl} alt="Uploaded space" className="w-full max-w-xs h-40 object-cover rounded-xl" />
          </div>
        )}
      </div>

      {/* SECTION B: Design Recommendations */}
      <div>
        <h2 className="font-display font-semibold text-xl text-charcoal-800 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold-500" /> AI Design Recommendations
        </h2>
        <div className="flex gap-2 mb-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">These are AI-generated recommendations for demonstration. Consult a professional before purchasing materials.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {result.recommendations.map((rec, i) => (
            <RecommendationCard key={i} rec={rec} i={i} />
          ))}
        </div>
      </div>

      {/* SECTION C: BOM */}
      <div>
        <h2 className="font-display font-semibold text-xl text-charcoal-800 mb-4 flex items-center gap-2">
          <Printer className="w-5 h-5 text-sage-600" /> Bill of Materials (BOM)
        </h2>
        <div className="card overflow-hidden">
          <MaterialTable items={result.materials} />
        </div>
        <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-xs text-blue-700">
            <strong>Note:</strong> Quantities are calculated from your measurements and rounded up to standard purchase units. Actual quantities may vary based on site conditions and workmanship. Prices are approximate market estimates.
          </p>
        </div>
      </div>

      {/* SECTION D: Budget Breakdown */}
      <div>
        <h2 className="font-display font-semibold text-xl text-charcoal-800 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gold-500" /> Budget Breakdown
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart */}
          <div className="card p-6">
            <BudgetChart breakdown={bd} />
          </div>
          {/* Numbers */}
          <div className="card p-6 space-y-3">
            {[
              { label: 'Material Cost', value: bd.material, color: 'bg-sage-500' },
              { label: 'Labour / Installation', value: bd.labour, color: 'bg-gold-500' },
              { label: 'Transportation', value: bd.transport, color: 'bg-blue-400' },
              { label: 'Miscellaneous', value: bd.misc, color: 'bg-rose-400' },
              { label: 'Contingency (8%)', value: bd.contingency, color: 'bg-emerald-400' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="text-sm text-charcoal-700">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-charcoal-800">₹{item.value.toLocaleString('en-IN')}</span>
              </div>
            ))}
            <div className="border-t border-warm-100 pt-3">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-lg text-charcoal-800">Total Estimated Budget</span>
                <span className="font-display font-bold text-2xl text-sage-700">₹{bd.total.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-xs text-charcoal-700 opacity-60 mt-1">
                Range: ₹{Math.round(bd.total * 0.85).toLocaleString('en-IN')} – ₹{Math.round(bd.total * 1.20).toLocaleString('en-IN')} (±15%)
              </p>
            </div>
          </div>
        </div>

        {/* Expandable Detail */}
        <button
          onClick={() => setShowDetailedCost(!showDetailedCost)}
          className="mt-4 flex items-center gap-2 text-sm text-sage-600 font-medium hover:text-sage-700"
        >
          {showDetailedCost ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {showDetailedCost ? 'Hide' : 'View'} Detailed Cost Assumptions
        </button>
        {showDetailedCost && (
          <div className="mt-3 card p-5 text-sm space-y-2 animate-slide-up">
            <p className="font-semibold text-charcoal-800 mb-2">Cost Calculation Assumptions</p>
            <ul className="space-y-1.5 text-charcoal-700 opacity-80">
              <li>• Material prices based on average Indian retail market (2024)</li>
              <li>• Labour rates estimated at {result.category === 'furniture' ? '55%' : result.category === 'ceiling' ? '65%' : '45%'} of material cost for {result.category}</li>
              <li>• Transportation estimated at 6% of material cost</li>
              <li>• Miscellaneous (masking, cleanup, small tools) at 4%</li>
              <li>• 8% contingency for scope changes, rework, and price fluctuations</li>
              <li>• All prices in Indian Rupees (INR) and exclusive of GST</li>
              <li className="text-amber-700 font-medium">• These are illustrative estimates only — not professional quotes</li>
            </ul>
          </div>
        )}
      </div>

      {/* SECTION E: Actions */}
      <div className="card p-6 bg-gradient-to-br from-sage-50 to-cream-100">
        <h3 className="font-display font-semibold text-lg text-charcoal-800 mb-2">Ready to Transform Your Space?</h3>
        <p className="text-sm text-charcoal-700 opacity-70 mb-5">
          Connect with verified local professionals for your renovation project, or save this report for later.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownload}
            className="btn-secondary !text-sm"
            id="download-report"
          >
            <Download className="w-4 h-4" /> {t('btn.downloadReport')}
          </button>
          <button
            onClick={handleSave}
            disabled={saved}
            className="btn-secondary !text-sm disabled:opacity-60"
            id="save-project"
          >
            {saved ? <><CheckCircle className="w-4 h-4 text-sage-600" /> Saved!</> : <><Save className="w-4 h-4" /> {t('btn.saveProject')}</>}
          </button>
          <button
            onClick={() => { navigate('/analysis'); }}
            className="btn-secondary !text-sm"
          >
            <Plus className="w-4 h-4" /> New Analysis
          </button>
          <button
            onClick={() => navigate('/professionals')}
            className="btn-gold !text-sm"
            id="book-professionals"
          >
            <Users className="w-4 h-4" /> {t('btn.bookProfessionals')}
          </button>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="rounded-2xl bg-charcoal-900 text-white p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-display font-bold text-xl mb-1">Ready to Get Started?</p>
          <p className="text-gray-400 text-sm">Connect with verified renovation professionals in your area.</p>
        </div>
        <button
          onClick={() => navigate('/professionals')}
          className="flex items-center gap-2 bg-sage-600 hover:bg-sage-700 text-white font-semibold px-6 py-3 rounded-xl transition-all flex-shrink-0"
        >
          <Users className="w-4 h-4" /> Book Professionals
        </button>
      </div>
    </div>
  );
};
