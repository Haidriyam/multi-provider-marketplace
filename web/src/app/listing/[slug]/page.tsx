import React from 'react';
import type { Metadata } from 'next';
import ListingClient from './ListingClient';

interface PageProps {
  params: {
    slug: string;
  };
}

async function getListingData(slug: string) {
  try {
    const res = await fetch(`http://localhost:5000/api/listings/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error('Error fetching listing for SEO metadata:', err);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const listing = await getListingData(params.slug);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  if (!listing) {
    return {
      title: 'Expedition Offering | Faraday Royal Expeditions',
      description: 'Discover verified luxury expeditions, private alpine suites, and mountain charters.',
    };
  }

  const coverImage = listing.media?.[0]?.url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';
  const pageUrl = `${baseUrl}/listing/${listing.slug}`;

  return {
    title: `${listing.title} | Faraday Royal Expeditions`,
    description: listing.shortDescription,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${listing.title} — Verified Royal Expedition`,
      description: listing.shortDescription,
      url: pageUrl,
      siteName: 'Faraday Royal Expeditions',
      images: [
        {
          url: coverImage,
          width: 1200,
          height: 630,
          alt: listing.title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: listing.title,
      description: listing.shortDescription,
      images: [coverImage],
    },
  };
}

export default async function ListingPage({ params }: PageProps) {
  const listing = await getListingData(params.slug);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Construct JSON-LD Structured Data Schema for Search Engines (TouristTrip & Product)
  const structuredData = listing ? {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TouristTrip',
        '@id': `${baseUrl}/listing/${listing.slug}#trip`,
        name: listing.title,
        description: listing.shortDescription,
        image: listing.media?.[0]?.url,
        touristType: ['Luxury Traveler', 'High-Altitude Trekker', 'Eco Explorer'],
        provider: {
          '@type': 'TravelAgency',
          name: listing.provider?.businessName || 'Faraday Royal Expeditions',
          url: `${baseUrl}/provider/${listing.providerId}`,
        },
        offers: {
          '@type': 'Offer',
          price: listing.basePrice,
          priceCurrency: listing.currency || 'PKR',
          availability: 'https://schema.org/InStock',
          validFrom: new Date().toISOString(),
          url: `${baseUrl}/listing/${listing.slug}`,
        },
        aggregateRating: listing.reviewCount > 0 ? {
          '@type': 'AggregateRating',
          ratingValue: listing.rating || 5.0,
          reviewCount: listing.reviewCount,
          bestRating: 5,
          worstRating: 1,
        } : undefined,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${baseUrl}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: listing.destination?.name || 'Destinations',
            item: `${baseUrl}/search?destination=${listing.destination?.slug}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: listing.title,
            item: `${baseUrl}/listing/${listing.slug}`,
          },
        ],
      },
    ],
  } : null;

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <ListingClient initialListing={listing} />
    </>
  );
}
