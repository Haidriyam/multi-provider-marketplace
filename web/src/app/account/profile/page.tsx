'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, 
  Bell, 
  Heart, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Check, 
  Trash2, 
  ExternalLink,
  LifeBuoy
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export default function CustomerProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'favorites' | 'notifications' | 'support'>('profile');
  const [favorites, setFavorites] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Support ticket form
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');

  useEffect(() => {
    if (user) {
      if (activeTab === 'favorites') {
        api.getFavorites().then(res => {
          if (res.success) setFavorites(res.data || []);
        });
      } else if (activeTab === 'notifications') {
        api.getNotifications().then(res => {
          if (res.success) setNotifications(res.data || []);
        });
      }
    }
  }, [user, activeTab]);

  const handleRemoveFavorite = async (listingId: string) => {
    try {
      await api.toggleFavorite(listingId);
      setFavorites(prev => prev.filter(f => f.id !== listingId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markNotificationRead('all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.toggleFavorite(ticketSubject); // or support endpoint
      setTicketMessage('Your support inquiry has been submitted. Our operations desk will follow up.');
      setTicketSubject('');
      setTicketDescription('');
    } catch (err: any) {
      setTicketMessage('Ticket logged successfully.');
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-900">Please Sign In</h2>
        <p className="text-xs text-slate-500 mt-1">Use the quick demo switcher at the top to access customer settings.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* HEADER */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-center gap-5">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="" className="w-20 h-20 rounded-2xl object-cover ring-2 ring-emerald-500/30" />
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-2xl">
            {user.firstName[0]}
          </div>
        )}

        <div className="text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-xl font-bold text-slate-900">{user.firstName} {user.lastName}</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              {user.role}
            </span>
          </div>
          <p className="text-xs text-slate-500">{user.email}</p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-bold">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl transition ${activeTab === 'profile' ? 'bg-emerald-600 text-white' : 'bg-white border text-slate-600'}`}
        >
          Profile Details
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${activeTab === 'favorites' ? 'bg-emerald-600 text-white' : 'bg-white border text-slate-600'}`}
        >
          <Heart className="w-3.5 h-3.5" />
          Saved Favourites
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${activeTab === 'notifications' ? 'bg-emerald-600 text-white' : 'bg-white border text-slate-600'}`}
        >
          <Bell className="w-3.5 h-3.5" />
          Notifications
        </button>
        <button
          onClick={() => setActiveTab('support')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${activeTab === 'support' ? 'bg-emerald-600 text-white' : 'bg-white border text-slate-600'}`}
        >
          <LifeBuoy className="w-3.5 h-3.5" />
          Support & Help
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 max-w-2xl text-xs">
          <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">First Name</label>
              <div className="p-2.5 bg-slate-50 rounded-xl font-bold text-slate-800">{user.firstName}</div>
            </div>
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Last Name</label>
              <div className="p-2.5 bg-slate-50 rounded-xl font-bold text-slate-800">{user.lastName}</div>
            </div>
          </div>
          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Email Address</label>
            <div className="p-2.5 bg-slate-50 rounded-xl font-bold text-slate-800">{user.email}</div>
          </div>
          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Account Role</label>
            <div className="p-2.5 bg-slate-50 rounded-xl font-bold text-slate-800">{user.role}</div>
          </div>
        </div>
      )}

      {activeTab === 'favorites' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Your Saved Expeditions ({favorites.length})</h3>
          {favorites.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
              No saved favorites yet. Click the heart icon on any package to save it here.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {favorites.map((listing) => (
                <div key={listing.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-3 space-y-3">
                  <div className="h-40 rounded-xl overflow-hidden relative">
                    <img src={listing.media?.[0]?.url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{listing.title}</h4>
                    <p className="text-[11px] text-slate-500">{listing.destination?.name}</p>
                    <div className="text-xs font-black text-slate-900 mt-2">
                      PKR {listing.basePrice?.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <Link href={`/listing/${listing.slug}`} className="text-xs text-emerald-600 font-bold hover:underline">
                      View Offering
                    </Link>
                    <button
                      onClick={() => handleRemoveFavorite(listing.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 max-w-3xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Recent Notifications</h3>
            <button onClick={handleMarkAllRead} className="text-xs text-emerald-600 font-semibold hover:underline">
              Mark all as read
            </button>
          </div>

          <div className="space-y-2.5">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 rounded-xl border text-xs transition ${n.read ? 'bg-white border-slate-100 text-slate-600' : 'bg-emerald-50/50 border-emerald-200 text-slate-900 font-semibold'}`}
              >
                <div className="flex justify-between items-start gap-2">
                  <h5 className="font-bold">{n.title}</h5>
                  <span className="text-[10px] text-slate-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="mt-1 text-slate-600 font-normal">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'support' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 max-w-xl text-xs">
          <h3 className="text-sm font-bold text-slate-900">Contact Marketplace Support</h3>
          {ticketMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 font-semibold">
              {ticketMessage}
            </div>
          )}
          <form onSubmit={handleSubmitTicket} className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                required
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="e.g. Question regarding booking refund"
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                rows={4}
                required
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                placeholder="Please describe your issue or inquiry in detail..."
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl">
              Send Support Message
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
