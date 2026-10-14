import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6 text-xs text-slate-700 leading-relaxed">
      <h1 className="text-2xl font-black text-slate-900">Terms & Conditions of Service</h1>
      <p className="text-slate-400">Last updated: October 2026</p>

      <section className="space-y-2">
        <h3 className="text-sm font-bold text-slate-900">1. Platform Scope & Purpose</h3>
        <p>Faraday Expeditions operates as a technology marketplace platform connecting verified third-party travel operators with end consumers. We do not own or directly manage transport vehicles, lodging establishments, or climbing gear.</p>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-bold text-slate-900">2. Service Provider Responsibilities</h3>
        <p>All service providers must maintain valid regional operating permits, passenger liability insurance, and professional alpine or marine safety accreditations. Inaccurate pricing or misleading inclusions are subject to immediate account suspension.</p>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-bold text-slate-900">3. Booking Requests & Cancellations</h3>
        <p>Initial enquiries represent non-binding requests until confirmed by the operator. Cancellation terms specified on each package detail page govern all date changes and refunds.</p>
      </section>
    </div>
  );
}
