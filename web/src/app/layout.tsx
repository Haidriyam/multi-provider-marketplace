import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Faraday Royal Expeditions | Verified Multi-Provider Luxury Travel Marketplace',
    template: '%s | Faraday Royal Expeditions',
  },
  description: 'Discover, compare, and reserve verified First-Class expeditions, alpine suites, and private charters across the Karakoram, Himalayas, and Arabian Sea Coast.',
  keywords: [
    'luxury travel Pakistan',
    'K2 base camp trek',
    'Hunza valley royal tours',
    'Skardu expeditions',
    'Astola island scuba diving',
    'Deosai brown bear safari',
    'Fairy Meadows Nanga Parbat',
    'private helicopter charters',
    'Faraday Royal Expeditions',
  ],
  authors: [{ name: 'Faraday Royal Expeditions' }],
  creator: 'Faraday Royal Expeditions',
  publisher: 'Faraday Royal Expeditions',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'Faraday Royal Expeditions',
    title: 'Faraday Royal Expeditions | Verified Luxury Travel Marketplace',
    description: 'Fly First Class across the peaks, valleys, and oases. Discover verified expedition operators and private suites.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Faraday Royal Expeditions Karakoram Panoramic',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Faraday Royal Expeditions | Luxury Travel Marketplace',
    description: 'Verified expedition operators, private charters, and high-altitude alpine suites.',
    images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'],
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const globalSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'Faraday Royal Expeditions',
        description: 'Verified Multi-Provider Luxury Travel Marketplace for high-altitude expeditions and private charters.',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseUrl}/search?search={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'TravelAgency',
        '@id': `${baseUrl}/#organization`,
        name: 'Faraday Royal Expeditions',
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        description: 'Emirates-grade luxury travel marketplace connecting discerning travelers with government-audited expedition operators.',
        telephone: '+971 4 214 4444',
        areaServed: 'Worldwide',
        priceRange: 'PKR 65,000 - 350,000',
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#faf8f5] text-slate-900 antialiased selection:bg-gold-500 selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 w-full">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
