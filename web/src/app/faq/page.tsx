'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Crown } from 'lucide-react';

const faqs = [
  {
    q: 'How does the First-Class booking & suite enquiry workflow operate?',
    a: 'When you select an expedition or suite tier, submit your desired departure date and party size. Your reservation request is dispatched directly to the certified fleet operator and our VIP concierge desk. The operator reviews provisions, confirms availability, and communicates directly through the encrypted in-platform dispatch channel.'
  },
  {
    q: 'How are expedition fleet operators audited and accredited?',
    a: 'All operators undergo rigorous compliance audits. They must submit active Department of Tourism or Maritime licenses, National Tax Numbers (NTN), mountain rescue insurance guarantees, and security authorizations. Our compliance team verifies documentation with regulatory bodies prior to granting Verified Fleet status.'
  },
  {
    q: 'Are payments charged immediately upon submitting a suite enquiry?',
    a: 'No. Phase 1 operates as a verified enquiry and reservation confirmation workflow. Once the certified operator confirms availability and locks in your suite provisions, payment instructions (including bank escrow and digital transfers) and boarding pass vouchers are issued.'
  },
  {
    q: 'Can I request bespoke modifications like helicopter transfers or dietary accommodations?',
    a: 'Yes. Every booking request allows you to specify custom concierge notes (e.g. VIP helicopter transfers from Islamabad or Skardu, private photographer escorts, gluten-free dining, or private 4x4 allocations). The operator and concierge team tailor the itinerary accordingly.'
  },
  {
    q: 'Who is eligible to submit verified reviews on the marketplace?',
    a: 'Only travelers who have completed a transaction and finished their scheduled expedition through Faraday Royal can publish a star rating and written review. Provider manipulation is strictly prohibited, ensuring 100% authentic feedback.'
  },
  {
    q: 'What is the platform cancellation and rescheduling policy?',
    a: 'Each offering clearly displays its specific cancellation policy (typically full refunds up to 7 to 14 days before departure). In the event of high-altitude weather advisories or marine warnings, operators provide flexible date rescheduling or full refunds.'
  }
];

export default function FaqPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8 bg-[#faf8f5] text-slate-900 w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="text-center space-y-2.5">
        <div className="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-200 text-gold-700 flex items-center justify-center mx-auto shadow-xs">
          <Crown className="w-6 h-6 text-gold-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-cinzel font-black text-slate-950">
          Frequently Asked Questions & Concierge Charter
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto font-light">
          Everything you need to know about booking with government-audited expedition operators and private charters.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs transition"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 hover:text-gold-800 transition"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-gold-600 shrink-0 transition transform ${isOpen ? 'rotate-180 text-gold-700' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 font-light">
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
