import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paintbrush, Square, DoorOpen, LayoutGrid,
  ChevronRight, ChevronLeft, Check, Upload, X, Camera,
  Ruler, Sparkles, Info, Loader2
} from 'lucide-react';
import { useAnalysis, useToast } from '../context/AppContext';
import { generateMockAnalysis } from '../data/mockAnalysis';
import type { RenovationCategory } from '../types';

// Step Indicator
const StepBar: React.FC<{ current: number; total: number; labels: string[] }> = ({ current, total, labels }) => (
  <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
    {labels.map((label, i) => (
      <React.Fragment key={i}>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < current ? 'bg-sage-600 text-white' : i === current ? 'bg-sage-600 text-white ring-4 ring-sage-100' : 'bg-gray-200 text-gray-500'}`}>
            {i < current ? <Check className="w-3.5 h-3.5" /> : i + 1}
          </div>
          <span className={`text-xs font-medium hidden sm:block ${i === current ? 'text-sage-600' : i < current ? 'text-charcoal-700' : 'text-gray-400'}`}>{label}</span>
        </div>
        {i < total - 1 && <div className={`flex-shrink-0 h-0.5 w-8 ${i < current ? 'bg-sage-600' : 'bg-gray-200'}`} />}
      </React.Fragment>
    ))}
  </div>
);

const categories = [
  { id: 'painting', title: 'Painting / Walls', icon: <Paintbrush className="w-7 h-7" />, desc: 'Walls, textures, colour palettes', color: 'from-blue-50 to-indigo-50 border-blue-200', activeColor: 'from-blue-100 to-indigo-100 border-blue-500' },
  { id: 'ceiling', title: 'Ceiling', icon: <Square className="w-7 h-7" />, desc: 'False ceiling, POP, lighting', color: 'from-amber-50 to-orange-50 border-amber-200', activeColor: 'from-amber-100 to-orange-100 border-amber-500' },
  { id: 'doors', title: 'Doors', icon: <DoorOpen className="w-7 h-7" />, desc: 'Door panels, frames, hardware', color: 'from-emerald-50 to-green-50 border-emerald-200', activeColor: 'from-emerald-100 to-green-100 border-emerald-500' },
  { id: 'windows', title: 'Windows', icon: <ChevronRight className="w-7 h-7" />, desc: 'UPVC, aluminium, glass types', color: 'from-sky-50 to-cyan-50 border-sky-200', activeColor: 'from-sky-100 to-cyan-100 border-sky-500' },
  { id: 'furniture', title: 'Furniture', icon: <LayoutGrid className="w-7 h-7" />, desc: 'Custom furniture & cabinetry', color: 'from-rose-50 to-pink-50 border-rose-200', activeColor: 'from-rose-100 to-pink-100 border-rose-500' },
];

const budgets = [
  { id: 'luxury', title: 'Luxury', emoji: '✨', desc: 'Premium materials, high-end finishes, sophisticated designs and luxury aesthetics.', range: '₹₹₹', color: 'bg-amber-50 border-amber-200', activeColor: 'bg-amber-100 border-amber-500' },
  { id: 'moderate', title: 'Moderate', emoji: '⚖️', desc: 'Balanced quality, attractive designs, durability, and reasonable pricing.', range: '₹₹', color: 'bg-sage-50 border-sage-200', activeColor: 'bg-sage-100 border-sage-500' },
  { id: 'budget', title: 'Budget Friendly', emoji: '💰', desc: 'Affordable materials, simple designs, and cost-effective renovation solutions.', range: '₹', color: 'bg-blue-50 border-blue-200', activeColor: 'bg-blue-100 border-blue-500' },
];

const propertyTypes = [
  { id: 'urban', title: 'Urban', emoji: '🏙️', desc: 'Modern apartments, city homes, contemporary interiors, and space-efficient designs.', image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=75' },
  { id: 'rural', title: 'Rural', emoji: '🏡', desc: 'Village homes, traditional houses, practical materials, and locally suitable renovation choices.', image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=400&q=75' },
];

const designStyles = ['Modern', 'Minimalist', 'Traditional', 'Contemporary', 'Classic'];

// Step 1
const Step1Category: React.FC<{ value: RenovationCategory; onChange: (c: RenovationCategory) => void }> = ({ value, onChange }) => (
  <div className="animate-slide-up">
    <h2 className="text-2xl font-display font-bold text-charcoal-800 mb-2">What would you like to renovate?</h2>
    <p className="text-charcoal-700 opacity-70 mb-6">Select one category to begin your AI analysis.</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map(cat => (
        <button
          key={cat.id}
          id={`cat-${cat.id}`}
          onClick={() => onChange(cat.id as RenovationCategory)}
          className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 group bg-gradient-to-br ${value === cat.id ? cat.activeColor : cat.color} hover:shadow-card`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-charcoal-700 ${value === cat.id ? 'bg-white shadow-sm' : 'bg-white/70'}`}>
              {cat.icon}
            </div>
            {value === cat.id && (
              <div className="ml-auto w-5 h-5 bg-sage-600 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <h3 className="font-semibold text-charcoal-800 mb-0.5">{cat.title}</h3>
          <p className="text-xs text-charcoal-700 opacity-60">{cat.desc}</p>
        </button>
      ))}
    </div>
  </div>
);

// Step 2
const Step2Budget: React.FC<{ value: string | null; onChange: (b: any) => void }> = ({ value, onChange }) => (
  <div className="animate-slide-up">
    <h2 className="text-2xl font-display font-bold text-charcoal-800 mb-2">Choose your budget range</h2>
    <p className="text-charcoal-700 opacity-70 mb-6">This affects material quality, pricing, and design recommendations.</p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {budgets.map(b => (
        <button
          key={b.id}
          id={`budget-${b.id}`}
          onClick={() => onChange(b.id)}
          className={`p-6 rounded-2xl border-2 text-left transition-all duration-200 ${value === b.id ? b.activeColor + ' shadow-card' : b.color} hover:shadow-card`}
        >
          <div className="text-3xl mb-3">{b.emoji}</div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display font-semibold text-lg text-charcoal-800">{b.title}</h3>
            <span className="text-lg font-bold text-gold-500">{b.range}</span>
          </div>
          <p className="text-sm text-charcoal-700 opacity-70 leading-relaxed">{b.desc}</p>
          {value === b.id && (
            <div className="mt-3 flex items-center gap-1.5 text-sage-600 text-xs font-semibold">
              <Check className="w-3.5 h-3.5" /> Selected
            </div>
          )}
        </button>
      ))}
    </div>
  </div>
);

// Step 3
const Step3Property: React.FC<{ value: string | null; onChange: (p: any) => void }> = ({ value, onChange }) => (
  <div className="animate-slide-up">
    <h2 className="text-2xl font-display font-bold text-charcoal-800 mb-2">What type of property?</h2>
    <p className="text-charcoal-700 opacity-70 mb-6">Recommendations are tailored to your property context.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {propertyTypes.map(p => (
        <button
          key={p.id}
          id={`prop-${p.id}`}
          onClick={() => onChange(p.id)}
          className={`rounded-2xl border-2 overflow-hidden text-left transition-all duration-200 hover:shadow-card-hover ${value === p.id ? 'border-sage-600 shadow-card' : 'border-warm-200'}`}
        >
          <div className="relative h-40 overflow-hidden">
            <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            {value === p.id && (
              <div className="absolute top-3 right-3 w-7 h-7 bg-sage-600 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="absolute bottom-3 left-3">
              <span className="text-2xl">{p.emoji}</span>
            </div>
          </div>
          <div className="p-5">
            <h3 className="font-display font-semibold text-xl text-charcoal-800 mb-1">{p.title}</h3>
            <p className="text-sm text-charcoal-700 opacity-70 leading-relaxed">{p.desc}</p>
          </div>
        </button>
      ))}
    </div>
  </div>
);

// Step 4: Upload + Measurements
const Step4Upload: React.FC<{
  category: RenovationCategory;
  images: string[];
  onImages: (files: File[], urls: string[]) => void;
  measurements: any;
  onMeasurements: (m: any) => void;
}> = ({ category, images, onImages, measurements, onMeasurements }) => {
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    const urls = validFiles.map(f => URL.createObjectURL(f));
    onImages(validFiles, urls);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  const removeImage = (i: number) => {
    const newUrls = images.filter((_, idx) => idx !== i);
    onImages([], newUrls); // simplified – in real app, track file objects too
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onMeasurements({ [key]: e.target.value });

  const m = measurements;

  return (
    <div className="animate-slide-up space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-charcoal-800 mb-2">Upload your space & add measurements</h2>
        <p className="text-charcoal-700 opacity-70">Upload one or more photos of your space for AI analysis.</p>
      </div>

      {/* Upload Zone */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${dragging ? 'border-sage-500 bg-sage-50' : 'border-warm-300 hover:border-sage-400 hover:bg-sage-50/50'}`}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" accept="image/*" multiple capture="environment" className="hidden" onChange={e => handleFiles(e.target.files)} />
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 bg-sage-100 rounded-2xl flex items-center justify-center">
            <Upload className="w-6 h-6 text-sage-600" />
          </div>
          <div>
            <p className="font-semibold text-charcoal-800">Drag & drop photos here</p>
            <p className="text-sm text-charcoal-700 opacity-60 mt-0.5">or click to browse files</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={e => { e.stopPropagation(); fileRef.current?.click(); }} className="btn-secondary !text-xs !py-1.5 !px-3">
              <Upload className="w-3 h-3" /> Browse Files
            </button>
            <button onClick={e => { e.stopPropagation(); fileRef.current?.click(); }} className="btn-secondary !text-xs !py-1.5 !px-3">
              <Camera className="w-3 h-3" /> Take Photo
            </button>
          </div>
          <p className="text-xs text-gray-400">JPG, PNG, HEIC · Max 10MB per file</p>
        </div>
      </div>

      {/* Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((url, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden aspect-video group">
              <img src={url} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Notice */}
      <div className="flex gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
        <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700 leading-relaxed">
          For accurate AI-based measurements, include a known reference object (e.g., a door, chair, or ruler) in the photo. Manual measurements below are used for material calculations.
        </p>
      </div>

      {/* Measurements */}
      <div>
        <h3 className="font-display font-semibold text-lg text-charcoal-800 mb-4 flex items-center gap-2">
          <Ruler className="w-5 h-5 text-sage-600" /> Manual Measurements
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Unit selector */}
          <div className="col-span-full">
            <label className="form-label">Measurement Unit</label>
            <div className="flex gap-3">
              {['meters', 'feet'].map(u => (
                <button
                  key={u}
                  onClick={() => onMeasurements({ unit: u })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all capitalize ${m.unit === u ? 'border-sage-600 bg-sage-50 text-sage-700' : 'border-warm-200 text-charcoal-700 hover:border-sage-300'}`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {/* Category-specific fields */}
          {(category === 'painting') && <>
            <div><label className="form-label">Wall Length ({m.unit || 'meters'})</label><input type="number" className="form-input" placeholder="e.g. 4" value={m.wallLength || ''} onChange={set('wallLength')} /></div>
            <div><label className="form-label">Wall Height ({m.unit || 'meters'})</label><input type="number" className="form-input" placeholder="e.g. 3" value={m.wallHeight || ''} onChange={set('wallHeight')} /></div>
            <div><label className="form-label">Number of Walls</label><input type="number" className="form-input" placeholder="e.g. 4" value={m.numWalls || ''} onChange={set('numWalls')} /></div>
            <div><label className="form-label">Doors in Walls (deduct)</label><input type="number" className="form-input" placeholder="e.g. 1" value={m.numDoorsInWall || ''} onChange={set('numDoorsInWall')} /></div>
          </>}
          {(category === 'ceiling') && <>
            <div><label className="form-label">Room Length ({m.unit || 'meters'})</label><input type="number" className="form-input" placeholder="e.g. 5" value={m.ceilingLength || ''} onChange={set('ceilingLength')} /></div>
            <div><label className="form-label">Room Width ({m.unit || 'meters'})</label><input type="number" className="form-input" placeholder="e.g. 4" value={m.ceilingWidth || ''} onChange={set('ceilingWidth')} /></div>
            <div className="col-span-full"><label className="form-label">Ceiling Type</label>
              <select className="form-input" value={m.ceilingType || ''} onChange={set('ceilingType')}>
                <option value="">Select type</option>
                <option>Flat Gypsum</option><option>Cove Design</option><option>Coffered</option><option>Multi-Level</option>
              </select>
            </div>
          </>}
          {(category === 'doors') && <>
            <div><label className="form-label">Door Height ({m.unit || 'meters'})</label><input type="number" className="form-input" placeholder="e.g. 2.1" value={m.doorHeight || ''} onChange={set('doorHeight')} /></div>
            <div><label className="form-label">Door Width ({m.unit || 'meters'})</label><input type="number" className="form-input" placeholder="e.g. 0.9" value={m.doorWidth || ''} onChange={set('doorWidth')} /></div>
            <div><label className="form-label">Number of Doors</label><input type="number" className="form-input" placeholder="e.g. 3" value={m.numDoors || ''} onChange={set('numDoors')} /></div>
          </>}
          {(category === 'windows') && <>
            <div><label className="form-label">Window Height ({m.unit || 'meters'})</label><input type="number" className="form-input" placeholder="e.g. 1.2" value={m.windowHeight || ''} onChange={set('windowHeight')} /></div>
            <div><label className="form-label">Window Width ({m.unit || 'meters'})</label><input type="number" className="form-input" placeholder="e.g. 1.5" value={m.windowWidth || ''} onChange={set('windowWidth')} /></div>
            <div><label className="form-label">Number of Windows</label><input type="number" className="form-input" placeholder="e.g. 4" value={m.numWindows || ''} onChange={set('numWindows')} /></div>
          </>}
          {(category === 'furniture') && <>
            <div><label className="form-label">Furniture Type</label>
              <select className="form-input" value={m.furnitureType || ''} onChange={set('furnitureType')}>
                <option value="">Select type</option>
                <option>Wardrobe</option><option>Kitchen Cabinet</option><option>TV Unit</option><option>Bookshelf</option><option>Bed</option><option>Sofa</option>
              </select>
            </div>
            <div><label className="form-label">Number of Units</label><input type="number" className="form-input" placeholder="e.g. 2" value={m.numFurnitureUnits || ''} onChange={set('numFurnitureUnits')} /></div>
            <div><label className="form-label">Width ({m.unit || 'meters'})</label><input type="number" className="form-input" placeholder="e.g. 2" value={m.furnitureWidth || ''} onChange={set('furnitureWidth')} /></div>
            <div><label className="form-label">Height ({m.unit || 'meters'})</label><input type="number" className="form-input" placeholder="e.g. 2.1" value={m.furnitureHeight || ''} onChange={set('furnitureHeight')} /></div>
          </>}
        </div>
      </div>
    </div>
  );
};

// Step 5: Preferences
const Step5Preferences: React.FC<{ prefs: any; onChange: (p: any) => void }> = ({ prefs, onChange }) => {
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onChange({ [k]: e.target.value });
  return (
    <div className="animate-slide-up space-y-5">
      <div>
        <h2 className="text-2xl font-display font-bold text-charcoal-800 mb-2">Additional preferences (optional)</h2>
        <p className="text-charcoal-700 opacity-70">Help us tailor recommendations further. All fields are optional.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Preferred Colour Palette</label>
          <input type="text" className="form-input" placeholder="e.g. Warm neutrals, earthy tones" value={prefs.colorPalette || ''} onChange={set('colorPalette')} />
        </div>
        <div>
          <label className="form-label">Design Style</label>
          <select className="form-input" value={prefs.designStyle || ''} onChange={set('designStyle')}>
            <option value="">Select a style</option>
            {designStyles.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">Preferred Material Type</label>
          <input type="text" className="form-input" placeholder="e.g. Teak wood, UPVC, Marble" value={prefs.preferredMaterial || ''} onChange={set('preferredMaterial')} />
        </div>
        <div>
          <label className="form-label">Special Requirements</label>
          <input type="text" className="form-input" placeholder="e.g. Waterproofing, child-safe, acoustic" value={prefs.specialRequirements || ''} onChange={set('specialRequirements')} />
        </div>
      </div>
    </div>
  );
};

const STEPS = ['Category', 'Budget', 'Property', 'Upload', 'Preferences'];

export const AnalysisPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const { state, setCategory, setBudget, setPropertyType, setImages, setMeasurements, setPreferences, setResult } = useAnalysis();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const canAdvance = () => {
    if (step === 0 && !state.category) return false;
    if (step === 1 && !state.budget) return false;
    if (step === 2 && !state.propertyType) return false;
    return true;
  };

  const handleAnalyze = async () => {
    if (!state.category) return;
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 2500));
    const result = generateMockAnalysis(
      state.category,
      state.budget,
      state.propertyType,
      state.measurements as any,
      state.preferences as any,
      state.imagePreviewUrls[0]
    );
    setResult(result);
    showToast('Analysis complete! Viewing your results.', 'success');
    setAnalyzing(false);
    navigate('/result');
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-charcoal-800">New Renovation Analysis</h1>
        <p className="text-sm text-charcoal-700 opacity-60 mt-1">AI-powered demo · Results are illustrative</p>
      </div>

      <StepBar current={step} total={STEPS.length} labels={STEPS} />

      <div className="card p-6 lg:p-8 mb-6">
        {step === 0 && <Step1Category value={state.category} onChange={setCategory} />}
        {step === 1 && <Step2Budget value={state.budget} onChange={setBudget} />}
        {step === 2 && <Step3Property value={state.propertyType} onChange={setPropertyType} />}
        {step === 3 && (
          <Step4Upload
            category={state.category}
            images={state.imagePreviewUrls}
            onImages={setImages}
            measurements={state.measurements}
            onMeasurements={setMeasurements}
          />
        )}
        {step === 4 && <Step5Preferences prefs={state.preferences} onChange={setPreferences} />}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className="btn-secondary disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => {
              if (!canAdvance()) { showToast('Please make a selection to continue.', 'warning'); return; }
              setStep(s => s + 1);
            }}
            className="btn-primary"
            id="analysis-next"
          >
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="btn-gold !text-sm !px-8 !py-3.5 disabled:opacity-70"
            id="analyze-submit"
          >
            {analyzing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Analyzing…
              </span>
            ) : (
              <><Sparkles className="w-4 h-4" /> Analyze My Space</>
            )}
          </button>
        )}
      </div>

      {analyzing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center max-w-sm w-full mx-4 shadow-premium">
            <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-sage-600 animate-pulse-soft" />
            </div>
            <h3 className="font-display font-bold text-xl text-charcoal-800 mb-2">AI Analysis in Progress</h3>
            <p className="text-sm text-charcoal-700 opacity-70 mb-4">Generating design recommendations, material estimates, and budget breakdown…</p>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-sage rounded-full animate-[slideIn_2.5s_ease-in-out]" style={{ width: '100%', transition: 'width 2.5s ease-in-out' }} />
            </div>
            <p className="text-xs text-gray-400 mt-2">This is a demo — results are illustrative</p>
          </div>
        </div>
      )}
    </div>
  );
};
