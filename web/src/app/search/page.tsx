'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  MapPin, 
  Compass, 
  Star, 
  ShieldCheck, 
  Tag, 
  Calendar, 
  Users, 
  SlidersHorizontal, 
  X, 
  LayoutGrid, 
  List, 
  ArrowUpDown,
  Sparkles,
  Crown
} from 'lucide-react';
import { api } from '@/lib/api';

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state
  const initialKeyword = searchParams.get('search') || '';
  const initialDestination = searchParams.get('destination') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialHasDiscount = searchParams.get('hasDiscount') === 'true';

  // Filters state
  const [keyword, setKeyword] = useState(initialKeyword);
  const [selectedDestination, setSelectedDestination] = useState(initialDestination);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [minRating, setMinRating] = useState<string>('');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [hasDiscount, setHasDiscount] = useState<boolean>(initialHasDiscount);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Data state
  const [listings, setListings] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  useEffect(() => {
    // Load metadata for filters
    Promise.all([
      api.getDestinations(),
      api.getCategories()
    ]).then(([destRes, catRes]) => {
      if (destRes.success) setDestinations(destRes.data || []);
      if (catRes.success) setCategories(catRes.data || []);
    });
  }, []);

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        const query: any = {
          sortBy,
          limit: 30,
        };
        if (keyword) query.search = keyword;
        if (selectedDestination) query.destination = selectedDestination;
        if (selectedCategory) query.category = selectedCategory;
        if (minPrice) query.minPrice = minPrice;
        if (maxPrice) query.maxPrice = maxPrice;
        if (minRating) query.minRating = minRating;
        if (verifiedOnly) query.verifiedOnly = 'true';
        if (hasDiscount) query.hasDiscount = 'true';

        const res = await api.getListings(query);
        if (res.success) {
          setListings(res.data || []);
          setTotalCount(res.meta?.total || 0);
        }
      } catch (err) {
        console.error('Failed to load listings', err);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [keyword, selectedDestination, selectedCategory, minPrice, maxPrice, minRating, verifiedOnly, hasDiscount, sortBy]);

  const clearFilters = () => {
    setKeyword('');
    setSelectedDestination('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setVerifiedOnly(false);
    setHasDiscount(false);
    setSortBy('featured');
  };

  const activeFiltersCount = [
    selectedDestination,
    selectedCategory,
    minPrice,
    maxPrice,
    minRating,
    verifiedOnly,
    hasDiscount,
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-obsidian-950 text-slate-100">
      
      {/* SEARCH HEADER & SEARCH BAR */}
      <div className="glass-obsidian rounded-2xl border border-gold-500/25 p-4 sm:p-5 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gold-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by peaks, private charters, suite titles, or operator..."
              className="w-full pl-10 pr-4 py-3 text-sm bg-obsidian-950 border border-gold-500/25 rounded-xl focus:ring-1 focus:ring-gold-400 focus:outline-none text-white placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-obsidian-900 border border-gold-500/30 text-gold-300 text-xs font-bold rounded-xl"
            >
              <Filter className="w-4 h-4" />
              Filters ({activeFiltersCount})
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-obsidian-950 border border-gold-500/25 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200">
              <ArrowUpDown className="w-3.5 h-3.5 text-gold-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer text-gold-300 font-semibold"
              >
                <option value="featured" className="bg-obsidian-950 text-slate-200">Featured Fleet</option>
                <option value="price_asc" className="bg-obsidian-950 text-slate-200">Rate: Low to High</option>
                <option value="price_desc" className="bg-obsidian-950 text-slate-200">Rate: High to Low</option>
                <option value="rating_desc" className="bg-obsidian-950 text-slate-200">Highest Rated VIP</option>
                <option value="newest" className="bg-obsidian-950 text-slate-200">Newest Added</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center border border-gold-500/25 rounded-xl overflow-hidden p-0.5 bg-obsidian-950">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-gold-500/20 text-gold-400' : 'text-slate-500 hover:text-slate-300'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-gold-500/20 text-gold-400' : 'text-slate-500 hover:text-slate-300'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Pill Row */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gold-500/15 text-xs">
            <span className="text-slate-400 font-light">Active parameters:</span>
            {selectedDestination && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 font-semibold text-xs">
                Destination: {destinations.find(d => d.slug === selectedDestination)?.name || selectedDestination}
                <button onClick={() => setSelectedDestination('')}><X className="w-3 h-3 hover:text-white" /></button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 font-semibold text-xs">
                Collection: {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
                <button onClick={() => setSelectedCategory('')}><X className="w-3 h-3 hover:text-white" /></button>
              </span>
            )}
            {verifiedOnly && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300 font-semibold text-xs">
                Verified Fleet Only
                <button onClick={() => setVerifiedOnly(false)}><X className="w-3 h-3 hover:text-white" /></button>
              </span>
            )}
            {hasDiscount && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold text-xs">
                VIP Privileges Only
                <button onClick={() => setHasDiscount(false)}><X className="w-3 h-3 hover:text-white" /></button>
              </span>
            )}
            {minRating && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 font-semibold text-xs">
                {minRating}+ Stars
                <button onClick={() => setMinRating('')}><X className="w-3 h-3 hover:text-white" /></button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-gold-400 hover:text-gold-300 font-semibold ml-auto underline"
            >
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* MAIN TWO COLUMN LAYOUT: FILTERS & RESULTS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        {/* DESKTOP FILTERS SIDEBAR */}
        <aside className={`md:block ${mobileFilterOpen ? 'block' : 'hidden'} glass-card rounded-2xl border border-gold-500/20 p-5 space-y-6 shadow-xl`}>
          <div className="flex items-center justify-between border-b border-gold-500/15 pb-3">
            <h3 className="font-cinzel text-xs font-bold uppercase tracking-widest text-gold-300 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gold-400" />
              Filter Fleet
            </h3>
            {activeFiltersCount > 0 && (
              <button onClick={clearFilters} className="text-[11px] text-slate-400 hover:text-gold-400">
                Reset
              </button>
            )}
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gold-400 font-cinzel">
              Destination
            </label>
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="w-full bg-obsidian-950 border border-gold-500/20 text-slate-200 text-xs rounded-xl p-2.5 focus:ring-1 focus:ring-gold-400 focus:outline-none"
            >
              <option value="">All Prestigious Valleys</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.slug}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gold-400 font-cinzel">
              Curated Collection
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-obsidian-950 border border-gold-500/20 text-slate-200 text-xs rounded-xl p-2.5 focus:ring-1 focus:ring-gold-400 focus:outline-none"
            >
              <option value="">All Collections</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gold-400 font-cinzel">
              Suite Price Range (PKR)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min PKR"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-obsidian-950 border border-gold-500/20 text-slate-200 text-xs rounded-xl p-2 focus:ring-1 focus:ring-gold-400 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Max PKR"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-obsidian-950 border border-gold-500/20 text-slate-200 text-xs rounded-xl p-2 focus:ring-1 focus:ring-gold-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Min Rating */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gold-400 font-cinzel">
              Minimum Rating
            </label>
            <div className="flex items-center gap-1.5">
              {['', '4.5', '4.0', '3.5'].map((r) => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition ${
                    minRating === r 
                      ? 'border-gold-400 bg-gold-500/20 text-gold-300' 
                      : 'border-white/10 hover:border-gold-500/30 text-slate-400'
                  }`}
                >
                  {r ? `${r}★` : 'Any'}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-3 border-t border-gold-500/15">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 accent-gold-500 rounded border-gold-500/40 bg-obsidian-950"
              />
              <span className="text-xs font-medium text-slate-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                Verified Operators Only
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasDiscount}
                onChange={(e) => setHasDiscount(e.target.checked)}
                className="w-4 h-4 accent-gold-500 rounded border-gold-500/40 bg-obsidian-950"
              />
              <span className="text-xs font-medium text-slate-300 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-gold-400" />
                VIP Seasonal Privileges
              </span>
            </label>
          </div>
        </aside>

        {/* RESULTS COLUMN */}
        <main className="md:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs font-light text-slate-400 px-1">
            <span>Showing {listings.length} of {totalCount} verified fleet offerings</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-80 bg-obsidian-900 animate-pulse rounded-2xl border border-gold-500/15" />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="glass-card rounded-2xl border border-gold-500/20 p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-obsidian-900 border border-gold-500/20 text-gold-400 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-cinzel font-bold text-white">No offerings matched your criteria</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto font-light">
                Try widening your price range, choosing another destination, or resetting parameters to review all available suites.
              </p>
              <button
                onClick={clearFilters}
                className="px-5 py-2.5 bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 text-xs font-black uppercase tracking-wider rounded-xl transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* GRID VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {listings.map((listing) => {
                const coverImage = listing.media?.[0]?.url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
                const hasDiscount = listing.discounts && listing.discounts.length > 0;
                const discount = hasDiscount ? listing.discounts[0] : null;

                return (
                  <div
                    key={listing.id}
                    className="group glass-card rounded-2xl border border-white/10 hover:border-gold-500/50 hover:shadow-gold-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={coverImage}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-transparent opacity-80" />

                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          {hasDiscount && (
                            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-600 to-rose-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                              <Tag className="w-3 h-3" />
                              {discount.percentage ? `${discount.percentage}% PRIVILEGE` : 'EXCLUSIVE'}
                            </span>
                          )}
                          <span className="bg-obsidian-950/85 backdrop-blur text-gold-300 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border border-gold-500/25">
                            {listing.destination?.name}
                          </span>
                        </div>
                        <div className="absolute bottom-3 right-3 bg-obsidian-950/90 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-bold text-gold-400 flex items-center gap-1 border border-gold-500/20 shadow-sm">
                          <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                          <span>{listing.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-slate-300 truncate">{listing.provider?.businessName}</span>
                          {listing.provider?.verificationStatus === 'APPROVED' && (
                            <ShieldCheck className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                          )}
                        </div>

                        <Link href={`/listing/${listing.slug}`}>
                          <h4 className="text-base font-cinzel font-bold text-white group-hover:text-gold-300 transition line-clamp-2">
                            {listing.title}
                          </h4>
                        </Link>

                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-light">
                          {listing.shortDescription}
                        </p>

                        <div className="flex items-center gap-3 text-xs text-slate-400 font-light pt-2 border-t border-white/5">
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gold-500/80" /> {listing.durationDays} Days</span>
                          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-gold-500/80" /> Up to {listing.maxGuests}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 flex items-center justify-between border-t border-gold-500/15 mt-2">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest font-bold text-gold-400/80 block">From</span>
                        <span className="text-base font-black text-white">
                          {listing.currency} {listing.basePrice.toLocaleString()}
                        </span>
                      </div>

                      <Link
                        href={`/listing/${listing.slug}`}
                        className="px-4 py-2 bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-obsidian-950 text-xs font-black rounded-xl shadow-gold-sm transition hover:scale-[1.02]"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* LIST VIEW */
            <div className="space-y-4">
              {listings.map((listing) => {
                const coverImage = listing.media?.[0]?.url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
                return (
                  <div
                    key={listing.id}
                    className="glass-card rounded-2xl border border-white/10 hover:border-gold-500/50 p-4 flex flex-col sm:flex-row items-center gap-5 transition"
                  >
                    <img src={coverImage} alt={listing.title} className="w-full sm:w-48 h-36 object-cover rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gold-400 font-semibold">{listing.destination?.name} • {listing.category?.name}</span>
                        <span className="flex items-center gap-1 text-xs font-bold text-gold-400">
                          <Star className="w-3.5 h-3.5 fill-gold-400" /> {listing.rating.toFixed(1)}
                        </span>
                      </div>
                      <Link href={`/listing/${listing.slug}`}>
                        <h4 className="text-base font-cinzel font-bold text-white hover:text-gold-300 transition">{listing.title}</h4>
                      </Link>
                      <p className="text-xs text-slate-400 line-clamp-2 font-light">{listing.shortDescription}</p>
                    </div>
                    <div className="flex sm:flex-col items-center justify-between gap-3 shrink-0 sm:border-l sm:border-gold-500/20 sm:pl-5 w-full sm:w-auto">
                      <div className="text-right sm:text-center">
                        <span className="text-[10px] uppercase text-gold-400 font-bold block">Rate</span>
                        <span className="text-base font-black text-white">{listing.currency} {listing.basePrice.toLocaleString()}</span>
                      </div>
                      <Link
                        href={`/listing/${listing.slug}`}
                        className="px-4 py-2 bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 font-black text-xs rounded-xl shadow-gold-sm"
                      >
                        View Suite
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
