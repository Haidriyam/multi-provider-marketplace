import React from 'react';
import Link from 'next/link';
import { Compass, ShieldCheck, Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Faraday<span className="text-emerald-500">Expeditions</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400">
              The modern, multi-provider marketplace connecting explorers with verified tour operators, mountain guides, and coastal expeditions.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-900/60 w-fit">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>100% Verified Service Providers</span>
            </div>
          </div>

          {/* Popular Destinations */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Popular Destinations</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/search?destination=hunza-valley" className="hover:text-emerald-400 transition">Hunza Valley</Link></li>
              <li><Link href="/search?destination=skardu-deosai" className="hover:text-emerald-400 transition">Skardu & Deosai Plains</Link></li>
              <li><Link href="/search?destination=gwadar-astola" className="hover:text-emerald-400 transition">Gwadar & Astola Coast</Link></li>
              <li><Link href="/search?destination=swat-valley" className="hover:text-emerald-400 transition">Swat Emerald Valley</Link></li>
              <li><Link href="/search?destination=kumrat-valley" className="hover:text-emerald-400 transition">Kumrat Valley</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Top Categories</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/search?category=trekking-expeditions" className="hover:text-emerald-400 transition">Mountain Trekking</Link></li>
              <li><Link href="/search?category=cultural-heritage" className="hover:text-emerald-400 transition">Cultural & Heritage Tours</Link></li>
              <li><Link href="/search?category=coastal-watersports" className="hover:text-emerald-400 transition">Coastal & Scuba Diving</Link></li>
              <li><Link href="/search?category=wildlife-safari" className="hover:text-emerald-400 transition">Wildlife & Eco Safaris</Link></li>
              <li><Link href="/search?hasDiscount=true" className="hover:text-amber-400 transition font-semibold">Special Offers & Discounts</Link></li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Platform & Trust</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/about" className="hover:text-emerald-400 transition">About Our Platform</Link></li>
              <li><Link href="/faq" className="hover:text-emerald-400 transition">How It Works / FAQs</Link></li>
              <li><Link href="/contact" className="hover:text-emerald-400 transition">Contact & Support</Link></li>
              <li><Link href="/terms" className="hover:text-emerald-400 transition">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-emerald-400 transition">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 Faraday Expeditions Marketplace. All rights reserved. Client technical ownership guaranteed.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-500">PKR Currency</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-500">Modular Monolith Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
