'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  Plus, 
  Calendar, 
  ShieldCheck, 
  Star, 
  Users, 
  TrendingUp, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  FileText, 
  X, 
  Clock, 
  Send, 
  Tag, 
  UploadCloud,
  ChevronRight
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function ProviderDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'bookings' | 'verification'>('overview');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Listing Wizard State
  const [newListingModal, setNewListingModal] = useState(false);
  const [listingTitle, setListingTitle] = useState('');
  const [listingDestinationId, setListingDestinationId] = useState('');
  const [listingCategoryId, setListingCategoryId] = useState('');
  const [listingBasePrice, setListingBasePrice] = useState<number>(85000);
  const [listingDuration, setListingDuration] = useState<number>(3);
  const [listingMaxGuests, setListingMaxGuests] = useState<number>(10);
  const [listingShortDesc, setListingShortDesc] = useState('');
  const [listingFullDesc, setListingFullDesc] = useState('');
  const [listingImageUrl, setListingImageUrl] = useState('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80');
  const [listingInclusions, setListingInclusions] = useState('4x4 Transport, Certified Alpine Guide, Hotel stays, All meals');
  const [listingExclusions, setListingExclusions] = useState('Airfares, Personal insurance');
  const [listingSubmitting, setListingSubmitting] = useState(false);
  const [listingSuccess, setListingSuccess] = useState('');

  // Booking Chat & Action Drawer
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatSending, setChatSending] = useState(false);

  // Verification Form State
  const [tradeLicenseNo, setTradeLicenseNo] = useState('');
  const [taxId, setTaxId] = useState('');
  const [verificationDocs, setVerificationDocs] = useState('https://storage.marketplace.com/docs/provider-license.pdf');
  const [verificationSubmitting, setVerificationSubmitting] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [dashRes, listRes, bookRes, destRes, catRes] = await Promise.all([
        api.getProviderDashboard().catch(() => ({ success: false })),
        api.getMyProviderListings().catch(() => ({ success: false, data: [] })),
        api.getProviderBookings().catch(() => ({ success: false, data: [] })),
        api.getDestinations().catch(() => ({ success: false, data: [] })),
        api.getCategories().catch(() => ({ success: false, data: [] })),
      ]);

      if (dashRes.success) setDashboardData(dashRes.data);
      if (listRes.success) setListings(listRes.data || []);
      if (bookRes.success) setBookings(bookRes.data || []);
      if (destRes.success) {
        setDestinations(destRes.data || []);
        if (destRes.data.length > 0) setListingDestinationId(destRes.data[0].id);
      }
      if (catRes.success) {
        setCategories(catRes.data || []);
        if (catRes.data.length > 0) setListingCategoryId(catRes.data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setListingSubmitting(true);
    setListingSuccess('');
    try {
      const payload = {
        title: listingTitle,
        destinationId: listingDestinationId,
        categoryId: listingCategoryId,
        shortDescription: listingShortDesc,
        fullDescription: listingFullDesc,
        basePrice: Number(listingBasePrice),
        currency: 'PKR',
        durationDays: Number(listingDuration),
        maxGuests: Number(listingMaxGuests),
        inclusions: listingInclusions.split(',').map(s => s.trim()).filter(Boolean),
        exclusions: listingExclusions.split(',').map(s => s.trim()).filter(Boolean),
        status: 'PENDING_APPROVAL', // Submitted for admin moderation
        media: [{ url: listingImageUrl, isCover: true }],
      };

      const res = await api.createListing(payload);
      if (res.success) {
        setListingSuccess('Listing submitted! It is now pending administrative approval.');
        setTimeout(() => {
          setNewListingModal(false);
          loadData();
        }, 1200);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create listing');
    } finally {
      setListingSubmitting(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: string, notes?: string) => {
    try {
      const res = await api.updateBookingStatus(bookingId, status, notes);
      if (res.success) {
        await loadData();
        if (selectedBooking && selectedBooking.id === bookingId) {
          setSelectedBooking((prev: any) => ({ ...prev, status }));
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !selectedBooking) return;
    setChatSending(true);
    try {
      const res = await api.sendBookingMessage(selectedBooking.id, chatMessage.trim());
      if (res.success && res.data) {
        setSelectedBooking((prev: any) => ({
          ...prev,
          messages: [...(prev.messages || []), res.data]
        }));
        setChatMessage('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setChatSending(false);
    }
  };

  const handleSubmitVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationSubmitting(true);
    setVerificationMessage('');
    try {
      const res = await api.submitVerification({
        tradeLicenseNo,
        taxId,
        verificationDocs,
      });
      if (res.success) {
        setVerificationMessage('Verification documents successfully submitted for administrative review.');
        await loadData();
      }
    } catch (err: any) {
      setVerificationMessage(err.message || 'Verification submission failed');
    } finally {
      setVerificationSubmitting(false);
    }
  };

  if (!user || (user.role !== 'PROVIDER' && user.role !== 'SUPER_ADMIN')) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Provider Account Required</h2>
        <p className="text-xs text-slate-500">
          Switch to <span className="font-bold text-emerald-600">Apex Provider</span> using the quick demo bar at the top to access the Provider Dashboard.
        </p>
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    totalListings: listings.length,
    pendingRequests: bookings.filter(b => b.status === 'PENDING').length,
    confirmedBookings: bookings.filter(b => b.status === 'CONFIRMED').length,
    completedBookings: bookings.filter(b => b.status === 'COMPLETED').length,
    totalRevenue: bookings.filter(b => ['CONFIRMED', 'COMPLETED'].includes(b.status)).reduce((s, b) => s + b.finalPrice, 0),
  };

  const verificationStatus = dashboardData?.verificationStatus || user.verificationStatus || 'APPROVED';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* HEADER & VERIFICATION NOTICE */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">
              {dashboardData?.businessName || 'Provider Control Hub'}
            </h1>
            {verificationStatus === 'APPROVED' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Licensed Operator
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <Clock className="w-3.5 h-3.5" />
                Verification Status: {verificationStatus}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">Manage your business profile, packages catalog, customer requests, and transactions.</p>
        </div>

        <button
          onClick={() => setNewListingModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New Package
        </button>
      </div>

      {/* OPERATIONAL KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Published Listings</span>
          <div className="text-2xl font-black text-slate-900">{stats.totalListings}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Pending Requests</span>
          <div className="text-2xl font-black text-amber-600">{stats.pendingRequests}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Confirmed</span>
          <div className="text-2xl font-black text-emerald-600">{stats.confirmedBookings}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Completed Trips</span>
          <div className="text-2xl font-black text-blue-600">{stats.completedBookings}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1 col-span-2 lg:col-span-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Gross Volume (PKR)</span>
          <div className="text-xl font-black text-slate-900 truncate">PKR {stats.totalRevenue.toLocaleString()}</div>
        </div>
      </div>

      {/* DASHBOARD TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl transition ${activeTab === 'overview' ? 'bg-emerald-600 text-white' : 'bg-white border text-slate-600'}`}
        >
          Requests & Bookings ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2 rounded-xl transition ${activeTab === 'listings' ? 'bg-emerald-600 text-white' : 'bg-white border text-slate-600'}`}
        >
          My Listings Catalog ({listings.length})
        </button>
        <button
          onClick={() => setActiveTab('verification')}
          className={`px-4 py-2 rounded-xl transition ${activeTab === 'verification' ? 'bg-emerald-600 text-white' : 'bg-white border text-slate-600'}`}
        >
          Verification & Credentials
        </button>
      </div>

      {/* TAB 1: BOOKING & REQUEST MANAGEMENT */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Incoming Customer Requests</h3>
          {bookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
              No booking requests received yet.
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">#{booking.bookingReference}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500">From: {booking.user?.firstName} {booking.user?.lastName} ({booking.user?.email})</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                      booking.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      booking.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      booking.status === 'COMPLETED' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center text-xs">
                    <div className="md:col-span-2">
                      <h4 className="font-bold text-slate-900">{booking.listing?.title}</h4>
                      <p className="text-slate-500 mt-0.5">
                        Dates: {booking.startDate} • {booking.guestsCount} Travelers
                      </p>
                      {booking.customerNotes && (
                        <p className="italic text-slate-600 mt-1">"{booking.customerNotes}"</p>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Quote</span>
                      <span className="text-base font-black text-slate-900">
                        {booking.currency} {booking.finalPrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-start md:justify-end gap-2">
                      <button
                        onClick={async () => {
                          const res = await api.getBookingDetails(booking.id);
                          if (res.success) setSelectedBooking(res.data);
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                        Chat & Details
                      </button>

                      {booking.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleUpdateBookingStatus(booking.id, 'CONFIRMED', 'Provider accepted booking')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleUpdateBookingStatus(booking.id, 'REJECTED', 'Fully booked on selected dates')}
                            className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold rounded-xl"
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {booking.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleUpdateBookingStatus(booking.id, 'COMPLETED', 'Tour completed successfully')}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LISTINGS CATALOG */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">All Created Listings</h3>
            <button
              onClick={() => setNewListingModal(true)}
              className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Package
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map((l) => (
              <div key={l.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-4 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="h-40 rounded-xl overflow-hidden relative">
                    <img src={l.media?.[0]?.url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'} alt="" className="w-full h-full object-cover" />
                    <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded ${
                      l.status === 'PUBLISHED' ? 'bg-emerald-600 text-white' :
                      l.status === 'PENDING_APPROVAL' ? 'bg-amber-500 text-white' : 'bg-slate-700 text-white'
                    }`}>
                      {l.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mt-2 line-clamp-2">{l.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{l.destination?.name} • {l.durationDays} Days</p>
                  <div className="text-sm font-black text-slate-900 mt-2">
                    PKR {l.basePrice.toLocaleString()}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                  <Link href={`/listing/${l.slug}`} className="text-emerald-600 hover:underline">
                    View Public Page
                  </Link>
                  <span className="text-slate-400">
                    {l._count?.bookings || 0} Bookings
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: VERIFICATION */}
      {activeTab === 'verification' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-2xl space-y-5 text-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Business Verification & Credentials</h3>
            <p className="text-slate-500 mt-1">To ensure platform safety, submit your official department licenses and tax identification numbers.</p>
          </div>

          {verificationMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 font-semibold">
              {verificationMessage}
            </div>
          )}

          <form onSubmit={handleSubmitVerification} className="space-y-3.5">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tourism Department / Trade License No.</label>
              <input
                type="text"
                required
                value={tradeLicenseNo}
                onChange={(e) => setTradeLicenseNo(e.target.value)}
                placeholder="e.g. LIC-GB-2024-881"
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">FBR National Tax Number (NTN)</label>
              <input
                type="text"
                required
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                placeholder="e.g. NTN-9841203-7"
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Verification Document Link (PDF or Cloud URL)</label>
              <input
                type="text"
                required
                value={verificationDocs}
                onChange={(e) => setVerificationDocs(e.target.value)}
                placeholder="https://cloud.com/docs/license.pdf"
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>

            <button
              type="submit"
              disabled={verificationSubmitting}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition"
            >
              {verificationSubmitting ? 'Submitting...' : 'Submit Credentials for Verification'}
            </button>
          </form>
        </div>
      )}

      {/* CREATE NEW LISTING MODAL */}
      {newListingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative border border-slate-100 my-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setNewListingModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">New Offering Wizard</span>
              <h3 className="text-lg font-bold text-slate-900">Publish a Travel Package</h3>
              <p className="text-xs text-slate-500">Provide complete transparent details to pass administrative moderation swiftly.</p>
            </div>

            {listingSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold">
                {listingSuccess}
              </div>
            )}

            <form onSubmit={handleCreateListing} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Package Title</label>
                <input
                  type="text"
                  required
                  value={listingTitle}
                  onChange={(e) => setListingTitle(e.target.value)}
                  placeholder="e.g. Fairy Meadows & Nanga Parbat Basecamp 5-Day Expedition"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Destination</label>
                  <select
                    value={listingDestinationId}
                    onChange={(e) => setListingDestinationId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    {destinations.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={listingCategoryId}
                    onChange={(e) => setListingCategoryId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Base Price (PKR)</label>
                  <input
                    type="number"
                    required
                    value={listingBasePrice}
                    onChange={(e) => setListingBasePrice(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    required
                    value={listingDuration}
                    onChange={(e) => setListingDuration(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Guests</label>
                  <input
                    type="number"
                    required
                    value={listingMaxGuests}
                    onChange={(e) => setListingMaxGuests(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 border rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Description (Summary)</label>
                <input
                  type="text"
                  required
                  value={listingShortDesc}
                  onChange={(e) => setListingShortDesc(e.target.value)}
                  placeholder="One sentence summary highlighting vehicle, stays, and scenic points..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Detailed Itinerary Description</label>
                <textarea
                  rows={3}
                  required
                  value={listingFullDesc}
                  onChange={(e) => setListingFullDesc(e.target.value)}
                  placeholder="Detailed explanation of the full expedition..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  required
                  value={listingImageUrl}
                  onChange={(e) => setListingImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Inclusions (Comma separated)</label>
                  <input
                    type="text"
                    value={listingInclusions}
                    onChange={(e) => setListingInclusions(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Exclusions (Comma separated)</label>
                  <input
                    type="text"
                    value={listingExclusions}
                    onChange={(e) => setListingExclusions(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={listingSubmitting}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50"
              >
                {listingSubmitting ? 'Submitting to Moderation...' : 'Submit Listing for Approval'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DRAWER: OPERATOR CHAT & DETAILS */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Customer Communication</span>
                <h3 className="text-sm font-bold text-slate-900">Request #{selectedBooking.bookingReference}</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 border text-xs space-y-1.5">
                <p><span className="font-bold">Customer:</span> {selectedBooking.user?.firstName} {selectedBooking.user?.lastName}</p>
                <p><span className="font-bold">Email:</span> {selectedBooking.user?.email}</p>
                <p><span className="font-bold">Phone:</span> {selectedBooking.user?.phone || 'On File'}</p>
                <p><span className="font-bold">Dates:</span> {selectedBooking.startDate}</p>
                <p><span className="font-bold">Status:</span> {selectedBooking.status}</p>
              </div>

              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Thread</h4>
                {selectedBooking.messages?.map((msg: any) => {
                  const isMe = msg.senderId === user.id;
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <span className="text-[10px] text-slate-400 mb-0.5">
                        {isMe ? 'You (Operator)' : selectedBooking.user?.firstName}
                      </span>
                      <div className={`p-3 rounded-2xl max-w-[85%] text-xs ${isMe ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                        {msg.message}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSendChatMessage} className="p-3 border-t bg-white flex items-center gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Reply to customer..."
                className="flex-1 px-3 py-2 text-xs border rounded-xl focus:outline-none"
              />
              <button
                type="submit"
                disabled={chatSending || !chatMessage.trim()}
                className="p-2 bg-emerald-600 text-white rounded-xl"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
