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
    if (name.includes('Mountain') || name.includes('Trek')) return <Mountain className="w-5 h-5 text-gold-700" />;
    if (name.includes('Culture') || name.includes('Heritage')) return <Landmark className="w-5 h-5 text-gold-700" />;
    if (name.includes('Coast') || name.includes('Water')) return <Waves className="w-5 h-5 text-gold-700" />;
    if (name.includes('Wildlife') || name.includes('Safari')) return <Trees className="w-5 h-5 text-gold-700" />;
    return <Compass className="w-5 h-5 text-gold-700" />;
  };

  return (
    <div className="space-y-14 sm:space-y-20 pb-20 w-full bg-[#faf8f5] text-slate-900 overflow-hidden">
      
      {/* EMIRATES-GRADE HERO SUITE - LIGHT LUXURY */}
      <section className="relative min-h-[560px] sm:min-h-[640px] lg:min-h-[680px] flex items-center justify-center py-14 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden w-full">
        {/* Background Panoramic Mountain View with Soft Alabaster Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=90"
            alt="Karakoram and Himalayan High-Altitude Peaks"
            className="w-full h-full object-cover object-center scale-105 transition duration-1000 opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#faf8f5] via-[#faf8f5]/85 to-white/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6 sm:space-y-7 w-full">
          
          {/* Royal Crest Tagline */}
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white border border-gold-300/80 text-gold-800 text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-xs">
            <Crown className="w-3.5 h-3.5 text-gold-600" />
            <span>Emirates-Grade Luxury Marketplace</span>
            <span className="text-gold-400">•</span>
            <span className="text-slate-700">Verified Fleet</span>
          </div>

          {/* Majestic Heading */}
          <h1 className="font-cinzel text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-[1.18] break-words">
            Fly First Class Across <br className="hidden sm:block" />
            <span className="gold-text-gradient">
              The Peaks, Valleys & Oases
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-light px-2">
            Connecting discerning world travelers with government-audited expedition operators, private helicopter charters, and bespoke alpine suites. Transparent royal pricing with zero middleman markups.
          </p>

          {/* LUXURY SEARCH DESK WIDGET - RESPONSIVE & HIGH CONTRAST */}
          <div className="max-w-4xl mx-auto glass-luxury rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-lg border border-gold-300/40 text-slate-900 text-left mt-6 sm:mt-8 w-full">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
              
              {/* Destination */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200/90 hover:border-gold-400 focus-within:border-gold-500 transition">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gold-800 mb-0.5 flex items-center gap-1 font-cinzel">
                  <MapPin className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                  Destination
                </label>
                <select
                  value={selectedDestination}
                  onChange={(e) => setSelectedDestination(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="">All Prestigious Valleys</option>
                  {destinations.map((d) => (
                    <option key={d.id} value={d.slug}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200/90 hover:border-gold-400 focus-within:border-gold-500 transition">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gold-800 mb-0.5 flex items-center gap-1 font-cinzel">
                  <Compass className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                  Collection
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="">All Curated Collections</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Keyword */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200/90 hover:border-gold-400 focus-within:border-gold-500 transition">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gold-800 mb-0.5 flex items-center gap-1 font-cinzel">
                  <Search className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                  Bespoke Keywords
                </label>
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="e.g. Scuba, Glaciers, 4x4"
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none placeholder:text-slate-400"
                />
              </div>

              {/* Luxury CTA Button */}
              <div className="flex items-center sm:col-span-2 lg:col-span-1">
                <button
                  type="submit"
                  className="w-full h-full min-h-[46px] sm:min-h-[50px] rounded-xl bg-gradient-to-r from-gold-500 via-gold-600 to-amber-600 hover:brightness-105 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
                >
                  <Search className="w-4 h-4 stroke-[2.5]" />
                  Search Expeditions
                </button>
              </div>
            </form>
          </div>

          {/* Royal Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-3 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% NTN & Security Audited</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Direct Operator Dispatch</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Verified VIP Reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* CURATED LUXURY CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 border-b border-slate-200 pb-3 sm:pb-4 gap-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold-800 font-cinzel">Exclusive Portfolio</span>
            <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-slate-950">Explore by Curated Collection</h2>
          </div>
          <Link href="/search" className="text-xs font-bold text-gold-800 hover:text-gold-900 flex items-center gap-1 group self-start sm:self-auto">
            Complete Fleet <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/search?category=${cat.slug}`}
              className="group p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-gold-400 hover:shadow-md transition-all text-center flex flex-col items-center justify-center gap-2 shadow-xs"
            >
              <div className="w-12 h-12 rounded-xl bg-gold-50/80 border border-gold-200/60 text-gold-700 flex items-center justify-center group-hover:scale-110 transition-all">
                {getCategoryIcon(cat.name)}
              </div>
              <h3 className="text-xs font-bold text-slate-800 group-hover:text-gold-800 transition line-clamp-1">{cat.name}</h3>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                {cat._count?.listings || 0} Packages
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* PRESTIGIOUS DESTINATIONS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 border-b border-slate-200 pb-3 sm:pb-4 gap-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold-800 font-cinzel">Sanctuaries & Peaks</span>
            <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-slate-950">Prestigious Destinations</h2>
          </div>
          <Link href="/search" className="text-xs font-bold text-gold-800 hover:text-gold-900 flex items-center gap-1 group self-start sm:self-auto">
            All Destinations <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {destinations.slice(0, 4).map((dest) => (
            <Link
              key={dest.id}
              href={`/search?destination=${dest.slug}`}
              className="group relative h-64 sm:h-72 lg:h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img
                src={dest.imageUrl}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
              
              <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5 right-4 sm:right-5 text-white space-y-1">
                <span className="inline-block text-[9px] font-bold uppercase tracking-widest text-gold-300 bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-gold-400/40 backdrop-blur">
                  {dest.region}
                </span>
                <h3 className="text-base sm:text-lg font-cinzel font-bold leading-tight group-hover:text-gold-300 transition">
                  {dest.name}
                </h3>
                <p className="text-xs text-slate-300 font-light">
                  {dest._count?.listings || 0} Available Expeditions
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED ROYAL EXPEDITIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 border-b border-slate-200 pb-3 sm:pb-4 gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gold-800 font-cinzel mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" /> First-Class Suites & Packages
            </div>
            <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-slate-950">Featured Luxury Expeditions</h2>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <Link 
              href="/compare" 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 text-xs font-bold text-slate-700 hover:border-gold-400 transition shadow-xs"
            >
              Compare Packages
            </Link>
            <Link href="/search" className="text-xs font-bold text-gold-800 hover:text-gold-900 flex items-center gap-1 group">
              View All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {featuredListings.map((listing) => {
            const coverImage = listing.media?.[0]?.url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
            const hasDiscount = listing.discounts && listing.discounts.length > 0;
            const discount = hasDiscount ? listing.discounts[0] : null;

            return (
              <div
                key={listing.id}
                className="group bg-white rounded-2xl border border-slate-200/90 hover:border-gold-400/80 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xs"
              >
                {/* Image Container with Luxury Badges */}
                <div className="relative h-52 sm:h-60 overflow-hidden">
                  <img
                    src={coverImage}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 sm:gap-2">
                    {hasDiscount && (
                      <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-600 to-rose-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                        <Tag className="w-3 h-3" />
                        {discount.percentage ? `${discount.percentage}% PRIVILEGE` : 'EXCLUSIVE OFFER'}
                      </span>
                    )}
                    <span className="bg-slate-900/85 backdrop-blur text-gold-300 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border border-gold-400/30">
                      {listing.destination?.name}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-bold text-slate-900 flex items-center gap-1 border border-slate-100 shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{listing.rating.toFixed(1)}</span>
                    <span className="text-slate-400 font-normal">({listing.reviewCount})</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
                  <div>
                    {/* Provider chip */}
                    <div className="flex items-center gap-2 mb-2">
                      {listing.provider?.logoUrl ? (
                        <img src={listing.provider.logoUrl} alt={listing.provider.businessName} className="w-5 h-5 rounded-full object-cover border border-slate-200" />
                      ) : null}
                      <span className="text-xs font-semibold text-slate-600 truncate">
                        {listing.provider?.businessName}
                      </span>
                      {listing.provider?.verificationStatus === 'APPROVED' && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      )}
                    </div>

                    <Link href={`/listing/${listing.slug}`}>
                      <h3 className="text-base font-cinzel font-bold text-slate-900 group-hover:text-gold-800 transition line-clamp-2">
                        {listing.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed font-light">
                      {listing.shortDescription}
                    </p>

                    <div className="flex items-center gap-4 text-xs font-light text-slate-500 mt-2.5 pt-2.5 border-t border-slate-100">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gold-700" />
                        <span>{listing.durationDays} Days</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-gold-700" />
                        <span>Up to {listing.maxGuests} guests</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400 block">Suite Rate</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base sm:text-lg font-black text-slate-950 font-cinzel">
                          {listing.currency} {listing.basePrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/listing/${listing.slug}`}
                      className="px-3.5 sm:px-4 py-2 bg-gradient-to-r from-gold-500 to-amber-600 hover:brightness-105 text-slate-950 text-xs font-black rounded-xl shadow-xs transition hover:scale-[1.02] shrink-0"
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-[#f5f2eb] border border-gold-300/40 py-12 sm:py-16 px-5 sm:px-8 lg:px-12 rounded-3xl shadow-xs relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4 mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gold-300/60 text-gold-800 text-xs font-bold uppercase tracking-wider shadow-xs">
              <Award className="w-3.5 h-3.5 text-gold-600" />
              The Faraday Guarantee
            </div>
            <h2 className="text-2xl sm:text-3xl font-cinzel font-black text-slate-950">Strict Operational Standards for Discerning Travelers</h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto font-light">
              Traditional tourism marketplaces feature unvetted intermediaries. We operate like a private luxury aviation fleet, ensuring absolute safety, verified operators, and transparent terms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 space-y-2.5 shadow-xs">
              <div className="w-11 h-11 rounded-xl bg-gold-50 border border-gold-200 text-gold-700 flex items-center justify-center font-cinzel font-bold text-base">
                01
              </div>
              <h3 className="text-base font-cinzel font-bold text-slate-900">100% Government Audited Providers</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                Every provider must furnish active business registrations, NTN certificates, and security authorizations vetted manually by our compliance team.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 space-y-2.5 shadow-xs">
              <div className="w-11 h-11 rounded-xl bg-gold-50 border border-gold-200 text-gold-700 flex items-center justify-center font-cinzel font-bold text-base">
                02
              </div>
              <h3 className="text-base font-cinzel font-bold text-slate-900">Direct Concierge & Guide Messaging</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                Enjoy continuous communication directly with the certified expedition master. Request bespoke route extensions, helicopter transfers, and dietary accommodations.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 space-y-2.5 shadow-xs">
              <div className="w-11 h-11 rounded-xl bg-gold-50 border border-gold-200 text-gold-700 flex items-center justify-center font-cinzel font-bold text-base">
                03
              </div>
              <h3 className="text-base font-cinzel font-bold text-slate-900">Verified Traveler Escrow Reviews</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                Only travelers who have genuinely completed an expedition through our platform may post ratings. Unbiased, unmanipulated, and protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OPERATOR ACCREDITATION CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 md:p-12 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8 shadow-xl relative overflow-hidden">
          <div className="space-y-2.5 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400 font-cinzel">Fleet Accreditation</span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-cinzel font-black text-white">Are you a licensed expedition operator or luxury lodge?</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              Join our verified high-end marketplace. Showcase your packages to high-net-worth international and domestic travelers, with automated booking tracking and direct guest messaging.
            </p>
          </div>
          <Link
            href="/faq"
            className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:brightness-105 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md transition shrink-0"
          >
            Apply for Accreditation
          </Link>
        </div>
      </section>
    </div>
  );
}
