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
  Sparkles,
  Crown,
  Award,
  Plane
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
      alert('Please log in as a traveler to submit a booking or enquiry request.');
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
      <div className="max-w-6xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs uppercase tracking-widest font-cinzel text-slate-600">Loading First-Class Suite & Availability...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-cinzel font-bold text-slate-900">Expedition Not Found</h2>
        <p className="text-xs text-slate-500">The requested suite or offering might have been unpublished or reserved.</p>
        <Link href="/search" className="inline-block px-5 py-2.5 bg-gradient-to-r from-gold-500 to-amber-600 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider shadow-xs">
          Return to Fleet Discovery
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 bg-[#faf8f5] text-slate-900 w-full overflow-hidden">
      
      {/* BREADCRUMB & HEADER TITLE */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-light text-slate-500">
          <Link href="/" className="hover:text-gold-700 transition">Royal Fleet</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link href={`/search?destination=${listing.destination?.slug}`} className="hover:text-gold-700 transition">
            {listing.destination?.name}
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-800 font-semibold truncate">{listing.category?.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="font-cinzel text-xl sm:text-3xl lg:text-4xl font-black text-slate-950 leading-tight">
              {listing.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-600 font-light">
              <span className="flex items-center gap-1 font-semibold text-amber-600">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {listing.rating.toFixed(1)} ({listing.reviewCount} VIP Reviews)
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gold-700" />
                {listing.destination?.name}, {listing.destination?.region}
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gold-700" />
                {listing.durationDays} Days / {listing.durationDays - 1} Nights
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-auto shrink-0">
            <button
              onClick={handleFavoriteToggle}
              className={`p-2.5 sm:p-3 rounded-xl border transition ${isFavorited ? 'bg-gold-50 border-gold-400 text-gold-700' : 'bg-white border-slate-200 text-slate-600 hover:border-gold-400 shadow-xs'}`}
              title="Save to favorites"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-gold-600 text-gold-600' : ''}`} />
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
              className="p-2.5 sm:p-3 rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-gold-400 transition shadow-xs"
              title="Share listing"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* LUXURY PHOTO GALLERY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm bg-white">
        <div className="md:col-span-2 h-[260px] sm:h-[360px] md:h-[440px] relative">
          <img
            src={images[activeImageIndex]}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-60" />
          {activeDiscount && (
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 inline-flex items-center gap-1.5 bg-gradient-to-r from-gold-500 to-amber-600 text-slate-950 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
              <Tag className="w-3.5 h-3.5" />
              {activeDiscount.percentage ? `${activeDiscount.percentage}% VIP PRIVILEGE ACTIVE` : 'EXCLUSIVE OFFER'}
            </div>
          )}
        </div>
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-[440px] p-2 bg-slate-50">
          {images.map((img: string, idx: number) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`h-20 sm:h-24 md:h-[136px] w-28 md:w-full shrink-0 rounded-xl overflow-hidden border-2 transition ${activeImageIndex === idx ? 'border-gold-500 ring-2 ring-gold-400/40' : 'border-transparent opacity-70 hover:opacity-100'}`}
            >
              <img src={img} alt="Gallery thumbnail" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* TWO COLUMN CONTENT: SUITE DETAILS & BOARDING PASS SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        
        {/* LEFT COLUMN: 2 SPANS */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          
          {/* VERIFIED OPERATOR SEAL */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3.5">
              <img
                src={listing.provider?.logoUrl || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=200&q=80'}
                alt={listing.provider?.businessName}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-cinzel font-bold text-slate-900">{listing.provider?.businessName}</h3>
                  {listing.provider?.verificationStatus === 'APPROVED' && (
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{listing.provider?.city}, {listing.provider?.country}</p>
                <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold text-gold-800">
                  <span>★ {listing.provider?.rating.toFixed(1)} Accredited Operator</span>
                  <span>•</span>
                  <span>NTN Audited</span>
                </div>
              </div>
            </div>

            <Link
              href={`/provider/${listing.providerId}`}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-gold-400 text-xs font-bold text-slate-800 bg-slate-50 transition self-start sm:self-auto shrink-0 shadow-xs"
            >
              Operator Dossier
            </Link>
          </div>

          {/* DESCRIPTION */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 space-y-3.5 shadow-xs">
            <h3 className="text-lg font-cinzel font-bold text-slate-900">Expedition Narrative & Scope</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light whitespace-pre-line">
              {listing.fullDescription || listing.shortDescription}
            </p>
          </div>

          {/* HIGHLIGHTS */}
          {highlights.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 space-y-3.5 shadow-xs">
              <h3 className="text-lg font-cinzel font-bold text-slate-900">First-Class Itinerary Highlights</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                    <span className="font-light">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INCLUSIONS & EXCLUSIONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white rounded-2xl border border-gold-200/80 p-5 sm:p-6 space-y-3 shadow-xs">
              <h4 className="text-xs font-cinzel font-bold text-gold-900 uppercase tracking-widest flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                Royal Inclusions
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {inclusions.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-gold-600 font-bold">•</span>
                    <span className="font-light">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 space-y-3 shadow-xs">
              <h4 className="text-xs font-cinzel font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                <XIcon className="w-4 h-4 text-rose-500" />
                Exclusions & Requirements
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                {exclusions.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span className="font-light">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* VERIFIED VIP REVIEWS */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-cinzel font-bold text-slate-900">Verified Guest Experiences</h3>
                <p className="text-xs text-slate-500">Only travelers with completed bookings can post verified reviews</p>
              </div>
              <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                {listing.rating.toFixed(1)} / 5.0
              </span>
            </div>

            {listing.reviews && listing.reviews.length > 0 ? (
              <div className="space-y-3.5">
                {listing.reviews.map((rev: any) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        {rev.user?.avatarUrl ? (
                          <img src={rev.user.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gold-100 text-gold-800 flex items-center justify-center text-xs font-bold">
                            {rev.user?.firstName?.[0]}
                          </div>
                        )}
                        <div>
                          <span className="text-xs font-bold text-slate-900">{rev.user?.firstName} {rev.user?.lastName}</span>
                          <span className="block text-[10px] text-emerald-700 font-semibold">Verified VIP Explorer</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>
                    <h5 className="text-xs font-bold text-slate-900">{rev.title}</h5>
                    <p className="text-xs text-slate-600 leading-relaxed font-light">{rev.comment}</p>

                    {rev.providerResponse && (
                      <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 space-y-1">
                        <span className="font-bold text-gold-900 block text-[11px]">Operator Response:</span>
                        <p className="font-light">{rev.providerResponse}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No verified guest reviews yet for this offering.</p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: FIRST CLASS BOARDING PASS SUMMARY CARD */}
        <aside className="sticky top-24 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-lg space-y-5">
          <div className="space-y-1 pb-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold-800 font-cinzel">First Class Suite</span>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                <Plane className="w-3 h-3 text-gold-600" /> Verified Fleet
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-cinzel font-black text-slate-950">
                {listing.currency} {currentPrice.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 font-light">/ explorer</span>
            </div>
            {activeDiscount && (
              <span className="inline-block text-[11px] font-bold text-gold-900 bg-gold-50 border border-gold-200 px-2.5 py-0.5 rounded-full mt-1">
                Save {activeDiscount.percentage}% with promo {activeDiscount.code}
              </span>
            )}
          </div>

          {/* PACKAGE TIERS IF AVAILABLE */}
          {listing.packages && listing.packages.length > 0 && (
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-700 font-cinzel">
                Select Suite Tier
              </label>
              <div className="space-y-2">
                {listing.packages.map((pkg: any) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`w-full p-3 rounded-xl border text-left transition ${
                      selectedPackageId === pkg.id
                        ? 'border-gold-500 bg-gold-50/70 ring-1 ring-gold-400/50'
                        : 'border-slate-200 hover:border-gold-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{pkg.name}</span>
                      <span className="text-xs font-black text-gold-800">
                        PKR {(pkg.discountedPrice || pkg.price).toLocaleString()}
                      </span>
                    </div>
                    {pkg.description && (
                      <p className="text-[11px] text-slate-500 mt-1 font-light">{pkg.description}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TRIP HIGHLIGHT SPECS */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Duration:</span>
              <span className="font-semibold text-slate-900">{listing.durationDays} Days</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Max Capacity:</span>
              <span className="font-semibold text-slate-900">{listing.maxGuests} Travelers</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Rendezvous Hub:</span>
              <span className="font-semibold text-slate-900 truncate max-w-[150px]">{listing.meetingPoint || 'Central VIP Terminal'}</span>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => setBookingModalOpen(true)}
              className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-gold-500 via-gold-600 to-amber-600 hover:brightness-105 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl shadow-md transition hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <CalendarCheck2 className="w-4 h-4 stroke-[2.5]" />
              Reserve Suite / Dispatch Enquiry
            </button>
            <p className="text-[11px] text-center text-slate-400 font-light">
              Zero advance charge. The certified operator confirms slot & provisions first.
            </p>
          </div>
        </aside>
      </div>

      {/* BOOKING / ENQUIRY MODAL WITH BOARDING PASS DESIGN */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl relative space-y-4 text-slate-900">
            <button
              onClick={() => {
                setBookingModalOpen(false);
                setBookingSuccess(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
            >
              <XIcon className="w-5 h-5" />
            </button>

            {bookingSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-cinzel font-bold text-slate-950">Boarding Pass Request Dispatched!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed font-light">
                  Your reservation reference <span className="font-bold text-gold-800">#{bookingSuccess.bookingReference}</span> has been routed directly to {listing.provider?.businessName}. You can track status and communicate in real-time.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <Link
                    href="/account/bookings"
                    className="px-5 py-2.5 bg-gradient-to-r from-gold-500 to-amber-600 hover:brightness-105 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition shadow-xs"
                  >
                    View My Bookings
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
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gold-800 font-cinzel">First-Class Reservation</span>
                  <h3 className="text-lg font-cinzel font-bold text-slate-950">{listing.title}</h3>
                  <p className="text-xs text-slate-500">Fleet Operator: {listing.provider?.businessName}</p>
                </div>

                {bookingError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                    {bookingError}
                  </div>
                )}

                <form onSubmit={handleBookingSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Departure Date</label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-gold-500 focus:outline-none font-semibold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Number of Guests in Suite</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={listing.maxGuests || 20}
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(parseInt(e.target.value, 10))}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-gold-500 focus:outline-none font-semibold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Special Concierge Requests</label>
                    <textarea
                      rows={3}
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      placeholder="e.g. VIP helicopter transfer, gourmet diet, photography guide, luggage assistance..."
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-gold-500 focus:outline-none placeholder:text-slate-400 text-slate-900"
                    />
                  </div>

                  {/* PRICE ESTIMATE SUMMARY */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="flex justify-between text-slate-600">
                      <span>Unit Rate ({guestsCount} guests):</span>
                      <span className="font-semibold text-slate-900">{listing.currency} {(currentPrice * guestsCount).toLocaleString()}</span>
                    </div>
                    {activeDiscount && (
                      <div className="flex justify-between text-rose-600 font-semibold">
                        <span>VIP Privilege Discount ({activeDiscount.percentage}%):</span>
                        <span>- {listing.currency} {((currentPrice * guestsCount * activeDiscount.percentage) / 100).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-black text-slate-950 pt-2 border-t border-slate-200 text-sm">
                      <span>Total Suite Estimate:</span>
                      <span className="text-gold-900 font-cinzel text-base">
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
                    className="w-full py-3.5 bg-gradient-to-r from-gold-500 via-gold-600 to-amber-600 hover:brightness-105 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl shadow-md transition disabled:opacity-50"
                  >
                    {bookingSubmitting ? 'Dispatching to Concierge...' : 'Confirm & Dispatch Reservation'}
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
