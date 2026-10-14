'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'How does the booking & enquiry workflow function?',
    a: 'When you choose a package, click "Request Booking / Enquiry". Choose your start date and number of guests, and add any specific notes. The verified provider receives an instant notification to review your request, confirm availability, and respond directly via in-platform messaging.'
  },
  {
    q: 'How are service providers verified?',
    a: 'All operators must submit their official Department of Tourism or maritime license, national tax certificates (NTN), and company registrations. Our compliance team manually audits each document before approving the provider account.'
  },
  {
    q: 'Can I cancel or alter my booking?',
    a: 'Yes. From your Customer Dashboard under "My Bookings & Enquiries", you can cancel any pending request or discuss rescheduling directly with the operator according to the listing cancellation policy.'
  },
  {
    q: 'Are payments charged immediately on enquiry?',
    a: 'No. Phase 1 operates as a verified enquiry and booking confirmation platform. Once your request is accepted and confirmed by the provider, payment instructions and itinerary confirmations are handled transparently.'
  },
  {
    q: 'Who can leave reviews on the platform?',
    a: 'Only travelers who have genuinely completed an expedition can post a star rating and written review. This ensures 100% verified authentic feedback.'
  }
];

export default function FaqPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="text-center space-y-2">
        <HelpCircle className="w-10 h-10 text-emerald-600 mx-auto" />
        <h1 className="text-3xl font-black text-slate-900">Frequently Asked Questions</h1>
        <p className="text-xs text-slate-500">Everything you need to know about booking with verified expedition operators.</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition transform ${isOpen ? 'rotate-180 text-emerald-600' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
