'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-slate-900">Contact Marketplace Operations</h1>
        <p className="text-xs text-slate-500">Reach our team for provider verification inquiries, traveler assistance, and commercial partnerships.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm text-xs text-slate-600">
          <h3 className="text-sm font-bold text-slate-900">Operations Hub</h3>
          <p>Our verification desk operates Monday through Saturday, reviewing provider licenses and ensuring platform integrity.</p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-emerald-600" />
              <span>operations@faradayexpeditions.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>+92 51 8899112</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Level 4, Evacuee Trust Complex, Islamabad, Pakistan</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900">Message Received</h4>
              <p className="text-xs text-slate-500">Our team will get back to your inquiry shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="Ali Khan"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="ali@example.com"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="How can we assist you?"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
