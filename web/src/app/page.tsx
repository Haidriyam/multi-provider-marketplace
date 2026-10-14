'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  Compass, 
  ShieldCheck, 
  Star, 
  Calendar, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Mountain,
  Landmark,
  Waves,
  Trees,
  Tag,
  Crown,
  Award,
  PhoneCall,
  Check
} from 'lucide-react';
import { api } from '@/lib/api';

export default function HomePage() {
  const router = useRouter();
  const [destinations, setDestinations] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredListings, setFeaturedListings] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search form state
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [destRes, catRes, listRes, bannerRes] = await Promise.all([
          api.getDestinations(),
          api.getCategories(),
          api.getListings({ limit: 6, sortBy: 'featured' }),
          api.getBanners().catch(() => ({ data: [] })),
        ]);

        if (destRes.success) setDestinations(destRes.data || []);
        if (catRes.success) setCategories(catRes.data || []);
        if (listRes.success) setFeaturedListings(listRes.data || []);
        if (bannerRes.success) setBanners(bannerRes.data || []);
      } catch (err) {
        console.error('Error loading homepage data', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchKeyword) params.append('search', searchKeyword);
    if (selectedDestination) params.append('destination', selectedDestination);
    if (selectedCategory) params.append('category', selectedCategory);
    router.push(`/search?${params.toString()}`);
  };

  const getCategoryIcon = (name: string) => {
    if (name.includes('Mountain') || name.includes('Trek')) return <Mountain className="w-5 h-5 text-gold-400" />;
    if (name.includes('Culture') || name.includes('Heritage')) return <Landmark className="w-5 h-5 text-gold-400" />;
    if (name.includes('Coast') || name.includes('Water')) return <Waves className="w-5 h-5 text-gold-400" />;
    if (name.includes('Wildlife') || name.includes('Safari')) return <Trees className="w-5 h-5 text-gold-400" />;
    return <Compass className="w-5 h-5 text-gold-400" />;
  };

  return (
    <div className="space-y-20 pb-24 bg-obsidian-950 text-slate-100">
      
      {/* EMIRATES-GRADE HERO SUITE */}
      <section className="relative min-h-[640px] lg:min-h-[700px] flex items-center justify-center overflow-hidden py-20 px-4">
        {/* Background Panoramic Imagery with Luxury Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=90"
            alt="Karakoram and Himalayan High-Altitude Peaks"
            className="w-full h-full object-cover object-center scale-105 transition duration-1000 opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/70 to-obsidian-999/85" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-7">
          
          {/* Royal Crest Tagline */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-obsidian-900/90 border border-gold-500/40 text-gold-300 text-xs font-semibold uppercase tracking-widest shadow-gold-sm backdrop-blur-md">
            <Crown className="w-3.5 h-3.5 text-gold-400" />
            <span>Emirates-Grade Luxury Marketplace</span>
            <span className="text-gold-500/60">•</span>
            <span className="text-slate-300">Phase 1 Verified Fleet</span>
          </div>

          {/* Majestic Heading */}
          <h1 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
            Fly First Class Across <br className="hidden sm:block" />
            <span className="gold-text-gradient">
              The Peaks, Valleys & Oases
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-light">
            Connecting discerning world travelers with audited expedition operators, private helicopter charters, and bespoke alpine suites. Transparent royal pricing with zero middleman markups.
          </p>

          {/* LUXURY SEARCH DESK WIDGET */}
          <div className="max-w-4xl mx-auto glass-obsidian rounded-2xl p-3 sm:p-5 shadow-2xl border border-gold-500/30 text-slate-100 text-left mt-8">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Destination */}
              <div className="p-3 rounded-xl bg-obsidian-900/80 border border-gold-500/20 hover:border-gold-400 transition">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gold-400 mb-1 flex items-center gap-1.5 font-cinzel">
                  <MapPin className="w-3.5 h-3.5 text-gold-400" />
                  Destination
                </label>
                <select
                  value={selectedDestination}
                  onChange={(e) => setSelectedDestination(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-slate-100 focus:outline-none cursor-pointer"
                >
                  <option value="" className="bg-obsidian-900 text-slate-200">All Prestigious Valleys</option>
                  {destinations.map((d) => (
                    <option key={d.id} value={d.slug} className="bg-obsidian-900 text-slate-200">{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div className="p-3 rounded-xl bg-obsidian-900/80 border border-gold-500/20 hover:border-gold-400 transition">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gold-400 mb-1 flex items-center gap-1.5 font-cinzel">
                  <Compass className="w-3.5 h-3.5 text-gold-400" />
                  Collection
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-slate-100 focus:outline-none cursor-pointer"
                >
                  <option value="" className="bg-obsidian-900 text-slate-200">All Curated Collections</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug} className="bg-obsidian-900 text-slate-200">{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Keyword */}
              <div className="p-3 rounded-xl bg-obsidian-900/80 border border-gold-500/20 hover:border-gold-400 transition">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gold-400 mb-1 flex items-center gap-1.5 font-cinzel">
                  <Search className="w-3.5 h-3.5 text-gold-400" />
                  Bespoke Keywords
                </label>
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="e.g. Scuba, Glaciers, VIP 4x4"
                  className="w-full bg-transparent text-sm font-semibold text-slate-100 focus:outline-none placeholder:text-slate-500 placeholder:font-normal"
                />
              </div>

              {/* Luxury CTA Button */}
              <div className="flex items-center">
                <button
                  type="submit"
                  className="w-full h-full min-h-[50px] rounded-xl bg-gradient-to-r from-gold-400 via-gold-500 to-amber-600 text-obsidian-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold-md hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Search className="w-4 h-4 stroke-[2.5]" />
                  Search Expeditions
                </button>
              </div>
            </form>
          </div>

          {/* Royal Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-4 text-xs font-light text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>100% NTN & Security Audited</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-gold-400" />
              <span>Direct Operator Dispatch</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
              <span>Verified VIP Reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* CURATED LUXURY CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 border-b border-gold-500/15 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold-400 font-cinzel">Exclusive Portfolio</span>
            <h2 className="text-2xl font-cinzel font-bold text-white">Explore by Curated Collection</h2>
          </div>
          <Link href="/search" className="text-xs font-bold text-gold-400 hover:text-gold-300 flex items-center gap-1 group">
            Complete Fleet <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/search?category=${cat.slug}`}
              className="group p-5 rounded-2xl glass-card border border-white/5 hover:border-gold-500/40 hover:shadow-gold-sm transition-all text-center flex flex-col items-center justify-center gap-2.5"
            >
              <div className="w-12 h-12 rounded-xl bg-obsidian-900 border border-gold-500/20 text-gold-400 flex items-center justify-center group-hover:scale-110 group-hover:border-gold-400 transition-all">
                {getCategoryIcon(cat.name)}
              </div>
              <h3 className="text-xs font-bold text-slate-200 group-hover:text-gold-300 transition line-clamp-1">{cat.name}</h3>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                {cat._count?.listings || 0} Packages
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* PRESTIGIOUS DESTINATIONS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 border-b border-gold-500/15 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold-400 font-cinzel">Sanctuaries & Peaks</span>
            <h2 className="text-2xl font-cinzel font-bold text-white">Prestigious Destinations</h2>
          </div>
          <Link href="/search" className="text-xs font-bold text-gold-400 hover:text-gold-300 flex items-center gap-1 group">
            All Destinations <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {destinations.slice(0, 4).map((dest) => (
            <Link
              key={dest.id}
              href={`/search?destination=${dest.slug}`}
              className="group relative h-80 rounded-2xl overflow-hidden border border-gold-500/20 shadow-obsidian-lg hover:border-gold-400 transition-all duration-300"
            >
              <img
                src={dest.imageUrl}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-999 via-obsidian-950/40 to-transparent" />
              
              <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                <span className="inline-block text-[9px] font-bold uppercase tracking-widest text-gold-400 bg-obsidian-950/80 px-2.5 py-0.5 rounded-full border border-gold-500/30 backdrop-blur">
                  {dest.region}
                </span>
                <h3 className="text-lg font-cinzel font-bold leading-tight group-hover:text-gold-300 transition">
                  {dest.name}
                </h3>
                <p className="text-xs text-slate-400 font-light">
                  {dest._count?.listings || 0} Available Expeditions
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED ROYAL EXPEDITIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 border-b border-gold-500/15 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gold-400 font-cinzel mb-1">
              <Sparkles className="w-3.5 h-3.5" /> First-Class Suites & Packages
            </div>
            <h2 className="text-2xl font-cinzel font-bold text-white">Featured Luxury Expeditions</h2>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/compare" 
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-900 border border-gold-500/30 text-xs font-bold text-gold-300 hover:border-gold-400 transition"
            >
              Compare Packages
            </Link>
            <Link href="/search" className="text-xs font-bold text-gold-400 hover:text-gold-300 flex items-center gap-1 group">
              View All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredListings.map((listing) => {
            const coverImage = listing.media?.[0]?.url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
            const hasDiscount = listing.discounts && listing.discounts.length > 0;
            const discount = hasDiscount ? listing.discounts[0] : null;

            return (
              <div
                key={listing.id}
                className="group glass-card rounded-2xl border border-white/10 hover:border-gold-500/50 hover:shadow-gold-md transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Image Container with Luxury Badges */}
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={coverImage}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-transparent opacity-80" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    {hasDiscount && (
                      <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-600 to-rose-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                        <Tag className="w-3 h-3" />
                        {discount.percentage ? `${discount.percentage}% PRIVILEGE` : 'EXCLUSIVE OFFER'}
                      </span>
                    )}
                    <span className="bg-obsidian-950/85 backdrop-blur text-gold-300 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border border-gold-500/25">
                      {listing.destination?.name}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-obsidian-950/90 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-bold text-gold-400 flex items-center gap-1 border border-gold-500/20 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                    <span>{listing.rating.toFixed(1)}</span>
                    <span className="text-slate-400 font-normal">({listing.reviewCount})</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Provider chip */}
                    <div className="flex items-center gap-2 mb-2.5">
                      {listing.provider?.logoUrl ? (
                        <img src={listing.provider.logoUrl} alt={listing.provider.businessName} className="w-5 h-5 rounded-full object-cover border border-gold-500/30" />
                      ) : null}
                      <span className="text-xs font-semibold text-slate-300 truncate">
                        {listing.provider?.businessName}
                      </span>
                      {listing.provider?.verificationStatus === 'APPROVED' && (
                        <ShieldCheck className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                      )}
                    </div>

                    <Link href={`/listing/${listing.slug}`}>
                      <h3 className="text-base font-cinzel font-bold text-white group-hover:text-gold-300 transition line-clamp-2">
                        {listing.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed font-light">
                      {listing.shortDescription}
                    </p>

                    <div className="flex items-center gap-4 text-xs font-light text-slate-400 mt-3 pt-3 border-t border-white/5">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gold-500/80" />
                        <span>{listing.durationDays} Days</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-gold-500/80" />
                        <span>Up to {listing.maxGuests} guests</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-3 border-t border-gold-500/15 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest font-bold text-gold-400/80 block">Private Suite Rate</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-black text-white">
                          {listing.currency} {listing.basePrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/listing/${listing.slug}`}
                      className="px-4 py-2 bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-obsidian-950 text-xs font-black rounded-xl shadow-gold-sm transition hover:scale-[1.02]"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* THE EMIRATES-GRADE ROYAL CONCIERGE STANDARD */}
      <section className="bg-obsidian-900 border border-gold-500/25 py-16 px-4 sm:px-6 lg:px-8 rounded-3xl max-w-7xl mx-auto my-14 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-semibold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-gold-400" />
            The Faraday Guarantee
          </div>
          <h2 className="text-3xl font-cinzel font-black text-white">Strict Operational Standards for Discerning Travelers</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto font-light">
            Traditional tourism marketplaces feature unvetted intermediaries. We operate like a private luxury aviation fleet, ensuring absolute safety, verified operators, and transparent terms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl glass-card border border-gold-500/20 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center font-cinzel font-bold text-lg">
              01
            </div>
            <h3 className="text-base font-cinzel font-bold text-white">100% Government Audited Providers</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Every provider must furnish active business registrations, NTN certificates, and security authorizations vetted manually by our compliance team.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-gold-500/20 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center font-cinzel font-bold text-lg">
              02
            </div>
            <h3 className="text-base font-cinzel font-bold text-white">Direct Concierge & Guide Messaging</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Enjoy continuous communication directly with the certified expedition master. Request bespoke route extensions, helicopter transfers, and dietary accommodations.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-gold-500/20 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center font-cinzel font-bold text-lg">
              03
            </div>
            <h3 className="text-base font-cinzel font-bold text-white">Verified Traveler Escrow Reviews</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Only travelers who have genuinely completed an expedition through our platform may post ratings. Unbiased, unmanipulated, and protected.
            </p>
          </div>
        </div>
      </section>

      {/* OPERATOR ACCREDITATION CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-gold-500/30 shadow-2xl relative overflow-hidden">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400 font-cinzel">Fleet Accreditation</span>
            <h2 className="text-2xl sm:text-3xl font-cinzel font-black text-white">Are you a licensed expedition operator or luxury lodge?</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              Join our verified high-end marketplace. Showcase your packages to high-net-worth international and domestic travelers, with automated booking tracking and direct guest messaging.
            </p>
          </div>
          <Link
            href="/faq"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-gold-400 via-gold-500 to-amber-600 text-obsidian-950 font-black text-xs uppercase tracking-wider shadow-gold-md hover:scale-105 transition shrink-0"
          >
            Apply for Accreditation
          </Link>
        </div>
      </section>
    </div>
  );
}
