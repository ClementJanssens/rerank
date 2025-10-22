// Perplexity n'a pas de SDK officiel, mais fetch fonctionne côté browser
export async function searchStats(prompt: string, apiKey: string): Promise<string> {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'sonar',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful research assistant.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            max_tokens: 4000,
        }),
    })

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`Perplexity API error: ${response.status} - ${error}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || ''
}

export async function testPerplexityKey(apiKey: string): Promise<boolean> {
    try {
        await searchStats('Test query', apiKey)
        return true
    } catch {
        return false
    }
}
