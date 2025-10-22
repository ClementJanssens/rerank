import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { url } = await request.json()

        if (!url) {
            return NextResponse.json({ valid: false, error: 'Missing URL' }, { status: 400 })
        }

        // Verify it's a valid URL
        try {
            new URL(url)
        } catch {
            return NextResponse.json({ valid: false, error: 'Invalid URL' }, { status: 400 })
        }

        // Fetch the sitemap
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; SitemapValidator/1.0)',
            },
        })

        if (!response.ok) {
            return NextResponse.json({ valid: false, error: `HTTP Error: ${response.status}` }, { status: 200 })
        }

        const contentType = response.headers.get('content-type')
        if (!contentType?.includes('xml') && !contentType?.includes('text')) {
            return NextResponse.json({ valid: false, error: 'The file does not appear to be XML' }, { status: 200 })
        }

        const text = await response.text()

        // Parse the XML (server-side with simple regex)
        const urlMatches = text.match(/<loc>(.*?)<\/loc>/g)

        if (!urlMatches || urlMatches.length === 0) {
            return NextResponse.json({ valid: false, error: 'No URLs found in sitemap' }, { status: 200 })
        }

        return NextResponse.json({
            valid: true,
            urlCount: urlMatches.length,
        })
    } catch (error) {
        console.error('Error validating sitemap:', error)
        return NextResponse.json({ valid: false, error: 'Unable to fetch sitemap' }, { status: 200 })
    }
}
