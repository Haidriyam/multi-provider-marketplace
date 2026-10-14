'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Users, 
  Briefcase, 
  Layers, 
  Calendar, 
  Star, 
  FileText, 
  Check, 
  X, 
  AlertTriangle, 
  Search, 
  ExternalLink,
  SlidersHorizontal,
  Eye,
  TrendingUp,
  History
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'providers' | 'listings' | 'bookings' | 'users' | 'reviews' | 'audit'>('overview');
  const [overview, setOverview] = useState<any>(null);
  const [providers, setProviders] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Rejection/Feedback modal state
  const [actionModal, setActionModal] = useState<{
    type: 'PROVIDER_REJECT' | 'LISTING_REJECT' | 'STATUS_OVERRIDE' | null;
    targetId: string | null;
    title: string;
  }>({ type: null, targetId: null, title: '' });
  const [feedbackNote, setFeedbackNote] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [ovRes, provRes, listRes, bookRes, userRes, revRes, auditRes] = await Promise.all([
        api.getAdminOverview().catch(() => ({ success: false })),
        api.getAdminProviders().catch(() => ({ success: false, data: [] })),
        api.getAdminListings().catch(() => ({ success: false, data: [] })),
        api.getAdminBookings().catch(() => ({ success: false, data: [] })),
        api.getAdminUsers().catch(() => ({ success: false, data: [] })),
        api.getAdminReviews().catch(() => ({ success: false, data: [] })),
        api.getAuditLogs().catch(() => ({ success: false, data: [] })),
      ]);

      if (ovRes.success) setOverview(ovRes.data);
      if (provRes.success) setProviders(provRes.data || []);
      if (listRes.success) setListings(listRes.data || []);
      if (bookRes.success) setBookings(bookRes.data || []);
      if (userRes.success) setUsersList(userRes.data || []);
      if (revRes.success) setReviewsList(revRes.data || []);
      if (auditRes.success) setAuditLogs(auditRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && (user.role === 'SUPER_ADMIN' || user.role === 'OPERATIONS_ADMIN')) {
      loadData();
    }
  }, [user]);

  const handleVerifyProvider = async (providerId: string, status: 'APPROVED' | 'REJECTED' | 'SUSPENDED', notes?: string) => {
    try {
      const res = await api.verifyProvider(providerId, status, notes);
      if (res.success) {
        await loadData();
      }
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  const handleModerateListing = async (listingId: string, status: 'PUBLISHED' | 'REJECTED' | 'SUSPENDED', rejectionReason?: string) => {
    try {
      const res = await api.moderateListing(listingId, { status, rejectionReason });
      if (res.success) {
        await loadData();
      }
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const res = await api.toggleUserStatus(userId, { isActive });
      if (res.success) {
        await loadData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update user');
    }
  };

  const handleModerateReview = async (reviewId: string, status: 'PUBLISHED' | 'HIDDEN') => {
    try {
      const res = await api.moderateReview(reviewId, status);
      if (res.success) {
        await loadData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to moderate review');
    }
  };

  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'OPERATIONS_ADMIN')) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Administrative Access Required</h2>
        <p className="text-xs text-slate-500">
          Switch to <span className="font-bold text-purple-600">Super Admin</span> or <span className="font-bold text-blue-600">Ops Admin</span> via the top demo bar to inspect the Admin Dashboard.
        </p>
      </div>
    );
  }

  const kpis = overview?.kpis || {
    totalUsers: usersList.length,
    totalProviders: providers.length,
    pendingProviders: providers.filter(p => p.verificationStatus === 'PENDING').length,
    totalListings: listings.length,
    pendingListings: listings.filter(l => l.status === 'PENDING_APPROVAL').length,
    totalBookings: bookings.length,
    totalGMV: bookings.filter(b => ['CONFIRMED', 'COMPLETED'].includes(b.status)).reduce((s, b) => s + b.finalPrice, 0),
    reportedReviews: reviewsList.filter(r => r.status === 'REPORTED').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* HEADER */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black">Marketplace Operational Control Panel</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold">
              {user.role}
            </span>
          </div>
          <p className="text-xs text-slate-400">Complete moderation over providers, listings, user accounts, dispute resolutions, and immutable audit trails.</p>
        </div>
      </div>

      {/* KPIS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Users</span>
          <div className="text-2xl font-black text-slate-900">{kpis.totalUsers}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Pending Provider Verifications</span>
          <div className="text-2xl font-black text-amber-600">{kpis.pendingProviders}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">Pending Listing Approvals</span>
          <div className="text-2xl font-black text-purple-600">{kpis.pendingListings}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Marketplace GMV</span>
          <div className="text-2xl font-black text-slate-900 truncate">PKR {kpis.totalGMV.toLocaleString()}</div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl transition ${activeTab === 'overview' ? 'bg-purple-600 text-white' : 'bg-white border text-slate-600'}`}
        >
          Overview & Queue
        </button>
        <button
          onClick={() => setActiveTab('providers')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${activeTab === 'providers' ? 'bg-purple-600 text-white' : 'bg-white border text-slate-600'}`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          Providers ({providers.length})
          {kpis.pendingProviders > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${activeTab === 'listings' ? 'bg-purple-600 text-white' : 'bg-white border text-slate-600'}`}
        >
          <Layers className="w-3.5 h-3.5" />
          Listings Moderation ({listings.length})
          {kpis.pendingListings > 0 && (
            <span className="w-2 h-2 rounded-full bg-purple-400" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${activeTab === 'bookings' ? 'bg-purple-600 text-white' : 'bg-white border text-slate-600'}`}
        >
          <Calendar className="w-3.5 h-3.5" />
          All Bookings ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${activeTab === 'users' ? 'bg-purple-600 text-white' : 'bg-white border text-slate-600'}`}
        >
          <Users className="w-3.5 h-3.5" />
          User Management ({usersList.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${activeTab === 'reviews' ? 'bg-purple-600 text-white' : 'bg-white border text-slate-600'}`}
        >
          <Star className="w-3.5 h-3.5" />
          Review Moderation ({reviewsList.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${activeTab === 'audit' ? 'bg-purple-600 text-white' : 'bg-white border text-slate-600'}`}
        >
          <History className="w-3.5 h-3.5" />
          Audit Logs
        </button>
      </div>

      {/* TAB 1: OVERVIEW & PENDING QUEUE */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pending Providers Queue */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Providers Pending Verification ({providers.filter(p => p.verificationStatus === 'PENDING').length})
            </h3>
            <div className="space-y-3">
              {providers.filter(p => p.verificationStatus === 'PENDING').length === 0 ? (
                <p className="text-xs text-slate-400 italic">No providers pending verification.</p>
              ) : (
                providers.filter(p => p.verificationStatus === 'PENDING').map(p => (
                  <div key={p.id} className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 text-xs space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900">{p.businessName}</h4>
                        <p className="text-slate-500">{p.city}, {p.country} • License: {p.tradeLicenseNo || 'Submitted'}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleVerifyProvider(p.id, 'APPROVED', 'License and identity verified')}
                          className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleVerifyProvider(p.id, 'REJECTED', 'Documents incomplete')}
                          className="px-2.5 py-1 bg-rose-50 text-rose-600 font-semibold rounded-lg hover:bg-rose-100 transition"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pending Listings Moderation Queue */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-600" />
              Listings Pending Moderation ({listings.filter(l => l.status === 'PENDING_APPROVAL').length})
            </h3>
            <div className="space-y-3">
              {listings.filter(l => l.status === 'PENDING_APPROVAL').length === 0 ? (
                <p className="text-xs text-slate-400 italic">No listings awaiting moderation.</p>
              ) : (
                listings.filter(l => l.status === 'PENDING_APPROVAL').map(l => (
                  <div key={l.id} className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/40 text-xs space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900">{l.title}</h4>
                        <p className="text-slate-500">By {l.provider?.businessName} • PKR {l.basePrice.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleModerateListing(l.id, 'PUBLISHED')}
                          className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition"
                        >
                          Publish
                        </button>
                        <button
                          onClick={() => handleModerateListing(l.id, 'REJECTED', 'Needs clearer itinerary breakdown')}
                          className="px-2.5 py-1 bg-rose-50 text-rose-600 font-semibold rounded-lg hover:bg-rose-100 transition"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROVIDERS MANAGEMENT */}
      {activeTab === 'providers' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 font-bold text-xs uppercase text-slate-400">
            Registered Marketplace Service Providers ({providers.length})
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="p-3">Business</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">License & NTN</th>
                  <th className="p-3">Verification</th>
                  <th className="p-3">Offerings</th>
                  <th className="p-3 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {providers.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-bold text-slate-900">{p.businessName}</td>
                    <td className="p-3 text-slate-500">{p.city}, {p.country}</td>
                    <td className="p-3 text-slate-600">{p.tradeLicenseNo || 'N/A'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        p.verificationStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                        p.verificationStatus === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {p.verificationStatus}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">{p._count?.listings || 0}</td>
                    <td className="p-3 text-right space-x-1.5">
                      {p.verificationStatus !== 'APPROVED' && (
                        <button
                          onClick={() => handleVerifyProvider(p.id, 'APPROVED', 'Verified by Admin')}
                          className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg"
                        >
                          Approve
                        </button>
                      )}
                      {p.verificationStatus !== 'SUSPENDED' && (
                        <button
                          onClick={() => handleVerifyProvider(p.id, 'SUSPENDED', 'Administrative suspension')}
                          className="px-2.5 py-1 bg-rose-50 text-rose-600 font-semibold rounded-lg hover:bg-rose-100"
                        >
                          Suspend
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LISTINGS MODERATION */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 font-bold text-xs uppercase text-slate-400">
            All Marketplace Offerings ({listings.length})
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Provider</th>
                  <th className="p-3">Destination</th>
                  <th className="p-3">Base Price</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {listings.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-bold text-slate-900 max-w-xs truncate">{l.title}</td>
                    <td className="p-3 text-slate-600">{l.provider?.businessName}</td>
                    <td className="p-3 text-slate-500">{l.destination?.name}</td>
                    <td className="p-3 font-semibold">PKR {l.basePrice.toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        l.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' :
                        l.status === 'PENDING_APPROVAL' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1.5">
                      {l.status !== 'PUBLISHED' && (
                        <button
                          onClick={() => handleModerateListing(l.id, 'PUBLISHED')}
                          className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg"
                        >
                          Publish Live
                        </button>
                      )}
                      {l.status !== 'SUSPENDED' && (
                        <button
                          onClick={() => handleModerateListing(l.id, 'SUSPENDED', 'Moderation audit hold')}
                          className="px-2.5 py-1 bg-rose-50 text-rose-600 font-semibold rounded-lg hover:bg-rose-100"
                        >
                          Suspend
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ALL BOOKINGS MASTER VIEW */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 font-bold text-xs uppercase text-slate-400">
            Master Bookings & Requests ({bookings.length})
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="p-3">Ref</th>
                  <th className="p-3">Offering</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Provider</th>
                  <th className="p-3">Final Quote</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-mono font-bold text-slate-900">#{b.bookingReference}</td>
                    <td className="p-3 text-slate-800 font-semibold max-w-xs truncate">{b.listing?.title}</td>
                    <td className="p-3 text-slate-600">{b.user?.firstName} {b.user?.lastName}</td>
                    <td className="p-3 text-slate-600">{b.provider?.businessName}</td>
                    <td className="p-3 font-bold text-slate-900">PKR {b.finalPrice?.toLocaleString()}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-slate-100 text-slate-800">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 font-bold text-xs uppercase text-slate-400">
            User Accounts & Roles ({usersList.length})
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-bold text-slate-900">{u.firstName} {u.lastName}</td>
                    <td className="p-3 text-slate-600">{u.email}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {u.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleUserStatus(u.id, !u.isActive)}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                          u.isActive ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                      >
                        {u.isActive ? 'Deactivate' : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: REVIEW MODERATION */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 font-bold text-xs uppercase text-slate-400">
            Reviews Moderation Queue ({reviewsList.length})
          </div>
          <div className="p-4 space-y-3">
            {reviewsList.map((r) => (
              <div key={r.id} className="p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-slate-900">{r.user?.firstName} {r.user?.lastName}</span>
                    <span className="text-slate-400"> on </span>
                    <span className="font-semibold text-slate-800">{r.listing?.title}</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{r.rating}.0</span>
                  </div>
                </div>
                <h5 className="font-bold text-slate-800">{r.title}</h5>
                <p className="text-slate-600">{r.comment}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${r.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                    Status: {r.status}
                  </span>
                  <div className="space-x-2">
                    {r.status === 'PUBLISHED' ? (
                      <button
                        onClick={() => handleModerateReview(r.id, 'HIDDEN')}
                        className="px-2.5 py-1 bg-rose-50 text-rose-600 font-semibold rounded-lg hover:bg-rose-100"
                      >
                        Hide Review
                      </button>
                    ) : (
                      <button
                        onClick={() => handleModerateReview(r.id, 'PUBLISHED')}
                        className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg"
                      >
                        Restore Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 font-bold text-xs uppercase text-slate-400">
            Immutable Platform Audit Logs
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <span className="px-2 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-mono">
                      {log.entityType} #{log.entityId}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Actor: {log.actor?.firstName} {log.actor?.lastName} ({log.actor?.role || log.actorRole})
                    {log.metadata && <span className="ml-2 font-mono text-[10px] text-slate-400">{log.metadata}</span>}
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
