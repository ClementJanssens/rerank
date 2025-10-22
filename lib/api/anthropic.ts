import Anthropic from '@anthropic-ai/sdk'
import { ClaudeMessage } from '../types'

export async function callClaude(messages: ClaudeMessage[], apiKey: string, systemPrompt?: string, onStreamChunk?: (text: string) => void): Promise<string> {
    const anthropic = new Anthropic({
        apiKey,
        dangerouslyAllowBrowser: true,
    })

    const stream = await anthropic.messages.stream({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 64000,
        messages,
        ...(systemPrompt ? { system: systemPrompt } : {}),
    })

    let fullText = ''
    for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            fullText += chunk.delta.text
            if (onStreamChunk) {
                onStreamChunk(fullText)
            }
        }
    }

    return fullText
}

export async function testClaudeKey(apiKey: string): Promise<boolean> {
    try {
        await callClaude([{ role: 'user', content: 'Réponds juste "ok"' }], apiKey)
        return true
    } catch {
        return false
    }
}
