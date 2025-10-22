import FirecrawlApp from '@mendable/firecrawl-js'
import { FirecrawlSearchResult } from '../types'

export async function searchSerp(keyword: string, region: string, apiKey: string): Promise<FirecrawlSearchResult[]> {
    const app = new FirecrawlApp({ apiKey })

    const result = await app.search(keyword, {
        limit: 5,
        location: region,
    })

    const data = (result as any).web || []

    return data.map((item: any) => ({
        url: item.url,
        title: item.title || '',
        description: item.description || '',
    }))
}

export async function scrapePage(url: string, apiKey: string): Promise<string> {
    try {
        const app = new FirecrawlApp({ apiKey })

        const result = await app.scrape(url, {
            formats: ['markdown'],
            onlyMainContent: true,
        })

        return (result as any).markdown || ''
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)

        // Site non supporté par Firecrawl - on ignore silencieusement
        if (errorMessage.includes('not currently supported')) {
            console.warn(`Site non supporté par Firecrawl: ${url}`)
            return ''
        }

        // Autres erreurs - on les relance
        throw error
    }
}

export async function testFirecrawlKey(apiKey: string): Promise<boolean> {
    try {
        await searchSerp('test', 'global', apiKey)
        return true
    } catch {
        return false
    }
}
