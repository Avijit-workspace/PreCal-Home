import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Filter, Star, Shield, Clock,
  ChevronDown, X, Phone, Calendar, Check, ArrowLeft
} from 'lucide-react';
import { mockProfessionals } from '../data/mockProfessionals';
import { useToast } from '../context/AppContext';
import type { Professional } from '../types';

const professionTypes = ['All', 'Painter', 'Interior Designer', 'Civil Contractor', 'Carpenter', 'Ceiling Specialist', 'Door & Window Installer', 'Electrician'];

const availabilityColor: Record<string, string> = {
  Available: 'bg-green-100 text-green-700',
  Limited: 'bg-amber-100 text-amber-700',
  Busy: 'bg-red-100 text-red-700',
};

// ---- Professional Card ----
const ProfessionalCard: React.FC<{ pro: Professional; onView: () => void; onBook: () => void }> = ({ pro, onView, onBook }) => (
  <div className="card-hover p-5">
    <div className="flex gap-4 mb-4">
      <img
        src={pro.avatar}
        alt={pro.name}
        className="w-14 h-14 rounded-xl bg-cream-200 flex-shrink-0"
        onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(pro.name)}&background=4a7c4a&color=fff`; }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-charcoal-800">{pro.name}</h3>
          {pro.verified && (
            <span className="flex items-center gap-0.5 text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
              <Shield className="w-2.5 h-2.5" /> Verified
            </span>
          )}
        </div>
        <p className="text-xs text-sage-600 font-medium">{pro.profession}</p>
        <p className="text-xs text-charcoal-700 opacity-60">{pro.specialization}</p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
      <div className="flex items-center gap-1.5 text-charcoal-700">
        <MapPin className="w-3 h-3 text-gray-400" />
        <span className="truncate">{pro.serviceArea}</span>
      </div>
      <div className="flex items-center gap-1.5 text-charcoal-700">
        <Clock className="w-3 h-3 text-gray-400" />
        <span>{pro.experience} yrs exp.</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Star className="w-3 h-3 fill-gold-400 text-gold-400" />
        <span className="font-semibold text-charcoal-800">{pro.rating}</span>
        <span className="text-gray-400">({pro.reviews})</span>
      </div>
      <div>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${availabilityColor[pro.availability]}`}>
          {pro.availability}
        </span>
      </div>
    </div>

    <div className="flex items-center justify-between mb-4">
      <div>
        <p className="text-xs text-charcoal-700 opacity-60">Starting from</p>
        <p className="font-semibold text-charcoal-800">₹{pro.startingPrice.toLocaleString('en-IN')}</p>
      </div>
      {pro.consultationFee === 0 ? (
        <span className="badge-green text-[10px]">Free Consultation</span>
      ) : (
        <div className="text-right">
          <p className="text-xs text-charcoal-700 opacity-60">Consultation</p>
          <p className="text-sm font-medium text-charcoal-800">₹{pro.consultationFee}</p>
        </div>
      )}
    </div>

    <div className="flex gap-2">
      <button onClick={onView} className="btn-outline !text-xs !py-2 flex-1 justify-center">
        View Profile
      </button>
      <button onClick={onBook} disabled={pro.availability === 'Busy'} className="btn-primary !text-xs !py-2 flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed">
        Book Now
      </button>
    </div>
  </div>
);

// ---- Profile Modal ----
const ProfileModal: React.FC<{ pro: Professional; onClose: () => void; onBook: () => void }> = ({ pro, onClose, onBook }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
    <div
      className="bg-white w-full sm:max-w-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto animate-slide-up"
      onClick={e => e.stopPropagation()}
    >
      <div className="p-6 border-b border-warm-100 flex items-start gap-4">
        <img
          src={pro.avatar}
          alt={pro.name}
          className="w-16 h-16 rounded-xl bg-cream-200 flex-shrink-0"
          onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(pro.name)}&background=4a7c4a&color=fff`; }}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-display font-bold text-xl text-charcoal-800">{pro.name}</h2>
            {pro.verified && (
              <span className="flex items-center gap-0.5 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                <Shield className="w-3 h-3" /> Verified
              </span>
            )}
          </div>
          <p className="text-sage-600 font-medium">{pro.profession} · {pro.specialization}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
            <span className="font-semibold text-sm">{pro.rating}</span>
            <span className="text-xs text-gray-400">({pro.reviews} reviews)</span>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="p-6 space-y-5">
        <div>
          <h4 className="font-semibold text-charcoal-800 mb-2 text-sm">About</h4>
          <p className="text-sm text-charcoal-700 opacity-80 leading-relaxed">{pro.bio}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-cream-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-0.5">Experience</p>
            <p className="font-semibold text-charcoal-800">{pro.experience} years</p>
          </div>
          <div className="bg-cream-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-0.5">Service Area</p>
            <p className="font-semibold text-charcoal-800 text-xs">{pro.serviceArea}</p>
          </div>
          <div className="bg-cream-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-0.5">Starting Price</p>
            <p className="font-semibold text-charcoal-800">₹{pro.startingPrice.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-cream-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-0.5">Availability</p>
            <p className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block ${availabilityColor[pro.availability]}`}>{pro.availability}</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-charcoal-800 mb-2 text-sm">Skills & Expertise</h4>
          <div className="flex flex-wrap gap-2">
            {pro.skills.map(s => (
              <span key={s} className="text-xs bg-sage-50 text-sage-700 border border-sage-200 px-2.5 py-1 rounded-full">{s}</span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-charcoal-800 mb-2 text-sm">Services Offered</h4>
          <div className="grid grid-cols-2 gap-1.5">
            {pro.services.map(s => (
              <div key={s} className="flex items-center gap-1.5 text-xs text-charcoal-700">
                <Check className="w-3 h-3 text-sage-600 flex-shrink-0" />
                {s}
              </div>
            ))}
          </div>
        </div>

        {pro.portfolio.length > 0 && (
          <div>
            <h4 className="font-semibold text-charcoal-800 mb-2 text-sm">Portfolio</h4>
            <div className="grid grid-cols-3 gap-2">
              {pro.portfolio.map((img, i) => (
                <img key={i} src={img} alt="Portfolio" className="rounded-lg aspect-square object-cover" />
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="font-semibold text-charcoal-800 mb-2 text-sm">Available Slots</h4>
          <div className="flex flex-wrap gap-2">
            {pro.slots.map(slot => (
              <span key={slot} className="text-xs bg-cream-100 text-charcoal-700 px-3 py-1.5 rounded-lg border border-warm-200">{slot}</span>
            ))}
          </div>
        </div>

        <button
          onClick={onBook}
          disabled={pro.availability === 'Busy'}
          className="btn-primary w-full justify-center py-3.5 disabled:opacity-50"
        >
          <Calendar className="w-4 h-4" /> Book Appointment
        </button>
      </div>
    </div>
  </div>
);

// ---- Booking Modal ----
const BookingModal: React.FC<{ pro: Professional; onClose: () => void }> = ({ pro, onClose }) => {
  const [form, setForm] = useState({ name: '', phone: '', location: '', category: '', date: '', slot: '', requirements: '' });
  const [confirmed, setConfirmed] = useState(false);
  const [refNumber] = useState(`RNO-${Math.floor(100000 + Math.random() * 900000)}`);
  const { showToast } = useToast();

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleConfirm = () => {
    if (!form.name || !form.phone || !form.date || !form.slot) {
      showToast('Please fill all required fields.', 'warning');
      return;
    }
    setConfirmed(true);
    showToast('Booking confirmed! 🎉', 'success');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-lg sm:rounded-2xl max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-warm-100 flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-charcoal-800">Book Appointment</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {!confirmed ? (
          <div className="p-6 space-y-4">
            {/* Professional Summary */}
            <div className="flex gap-3 p-3 bg-cream-50 rounded-xl">
              <img src={pro.avatar} alt={pro.name} className="w-10 h-10 rounded-lg bg-cream-200" onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(pro.name)}&background=4a7c4a&color=fff`; }} />
              <div>
                <p className="font-semibold text-sm text-charcoal-800">{pro.name}</p>
                <p className="text-xs text-charcoal-700 opacity-60">{pro.profession}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className="form-label">Your Name *</label><input type="text" className="form-input" placeholder="Full name" value={form.name} onChange={set('name')} /></div>
              <div><label className="form-label">Phone *</label><input type="tel" className="form-input" placeholder="9876543210" value={form.phone} onChange={set('phone')} /></div>
              <div><label className="form-label">Project Location</label><input type="text" className="form-input" placeholder="City, Area" value={form.location} onChange={set('location')} /></div>
              <div>
                <label className="form-label">Renovation Category</label>
                <select className="form-input" value={form.category} onChange={set('category')}>
                  <option value="">Select category</option>
                  {['Painting', 'Ceiling', 'Doors', 'Windows', 'Furniture', 'Full Renovation'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div><label className="form-label">Preferred Date *</label><input type="date" className="form-input" min={new Date().toISOString().split('T')[0]} value={form.date} onChange={set('date')} /></div>
              <div className="col-span-2">
                <label className="form-label">Preferred Time Slot *</label>
                <div className="flex flex-wrap gap-2">
                  {pro.slots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setForm(f => ({ ...f, slot }))}
                      className={`text-xs px-3 py-1.5 rounded-lg border-2 transition-all ${form.slot === slot ? 'border-sage-600 bg-sage-50 text-sage-700' : 'border-warm-200 text-charcoal-700 hover:border-sage-300'}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <label className="form-label">Additional Requirements</label>
                <textarea className="form-input resize-none" rows={2} placeholder="Any special requirements or questions…" value={form.requirements} onChange={set('requirements')} />
              </div>
            </div>

            <button onClick={handleConfirm} className="btn-primary w-full justify-center py-3.5">
              <Calendar className="w-4 h-4" /> Confirm Booking
            </button>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-sage-600" />
            </div>
            <h3 className="font-display font-bold text-2xl text-charcoal-800 mb-2">Booking Confirmed!</h3>
            <p className="text-charcoal-700 opacity-70 mb-4">Your appointment has been scheduled.</p>
            <div className="bg-cream-50 rounded-xl p-4 mb-4 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Reference No.</span>
                <span className="font-bold text-sage-600">{refNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Professional</span>
                <span className="font-semibold text-charcoal-800">{pro.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Date</span>
                <span className="font-semibold text-charcoal-800">{form.date}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Time</span>
                <span className="font-semibold text-charcoal-800">{form.slot}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className="badge-green text-xs">Pending Confirmation</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              This is a demo booking. In production, {pro.name} would be notified and would confirm your appointment.
            </p>
            <button onClick={onClose} className="btn-primary w-full justify-center">Done</button>
          </div>
        )}
      </div>
    </div>
  );
};

export const ProfessionalsPage: React.FC = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [searched, setSearched] = useState(false);
  const [profType, setProfType] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'distance'>('rating');
  const [selectedPro, setSelectedPro] = useState<Professional | null>(null);
  const [bookingPro, setBookingPro] = useState<Professional | null>(null);

  const filtered = useMemo(() => {
    let list = [...mockProfessionals];
    if (profType !== 'All') list = list.filter(p => p.profession === profType);
    if (minRating > 0) list = list.filter(p => p.rating >= minRating);
    list.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price') return a.startingPrice - b.startingPrice;
      if (sortBy === 'distance') return (a.distance || 99) - (b.distance || 99);
      return 0;
    });
    return list;
  }, [profType, minRating, sortBy]);

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-charcoal-700 hover:text-sage-600 mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="text-2xl lg:text-3xl font-display font-bold text-charcoal-800 mb-1">Find Professionals</h1>
      <p className="text-charcoal-700 opacity-70 mb-6">Connect with verified local renovation experts</p>

      {/* Location Search */}
      <div className="card p-5 mb-6">
        <h3 className="font-semibold text-charcoal-800 mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-sage-600" /> Your Location
        </h3>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              className="form-input pl-9"
              placeholder="Enter city, area, or PIN code…"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </div>
          <button
            onClick={() => { setSearched(true); }}
            className="btn-primary !py-2.5"
            id="search-professionals"
          >
            <Search className="w-4 h-4" /> Search
          </button>
          <button
            onClick={() => { setLocation('My Location'); setSearched(true); }}
            className="btn-secondary !py-2.5 !px-3"
            title="Use my current location"
          >
            <MapPin className="w-4 h-4" />
          </button>
        </div>
        {searched && <p className="text-xs text-sage-600 mt-2 flex items-center gap-1"><Check className="w-3 h-3" /> Showing professionals near "{location || 'your area'}"</p>}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-charcoal-600" />
          <span className="text-sm font-medium text-charcoal-700">Filter:</span>
        </div>

        {/* Profession */}
        <div className="relative">
          <select
            className="appearance-none bg-white border border-warm-200 rounded-xl text-sm px-4 py-2 pr-8 text-charcoal-700 focus:border-sage-500 focus:ring-2 focus:ring-sage-100"
            value={profType}
            onChange={e => setProfType(e.target.value)}
          >
            {professionTypes.map(t => <option key={t}>{t}</option>)}
          </select>
          <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Rating */}
        <div className="relative">
          <select
            className="appearance-none bg-white border border-warm-200 rounded-xl text-sm px-4 py-2 pr-8 text-charcoal-700 focus:border-sage-500 focus:ring-2 focus:ring-sage-100"
            value={minRating}
            onChange={e => setMinRating(Number(e.target.value))}
          >
            <option value={0}>All Ratings</option>
            <option value={4}>4+ Stars</option>
            <option value={4.5}>4.5+ Stars</option>
          </select>
          <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Sort */}
        <div className="relative ml-auto">
          <span className="text-sm font-medium text-charcoal-700 mr-2">Sort by:</span>
          <select
            className="appearance-none bg-white border border-warm-200 rounded-xl text-sm px-4 py-2 pr-8 text-charcoal-700 focus:border-sage-500 focus:ring-2 focus:ring-sage-100"
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
          >
            <option value="rating">Rating</option>
            <option value="price">Price (Low to High)</option>
            <option value="distance">Distance</option>
          </select>
          <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <p className="text-sm text-charcoal-700 opacity-60 mb-4">{filtered.length} professionals found</p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(pro => (
          <ProfessionalCard
            key={pro.id}
            pro={pro}
            onView={() => setSelectedPro(pro)}
            onBook={() => setBookingPro(pro)}
          />
        ))}
      </div>

      {/* Modals */}
      {selectedPro && (
        <ProfileModal
          pro={selectedPro}
          onClose={() => setSelectedPro(null)}
          onBook={() => { setBookingPro(selectedPro); setSelectedPro(null); }}
        />
      )}
      {bookingPro && (
        <BookingModal
          pro={bookingPro}
          onClose={() => setBookingPro(null)}
        />
      )}
    </div>
  );
};
