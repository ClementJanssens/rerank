import { callClaude } from './api/anthropic'
import { scrapePage, searchSerp } from './api/firecrawl'
import { searchStats } from './api/perplexity'
import { PROMPTS } from './prompts'
import { ApiKeys, ArticleInput, GeneratedArticle, WorkflowStep } from './types'

export type ProgressCallback = (steps: WorkflowStep[]) => void

const WORKFLOW_STEPS: Omit<WorkflowStep, 'progress'>[] = [
    { id: 'serp-analysis', name: 'SERP Analysis', status: 'pending' },
    { id: 'scraping', name: 'Scraping Competitors', status: 'pending' },
    { id: 'plan-generation', name: 'Generating Plans', status: 'pending' },
    { id: 'plan-aggregation', name: 'Aggregating Plans', status: 'pending' },
    { id: 'final-plan', name: 'Final Plan', status: 'pending' },
    { id: 'base-article', name: 'Generating Base Article', status: 'pending' },
    { id: 'translation', name: 'Translation (if needed)', status: 'pending' },
    {
        id: 'intro-improvement',
        name: 'Improving Introduction',
        status: 'pending',
    },
    { id: 'seo-optimization', name: 'SEO Optimization', status: 'pending' },
    {
        id: 'keyword-optimization',
        name: 'Keyword Optimization',
        status: 'pending',
    },
    { id: 'sitemap-fetch', name: 'Fetching Sitemap', status: 'pending' },
    { id: 'internal-links', name: 'Adding Internal Links', status: 'pending' },
    { id: 'stats-search', name: 'Searching Statistics', status: 'pending' },
    { id: 'stats-insertion', name: 'Inserting Statistics', status: 'pending' },
    { id: 'metadata-generation', name: 'Generating Metadata', status: 'pending' },
]

export async function generateArticle(input: ArticleInput, apiKeys: ApiKeys, onProgress: ProgressCallback): Promise<GeneratedArticle> {
    const steps: WorkflowStep[] = WORKFLOW_STEPS.map(s => ({
        ...s,
        progress: 0,
    }))
    const updateStep = (id: string, status: WorkflowStep['status'], progress: number, error?: string, streamContent?: string) => {
        const step = steps.find(s => s.id === id)
        if (step) {
            step.status = status
            step.progress = progress
            if (error) step.error = error
            if (streamContent !== undefined) step.streamContent = streamContent
            onProgress([...steps])
        }
    }

    let currentContent = ''
    let title = ''
    let meta_description = ''
    let slug = ''

    try {
        // 1. Analyse SERP
        updateStep('serp-analysis', 'running', 0)
        const serpResults = await searchSerp(input.main_keyword, input.region, apiKeys.firecrawl)
        console.log('SERP RESULTS', serpResults)
        updateStep('serp-analysis', 'completed', 100)

        // 2. Scraping concurrents (top 5)
        updateStep('scraping', 'running', 0)
        console.log('ICI')
        const scrapedPages: string[] = []
        for (let i = 0; i < Math.min(5, serpResults.length); i++) {
            try {
                const markdown = await scrapePage(serpResults[i].url, apiKeys.firecrawl)
                if (markdown) scrapedPages.push(markdown)
                updateStep('scraping', 'running', ((i + 1) / 5) * 100)
            } catch (error) {
                console.error(`Failed to scrape ${serpResults[i].url}:`, error)
            }
        }
        updateStep('scraping', 'completed', 100)

        // 3. Génération plans pour chaque concurrent
        updateStep('plan-generation', 'running', 0)
        const plans: string[] = []
        for (let i = 0; i < scrapedPages.length; i++) {
            try {
                const plan = await callClaude(
                    [
                        {
                            role: 'user',
                            content: PROMPTS.generatePlanFromMarkdown(scrapedPages[i]),
                        },
                    ],
                    apiKeys.anthropic,
                    undefined,
                    text => updateStep('plan-generation', 'running', ((i + 1) / scrapedPages.length) * 100, undefined, text)
                )
                plans.push(plan)
                updateStep('plan-generation', 'running', ((i + 1) / scrapedPages.length) * 100)
            } catch (error) {
                console.error('Failed to generate plan:', error)
            }
        }
        updateStep('plan-generation', 'completed', 100, undefined, '')

        // 4. Agrégation des plans
        updateStep('plan-aggregation', 'running', 50)
        const aggregatedPlans = plans.join('\n\n---\n\n')
        updateStep('plan-aggregation', 'completed', 100)

        // 5. Plan final
        updateStep('final-plan', 'running', 0)
        const finalPlan = await callClaude(
            [
                {
                    role: 'user',
                    content: PROMPTS.generateFinalPlan(input.main_keyword, input.intention, aggregatedPlans),
                },
            ],
            apiKeys.anthropic,
            undefined,
            text => updateStep('final-plan', 'running', 50, undefined, text)
        )
        updateStep('final-plan', 'completed', 100, undefined, '')

        // 6. Génération article de base
        updateStep('base-article', 'running', 0)
        const baseArticleResponse = await callClaude(
            [
                {
                    role: 'user',
                    content: PROMPTS.generateBaseArticle(input.topic, input.main_keyword, input.langue, input.remarque || '', finalPlan),
                },
            ],
            apiKeys.anthropic,
            undefined,
            text => updateStep('base-article', 'running', 50, undefined, text)
        )

        // Parse JSON response
        let parsedArticle
        try {
            // Remove markdown code blocks if present
            const cleanedResponse = baseArticleResponse
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim()
            parsedArticle = JSON.parse(cleanedResponse)
            currentContent = parsedArticle.content
            title = parsedArticle.title
            meta_description = parsedArticle.meta_description
        } catch (error) {
            console.error('Failed to parse base article JSON:', error)
            currentContent = baseArticleResponse
            title = input.topic
            meta_description = `Article sur ${input.main_keyword}`
        }
        updateStep('base-article', 'completed', 100, undefined, '')

        // 7. Traduction conditionnelle (skip pour l'instant, on demande french)
        updateStep('translation', 'running', 50)
        if (input.langue === 'english') {
            const translatedContent = await callClaude(
                [
                    {
                        role: 'user',
                        content: `Translate this article to English:\n\n${currentContent}`,
                    },
                ],
                apiKeys.anthropic
            )
            currentContent = translatedContent
        }
        updateStep('translation', 'completed', 100)

        // 8. Amélioration introduction
        updateStep('intro-improvement', 'running', 0)
        currentContent = await callClaude(
            [
                {
                    role: 'user',
                    content: PROMPTS.improveIntro(input.main_keyword, currentContent),
                },
            ],
            apiKeys.anthropic,
            undefined,
            text => updateStep('intro-improvement', 'running', 50, undefined, text)
        )
        updateStep('intro-improvement', 'completed', 100, undefined, '')

        // 9. Optimisation SEO
        updateStep('seo-optimization', 'running', 0)
        currentContent = await callClaude(
            [
                {
                    role: 'user',
                    content: PROMPTS.optimizeSEO(input.main_keyword, currentContent),
                },
            ],
            apiKeys.anthropic,
            undefined,
            text => updateStep('seo-optimization', 'running', 50, undefined, text)
        )
        updateStep('seo-optimization', 'completed', 100, undefined, '')

        // 10. Optimisation mots-clés
        updateStep('keyword-optimization', 'running', 0)
        currentContent = await callClaude(
            [
                {
                    role: 'user',
                    content: PROMPTS.optimizeKeywordOccurrence(input.main_keyword, input.intention, currentContent),
                },
            ],
            apiKeys.anthropic,
            undefined,
            text => updateStep('keyword-optimization', 'running', 50, undefined, text)
        )
        updateStep('keyword-optimization', 'completed', 100, undefined, '')

        // 11. Fetch sitemap & liens internes (si sitemap fourni)
        if (input.sitemap_url && input.sitemap_url.trim() !== '') {
            updateStep('sitemap-fetch', 'running', 0)
            const sitemapResponse = await fetch(`/api/validate-sitemap`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: input.sitemap_url }),
            })
            const sitemapText = await sitemapResponse.text()
            updateStep('sitemap-fetch', 'completed', 100)

            updateStep('internal-links', 'running', 0)
            currentContent = await callClaude(
                [
                    {
                        role: 'user',
                        content: PROMPTS.addInternalLinks(input.main_keyword, sitemapText, currentContent),
                    },
                ],
                apiKeys.anthropic,
                undefined,
                text => updateStep('internal-links', 'running', 50, undefined, text)
            )
            updateStep('internal-links', 'completed', 100, undefined, '')
        } else {
            // Skip les étapes de sitemap
            const sitemapStep = steps.find(s => s.id === 'sitemap-fetch')
            const linksStep = steps.find(s => s.id === 'internal-links')
            if (sitemapStep) {
                sitemapStep.status = 'completed'
                sitemapStep.progress = 100
            }
            if (linksStep) {
                linksStep.status = 'completed'
                linksStep.progress = 100
            }
            onProgress([...steps])
        }

        // 14. Recherche statistiques
        updateStep('stats-search', 'running', 0)
        const stats = await searchStats(PROMPTS.searchStatsPrompt(input.main_keyword, input.region), apiKeys.perplexity)
        updateStep('stats-search', 'completed', 100)

        // 14. Insertion statistiques
        updateStep('stats-insertion', 'running', 0)
        currentContent = await callClaude([{ role: 'user', content: PROMPTS.insertStats(stats, currentContent) }], apiKeys.anthropic, undefined, text => updateStep('stats-insertion', 'running', 50, undefined, text))
        updateStep('stats-insertion', 'completed', 100, undefined, '')

        // 15. Génération metadata
        updateStep('metadata-generation', 'running', 0)
        const metadataResponse = await callClaude(
            [
                {
                    role: 'user',
                    content: PROMPTS.generateMetadata(input.main_keyword, currentContent),
                },
            ],
            apiKeys.anthropic,
            undefined,
            text => updateStep('metadata-generation', 'running', 50, undefined, text)
        )

        try {
            const cleanedMetadata = metadataResponse
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim()
            const metadata = JSON.parse(cleanedMetadata)
            title = metadata.title
            meta_description = metadata.meta_description
            slug = metadata.slug
        } catch (error) {
            console.error('Failed to parse metadata JSON:', error)
            slug = input.main_keyword.toLowerCase().replace(/\s+/g, '-')
        }
        updateStep('metadata-generation', 'completed', 100, undefined, '')

        // Return final article
        return {
            id: Date.now().toString(),
            input,
            content: currentContent,
            title,
            meta_description,
            slug,
            createdAt: new Date().toISOString(),
            steps,
        }
    } catch (error) {
        // Mark current step as error
        const runningStep = steps.find(s => s.status === 'running')
        if (runningStep) {
            updateStep(runningStep.id, 'error', runningStep.progress, error instanceof Error ? error.message : 'Unknown error')
        }
        throw error
    }
}
