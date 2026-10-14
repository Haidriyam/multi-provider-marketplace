'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Star, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Send, 
  ChevronRight, 
  ShieldCheck,
  FileText
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function CustomerBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  // Chat & Details Drawer State
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [chatMessage, setChatMessage] = useState<string>('');
  const [chatSending, setChatSending] = useState(false);

  // Review Modal State
  const [reviewBooking, setReviewBooking] = useState<any>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewTitle, setReviewTitle] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState<string>('');

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await api.getCustomerBookings(statusFilter === 'ALL' ? undefined : statusFilter);
      if (res.success) {
        setBookings(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load customer bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user, statusFilter]);

  const handleOpenDetails = async (booking: any) => {
    try {
      const res = await api.getBookingDetails(booking.id);
      if (res.success && res.data) {
        setSelectedBooking(res.data);
      }
    } catch (err) {
      console.error(err);
      setSelectedBooking(booking);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
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

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking request?')) return;
    try {
      const res = await api.updateBookingStatus(bookingId, 'CANCELLED', undefined, 'Customer requested cancellation');
      if (res.success) {
        await loadBookings();
        if (selectedBooking && selectedBooking.id === bookingId) {
          setSelectedBooking((prev: any) => ({ ...prev, status: 'CANCELLED' }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBooking) return;

    setReviewSubmitting(true);
    setReviewMessage('');
    try {
      const res = await api.submitReview({
        bookingId: reviewBooking.id,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });

      if (res.success) {
        setReviewMessage('Your review has been successfully submitted and verified!');
        setTimeout(() => {
          setReviewBooking(null);
          setReviewTitle('');
          setReviewComment('');
          loadBookings();
        }, 1500);
      }
    } catch (err: any) {
      setReviewMessage(err.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Please Sign In</h2>
        <p className="text-xs text-slate-500">Log in as a customer (e.g. Sarah Jenkins or Ali Raza via the top demo switcher) to view your bookings.</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">Pending Provider Confirmation</span>;
      case 'CONFIRMED':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Confirmed Booking</span>;
      case 'COMPLETED':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">Completed Expedition</span>;
      case 'CANCELLED':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">Cancelled</span>;
      case 'REJECTED':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">Provider Declined</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">My Bookings & Enquiries</h1>
        <p className="text-xs text-slate-500 mt-1">Track request status, review quotes, and communicate directly with licensed tour operators.</p>
      </div>

      {/* STATUS TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              statusFilter === tab
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab === 'ALL' ? 'All Requests' : tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* BOOKINGS LIST */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="h-32 bg-slate-100 animate-pulse rounded-2xl border border-slate-200" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No {statusFilter.toLowerCase()} bookings found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explore verified expeditions across Hunza, Skardu, Swat, and Astola to submit your first request.
          </p>
          <Link
            href="/search"
            className="inline-block px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition"
          >
            Explore Offerings
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">Ref: #{booking.bookingReference}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-400">Submitted on {new Date(booking.createdAt).toLocaleDateString()}</span>
                </div>
                <div>{getStatusBadge(booking.status)}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                {/* Offering Info */}
                <div className="md:col-span-2 flex items-center gap-3.5">
                  <img
                    src={booking.listing?.media?.[0]?.url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80'}
                    alt=""
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{booking.listing?.title}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Operator: {booking.provider?.businessName}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {booking.startDate} {booking.endDate ? `to ${booking.endDate}` : ''} • {booking.guestsCount} Travelers
                    </p>
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Total Price</span>
                  <div className="text-base font-black text-slate-900">
                    {booking.currency} {booking.finalPrice.toLocaleString()}
                  </div>
                  {booking.discountAmount > 0 && (
                    <span className="text-[11px] text-rose-600 font-semibold block">
                      Saved {booking.currency} {booking.discountAmount.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-start md:justify-end gap-2">
                  <button
                    onClick={() => handleOpenDetails(booking)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    Chat & Details
                    {booking._count?.messages > 0 && (
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center">
                        {booking._count.messages}
                      </span>
                    )}
                  </button>

                  {booking.status === 'COMPLETED' && !booking.review && (
                    <button
                      onClick={() => setReviewBooking(booking)}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1"
                    >
                      <Star className="w-3.5 h-3.5" />
                      Leave Review
                    </button>
                  )}

                  {booking.status === 'PENDING' && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="px-3 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-semibold rounded-xl transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SIDE DRAWER: DETAILS & MESSAGING THREAD */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Booking Thread</span>
                <h3 className="text-sm font-bold text-slate-900">#{selectedBooking.bookingReference}</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body: Status Overview + Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Status Banner */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Current Status:</span>
                  {getStatusBadge(selectedBooking.status)}
                </div>
                <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-200">
                  <p><span className="font-semibold text-slate-800">Operator:</span> {selectedBooking.provider?.businessName}</p>
                  <p><span className="font-semibold text-slate-800">Dates:</span> {selectedBooking.startDate} to {selectedBooking.endDate || 'N/A'}</p>
                  <p><span className="font-semibold text-slate-800">Travelers:</span> {selectedBooking.guestsCount} guests</p>
                  <p><span className="font-semibold text-slate-800">Total Price:</span> {selectedBooking.currency} {selectedBooking.finalPrice?.toLocaleString()}</p>
                  {selectedBooking.customerNotes && (
                    <p className="italic text-slate-500">"Notes: {selectedBooking.customerNotes}"</p>
                  )}
                </div>
              </div>

              {/* Messaging History */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Direct Operator Messages</h4>
                {selectedBooking.messages && selectedBooking.messages.length > 0 ? (
                  <div className="space-y-2.5">
                    {selectedBooking.messages.map((msg: any) => {
                      const isMe = msg.senderId === user.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <span className="text-[10px] text-slate-400 mb-0.5">
                            {isMe ? 'You' : msg.sender?.firstName || 'Operator'} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <div
                            className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                              isMe
                                ? 'bg-emerald-600 text-white rounded-br-none'
                                : 'bg-slate-100 text-slate-800 rounded-bl-none'
                            }`}
                          >
                            {msg.message}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic text-center py-4">
                    No messages yet. Ask the operator about timing, gear, or special requirements below.
                  </p>
                )}
              </div>
            </div>

            {/* Chat Input Footer */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type message to operator..."
                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={chatSending || !chatMessage.trim()}
                className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW SUBMISSION MODAL */}
      {reviewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100 space-y-4">
            <button
              onClick={() => setReviewBooking(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Verified Experience</span>
              <h3 className="text-lg font-bold text-slate-900">Leave Your Review</h3>
              <p className="text-xs text-slate-500">{reviewBooking.listing?.title}</p>
            </div>

            {reviewMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold">
                {reviewMessage}
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Rating</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition"
                    >
                      <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                  <span className="font-bold text-slate-900 ml-2">{reviewRating} of 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Review Headline</label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Unforgettable Karakoram trek, highly recommended!"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Feedback</label>
                <textarea
                  rows={4}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Describe the guide punctuality, vehicle comfort, meal quality, and highlights..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition disabled:opacity-50"
              >
                {reviewSubmitting ? 'Submitting Review...' : 'Publish Verified Review'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
