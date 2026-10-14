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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 bg-[#faf8f5] text-slate-900 w-full overflow-hidden">
      
      {/* SEARCH HEADER & SEARCH BAR */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex flex-col md:flex-row items-center gap-2.5 sm:gap-3">
          
          {/* Keyword Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by peaks, private charters, suite titles, or operator..."
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200/90 rounded-xl focus:border-gold-500 focus:outline-none text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
            >
              <Filter className="w-4 h-4 text-gold-700" />
              Filters ({activeFiltersCount})
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/90 rounded-xl px-2.5 sm:px-3 py-2 text-xs font-semibold text-slate-800">
              <ArrowUpDown className="w-3.5 h-3.5 text-gold-600 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer text-slate-900 font-bold"
              >
                <option value="featured">Featured Fleet</option>
                <option value="price_asc">Rate: Low to High</option>
                <option value="price_desc">Rate: High to Low</option>
                <option value="rating_desc">Highest Rated VIP</option>
                <option value="newest">Newest Added</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center border border-slate-200 rounded-xl overflow-hidden p-0.5 bg-slate-50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 sm:p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-white shadow-xs text-gold-700 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 sm:p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-white shadow-xs text-gold-700 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Pill Row */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-light">Active parameters:</span>
            {selectedDestination && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold-50 border border-gold-200 text-gold-900 font-semibold text-xs">
                Destination: {destinations.find(d => d.slug === selectedDestination)?.name || selectedDestination}
                <button onClick={() => setSelectedDestination('')}><X className="w-3 h-3 hover:text-slate-950" /></button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold-50 border border-gold-200 text-gold-900 font-semibold text-xs">
                Collection: {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
                <button onClick={() => setSelectedCategory('')}><X className="w-3 h-3 hover:text-slate-950" /></button>
              </span>
            )}
            {verifiedOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold text-xs">
                Verified Fleet Only
                <button onClick={() => setVerifiedOnly(false)}><X className="w-3 h-3 hover:text-slate-950" /></button>
              </span>
            )}
            {hasDiscount && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-semibold text-xs">
                VIP Privileges Only
                <button onClick={() => setHasDiscount(false)}><X className="w-3 h-3 hover:text-slate-950" /></button>
              </span>
            )}
            {minRating && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold-50 border border-gold-200 text-gold-900 font-semibold text-xs">
                {minRating}+ Stars
                <button onClick={() => setMinRating('')}><X className="w-3 h-3 hover:text-slate-950" /></button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-gold-700 hover:text-gold-800 font-semibold ml-auto underline"
            >
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* MAIN TWO COLUMN LAYOUT: FILTERS & RESULTS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        {/* FILTERS SIDEBAR */}
        <aside className={`md:block ${mobileFilterOpen ? 'block' : 'hidden'} bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 space-y-5 shadow-xs`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-cinzel text-xs font-bold uppercase tracking-widest text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gold-700" />
              Filter Fleet
            </h3>
            {activeFiltersCount > 0 && (
              <button onClick={clearFilters} className="text-[11px] text-slate-500 hover:text-gold-800 font-semibold">
                Reset
              </button>
            )}
          </div>

          {/* Destination */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-700 font-cinzel">
              Destination
            </label>
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/90 text-slate-800 text-xs rounded-xl p-2.5 focus:border-gold-500 focus:outline-none"
            >
              <option value="">All Prestigious Valleys</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.slug}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-700 font-cinzel">
              Curated Collection
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/90 text-slate-800 text-xs rounded-xl p-2.5 focus:border-gold-500 focus:outline-none"
            >
              <option value="">All Collections</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-700 font-cinzel">
              Suite Price Range (PKR)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min PKR"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/90 text-slate-800 text-xs rounded-xl p-2 focus:border-gold-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Max PKR"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/90 text-slate-800 text-xs rounded-xl p-2 focus:border-gold-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Min Rating */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-700 font-cinzel">
              Minimum Rating
            </label>
            <div className="flex items-center gap-1.5">
              {['', '4.5', '4.0', '3.5'].map((r) => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition ${
                    minRating === r 
                      ? 'border-gold-500 bg-gold-50 text-gold-900 font-bold' 
                      : 'border-slate-200 bg-white text-slate-600 hover:border-gold-400'
                  }`}
                >
                  {r ? `${r}★` : 'Any'}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-2.5 pt-3 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 accent-gold-600 rounded border-slate-300"
              />
              <span className="text-xs font-medium text-slate-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Operators Only
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasDiscount}
                onChange={(e) => setHasDiscount(e.target.checked)}
                className="w-4 h-4 accent-gold-600 rounded border-slate-300"
              />
              <span className="text-xs font-medium text-slate-700 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-gold-700" />
                VIP Seasonal Privileges
              </span>
            </label>
          </div>
        </aside>

        {/* RESULTS COLUMN */}
        <main className="md:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs font-light text-slate-500 px-1">
            <span>Showing {listings.length} of {totalCount} verified fleet offerings</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-80 bg-slate-100 animate-pulse rounded-2xl border border-slate-200" />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center space-y-3.5 shadow-xs">
              <div className="w-14 h-14 bg-slate-100 border border-slate-200 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-cinzel font-bold text-slate-900">No offerings matched your criteria</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto font-light">
                Try widening your price range, choosing another destination, or resetting parameters to review all available suites.
              </p>
              <button
                onClick={clearFilters}
                className="px-5 py-2.5 bg-gradient-to-r from-gold-500 to-amber-600 hover:brightness-105 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* GRID VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {listings.map((listing) => {
                const coverImage = listing.media?.[0]?.url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
                const hasDiscount = listing.discounts && listing.discounts.length > 0;
                const discount = hasDiscount ? listing.discounts[0] : null;

                return (
                  <div
                    key={listing.id}
                    className="group bg-white rounded-2xl border border-slate-200/90 hover:border-gold-400/80 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xs"
                  >
                    <div>
                      <div className="relative h-48 sm:h-52 overflow-hidden">
                        <img
                          src={coverImage}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60" />

                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          {hasDiscount && (
                            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-600 to-rose-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                              <Tag className="w-3 h-3" />
                              {discount.percentage ? `${discount.percentage}% PRIVILEGE` : 'EXCLUSIVE'}
                            </span>
                          )}
                          <span className="bg-slate-900/85 backdrop-blur text-gold-300 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border border-gold-400/30">
                            {listing.destination?.name}
                          </span>
                        </div>
                        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-bold text-slate-900 flex items-center gap-1 border border-slate-100 shadow-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{listing.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      <div className="p-4 sm:p-5 space-y-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-slate-600 truncate">{listing.provider?.businessName}</span>
                          {listing.provider?.verificationStatus === 'APPROVED' && (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          )}
                        </div>

                        <Link href={`/listing/${listing.slug}`}>
                          <h4 className="text-base font-cinzel font-bold text-slate-900 group-hover:text-gold-800 transition line-clamp-2">
                            {listing.title}
                          </h4>
                        </Link>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-light">
                          {listing.shortDescription}
                        </p>

                        <div className="flex items-center gap-3 text-xs text-slate-500 font-light pt-2 border-t border-slate-100">
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gold-700" /> {listing.durationDays} Days</span>
                          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-gold-700" /> Up to {listing.maxGuests}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400 block">From</span>
                        <span className="text-base sm:text-lg font-black text-slate-950 font-cinzel">
                          {listing.currency} {listing.basePrice.toLocaleString()}
                        </span>
                      </div>

                      <Link
                        href={`/listing/${listing.slug}`}
                        className="px-3.5 sm:px-4 py-2 bg-gradient-to-r from-gold-500 to-amber-600 hover:brightness-105 text-slate-950 text-xs font-black rounded-xl shadow-xs transition hover:scale-[1.02]"
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
                    className="bg-white rounded-2xl border border-slate-200/90 hover:border-gold-400/80 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition shadow-xs"
                  >
                    <img src={coverImage} alt={listing.title} className="w-full sm:w-48 h-40 sm:h-36 object-cover rounded-xl shrink-0" />
                    <div className="flex-1 space-y-1.5 w-full">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gold-800 font-bold">{listing.destination?.name} • {listing.category?.name}</span>
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-amber-500" /> {listing.rating.toFixed(1)}
                        </span>
                      </div>
                      <Link href={`/listing/${listing.slug}`}>
                        <h4 className="text-base font-cinzel font-bold text-slate-900 hover:text-gold-800 transition line-clamp-1">{listing.title}</h4>
                      </Link>
                      <p className="text-xs text-slate-500 line-clamp-2 font-light">{listing.shortDescription}</p>
                    </div>
                    <div className="flex sm:flex-col items-center justify-between gap-2.5 shrink-0 sm:border-l sm:border-slate-100 sm:pl-4 w-full sm:w-auto">
                      <div className="text-left sm:text-center">
                        <span className="text-[10px] uppercase text-slate-400 font-bold block">Rate</span>
                        <span className="text-base font-black text-slate-950 font-cinzel">{listing.currency} {listing.basePrice.toLocaleString()}</span>
                      </div>
                      <Link
                        href={`/listing/${listing.slug}`}
                        className="px-4 py-2 bg-gradient-to-r from-gold-500 to-amber-600 hover:brightness-105 text-slate-950 font-black text-xs rounded-xl shadow-xs"
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
        <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
