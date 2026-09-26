import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Upload, Brain, Users, Sparkles, Shield, Leaf, BarChart3,
  Star, Play, ChevronRight, Check, Camera, Palette, Ruler, Clock
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

// Hero Image URLs from Unsplash
const HERO_IMAGE = 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1400&q=85&auto=format&fit=crop';
const BEFORE_IMAGE = 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=700&q=80&auto=format&fit=crop';
const AFTER_IMAGE = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=700&q=80&auto=format&fit=crop';

const steps = [
  { icon: <Upload className="w-6 h-6" />, title: 'Upload Your Space', desc: 'Upload a photo of your wall, ceiling, door, window, or furniture to begin.', color: 'bg-blue-50 text-blue-600' },
  { icon: <Palette className="w-6 h-6" />, title: 'Choose Your Preferences', desc: 'Select your budget range, design style, and property type.', color: 'bg-sage-50 text-sage-600' },
  { icon: <Brain className="w-6 h-6" />, title: 'Get AI Analysis', desc: 'Receive design recommendations, material estimates, and a detailed budget breakdown.', color: 'bg-amber-50 text-amber-600' },
  { icon: <Users className="w-6 h-6" />, title: 'Book Professionals', desc: 'Connect with verified local renovation experts and schedule your project.', color: 'bg-purple-50 text-purple-600' },
];

const features = [
  { icon: <Camera className="w-6 h-6" />, title: 'AI Image Analysis', desc: 'Upload any room photo and let our AI identify dimensions, materials, and renovation opportunities.', color: 'from-blue-500 to-blue-600' },
  { icon: <Sparkles className="w-6 h-6" />, title: 'Smart Design Recommendations', desc: 'Get personalized colour palettes, material suggestions, and design ideas tailored to your style and budget.', color: 'from-sage-500 to-sage-600' },
  { icon: <Ruler className="w-6 h-6" />, title: 'Automated Bill of Materials', desc: 'Auto-generate a complete material list with quantities and specifications — ready for procurement.', color: 'from-amber-500 to-amber-600' },
  { icon: <BarChart3 className="w-6 h-6" />, title: 'Budget & Cost Estimation', desc: 'Transparent cost breakdowns across materials, labour, and logistics. Compare Luxury, Moderate, and Budget tiers.', color: 'from-rose-500 to-rose-600' },
  { icon: <Users className="w-6 h-6" />, title: 'Local Professional Booking', desc: 'Browse verified painters, carpenters, contractors, and designers in your area and book appointments.', color: 'from-indigo-500 to-indigo-600' },
  { icon: <Leaf className="w-6 h-6" />, title: 'Sustainable Renovation', desc: 'Optimised material quantities to minimise waste. Eco-friendly alternatives highlighted across all categories.', color: 'from-emerald-500 to-emerald-600' },
];

const testimonials = [
  { name: 'Arjun Mehta', location: 'Bengaluru', rating: 5, text: 'PreCal Home saved me ₹40,000 by giving me an accurate material estimate before I even spoke to a contractor. Absolutely game-changing!', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun&backgroundColor=b6e3f4' },
  { name: 'Meena Krishnan', location: 'Chennai', rating: 5, text: 'I was completely lost on what colour to paint my living room. The AI recommendations were spot-on and I love the result!', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Meena&backgroundColor=ffdfbf' },
  { name: 'Sumit Ghosh', location: 'Kolkata', rating: 5, text: 'Found an amazing carpenter through PreCal Home. The whole process from analysis to booking took less than 20 minutes.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sumit&backgroundColor=c0aede' },
];

// Before-After Comparison Slider
const BeforeAfterSlider: React.FC = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePos = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setSliderPos(pct);
  };

  const onMouseDown = () => { isDragging.current = true; };
  const onMouseMove = (e: React.MouseEvent) => { if (isDragging.current) updatePos(e.clientX); };
  const onMouseUp = () => { isDragging.current = false; };
  const onTouchMove = (e: React.TouchEvent) => { updatePos(e.touches[0].clientX); };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video rounded-2xl overflow-hidden cursor-col-resize select-none shadow-premium"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchMove={onTouchMove}
    >
      {/* After image (full) */}
      <img src={AFTER_IMAGE} alt="After renovation" className="absolute inset-0 w-full h-full object-cover" />
      {/* Before image (clipped) */}
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
        <img src={BEFORE_IMAGE} alt="Before renovation" className="absolute inset-0 w-full h-full object-cover" />
      </div>
      {/* Divider */}
      <div className="absolute inset-y-0 w-0.5 bg-white shadow-lg" style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-premium flex items-center justify-center">
          <ChevronRight className="w-3 h-3 text-charcoal-700 absolute right-1" />
          <ChevronRight className="w-3 h-3 text-charcoal-700 absolute left-1 rotate-180" />
        </div>
      </div>
      {/* Labels */}
      <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full text-xs font-semibold text-charcoal-800">Before</div>
      <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full text-xs font-semibold text-charcoal-800">After</div>
    </div>
  );
};

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setHeroLoaded(true);
    img.src = HERO_IMAGE;
  }, []);

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          {heroLoaded ? (
            <img src={HERO_IMAGE} alt="Modern interior" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-charcoal-800 to-charcoal-900 animate-pulse" />
          )}
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="max-w-2xl">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-3 glass px-5 py-2.5 rounded-full mb-8 animate-fade-in border border-white/20 shadow-xl backdrop-blur-md">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-sage-400"></span>
              </div>
              <span className="text-sm font-semibold tracking-wide text-white uppercase letter-spacing-1">The Future of Smart Renovation</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold text-white leading-[1.1] mb-8 animate-slide-up drop-shadow-2xl">
              Precision Material Estimates for
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 mt-2">
                Your Dream Space
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-200 leading-relaxed mb-10 animate-slide-up animate-delay-100 max-w-xl font-light">
              Eliminate guesswork from your interior projects. Experience instant AI-driven material calculations, accurate cost breakdowns, and seamless connections with elite professionals.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-5 animate-slide-up animate-delay-200">
              <button
                onClick={() => navigate('/register')}
                className="btn-gold !text-base !px-8 !py-4 shadow-[0_0_30px_rgba(212,160,23,0.3)] hover:shadow-[0_0_40px_rgba(212,160,23,0.5)] hover:-translate-y-1 transition-all duration-300"
              >
                <Sparkles className="w-5 h-5" />
                Start Free Analysis
              </button>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center justify-center gap-2 glass px-8 py-4 rounded-xl text-base font-semibold text-white hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 border border-white/30"
              >
                <Play className="w-5 h-5" />
                Explore How It Works
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 mt-12 animate-slide-up animate-delay-300">
              {['Zero Upfront Cost', '100% AI-Verified', 'Seamless Booking'].map(badge => (
                <div key={badge} className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-white/10 shadow-md">
                  <div className="bg-sage-500/20 p-1 rounded-full">
                    <Check className="w-3.5 h-3.5 text-sage-300" />
                  </div>
                  <span className="text-sm text-gray-100 font-medium">{badge}</span>
                </div>
              ))}
            </div>
          </div>


        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="bg-charcoal-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '10,000+', label: 'Analyses Done' },
              { value: '500+', label: 'Verified Professionals' },
              { value: '98%', label: 'Customer Satisfaction' },
              { value: '₹2Cr+', label: 'Saved on Materials' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-2xl font-display font-bold text-gold-400">{stat.value}</div>
                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="badge-green mb-4">Simple Process</span>
            <h2 className="section-heading mt-3">How It Works</h2>
            <p className="section-subheading mt-4 max-w-2xl mx-auto">
              From photo to professional booking in four simple steps. No expertise required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="relative card-hover p-6 text-center group">
                {/* Step number */}
                <div className="absolute -top-3 -right-3 w-7 h-7 bg-charcoal-800 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {i + 1}
                </div>
                <div className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  {step.icon}
                </div>
                <h3 className="font-display font-semibold text-lg text-charcoal-800 mb-2">{step.title}</h3>
                <p className="text-sm text-charcoal-700 opacity-70 leading-relaxed">{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                    <ArrowRight className="w-5 h-5 text-sage-400" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button onClick={() => navigate('/register')} className="btn-primary">
              Get Started Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="badge-gold mb-4">Platform Features</span>
            <h2 className="section-heading mt-3">Everything You Need for a Perfect Renovation</h2>
            <p className="section-subheading mt-4 max-w-2xl mx-auto">
              Powerful AI tools combined with practical renovation expertise to guide you from concept to completion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="card-hover p-6 group">
                <div className={`w-12 h-12 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="font-display font-semibold text-lg text-charcoal-800 mb-2">{f.title}</h3>
                <p className="text-sm text-charcoal-700 opacity-70 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER SHOWCASE */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge-green mb-4">Transformation Showcase</span>
              <h2 className="section-heading mt-3 mb-4">See the Difference AI Planning Makes</h2>
              <p className="section-subheading mb-6">
                Drag the slider to compare real renovation transformations powered by PreCal Home's intelligent design recommendations.
              </p>
              <ul className="space-y-3 mb-8">
                {['Precise colour selection with AI analysis', 'Material cost optimised by 30%', 'Completed in 5 days vs. 2-week estimate'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-charcoal-700">
                    <Check className="w-4 h-4 text-sage-600 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/register')} className="btn-primary">
                Start My Transformation <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <BeforeAfterSlider />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="badge-green mb-4">What Homeowners Say</span>
            <h2 className="section-heading mt-3">Trusted by Thousands Across India</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="card-hover p-6">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <p className="text-sm text-charcoal-700 leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full bg-cream-200" />
                  <div>
                    <p className="text-sm font-semibold text-charcoal-800">{t.name}</p>
                    <p className="text-xs text-charcoal-700 opacity-60">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-gradient-sage text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
            <Clock className="w-4 h-4 text-gold-300" />
            <span className="text-sm font-medium">Get your analysis in under 2 minutes</span>
          </div>
          <h2 className="text-4xl font-display font-bold mb-4">Your Dream Home Starts with One Photo.</h2>
          <p className="text-lg text-green-100 mb-8 leading-relaxed">
            Upload a photo of your space right now and receive AI-powered design recommendations, accurate material estimates, and a budget breakdown — completely free.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="flex items-center gap-2 bg-white text-sage-700 font-semibold px-8 py-4 rounded-xl hover:bg-cream-100 transition-all shadow-premium hover:shadow-card-hover"
            >
              <Sparkles className="w-4 h-4" />
              Get Started — It's Free
            </button>
            <Link to="/professionals" className="flex items-center gap-2 glass px-8 py-4 rounded-xl font-semibold text-white border border-white/30 hover:bg-white/20 transition-all">
              <Users className="w-4 h-4" />
              Find Professionals
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
