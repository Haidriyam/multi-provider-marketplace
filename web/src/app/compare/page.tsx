'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeftRight, 
  Check, 
  X as XIcon, 
  ShieldCheck, 
  Star, 
  Clock, 
  Users, 
  MapPin, 
  Tag, 
  ArrowRight
} from 'lucide-react';
import { api } from '@/lib/api';

export default function ComparePage() {
  const [allListings, setAllListings] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getListings({ limit: 20 });
        if (res.success && res.data) {
          setAllListings(res.data);
          // Preselect first two for instant comparison preview
          if (res.data.length >= 2) {
            setSelectedIds([res.data[0].id, res.data[1].id]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const selectedListings = allListings.filter(l => selectedIds.includes(l.id));

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(prev => prev.filter(x => x !== id));
      } else {
        alert('Please keep at least one package selected for comparison.');
      }
    } else {
      if (selectedIds.length >= 3) {
        alert('You can compare up to 3 packages simultaneously.');
        return;
      }
      setSelectedIds(prev => [...prev, id]);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-slate-500">Loading package comparison engine...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
            <ArrowLeftRight className="w-3.5 h-3.5" /> Direct Operator Comparison
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Compare Expeditions & Offerings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Evaluate itineraries, vehicle specs, inclusions, provider ratings, and transparent pricing side-by-side.
          </p>
        </div>

        {/* PACKAGE SELECTOR CHIPS */}
        <div className="flex flex-wrap items-center gap-2">
          {allListings.map(l => {
            const isSelected = selectedIds.includes(l.id);
            return (
              <button
                key={l.id}
                onClick={() => toggleSelect(l.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{l.destination?.name} ({l.durationDays}d)</span>
                {isSelected && <Check className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* COMPARISON TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              <th className="p-4 w-44 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Attributes
              </th>
              {selectedListings.map(l => (
                <th key={l.id} className="p-4 min-w-[280px] max-w-[320px] align-top">
                  <div className="space-y-2">
                    <img
                      src={l.media?.[0]?.url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'}
                      alt={l.title}
                      className="w-full h-36 object-cover rounded-xl"
                    />
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2">{l.title}</h3>
                    <div className="text-base font-black text-emerald-700">
                      PKR {l.basePrice.toLocaleString()}
                    </div>
                    <Link
                      href={`/listing/${l.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline"
                    >
                      Book / Enquiry <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {/* Operator & Verification */}
            <tr>
              <td className="p-4 font-bold text-slate-500 bg-slate-50/40">Verified Operator</td>
              {selectedListings.map(l => (
                <td key={l.id} className="p-4">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <span>{l.provider?.businessName}</span>
                    {l.provider?.verificationStatus === 'APPROVED' && (
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">Rating: ★ {l.rating.toFixed(1)} ({l.reviewCount} reviews)</span>
                </td>
              ))}
            </tr>

            {/* Destination & Region */}
            <tr>
              <td className="p-4 font-bold text-slate-500 bg-slate-50/40">Destination</td>
              {selectedListings.map(l => (
                <td key={l.id} className="p-4 font-semibold text-slate-800">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{l.destination?.name} ({l.destination?.country})</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Category */}
            <tr>
              <td className="p-4 font-bold text-slate-500 bg-slate-50/40">Category</td>
              {selectedListings.map(l => (
                <td key={l.id} className="p-4 font-semibold text-slate-800">
                  {l.category?.name}
                </td>
              ))}
            </tr>

            {/* Duration */}
            <tr>
              <td className="p-4 font-bold text-slate-500 bg-slate-50/40">Duration</td>
              {selectedListings.map(l => (
                <td key={l.id} className="p-4 font-semibold text-slate-800">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{l.durationDays} Days / {l.durationDays - 1} Nights</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Max Group Capacity */}
            <tr>
              <td className="p-4 font-bold text-slate-500 bg-slate-50/40">Max Capacity</td>
              {selectedListings.map(l => (
                <td key={l.id} className="p-4 font-semibold text-slate-800">
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Up to {l.maxGuests} travelers</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Inclusions Comparison */}
            <tr>
              <td className="p-4 font-bold text-slate-500 bg-slate-50/40 align-top">Inclusions</td>
              {selectedListings.map(l => {
                const incs: string[] = l.inclusions ? JSON.parse(l.inclusions) : [];
                return (
                  <td key={l.id} className="p-4 align-top">
                    <ul className="space-y-1.5">
                      {incs.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-slate-700">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                );
              })}
            </tr>

            {/* Exclusions Comparison */}
            <tr>
              <td className="p-4 font-bold text-slate-500 bg-slate-50/40 align-top">Exclusions</td>
              {selectedListings.map(l => {
                const excs: string[] = l.exclusions ? JSON.parse(l.exclusions) : [];
                return (
                  <td key={l.id} className="p-4 align-top">
                    <ul className="space-y-1 text-slate-400">
                      {excs.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <XIcon className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                );
              })}
            </tr>

            {/* Meeting Point */}
            <tr>
              <td className="p-4 font-bold text-slate-500 bg-slate-50/40">Meeting Point</td>
              {selectedListings.map(l => (
                <td key={l.id} className="p-4 text-slate-700 font-medium">
                  {l.meetingPoint || 'Central Airport Pick-up'}
                </td>
              ))}
            </tr>

            {/* Cancellation Policy */}
            <tr>
              <td className="p-4 font-bold text-slate-500 bg-slate-50/40">Cancellation Policy</td>
              {selectedListings.map(l => (
                <td key={l.id} className="p-4 text-slate-600">
                  {l.cancellationPolicy || 'Standard 14 days prior free cancellation.'}
                </td>
              ))}
            </tr>

            {/* Action Row */}
            <tr className="bg-slate-50/60">
              <td className="p-4 font-bold text-slate-500">Reserve / Inquire</td>
              {selectedListings.map(l => (
                <td key={l.id} className="p-4">
                  <Link
                    href={`/listing/${l.slug}`}
                    className="block w-full py-2.5 text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition"
                  >
                    View & Book
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
