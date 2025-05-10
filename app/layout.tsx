import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { ClerkProvider } from '@clerk/nextjs'
import { Footer } from "@/components/footer"
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

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
  metadataBase: new URL('https://gentest.dev'),
  alternates: {
    canonical: '/',
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
    url: 'https://gentest.dev',
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
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta name="theme-color" content="#000000" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <link rel="canonical" href="https://gentest.dev" />
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

