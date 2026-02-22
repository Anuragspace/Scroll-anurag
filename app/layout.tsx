import type { Metadata, Viewport } from 'next'
import { Outfit, Playfair_Display } from 'next/font/google'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',          // fills iPhone notch / Dynamic Island
  themeColor: '#000000',
  colorScheme: 'dark',
}

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'Anurag Adarsh — Product Designer',
    template: '%s · Anurag Adarsh',
  },
  description:
    'Portfolio of Anurag Adarsh, a Product & UI/UX Designer crafting interfaces that feel as good as they look. Turning complexity into clarity through intentional design.',
  keywords: [
    'Anurag Adarsh',
    'Product Designer',
    'UI UX Designer',
    'Interface Design',
    'Portfolio',
    'Interaction Design',
    'Visual Design',
    'Digital Product',
    'Brand Design',
  ],
  authors: [{ name: 'Anurag Adarsh', url: 'https://scrollanurag.vercel.app' }],
  creator: 'Anurag Adarsh',
  metadataBase: new URL('https://scrollanurag.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://scrollanurag.vercel.app',
    siteName: 'Anurag Adarsh',
    title: 'Anurag Adarsh — Product Designer',
    description:
      'Portfolio of Anurag Adarsh, a Product & UI/UX Designer crafting interfaces that feel as good as they look.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Anurag Adarsh — Product Designer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anurag Adarsh — Product Designer',
    description:
      'Portfolio of Anurag Adarsh, a Product & UI/UX Designer crafting interfaces that feel as good as they look.',
    creator: '@anuragadarsh_',
    images: ['/og-image.png'],
  },
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
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="font-outfit antialiased bg-black" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
