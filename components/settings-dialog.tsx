'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { testClaudeKey } from '@/lib/api/anthropic'
import { testFirecrawlKey } from '@/lib/api/firecrawl'
import { testPerplexityKey } from '@/lib/api/perplexity'
import { getApiKeys, saveApiKeys } from '@/lib/storage'
import { CheckCircle2, Loader2, Settings } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export function SettingsDialog({ children, onKeysUpdated, open: controlledOpen, onOpenChange: controlledOnOpenChange }: { children?: React.ReactNode; onKeysUpdated?: () => void; open?: boolean; onOpenChange?: (open: boolean) => void }) {
    const [internalOpen, setInternalOpen] = useState(false)
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen
    const setOpen = controlledOnOpenChange || setInternalOpen
    const [anthropicKey, setAnthropicKey] = useState('')
    const [firecrawlKey, setFirecrawlKey] = useState('')
    const [perplexityKey, setPerplexityKey] = useState('')
    const [testing, setTesting] = useState(false)
    const [validKeys, setValidKeys] = useState({
        anthropic: false,
        firecrawl: false,
        perplexity: false,
    })

    useEffect(() => {
        if (open) {
            const keys = getApiKeys()
            if (keys) {
                setAnthropicKey(keys.anthropic)
                setFirecrawlKey(keys.firecrawl)
                setPerplexityKey(keys.perplexity)
            }
        }
    }, [open])

    const handleSave = () => {
        if (!anthropicKey || !firecrawlKey || !perplexityKey) {
            toast.error('All API keys are required')
            return
        }

        saveApiKeys({
            anthropic: anthropicKey,
            firecrawl: firecrawlKey,
            perplexity: perplexityKey,
        })
        toast.success('API keys saved')
        onKeysUpdated?.()
        setOpen(false)
    }

    const handleTest = async () => {
        if (!anthropicKey || !firecrawlKey || !perplexityKey) {
            toast.error('Please fill in all API keys')
            return
        }

        setTesting(true)
        toast.info('Testing API keys...')

        const results = await Promise.all([testClaudeKey(anthropicKey), testFirecrawlKey(firecrawlKey), testPerplexityKey(perplexityKey)])

        setValidKeys({
            anthropic: results[0],
            firecrawl: results[1],
            perplexity: results[2],
        })

        setTesting(false)

        if (results.every(r => r)) {
            toast.success('All keys are valid!')
        } else {
            toast.error('Some keys are invalid')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button variant="ghost" size="sm">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>Configure your API keys. Keys are stored locally in your browser.</DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="anthropic">Anthropic (Claude)</Label>
                            {validKeys.anthropic && (
                                <Badge variant="outline" className="text-green-600">
                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                    Valid
                                </Badge>
                            )}
                            {!validKeys.anthropic && testing && (
                                <Badge variant="outline">
                                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                    Testing...
                                </Badge>
                            )}
                        </div>
                        <Input id="anthropic" type="password" placeholder="sk-ant-api03-..." value={anthropicKey} onChange={e => setAnthropicKey(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="firecrawl">Firecrawl</Label>
                            {validKeys.firecrawl && (
                                <Badge variant="outline" className="text-green-600">
                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                    Valid
                                </Badge>
                            )}
                            {!validKeys.firecrawl && testing && (
                                <Badge variant="outline">
                                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                    Testing...
                                </Badge>
                            )}
                        </div>
                        <Input id="firecrawl" type="password" placeholder="fc-..." value={firecrawlKey} onChange={e => setFirecrawlKey(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="perplexity">Perplexity</Label>
                            {validKeys.perplexity && (
                                <Badge variant="outline" className="text-green-600">
                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                    Valid
                                </Badge>
                            )}
                            {!validKeys.perplexity && testing && (
                                <Badge variant="outline">
                                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                    Testing...
                                </Badge>
                            )}
                        </div>
                        <Input id="perplexity" type="password" placeholder="pplx-..." value={perplexityKey} onChange={e => setPerplexityKey(e.target.value)} />
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button onClick={handleTest} variant="outline" disabled={testing}>
                            {testing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Test keys
                        </Button>
                        <Button onClick={handleSave} className="flex-1">
                            Save
                        </Button>
                    </div>

                    <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
                        <h3 className="font-medium text-amber-900 dark:text-amber-100 mb-2">⚠️ Security Note</h3>
                        <p className="text-sm text-amber-800 dark:text-amber-200">API keys are stored in your browser's localStorage. They are visible in developer tools. Never use keys with high limits or for production use.</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
