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
  ArrowRight,
  Crown
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
      <div className="max-w-6xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs uppercase tracking-widest font-cinzel text-gold-400">Loading Fleet Comparison Engine...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-obsidian-950 text-slate-100">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gold-500/20 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-400 uppercase tracking-widest font-cinzel mb-1">
            <ArrowLeftRight className="w-3.5 h-3.5" /> Fleet Specification Comparison
          </div>
          <h1 className="text-2xl sm:text-3xl font-cinzel font-black text-white">
            Compare First-Class Expeditions
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-light">
            Evaluate high-altitude itineraries, inclusions, licensed operator credentials, and suite rates side-by-side.
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
                    ? 'bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 shadow-gold-sm'
                    : 'bg-obsidian-900 border border-gold-500/20 text-slate-300 hover:border-gold-400'
                }`}
              >
                <span>{l.destination?.name} ({l.durationDays}d)</span>
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* COMPARISON TABLE */}
      <div className="glass-obsidian rounded-3xl border border-gold-500/30 shadow-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gold-500/20 bg-obsidian-900/90">
              <th className="p-4 w-48 text-[10px] font-cinzel font-bold text-gold-400 uppercase tracking-widest">
                Specifications
              </th>
              {selectedListings.map(l => (
                <th key={l.id} className="p-4 min-w-[280px] max-w-[320px] align-top">
                  <div className="space-y-3">
                    <img
                      src={l.media?.[0]?.url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'}
                      alt={l.title}
                      className="w-full h-36 object-cover rounded-xl border border-gold-500/20"
                    />
                    <h3 className="text-sm font-cinzel font-bold text-white line-clamp-2">{l.title}</h3>
                    <div className="text-base font-black text-gold-300 font-cinzel">
                      PKR {l.basePrice.toLocaleString()}
                    </div>
                    <Link
                      href={`/listing/${l.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-gold-400 hover:text-gold-300 transition"
                    >
                      Reserve Suite <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gold-500/15 text-xs font-light text-slate-300">
            {/* Operator & Verification */}
            <tr>
              <td className="p-4 font-cinzel font-bold text-gold-400 bg-obsidian-900/40">Accredited Operator</td>
              {selectedListings.map(l => (
                <td key={l.id} className="p-4">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <span>{l.provider?.businessName}</span>
                    {l.provider?.verificationStatus === 'APPROVED' && (
                      <ShieldCheck className="w-4 h-4 text-gold-400" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">Rating: ★ {l.rating.toFixed(1)} ({l.reviewCount} VIP reviews)</span>
                </td>
              ))}
            </tr>

            {/* Destination & Region */}
            <tr>
              <td className="p-4 font-cinzel font-bold text-gold-400 bg-obsidian-900/40">Destination</td>
              {selectedListings.map(l => (
                <td key={l.id} className="p-4 font-semibold text-slate-200">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gold-400" />
                    <span>{l.destination?.name} ({l.destination?.country})</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Category */}
            <tr>
              <td className="p-4 font-cinzel font-bold text-gold-400 bg-obsidian-900/40">Collection</td>
              {selectedListings.map(l => (
                <td key={l.id} className="p-4 font-semibold text-slate-200">
                  {l.category?.name}
                </td>
              ))}
            </tr>

            {/* Duration */}
            <tr>
              <td className="p-4 font-cinzel font-bold text-gold-400 bg-obsidian-900/40">Expedition Duration</td>
              {selectedListings.map(l => (
                <td key={l.id} className="p-4 font-semibold text-slate-200">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gold-400" />
                    <span>{l.durationDays} Days / {l.durationDays - 1} Nights</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Max Capacity */}
            <tr>
              <td className="p-4 font-cinzel font-bold text-gold-400 bg-obsidian-900/40">Suite Capacity</td>
              {selectedListings.map(l => (
                <td key={l.id} className="p-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-gold-400" />
                    <span>Up to {l.maxGuests} Travelers</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Inclusions Preview */}
            <tr>
              <td className="p-4 font-cinzel font-bold text-gold-400 bg-obsidian-900/40">Royal Inclusions</td>
              {selectedListings.map(l => {
                const incs: string[] = l.inclusions ? JSON.parse(l.inclusions) : [];
                return (
                  <td key={l.id} className="p-4">
                    <ul className="space-y-1 text-[11px]">
                      {incs.slice(0, 4).map((item, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 text-slate-300">
                          <Check className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                      {incs.length > 4 && (
                        <li className="text-[10px] text-gold-400 font-semibold italic">
                          +{incs.length - 4} more royal amenities included
                        </li>
                      )}
                    </ul>
                  </td>
                );
              })}
            </tr>

            {/* Cancellation Policy */}
            <tr>
              <td className="p-4 font-cinzel font-bold text-gold-400 bg-obsidian-900/40">Discretion & Policy</td>
              {selectedListings.map(l => (
                <td key={l.id} className="p-4 text-xs text-slate-400">
                  {l.cancellationPolicy || 'Flexible 7-day cancellation before departure.'}
                </td>
              ))}
            </tr>

            {/* Action Row */}
            <tr>
              <td className="p-4 bg-obsidian-900/40"></td>
              {selectedListings.map(l => (
                <td key={l.id} className="p-4">
                  <Link
                    href={`/listing/${l.slug}`}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 text-xs font-black uppercase tracking-wider rounded-xl shadow-gold-sm transition hover:scale-[1.02] flex items-center justify-center gap-1.5"
                  >
                    View Details
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
