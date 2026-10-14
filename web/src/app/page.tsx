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
  Tag
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
    if (name.includes('Mountain') || name.includes('Trek')) return <Mountain className="w-5 h-5" />;
    if (name.includes('Culture') || name.includes('Heritage')) return <Landmark className="w-5 h-5" />;
    if (name.includes('Coast') || name.includes('Water')) return <Waves className="w-5 h-5" />;
    if (name.includes('Wildlife') || name.includes('Safari')) return <Trees className="w-5 h-5" />;
    return <Compass className="w-5 h-5" />;
  };

  return (
    <div className="space-y-16 pb-20">
      {/* HERO SECTION WITH SEARCH ENGINE */}
      <section className="relative min-h-[580px] flex items-center justify-center bg-slate-900 text-white overflow-hidden py-16 px-4">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85"
            alt="Karakoram and Himalayan Expeditions"
            className="w-full h-full object-cover object-center opacity-45 scale-105 transition duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/80" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Verified Multi-Provider Marketplace
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Discover Verified Expeditions <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Direct from Licensed Operators
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-light">
            Compare packages, ratings, and transparent pricing across northern mountains, alpine lakes, and coastal islands. Direct enquiries and seamless bookings.
          </p>

          {/* MAIN SEARCH BAR CARD */}
          <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-2xl border border-white/20 text-slate-800 text-left mt-8">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Destination */}
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-500 transition">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  Destination
                </label>
                <select
                  value={selectedDestination}
                  onChange={(e) => setSelectedDestination(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none"
                >
                  <option value="">All Destinations</option>
                  {destinations.map((d) => (
                    <option key={d.id} value={d.slug}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-500 transition">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-emerald-600" />
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Keyword */}
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-500 transition">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5 flex items-center gap-1">
                  <Search className="w-3.5 h-3.5 text-emerald-600" />
                  Keywords
                </label>
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="e.g. Scuba, Glaciers, 4x4"
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none placeholder:text-slate-400 placeholder:font-normal"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center">
                <button
                  type="submit"
                  className="w-full h-full min-h-[46px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition hover:scale-[1.02]"
                >
                  <Search className="w-4 h-4" />
                  Search Packages
                </button>
              </div>
            </form>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Business Licenses</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero Middleman Markups</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Verified Customer Reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Explore by Category</h2>
            <p className="text-xs text-slate-500">Tailored experiences matching your adventure style</p>
          </div>
          <Link href="/search" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/search?category=${cat.slug}`}
              className="group p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-500 hover:shadow-lg transition-all text-center flex flex-col items-center justify-center gap-2"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition">
                {getCategoryIcon(cat.name)}
              </div>
              <h3 className="text-xs font-bold text-slate-800 line-clamp-1">{cat.name}</h3>
              <span className="text-[11px] font-semibold text-slate-400">
                {cat._count?.listings || 0} packages
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* POPULAR DESTINATIONS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Top Destinations</h2>
            <p className="text-xs text-slate-500">Unmatched valleys, rugged passes, and pristine coastlines</p>
          </div>
          <Link href="/search" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
            Browse All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {destinations.slice(0, 4).map((dest) => (
            <Link
              key={dest.id}
              href={`/search?destination=${dest.slug}`}
              className="group relative h-72 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
            >
              <img
                src={dest.imageUrl}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded backdrop-blur mb-1">
                  {dest.region}
                </span>
                <h3 className="text-lg font-bold leading-tight group-hover:text-emerald-300 transition">
                  {dest.name}
                </h3>
                <p className="text-xs text-slate-300 font-medium">
                  {dest._count?.listings || 0} available packages
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PACKAGES WITH PRICING & DISCOUNTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Verified Offerings
            </div>
            <h2 className="text-2xl font-black text-slate-900">Featured Packages & Expeditions</h2>
          </div>
          <Link href="/search" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
            All Packages <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredListings.map((listing) => {
            const coverImage = listing.media?.[0]?.url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
            const hasDiscount = listing.discounts && listing.discounts.length > 0;
            const discount = hasDiscount ? listing.discounts[0] : null;

            return (
              <div
                key={listing.id}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col"
              >
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={coverImage}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {hasDiscount && (
                      <span className="inline-flex items-center gap-1 bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md">
                        <Tag className="w-3 h-3" />
                        {discount.percentage ? `${discount.percentage}% OFF` : 'SPECIAL OFFER'}
                      </span>
                    )}
                    <span className="bg-slate-900/80 backdrop-blur text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                      {listing.destination?.name}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-slate-900 flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{listing.rating.toFixed(1)}</span>
                    <span className="text-slate-400 font-normal">({listing.reviewCount})</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Provider chip */}
                    <div className="flex items-center gap-2 mb-2">
                      {listing.provider?.logoUrl ? (
                        <img src={listing.provider.logoUrl} alt={listing.provider.businessName} className="w-5 h-5 rounded-full object-cover" />
                      ) : null}
                      <span className="text-xs font-semibold text-slate-600 truncate">
                        {listing.provider?.businessName}
                      </span>
                      {listing.provider?.verificationStatus === 'APPROVED' && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      )}
                    </div>

                    <Link href={`/listing/${listing.slug}`}>
                      <h3 className="text-base font-bold text-slate-900 hover:text-emerald-600 transition line-clamp-2">
                        {listing.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {listing.shortDescription}
                    </p>

                    <div className="flex items-center gap-4 text-xs font-medium text-slate-400 mt-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{listing.durationDays} Days</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>Up to {listing.maxGuests} guests</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">From</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-black text-slate-900">
                          {listing.currency} {listing.basePrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/listing/${listing.slug}`}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
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

      {/* WHY BOOK WITH VERIFIED OPERATORS */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 rounded-3xl max-w-7xl mx-auto my-12">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-12">
          <h2 className="text-3xl font-black">Built for Trust, Safety, and Transparency</h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Traditional unmoderated tourism marketplaces are rife with unlicensed brokers and unexpected extra costs. Faraday Expeditions enforces strict operational standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xl">
              01
            </div>
            <h3 className="text-lg font-bold">100% Manually Verified Providers</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every provider must submit active business licenses, NTN tax registrations, and identity documentation audited by our operations team before listing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xl">
              02
            </div>
            <h3 className="text-lg font-bold">Direct Provider Messaging</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Communicate directly with the guide or operator managing your expedition. Request custom dates, clarify itinerary details, and get live updates.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xl">
              03
            </div>
            <h3 className="text-lg font-bold">Verified Transaction Reviews</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Only travelers who have genuinely completed an expedition can submit ratings and written reviews. Zero fabricated reviews or provider manipulation.
            </p>
          </div>
        </div>
      </section>

      {/* PROVIDER CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Provider Partnership</span>
            <h2 className="text-2xl sm:text-3xl font-black">Are you a licensed expedition operator or adventure guide?</h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Join Pakistan's premier verified travel marketplace. Create your business profile, showcase packages to thousands of high-intent travelers, and manage requests with dedicated dashboards.
            </p>
          </div>
          <Link
            href="/faq"
            className="px-6 py-3.5 rounded-2xl bg-white text-emerald-900 font-bold text-sm shadow-lg hover:bg-emerald-50 transition shrink-0"
          >
            Become a Verified Provider
          </Link>
        </div>
      </section>
    </div>
  );
}
