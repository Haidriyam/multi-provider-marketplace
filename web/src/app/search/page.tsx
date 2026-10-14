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
  Sparkles
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* SEARCH HEADER & BAR */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by keywords, mountains, package titles, or operator..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl"
            >
              <Filter className="w-4 h-4" />
              Filters ({activeFiltersCount})
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Highest Rated</option>
                <option value="newest">Newest Added</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center border border-slate-200 rounded-xl overflow-hidden p-0.5 bg-slate-50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition ${viewMode === 'list' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Pill Row */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-medium">Active filters:</span>
            {selectedDestination && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold">
                Destination: {destinations.find(d => d.slug === selectedDestination)?.name || selectedDestination}
                <button onClick={() => setSelectedDestination('')}><X className="w-3 h-3 hover:text-emerald-950" /></button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold">
                Category: {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
                <button onClick={() => setSelectedCategory('')}><X className="w-3 h-3 hover:text-emerald-950" /></button>
              </span>
            )}
            {verifiedOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 font-semibold">
                Verified Only
                <button onClick={() => setVerifiedOnly(false)}><X className="w-3 h-3 hover:text-blue-950" /></button>
              </span>
            )}
            {hasDiscount && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 font-semibold">
                Discounts Only
                <button onClick={() => setHasDiscount(false)}><X className="w-3 h-3 hover:text-rose-950" /></button>
              </span>
            )}
            {minRating && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-semibold">
                {minRating}+ Stars
                <button onClick={() => setMinRating('')}><X className="w-3 h-3 hover:text-amber-950" /></button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-slate-500 hover:text-rose-600 font-semibold ml-auto underline"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* MAIN TWO-COLUMN LAYOUT: SIDEBAR + RESULTS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className={`md:block ${mobileFilterOpen ? 'block' : 'hidden'} bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-6 sticky top-24`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              Filter Results
            </h3>
            {activeFiltersCount > 0 && (
              <button onClick={clearFilters} className="text-xs text-emerald-600 hover:underline font-semibold">
                Reset
              </button>
            )}
          </div>

          {/* Destination Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Destination
            </label>
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Destinations ({destinations.length})</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.slug}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Budget (PKR)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min PKR"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Max PKR"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
              />
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Minimum Rating
            </label>
            <div className="space-y-1.5">
              {[
                { val: '4.8', label: '4.8 & above (Exceptional)' },
                { val: '4.5', label: '4.5 & above (Very Good)' },
                { val: '4.0', label: '4.0 & above (Good)' },
              ].map((r) => (
                <label key={r.val} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="minRating"
                    checked={minRating === r.val}
                    onChange={() => setMinRating(minRating === r.val ? '' : r.val)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Verification & Discounts Checkboxes */}
          <div className="pt-3 border-t border-slate-100 space-y-2.5">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Operators Only
              </span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={hasDiscount}
                onChange={(e) => setHasDiscount(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
              />
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-rose-600" />
                Active Discounts & Offers
              </span>
            </label>
          </div>
        </aside>

        {/* RESULTS COLUMN */}
        <main className="md:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
            <span>Showing {listings.length} of {totalCount} verified offerings</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-80 bg-slate-100 animate-pulse rounded-2xl border border-slate-200" />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No packages matched your criteria</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try widening your price range, choosing another destination, or clearing active filters to see all available packages.
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* GRID VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {listings.map((listing) => {
                const coverImage = listing.media?.[0]?.url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
                const hasDiscount = listing.discounts && listing.discounts.length > 0;
                const discount = hasDiscount ? listing.discounts[0] : null;

                return (
                  <div
                    key={listing.id}
                    className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src={coverImage}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          {hasDiscount && (
                            <span className="inline-flex items-center gap-1 bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md">
                              <Tag className="w-3 h-3" />
                              {discount.percentage ? `${discount.percentage}% OFF` : 'SPECIAL'}
                            </span>
                          )}
                          <span className="bg-slate-900/80 backdrop-blur text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                            {listing.destination?.name}
                          </span>
                        </div>
                        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-slate-900 flex items-center gap-1 shadow-sm">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span>{listing.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-slate-600 truncate">{listing.provider?.businessName}</span>
                          {listing.provider?.verificationStatus === 'APPROVED' && (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          )}
                        </div>

                        <Link href={`/listing/${listing.slug}`}>
                          <h4 className="text-base font-bold text-slate-900 hover:text-emerald-600 transition line-clamp-2">
                            {listing.title}
                          </h4>
                        </Link>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {listing.shortDescription}
                        </p>

                        <div className="flex items-center gap-3 text-xs text-slate-400 font-medium pt-2 border-t border-slate-100">
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {listing.durationDays} Days</span>
                          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Up to {listing.maxGuests}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">From</span>
                        <span className="text-base font-black text-slate-900">
                          {listing.currency} {listing.basePrice.toLocaleString()}
                        </span>
                      </div>
                      <Link
                        href={`/listing/${listing.slug}`}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition"
                      >
                        View Offering
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
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col sm:flex-row gap-5 p-4 items-center"
                  >
                    <div className="w-full sm:w-48 h-40 rounded-xl overflow-hidden shrink-0 relative">
                      <img src={coverImage} alt={listing.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                        {listing.destination?.name}
                      </div>
                    </div>

                    <div className="flex-1 space-y-2 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-600">{listing.provider?.businessName}</span>
                        {listing.provider?.verificationStatus === 'APPROVED' && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                        <span className="ml-auto flex items-center gap-1 text-xs font-bold text-slate-900">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {listing.rating.toFixed(1)}
                        </span>
                      </div>

                      <Link href={`/listing/${listing.slug}`}>
                        <h4 className="text-base font-bold text-slate-900 hover:text-emerald-600 transition">
                          {listing.title}
                        </h4>
                      </Link>

                      <p className="text-xs text-slate-500 line-clamp-2">
                        {listing.shortDescription}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>{listing.durationDays} Days</span>
                        <span>•</span>
                        <span>Max {listing.maxGuests} guests</span>
                        <span>•</span>
                        <span>{listing.category?.name}</span>
                      </div>
                    </div>

                    <div className="sm:border-l sm:border-slate-100 sm:pl-6 text-right shrink-0 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Total from</span>
                      <div className="text-lg font-black text-slate-900">
                        {listing.currency} {listing.basePrice.toLocaleString()}
                      </div>
                      <Link
                        href={`/listing/${listing.slug}`}
                        className="inline-block px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition"
                      >
                        Details
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
    <Suspense fallback={<div className="p-12 text-center text-sm font-semibold text-slate-500">Loading discovery engine...</div>}>
      <SearchContent />
    </Suspense>
  );
}
