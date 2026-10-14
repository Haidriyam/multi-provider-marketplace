import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6 text-xs text-slate-700 leading-relaxed">
      <h1 className="text-2xl font-black text-slate-900">Privacy Policy</h1>
      <p className="text-slate-400">Last updated: October 2026</p>

      <section className="space-y-2">
        <h3 className="text-sm font-bold text-slate-900">1. Information We Collect</h3>
        <p>We collect essential account details including name, email address, and phone number to coordinate booking confirmations and dispatch real-time status notifications.</p>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-bold text-slate-900">2. Data Security & Storage</h3>
        <p>All passwords are encrypted with industry-standard bcrypt hashing. Communication is strictly enforced via HTTPS with secure HTTP headers. We never store raw payment credit card numbers on our servers.</p>
      </section>
    </div>
  );
}
