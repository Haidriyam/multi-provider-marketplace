'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ShieldCheck, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Compass, 
  Award, 
  CheckCircle2,
  Clock
} from 'lucide-react';
import { api } from '@/lib/api';

export default function ProviderProfilePage() {
  const params = useParams();
  const providerId = params.id as string;

  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProvider() {
      try {
        const res = await api.getProvider(providerId);
        if (res.success) {
          setProvider(res.data);
        }
      } catch (err) {
        console.error('Failed to load provider', err);
      } finally {
        setLoading(false);
      }
    }
    loadProvider();
  }, [providerId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-slate-500">Loading operator profile...</p>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-900">Provider Not Found</h2>
        <Link href="/" className="text-xs text-emerald-600 hover:underline mt-2 inline-block font-semibold">
          Return to Marketplace Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* BANNER & HEADER */}
      <div className="relative bg-slate-900 text-white">
        <div className="h-64 sm:h-80 w-full overflow-hidden relative">
          <img
            src={provider.bannerUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80'}
            alt={provider.businessName}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-20 sm:-mt-24 pb-8 flex flex-col sm:flex-row items-start sm:items-end gap-6 border-b border-slate-800">
            <img
              src={provider.logoUrl || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=200&q=80'}
              alt={provider.businessName}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover ring-4 ring-slate-900 bg-white shadow-2xl shrink-0"
            />

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{provider.businessName}</h1>
                {provider.verificationStatus === 'APPROVED' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Operator
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{provider.address || provider.city}, {provider.country}</span>
                <span>•</span>
                <span>Operating License: {provider.tradeLicenseNo || 'Verified'}</span>
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold pt-1">
                <span className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {provider.rating.toFixed(1)} Rating ({provider.reviewCount} Reviews)
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-300">{provider.listings?.length || 0} Active Offerings</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BODY CONTENT: BIO & ACTIVE LISTINGS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* OPERATOR BIO */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">About This Operator</h3>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {provider.bio || 'Verified expedition and tour operator on the Faraday platform.'}
            </p>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Tax ID (NTN):</span>
                <span className="font-semibold text-slate-900">{provider.taxId || 'Registered'}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Verification State:</span>
                <span className="font-semibold text-emerald-600">{provider.verificationStatus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIVE LISTINGS CATALOG */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-900">
            Offerings by {provider.businessName}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {provider.listings?.map((listing: any) => (
              <div
                key={listing.id}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 relative overflow-hidden">
                    <img
                      src={listing.media?.[0]?.url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                      {listing.destination?.name}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <Link href={`/listing/${listing.slug}`}>
                      <h4 className="text-sm font-bold text-slate-900 hover:text-emerald-600 transition line-clamp-2">
                        {listing.title}
                      </h4>
                    </Link>
                    <p className="text-xs text-slate-500 line-clamp-2">{listing.shortDescription}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium pt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{listing.durationDays} Days</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                  <span className="text-sm font-black text-slate-900">
                    {listing.currency} {listing.basePrice.toLocaleString()}
                  </span>
                  <Link
                    href={`/listing/${listing.slug}`}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
