import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const footerLinks = {
  Company: [
    { label: 'About PreCal Home', href: '/#about' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Features', href: '/#features' },
    { label: 'Careers', href: '#' },
  ],
  Services: [
    { label: 'AI Room Analysis', href: '/analysis' },
    { label: 'Find Professionals', href: '/professionals' },
    { label: 'Material Estimator', href: '/analysis' },
    { label: 'Cost Calculator', href: '/analysis' },
  ],
  Support: [
    { label: 'Help Center', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
};

export const Footer: React.FC = () => (
  <footer className="bg-charcoal-900 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-sage rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-display font-bold text-xl">
              PreCal <span className="text-sage-400">Home</span>
            </span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed mb-2 italic font-display">
            "Design Smarter. Build Better. Spend Wisely."
          </p>
          <p className="text-sm text-gray-400 leading-relaxed mb-5">
            India's AI-powered home renovation planning platform. Transform any space with intelligent design recommendations, accurate material estimates, and trusted professionals.
          </p>
          <div className="flex items-center gap-1 text-xs text-sage-400">
            <Leaf className="w-3 h-3" />
            <span>Committed to sustainable renovation practices</span>
          </div>

        </div>

        {/* Links */}
        {Object.entries(footerLinks).map(([section, links]) => (
          <div key={section}>
            <h4 className="text-sm font-semibold text-white mb-4">{section}</h4>
            <ul className="space-y-2">
              {links.map(link => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-gray-400 hover:text-sage-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-charcoal-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} PreCal Home Technologies Pvt. Ltd. All rights reserved.
        </p>
        <p className="text-xs text-gray-500">
          AI analysis results are illustrative. Consult professionals for accurate assessments.
        </p>
      </div>
    </div>
  </footer>
);
