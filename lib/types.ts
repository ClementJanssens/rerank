export interface ArticleInput {
    topic: string
    main_keyword: string
    langue: 'french' | 'english'
    intention: string
    region: string
    remarque?: string
    sitemap_url?: string
}

export interface WorkflowStep {
    id: string
    name: string
    status: 'pending' | 'running' | 'completed' | 'error'
    progress: number
    error?: string
    streamContent?: string
}

export interface GeneratedArticle {
    id: string
    input: ArticleInput
    content: string
    title: string
    meta_description: string
    slug: string
    createdAt: string
    steps: WorkflowStep[]
}

export interface ApiKeys {
    anthropic: string
    firecrawl: string
    perplexity: string
}

export interface FirecrawlSearchResult {
    url: string
    title: string
    description?: string
}

export interface ClaudeMessage {
    role: 'user' | 'assistant'
    content: string
}

export interface ClaudeResponse {
    id: string
    content: Array<{
        type: string
        text: string
    }>
    model: string
    stop_reason: string
    usage: {
        input_tokens: number
        output_tokens: number
    }
}
