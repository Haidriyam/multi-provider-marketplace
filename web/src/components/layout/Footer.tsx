import React from 'react';
import Link from 'next/link';
import { Compass, ShieldCheck, Crown, Mail, Phone, MapPin, Award, Globe, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-obsidian-999 text-slate-400 text-sm border-t border-gold-500/20 relative overflow-hidden">
      {/* Decorative Gold Glow in Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-gold-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* VIP Concierge VIP Banner */}
      <div className="border-b border-gold-500/10 py-6 px-4 sm:px-6 lg:px-8 bg-obsidian-950/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <Crown className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <h4 className="text-sm font-cinzel font-bold text-white tracking-wider">
                Emirates-Grade Royal Concierge & Private Dispatch
              </h4>
              <p className="text-xs text-slate-400">
                24/7 Bespoke booking assistance for high-altitude charters, luxury suites & helicopter transfers.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2 text-gold-300 font-semibold">
              <Phone className="w-3.5 h-3.5 text-gold-400" />
              <span>Direct Concierge: +971 4 214 4444</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-slate-400">
              <Globe className="w-3.5 h-3.5 text-gold-500/70" />
              <span>Hubs: Dubai • Islamabad • London</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand Info (2 columns) */}
          <div className="md:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-700 p-0.5 shadow-gold-sm">
                <div className="w-full h-full bg-obsidian-950 rounded-[10px] flex items-center justify-center text-gold-400">
                  <Compass className="w-5 h-5 stroke-[1.75]" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-cinzel text-lg font-bold tracking-wider text-white">
                  FARADAY <span className="gold-text-gradient font-black">ROYAL</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-gold-400/90 font-medium -mt-1">
                  Private Expeditions & Suites
                </span>
              </div>
            </Link>

            <p className="text-xs leading-relaxed text-slate-400 font-light max-w-sm">
              The premier verified marketplace platform connecting high-net-worth explorers with licensed mountain guides, private charters, and high-end hospitality operators.
            </p>

            <div className="flex items-center gap-2.5 text-xs text-gold-300 bg-obsidian-900/90 p-3 rounded-xl border border-gold-500/25 w-fit shadow-gold-sm">
              <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
              <span className="font-medium">100% Government Audited & Licensed Providers</span>
            </div>
          </div>

          {/* Luxury Destinations */}
          <div>
            <h4 className="text-xs font-cinzel font-bold text-gold-300 uppercase tracking-widest mb-4">
              Prestigious Destinations
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/search?destination=hunza-valley" className="hover:text-gold-400 transition flex items-center gap-1.5">
                  <span className="text-gold-500/60">›</span> Hunza Royal Valley
                </Link>
              </li>
              <li>
                <Link href="/search?destination=skardu-deosai" className="hover:text-gold-400 transition flex items-center gap-1.5">
                  <span className="text-gold-500/60">›</span> Skardu & Deosai Sanctuary
                </Link>
              </li>
              <li>
                <Link href="/search?destination=gwadar-astola" className="hover:text-gold-400 transition flex items-center gap-1.5">
                  <span className="text-gold-500/60">›</span> Gwadar & Arabian Sea Coast
                </Link>
              </li>
              <li>
                <Link href="/search?destination=swat-valley" className="hover:text-gold-400 transition flex items-center gap-1.5">
                  <span className="text-gold-500/60">›</span> Swat Emerald Highlands
                </Link>
              </li>
              <li>
                <Link href="/search?destination=kumrat-valley" className="hover:text-gold-400 transition flex items-center gap-1.5">
                  <span className="text-gold-500/60">›</span> Kumrat Alpine Forests
                </Link>
              </li>
            </ul>
          </div>

          {/* Royal Categories */}
          <div>
            <h4 className="text-xs font-cinzel font-bold text-gold-300 uppercase tracking-widest mb-4">
              Curated Collections
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/search?category=trekking-expeditions" className="hover:text-gold-400 transition flex items-center gap-1.5">
                  <span className="text-gold-500/60">›</span> Karakoram Glacier Treks
                </Link>
              </li>
              <li>
                <Link href="/search?category=cultural-heritage" className="hover:text-gold-400 transition flex items-center gap-1.5">
                  <span className="text-gold-500/60">›</span> Royal Palaces & Silk Route
                </Link>
              </li>
              <li>
                <Link href="/search?category=coastal-watersports" className="hover:text-gold-400 transition flex items-center gap-1.5">
                  <span className="text-gold-500/60">›</span> Private Yacht & Scuba Charters
                </Link>
              </li>
              <li>
                <Link href="/search?category=wildlife-safari" className="hover:text-gold-400 transition flex items-center gap-1.5">
                  <span className="text-gold-500/60">›</span> Snow Leopard & Eco Safaris
                </Link>
              </li>
              <li>
                <Link href="/search?hasDiscount=true" className="hover:text-gold-400 transition flex items-center gap-1.5 text-gold-400 font-semibold">
                  <span className="text-gold-400">★</span> VIP Offers & Seasonal Privileges
                </Link>
              </li>
            </ul>
          </div>

          {/* Governance & Discretion */}
          <div>
            <h4 className="text-xs font-cinzel font-bold text-gold-300 uppercase tracking-widest mb-4">
              Platform & Governance
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/about" className="hover:text-gold-400 transition">About Our Marketplace</Link></li>
              <li><Link href="/compare" className="hover:text-gold-400 transition">Interactive Package Comparison</Link></li>
              <li><Link href="/faq" className="hover:text-gold-400 transition">Provider Accreditation FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-gold-400 transition">Concierge Support & Dispatch</Link></li>
              <li><Link href="/terms" className="hover:text-gold-400 transition">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-gold-400 transition">Privacy & Discretion Charter</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gold-500/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light">
          <p className="text-slate-500">
            © 2026 Faraday Royal Expeditions. All intellectual property, data and infrastructure remain under client ownership.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5 text-gold-400/90 font-medium">
              <Award className="w-3.5 h-3.5 text-gold-400" /> Emirates-Level Luxury Standard
            </span>
            <span className="text-slate-700">•</span>
            <span className="text-slate-500">PKR / USD Multi-Currency</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
