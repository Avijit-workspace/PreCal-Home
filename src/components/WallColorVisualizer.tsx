/**
 * WallColorVisualizer
 * Canvas-based wall recoloring tool.
 * - Detects wall pixels with a brightness/saturation/position heuristic.
 * - Applies luminance-preserving HSL blend (paint preview effect).
 * - Works for any hex color: AI-recommended OR custom.
 * - Always recomputes from the original pixel data — no layer accumulation.
 * - Responds to externalHex from parent (AI Recommendations) bidirectionally.
 */

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Palette, RotateCcw, Eye, EyeOff, Pipette, AlertCircle, Loader2 } from 'lucide-react';
import type { DesignRecommendation } from '../types';

/* ─── Colour helpers ─────────────────────────────────────── */

const hexToRgb = (hex: string): [number, number, number] | null => {
  const c = hex.replace('#', '');
  if (c.length !== 6) return null;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return [r, g, b];
};

const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return [h * 360, s, l];
};

const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
  const hue = h / 360;
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hue2rgb = (pp: number, qq: number, t: number) => {
    let tt = t < 0 ? t + 1 : t > 1 ? t - 1 : t;
    if (tt < 1 / 6) return pp + (qq - pp) * 6 * tt;
    if (tt < 1 / 2) return qq;
    if (tt < 2 / 3) return pp + (qq - pp) * (2 / 3 - tt) * 6;
    return pp;
  };
  return [
    Math.round(hue2rgb(p, q, hue + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, hue) * 255),
    Math.round(hue2rgb(p, q, hue - 1 / 3) * 255),
  ];
};

/* ─── Wall pixel heuristic ───────────────────────────────── */
const wallWeight = (
  r: number, g: number, b: number, xFrac: number, yFrac: number
): number => {
  if (yFrac < 0.05 || yFrac > 0.85) return 0;
  const [, s, l] = rgbToHsl(r, g, b);
  if (l < 0.12 || l > 0.95 || s > 0.65) return 0;
  let w = 1.0;
  if (yFrac > 0.70) w *= 1 - (yFrac - 0.70) / 0.15;
  if (s > 0.35) w *= 1 - (s - 0.35) / 0.30;
  if (l < 0.20) w *= (l - 0.12) / 0.08;
  if (l > 0.88) w *= 1 - (l - 0.88) / 0.07;
  if (xFrac < 0.12 || xFrac > 0.88) w *= 0.6;
  return Math.max(0, Math.min(1, w));
};

/* ─── Core recolor ────────────────────────────────────────── */
const recolorWall = (
  orig: Uint8ClampedArray, w: number, h: number, hex: string
): Uint8ClampedArray | null => {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const [th, ts] = rgbToHsl(...rgb);
  const out = new Uint8ClampedArray(orig);
  for (let i = 0; i < orig.length; i += 4) {
    if (orig[i + 3] === 0) continue;
    const px = (i / 4) % w, py = Math.floor((i / 4) / w);
    const weight = wallWeight(orig[i], orig[i + 1], orig[i + 2], px / w, py / h);
    if (weight <= 0) continue;
    const [, origS, origL] = rgbToHsl(orig[i], orig[i + 1], orig[i + 2]);
    const [nr, ng, nb] = hslToRgb(th, ts * 0.75 + origS * 0.25, origL);
    out[i]     = Math.round(orig[i]     + (nr - orig[i])     * weight);
    out[i + 1] = Math.round(orig[i + 1] + (ng - orig[i + 1]) * weight);
    out[i + 2] = Math.round(orig[i + 2] + (nb - orig[i + 2]) * weight);
  }
  return out;
};

/* ─── Color option helpers ───────────────────────────────── */
interface ColorOption { hex: string; name: string; isRecommended?: boolean; }

const buildOptions = (recs: DesignRecommendation[]): ColorOption[] => {
  const seen = new Set<string>();
  const out: ColorOption[] = [];
  recs.forEach(rec => {
    if (rec.primaryColorHex) {
      const hex = rec.primaryColorHex.toUpperCase();
      if (!seen.has(hex)) {
        seen.add(hex);
        out.push({ hex: rec.primaryColorHex, name: rec.primaryColor || rec.title, isRecommended: rec.label === 'Recommended' });
      }
    }
    rec.complementaryColors?.forEach(c => {
      const hex = c.hex.toUpperCase();
      if (!seen.has(hex)) { seen.add(hex); out.push({ hex: c.hex, name: c.name }); }
    });
  });
  return out;
};

/* ─── Component ──────────────────────────────────────────── */
interface Props {
  imageUrl: string;
  recommendations: DesignRecommendation[];
  category: string | null;
  externalHex?: string | null;
  externalName?: string;
}

export const WallColorVisualizer: React.FC<Props> = ({
  imageUrl, recommendations, category, externalHex, externalName,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const origPixels = useRef<Uint8ClampedArray | null>(null);
  const dims = useRef({ w: 0, h: 0 });

  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [processing, setProcessing] = useState(false);
  const [selHex, setSelHex] = useState<string | null>(null);
  const [selName, setSelName] = useState('');
  const [customHex, setCustomHex] = useState('#A3B899');
  const [showOrig, setShowOrig] = useState(false);
  const [previewing, setPreviewing] = useState(false);

  const colorOpts = useMemo(() => buildOptions(recommendations), [recommendations]);

  // ── Load image ────────────────────────────────────────────
  useEffect(() => {
    if (!imageUrl) return;
    setLoadState('loading');
    setSelHex(null); setPreviewing(false); origPixels.current = null;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const scale = Math.min(1, 800 / img.naturalWidth);
      const w = Math.round(img.naturalWidth * scale);
      const h = Math.round(img.naturalHeight * scale);
      canvas.width = w; canvas.height = h; dims.current = { w, h };
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, w, h);
      try {
        origPixels.current = new Uint8ClampedArray(ctx.getImageData(0, 0, w, h).data);
        setLoadState('ready');
      } catch { setLoadState('error'); }
    };
    img.onerror = () => setLoadState('error');
    img.src = imageUrl;
  }, [imageUrl]);

  // ── Apply color (declared before externalHex effect) ──────
  const applyColor = useCallback((hex: string) => {
    if (!origPixels.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    setProcessing(true);
    requestAnimationFrame(() => setTimeout(() => {
      const { w, h } = dims.current;
      const recolored = recolorWall(origPixels.current!, w, h, hex);
      if (recolored) {
        ctx.putImageData(new ImageData(new Uint8ClampedArray(recolored.buffer as ArrayBuffer), w, h), 0, 0);
      }
      setPreviewing(true); setProcessing(false);
    }, 10));
  }, []);

  // ── Respond to externalHex from parent ────────────────────
  useEffect(() => {
    if (!externalHex || loadState !== 'ready') return;
    setSelHex(externalHex);
    setSelName(externalName || externalHex);
    setShowOrig(false);
    applyColor(externalHex);
  }, [externalHex, externalName, loadState, applyColor]);

  // ── Restore original ──────────────────────────────────────
  const restore = useCallback(() => {
    if (!origPixels.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    const { w, h } = dims.current;
    ctx.putImageData(new ImageData(new Uint8ClampedArray(origPixels.current.buffer as ArrayBuffer), w, h), 0, 0);
  }, []);

  const handleClick = useCallback((opt: ColorOption) => {
    setSelHex(opt.hex); setSelName(opt.name); setShowOrig(false); applyColor(opt.hex);
  }, [applyColor]);

  const handleCustom = useCallback((hex: string) => {
    setCustomHex(hex); setSelHex(hex); setSelName('Custom'); setShowOrig(false); applyColor(hex);
  }, [applyColor]);

  const toggleOrig = useCallback(() => {
    if (!previewing) return;
    if (!showOrig) { restore(); setShowOrig(true); }
    else if (selHex) { applyColor(selHex); setShowOrig(false); }
  }, [showOrig, previewing, selHex, restore, applyColor]);

  const handleReset = useCallback(() => {
    restore(); setSelHex(null); setSelName(''); setShowOrig(false); setPreviewing(false);
  }, [restore]);

  const isPainting = category === 'painting' || category === null;

  return (
    <div className="card p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display font-semibold text-xl text-charcoal-800 flex items-center gap-2">
            <Palette className="w-5 h-5 text-sage-600" /> Compare Your Options
          </h2>
          <p className="text-sm text-charcoal-700 opacity-60 mt-0.5">
            {isPainting
              ? 'Click any colour to see it applied live on your uploaded photo.'
              : 'Colour preview is available for Painting & Walls projects.'}
          </p>
        </div>
        {previewing && (
          <div className="flex items-center gap-2">
            <button onClick={toggleOrig} className="btn-secondary !text-xs !py-2 !px-4">
              {showOrig ? <><Eye className="w-3.5 h-3.5" /> Preview</> : <><EyeOff className="w-3.5 h-3.5" /> Original</>}
            </button>
            <button onClick={handleReset} className="btn-secondary !text-xs !py-2 !px-4">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        )}
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden bg-cream-100 border border-warm-100 min-h-[120px]">
        {loadState === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center bg-cream-50 z-10">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-7 h-7 text-sage-500 animate-spin" />
              <span className="text-xs text-charcoal-700 opacity-60">Loading image…</span>
            </div>
          </div>
        )}
        {processing && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-7 h-7 text-sage-500 animate-spin" />
              <span className="text-xs text-charcoal-700 opacity-70">Applying colour…</span>
            </div>
          </div>
        )}
        {loadState === 'error' && (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <AlertCircle className="w-8 h-8 text-amber-500" />
            <p className="text-sm text-charcoal-700 font-medium">Preview Unavailable</p>
            <p className="text-xs text-charcoal-700 opacity-60 text-center max-w-xs">
              The image could not be loaded for recoloring (possible CORS restriction).
              Colour swatches below still represent your AI recommendations.
            </p>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className={`w-full h-auto block transition-opacity duration-300 ${loadState === 'ready' ? 'opacity-100' : 'opacity-0'}`}
          style={{ maxHeight: '420px' }}
        />
        {previewing && loadState === 'ready' && (
          <div className="absolute top-3 left-3">
            <div className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg ${showOrig ? 'bg-charcoal-800 text-white' : 'bg-sage-600 text-white'}`}>
              <span className="w-3 h-3 rounded-full border-2 border-white/60 flex-shrink-0" style={{ backgroundColor: showOrig ? '#999' : selHex || '#999' }} />
              {showOrig ? 'Original' : selName || 'Preview'}
            </div>
          </div>
        )}
      </div>

      {/* Non-painting note */}
      {!isPainting && (
        <div className="flex gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
          <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">Wall colour preview is for <strong>Painting / Walls</strong> projects. Browse the palette below for reference.</p>
        </div>
      )}

      {/* AI color swatches */}
      {colorOpts.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-charcoal-700 mb-3 uppercase tracking-wide">AI Recommended Colours</p>
          <div className="flex flex-wrap gap-3">
            {colorOpts.map(opt => {
              const active = selHex?.toUpperCase() === opt.hex.toUpperCase();
              return (
                <button
                  key={opt.hex}
                  onClick={() => handleClick(opt)}
                  title={`${opt.name} — ${opt.hex}`}
                  className={`group flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all duration-200 ${active ? 'border-sage-600 bg-sage-50 shadow-card' : 'border-warm-100 hover:border-sage-300 hover:shadow-sm bg-white'}`}
                >
                  <div className="w-10 h-10 rounded-lg shadow-inner transition-transform group-hover:scale-110" style={{ backgroundColor: opt.hex }} />
                  <span className="text-[10px] text-charcoal-700 text-center leading-tight max-w-[52px] font-medium">{opt.name}</span>
                  <span className="text-[9px] text-gray-400 font-mono">{opt.hex}</span>
                  {opt.isRecommended && <span className="text-[8px] bg-sage-100 text-sage-700 font-semibold px-1.5 py-0.5 rounded-full">★ Best</span>}
                  {active && <span className="text-[8px] bg-sage-600 text-white font-semibold px-1.5 py-0.5 rounded-full">✓ Active</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom Picker */}
      <div className="border-t border-warm-100 pt-4">
        <p className="text-xs font-semibold text-charcoal-700 mb-3 uppercase tracking-wide flex items-center gap-1.5">
          <Pipette className="w-3.5 h-3.5 text-sage-600" /> Choose Any Custom Colour
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <label className="cursor-pointer group relative" title="Open colour picker">
            <div className="w-14 h-14 rounded-xl border-4 border-white shadow-card transition-transform group-hover:scale-105 group-hover:shadow-card-hover" style={{ backgroundColor: customHex }} />
            <input type="color" value={customHex} onChange={e => handleCustom(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" aria-label="Custom colour picker" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-sage-600 rounded-full flex items-center justify-center shadow-sm">
              <Pipette className="w-2.5 h-2.5 text-white" />
            </div>
          </label>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-charcoal-700 opacity-50">#</span>
              <input
                type="text"
                value={customHex.replace('#', '')}
                maxLength={6}
                onChange={e => {
                  const val = '#' + e.target.value.replace(/[^0-9a-fA-F]/g, '');
                  if (val.length === 7) handleCustom(val);
                  else setCustomHex(val.length <= 7 ? val : customHex);
                }}
                className="form-input !py-2 !px-3 !text-sm font-mono w-32"
                placeholder="A3B899"
                aria-label="Hex colour value"
              />
              <button onClick={() => handleCustom(customHex)} className="btn-primary !text-xs !py-2 !px-4">Apply</button>
            </div>
            <p className="text-xs text-charcoal-700 opacity-50">Enter any 6-digit hex code or click the swatch to open the colour picker.</p>
          </div>
        </div>
      </div>

      {/* Demo note */}
      <div className="flex gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
        <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700 leading-relaxed">
          <strong>Demo Mode:</strong> Uses a brightness-preserving algorithm to simulate wall paint. For best results, upload a photo where the wall fills a significant area of the image.
        </p>
      </div>
    </div>
  );
};
