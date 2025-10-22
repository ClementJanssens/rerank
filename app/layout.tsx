import Footer from '@/components/Footer'
import { Toaster } from '@/components/ui/sonner'
import type { Metadata } from 'next'
import PlausibleProvider from 'next-plausible'
import './globals.css'

export const metadata: Metadata = {
    title: 'Rerank - SEO Article Generator by Retalk',
    description: 'Generate optimized SEO articles with AI powered by Retalk',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <PlausibleProvider trackOutboundLinks domain="rerank.retalk.bot" enabled={process.env.NODE_ENV === 'production'} selfHosted={true} customDomain="https://track.retalk.bot">
                <body className="antialiased">
                    <main className="min-h-[calc(100vh-3.5rem)] container mx-auto max-w-5xl">{children}</main>
                    <Toaster />
                    <Footer />
                </body>
            </PlausibleProvider>
        </html>
    )
}
