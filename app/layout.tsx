import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { ClerkProvider } from '@clerk/nextjs'
import { Footer } from "@/components/footer"
import dynamic from 'next/dynamic'

const Analytics = dynamic(() => import('@vercel/analytics/react').then(mod => mod.Analytics), { ssr: false })
const SpeedInsights = dynamic(() => import('@vercel/speed-insights/next').then(mod => mod.SpeedInsights), { ssr: false })

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GenTest - AI-Powered Test Generation",
  description: "Generate comprehensive test suites with AI. Save time and improve code coverage with automated test generation.",
  keywords: ["AI testing", "automated testing", "test generation", "code coverage", "software testing"],
  authors: [{ name: "GenTest Team" }],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gentest.com',
    title: 'GenTest - AI-Powered Test Generation',
    description: 'Generate comprehensive test suites with AI. Save time and improve code coverage.',
    siteName: 'GenTest',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GenTest - AI-Powered Test Generation',
    description: 'Generate comprehensive test suites with AI. Save time and improve code coverage.',
    creator: '@gentest',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        layout: {
          socialButtonsPlacement: "bottom",
          socialButtonsVariant: "iconButton",
          shimmer: false,
        },
        elements: {
          card: "bg-background",
          headerTitle: "hidden",
          headerSubtitle: "hidden",
          socialButtonsBlockButton: "bg-background hover:bg-muted",
          formButtonPrimary: "bg-primary hover:bg-primary/90",
          footerActionLink: "text-primary hover:text-primary/90",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta name="theme-color" content="#000000" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <link rel="preconnect" href="https://accounts.dev" />
          <link rel="preconnect" href="https://gentest.dev" />
          <link rel="dns-prefetch" href="https://accounts.dev" />
          <link rel="dns-prefetch" href="https://gentest.dev" />
        </head>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <Analytics />
            <SpeedInsights />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

