import type { Metadata } from 'next'
import Script from 'next/script'
import { inter, jetbrainsMono } from './fonts'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollAnimations from '@/components/ScrollAnimations'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import './globals.css'

const GA_ID = 'G-XF8F329XFD'
const ADSENSE_CLIENT = 'ca-pub-3166995085202346'

export const metadata: Metadata = {
  metadataBase: new URL('https://imrizwan.com'),
  title: {
    default: 'Rizwan | Microsoft 365, SharePoint & Power Platform Developer',
    template: '%s | ImRizwan',
  },
  description:
    'Independent Microsoft 365 developer. Browse free SPFx web parts, Power Platform solutions, SharePoint tools, and step-by-step developer guides.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'ImRizwan',
    title: 'Rizwan | SharePoint & Power Platform Developer',
    description:
      'Developer blog by Rizwan — SPFx webparts, Power Platform solutions, SharePoint development tips with real code and screenshots.',
    url: 'https://imrizwan.com/',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rizwan | SharePoint & Power Platform Developer',
    description:
      'SPFx webparts, Power Platform solutions, and SharePoint development tips with code and screenshots.',
  },
  verification: {
    google: 'vFCJmiQt9CxKIRs6l6f-DkldV1Rp8SVnC7WQOMLQFE8',
  },
  other: {
    'theme-color': '#0f172a',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Preconnect to critical origins */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Prevent white flash before CSS loads */}
        <style
          dangerouslySetInnerHTML={{
            __html: `body{background-color:#0B1120;margin:0}html[data-theme="light"] body{background-color:#f8fafc}`,
          }}
        />

        {/* Structured Data — WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'ImRizwan',
              url: 'https://imrizwan.com',
              description:
                'Developer blog by Rizwan — SPFx webparts, Power Platform solutions, SharePoint development tips with real code and screenshots.',
            }),
          }}
        />

        {/* Structured Data — Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'ImRizwan',
              url: 'https://imrizwan.com',
              logo: 'https://imrizwan.com/favicon.svg',
              description:
                'Developer blog covering SPFx, Power Platform, SharePoint, and Microsoft 365 development.',
            }),
          }}
        />
      </head>
      <body>
        {/* Theme restoration — before body renders to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);})();`,
          }}
        />

        <Header />
        <ScrollAnimations />
        <main>{children}</main>
        <Footer />

        <GoogleAnalytics gaId={GA_ID} />

        {/* Deferred Third-Party Scripts (AdSense) for Core Web Vitals */}
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
