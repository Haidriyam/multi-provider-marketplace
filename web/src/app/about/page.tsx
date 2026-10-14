import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Compass, Users, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
          About the Platform
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Connecting Explorers with Verified Regional Operators
        </h1>
        <p className="max-w-2xl mx-auto text-sm text-slate-600 leading-relaxed">
          Faraday Expeditions is built to solve transparency, safety, and price reliability in high-altitude mountain expeditions, cultural circuits, and coastal marine tours.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <ShieldCheck className="w-8 h-8 text-emerald-600" />
          <h3 className="text-base font-bold text-slate-900">Rigorous Verification</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every service provider submits verified business licenses, NTN certificates, and identity credentials audited by our operations team prior to publishing offerings.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <Compass className="w-8 h-8 text-teal-600" />
          <h3 className="text-base font-bold text-slate-900">Direct Operator Communication</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our unified platform enables in-thread messaging with operators. Clarify customized itineraries, pick-up points, and dietary requirements directly.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <Users className="w-8 h-8 text-cyan-600" />
          <h3 className="text-base font-bold text-slate-900">Verified Reviews Only</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Only customers with completed transactions can post ratings. Providers cannot manipulate, hide, or fabricate their marketplace presence.
          </p>
        </div>
      </div>
    </div>
  );
}
