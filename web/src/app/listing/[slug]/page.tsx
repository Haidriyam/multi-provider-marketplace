'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  MapPin, 
  Compass, 
  Calendar, 
  Users, 
  Clock, 
  ShieldCheck, 
  Star, 
  Check, 
  X as XIcon, 
  Heart, 
  Share2, 
  Tag, 
  Send, 
  AlertCircle, 
  ChevronRight, 
  Info,
  CalendarCheck2,
  Sparkles
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { user } = useAuth();

  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [customerNotes, setCustomerNotes] = useState<string>('');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);
  const [bookingError, setBookingError] = useState<string>('');

  useEffect(() => {
    async function loadListing() {
      try {
        const res = await api.getListing(slug);
        if (res.success && res.data) {
          setListing(res.data);
          if (res.data.packages && res.data.packages.length > 0) {
            setSelectedPackageId(res.data.packages[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load listing details', err);
      } finally {
        setLoading(false);
      }
    }
    loadListing();
  }, [slug]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      alert('Please log in to save favorites.');
      return;
    }
    try {
      const res = await api.toggleFavorite(listing.id);
      if (res.success) {
        setIsFavorited(res.isFavorited);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in as a customer to submit a booking or enquiry request.');
      return;
    }

    setBookingError('');
    setBookingSubmitting(true);
    try {
      const payload = {
        listingId: listing.id,
        packageId: selectedPackageId || undefined,
        startDate: startDate || new Date().toISOString().split('T')[0],
        guestsCount: Number(guestsCount),
        customerNotes,
      };

      const res = await api.createBooking(payload);
      if (res.success && res.data) {
        setBookingSuccess(res.data);
      }
    } catch (err: any) {
      setBookingError(err.message || 'Failed to submit booking request');
    } finally {
      setBookingSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-500">Loading package details and availability...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Package Not Found</h2>
        <p className="text-xs text-slate-500">The requested offering might have been unpublished or removed.</p>
        <Link href="/search" className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold">
          Return to Discovery
        </Link>
      </div>
    );
  }

  const images = listing.media && listing.media.length > 0 
    ? listing.media.map((m: any) => m.url)
    : ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'];

  const inclusions: string[] = listing.inclusions ? JSON.parse(listing.inclusions) : [];
  const exclusions: string[] = listing.exclusions ? JSON.parse(listing.exclusions) : [];
  const highlights: string[] = listing.highlights ? JSON.parse(listing.highlights) : [];

  const activeDiscount = listing.discounts && listing.discounts.length > 0 ? listing.discounts[0] : null;

  // Selected package calculation
  const selectedPkg = listing.packages?.find((p: any) => p.id === selectedPackageId);
  const currentPrice = selectedPkg?.discountedPrice || selectedPkg?.price || listing.basePrice;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* BREADCRUMB & HEADER TITLE */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/search?destination=${listing.destination?.slug}`} className="hover:text-emerald-600">
            {listing.destination?.name}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-600 truncate">{listing.category?.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {listing.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1 font-semibold text-slate-800">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                {listing.rating.toFixed(1)} ({listing.reviewCount} reviews)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                {listing.destination?.name}, {listing.destination?.region}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {listing.durationDays} Days / {listing.durationDays - 1} Nights
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFavoriteToggle}
              className={`p-2.5 rounded-xl border transition ${isFavorited ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
              title="Save to favorites"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-600' : ''}`} />
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: listing.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Listing URL copied to clipboard!');
                }
              }}
              className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-slate-300 transition"
              title="Share listing"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* PHOTO GALLERY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-2xl overflow-hidden shadow-sm">
        <div className="md:col-span-2 h-[340px] sm:h-[420px] relative">
          <img
            src={images[activeImageIndex]}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          {activeDiscount && (
            <div className="absolute top-4 left-4 inline-flex items-center gap-1 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              <Tag className="w-3.5 h-3.5" />
              {activeDiscount.percentage ? `${activeDiscount.percentage}% DISCOUNT ACTIVE` : 'SPECIAL OFFER'}
            </div>
          )}
        </div>
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[420px]">
          {images.map((img: string, idx: number) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`h-24 md:h-[132px] w-full shrink-0 rounded-xl overflow-hidden border-2 transition ${activeImageIndex === idx ? 'border-emerald-600 ring-2 ring-emerald-500/30' : 'border-transparent opacity-80 hover:opacity-100'}`}
            >
              <img src={img} alt="Gallery thumbnail" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* TWO COLUMN CONTENT: DETAILS & BOOKING CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* LEFT COLUMN: 2 SPANS */}
        <div className="lg:col-span-2 space-y-8">
          {/* VERIFIED PROVIDER SUMMARY */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3.5">
              <img
                src={listing.provider?.logoUrl || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=200&q=80'}
                alt={listing.provider?.businessName}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-slate-900">{listing.provider?.businessName}</h3>
                  {listing.provider?.verificationStatus === 'APPROVED' && (
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{listing.provider?.city}, {listing.provider?.country}</p>
                <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold text-emerald-700">
                  <span>★ {listing.provider?.rating.toFixed(1)} Operator Rating</span>
                  <span>•</span>
                  <span>{listing.provider?.reviewCount} completed expeditions</span>
                </div>
              </div>
            </div>

            <Link
              href={`/provider/${listing.provider?.id}`}
              className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              View Profile
            </Link>
          </div>

          {/* OVERVIEW & HIGHLIGHTS */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Experience Overview</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {listing.fullDescription}
            </p>

            {highlights.length > 0 && (
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Key Highlights
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-medium text-emerald-950">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* INCLUSIONS & EXCLUSIONS */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">What's Included & Excluded</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Inclusions */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Inclusions
                </h4>
                <ul className="space-y-2">
                  {inclusions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <XIcon className="w-4 h-4 text-slate-400" />
                  Exclusions
                </h4>
                <ul className="space-y-2">
                  {exclusions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-500">
                      <XIcon className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ITINERARY */}
          {listing.itineraryItems && listing.itineraryItems.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Day-by-Day Itinerary</h2>
              <div className="space-y-3">
                {listing.itineraryItems.map((item: any) => (
                  <div key={item.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                        Day {item.dayNumber}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pl-12">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-4 text-[11px] font-medium text-slate-400 pl-12 pt-1">
                      {item.mealsIncluded && <span>🍴 {item.mealsIncluded}</span>}
                      {item.accommodation && <span>🏨 {item.accommodation}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REVIEWS & RATINGS */}
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Verified Customer Reviews</h2>
              <span className="text-xs font-bold text-emerald-600">
                ★ {listing.rating.toFixed(1)} / 5.0
              </span>
            </div>

            {listing.reviews && listing.reviews.length > 0 ? (
              <div className="space-y-4">
                {listing.reviews.map((rev: any) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {rev.user?.avatarUrl ? (
                          <img src={rev.user.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                            {rev.user?.firstName?.[0]}
                          </div>
                        )}
                        <div>
                          <span className="text-xs font-bold text-slate-900">{rev.user?.firstName} {rev.user?.lastName}</span>
                          <span className="block text-[10px] text-emerald-600 font-semibold">Verified Traveler</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>
                    <h5 className="text-xs font-bold text-slate-900">{rev.title}</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>

                    {rev.providerResponse && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1">
                        <span className="font-bold text-slate-900 block text-[11px]">Provider Response:</span>
                        <p>{rev.providerResponse}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No reviews yet for this offering.</p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: BOOKING / ENQUIRY STICKY CARD */}
        <aside className="sticky top-24 bg-white rounded-3xl border border-slate-200 p-6 shadow-xl space-y-5">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Starting Price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">
                {listing.currency} {currentPrice.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 font-medium">/ person</span>
            </div>
            {activeDiscount && (
              <span className="inline-block text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full mt-1">
                Save {activeDiscount.percentage}% with promo {activeDiscount.code}
              </span>
            )}
          </div>

          {/* PACKAGE TIERS IF AVAILABLE */}
          {listing.packages && listing.packages.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Select Package Tier
              </label>
              <div className="space-y-1.5">
                {listing.packages.map((pkg: any) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`w-full p-2.5 rounded-xl border text-left transition ${
                      selectedPackageId === pkg.id
                        ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{pkg.name}</span>
                      <span className="text-xs font-black text-emerald-700">
                        PKR {(pkg.discountedPrice || pkg.price).toLocaleString()}
                      </span>
                    </div>
                    {pkg.description && (
                      <p className="text-[11px] text-slate-500 mt-0.5">{pkg.description}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TRIP HIGHLIGHT SPECS */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Duration:</span>
              <span className="font-semibold text-slate-900">{listing.durationDays} Days</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Max Capacity:</span>
              <span className="font-semibold text-slate-900">{listing.maxGuests} Travelers</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Meeting Point:</span>
              <span className="font-semibold text-slate-900 truncate max-w-[150px]">{listing.meetingPoint || 'Central Pick-up'}</span>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => setBookingModalOpen(true)}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-600/20 transition hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <CalendarCheck2 className="w-4 h-4" />
              Request Booking / Enquiry
            </button>
            <p className="text-[11px] text-center text-slate-400">
              No immediate card charge. Provider confirms availability first.
            </p>
          </div>
        </aside>
      </div>

      {/* BOOKING / ENQUIRY MODAL */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-100 space-y-5">
            <button
              onClick={() => {
                setBookingModalOpen(false);
                setBookingSuccess(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <XIcon className="w-5 h-5" />
            </button>

            {bookingSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Request Successfully Submitted!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Your enquiry <span className="font-bold text-slate-900">#{bookingSuccess.bookingReference}</span> has been dispatched to {listing.provider?.businessName}. You can track status and chat in real-time.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <Link
                    href="/account/bookings"
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition"
                  >
                    Go to My Bookings
                  </Link>
                  <button
                    onClick={() => setBookingModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Request Form</span>
                  <h3 className="text-lg font-bold text-slate-900">{listing.title}</h3>
                  <p className="text-xs text-slate-500">Provider: {listing.provider?.businessName}</p>
                </div>

                {bookingError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                    {bookingError}
                  </div>
                )}

                <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Desired Start Date</label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Number of Guests</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={listing.maxGuests || 20}
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(parseInt(e.target.value, 10))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Special Inquiries or Requirements</label>
                    <textarea
                      rows={3}
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      placeholder="e.g. Diet requirements, pick-up point, photography assistance, private room preference..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-400"
                    />
                  </div>

                  {/* PRICE ESTIMATE SUMMARY */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex justify-between text-slate-600">
                      <span>Unit Rate ({guestsCount} guests):</span>
                      <span className="font-semibold">{listing.currency} {(currentPrice * guestsCount).toLocaleString()}</span>
                    </div>
                    {activeDiscount && (
                      <div className="flex justify-between text-rose-600 font-semibold">
                        <span>Discount ({activeDiscount.percentage}%):</span>
                        <span>- {listing.currency} {((currentPrice * guestsCount * activeDiscount.percentage) / 100).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-black text-slate-900 pt-1 border-t border-slate-200 text-sm">
                      <span>Estimated Total:</span>
                      <span>
                        {listing.currency}{' '}
                        {activeDiscount
                          ? (currentPrice * guestsCount * (1 - activeDiscount.percentage / 100)).toLocaleString()
                          : (currentPrice * guestsCount).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={bookingSubmitting}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition disabled:opacity-50"
                  >
                    {bookingSubmitting ? 'Submitting Request...' : 'Submit Request to Provider'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
