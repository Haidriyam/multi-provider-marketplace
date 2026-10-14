import React from 'react';
import Link from 'next/link';
import { Compass, ShieldCheck, Crown, Mail, Phone, MapPin, Award, Globe, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#f5f2eb] text-slate-600 text-sm border-t border-gold-400/25 relative overflow-hidden w-full">
      
      {/* VIP Concierge VIP Banner - Light Luxury */}
      <div className="border-b border-gold-400/20 py-5 px-4 sm:px-6 lg:px-8 bg-white/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-300/50 flex items-center justify-center text-gold-700 shrink-0 shadow-xs">
              <Crown className="w-5 h-5 text-gold-600" />
            </div>
            <div>
              <h4 className="text-sm font-cinzel font-bold text-slate-950 tracking-wider">
                Emirates-Grade Royal Concierge & Private Dispatch
              </h4>
              <p className="text-xs text-slate-500 font-light">
                24/7 Bespoke booking assistance for high-altitude charters, luxury suites & helicopter transfers.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
            <div className="flex items-center gap-2 text-gold-800 font-bold">
              <Phone className="w-3.5 h-3.5 text-gold-600 shrink-0" />
              <span>Direct Concierge: +971 4 214 4444</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-slate-500">
              <Globe className="w-3.5 h-3.5 text-gold-600 shrink-0" />
              <span>Global Hubs: Dubai • Islamabad • London</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10 mb-10">
          
          {/* Brand Info (2 columns on large screens) */}
          <div className="sm:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-700 p-0.5 shadow-xs shrink-0">
                <div className="w-full h-full bg-[#080c16] rounded-[10px] flex items-center justify-center text-gold-400">
                  <Compass className="w-5 h-5 stroke-[1.75]" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-cinzel text-lg font-bold tracking-wider text-slate-950">
                  FARADAY <span className="gold-text-gradient font-black">ROYAL</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-gold-700 font-semibold -mt-1">
                  Private Expeditions & Suites
                </span>
              </div>
            </Link>

            <p className="text-xs leading-relaxed text-slate-600 font-light max-w-sm">
              The premier verified marketplace platform connecting discerning travelers with government-audited mountain guides, private charters, and high-end hospitality operators.
            </p>

            <div className="flex items-center gap-2.5 text-xs text-slate-800 bg-white p-3 rounded-xl border border-slate-200/90 w-fit shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">100% Government Audited & Licensed Providers</span>
            </div>
          </div>

          {/* Luxury Destinations */}
          <div>
            <h4 className="text-xs font-cinzel font-bold text-slate-950 uppercase tracking-widest mb-3.5">
              Prestigious Destinations
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/search?destination=hunza-valley" className="hover:text-gold-700 transition flex items-center gap-1.5">
                  <span className="text-gold-600">›</span> Hunza Royal Valley
                </Link>
              </li>
              <li>
                <Link href="/search?destination=skardu-deosai" className="hover:text-gold-700 transition flex items-center gap-1.5">
                  <span className="text-gold-600">›</span> Skardu & Deosai Sanctuary
                </Link>
              </li>
              <li>
                <Link href="/search?destination=gwadar-astola" className="hover:text-gold-700 transition flex items-center gap-1.5">
                  <span className="text-gold-600">›</span> Gwadar & Arabian Sea Coast
                </Link>
              </li>
              <li>
                <Link href="/search?destination=swat-valley" className="hover:text-gold-700 transition flex items-center gap-1.5">
                  <span className="text-gold-600">›</span> Swat Emerald Highlands
                </Link>
              </li>
              <li>
                <Link href="/search?destination=kumrat-valley" className="hover:text-gold-700 transition flex items-center gap-1.5">
                  <span className="text-gold-600">›</span> Kumrat Alpine Forests
                </Link>
              </li>
            </ul>
          </div>

          {/* Curated Collections */}
          <div>
            <h4 className="text-xs font-cinzel font-bold text-slate-950 uppercase tracking-widest mb-3.5">
              Curated Collections
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/search?category=trekking-expeditions" className="hover:text-gold-700 transition flex items-center gap-1.5">
                  <span className="text-gold-600">›</span> Karakoram Glacier Treks
                </Link>
              </li>
              <li>
                <Link href="/search?category=cultural-heritage" className="hover:text-gold-700 transition flex items-center gap-1.5">
                  <span className="text-gold-600">›</span> Royal Palaces & Silk Route
                </Link>
              </li>
              <li>
                <Link href="/search?category=coastal-watersports" className="hover:text-gold-700 transition flex items-center gap-1.5">
                  <span className="text-gold-600">›</span> Private Yacht & Scuba Charters
                </Link>
              </li>
              <li>
                <Link href="/search?category=wildlife-safari" className="hover:text-gold-700 transition flex items-center gap-1.5">
                  <span className="text-gold-600">›</span> Snow Leopard & Eco Safaris
                </Link>
              </li>
              <li>
                <Link href="/search?hasDiscount=true" className="hover:text-gold-800 transition flex items-center gap-1.5 text-gold-700 font-bold">
                  <span className="text-gold-600">★</span> VIP Seasonal Privileges
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Governance */}
          <div>
            <h4 className="text-xs font-cinzel font-bold text-slate-950 uppercase tracking-widest mb-3.5">
              Platform & Governance
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/about" className="hover:text-gold-700 transition">About Our Marketplace</Link></li>
              <li><Link href="/compare" className="hover:text-gold-700 transition">Interactive Package Comparison</Link></li>
              <li><Link href="/faq" className="hover:text-gold-700 transition">Provider Accreditation FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-gold-700 transition">Concierge Support & Dispatch</Link></li>
              <li><Link href="/terms" className="hover:text-gold-700 transition">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-gold-700 transition">Privacy & Discretion Charter</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-slate-500">
          <p>© 2026 Faraday Royal Expeditions. All intellectual property, data and infrastructure remain under client ownership.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-gold-800 font-semibold">
              <Award className="w-3.5 h-3.5 text-gold-600" /> Emirates-Level Luxury Standard
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-medium">PKR / USD Multi-Currency</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
