'use client'

import { SettingsDialog } from '@/components/settings-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { WorkflowProgress } from '@/components/workflow-progress'
import { getApiKeys, hasApiKeys, saveArticle } from '@/lib/storage'
import { WorkflowStep } from '@/lib/types'
import { generateArticle } from '@/lib/workflow-engine'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDebounce } from '@uidotdev/usehooks'
import { CheckCircle2, Loader2, RotateCcw, XCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const formSchema = z.object({
    topic: z.string().min(10, 'Topic must be at least 10 characters'),
    main_keyword: z.string().min(3, 'Keyword must be at least 3 characters'),
    langue: z.enum(['french', 'english']),
    intention: z.enum(['informationnelle', 'commerciale', 'transactionnelle', 'navigationnelle']),
    region: z.string().min(2, 'Region must be at least 2 characters'),
    remarque: z.string().optional(),
    sitemap_url: z.string().url('Invalid URL').optional().or(z.literal('')),
})

type FormValues = z.infer<typeof formSchema>

const STORAGE_KEY = 'article-generator-form-data'

export default function HomePage() {
    const router = useRouter()
    const [isGenerating, setIsGenerating] = useState(false)
    const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([])
    const [hasKeys, setHasKeys] = useState(false)
    const [sitemapStatus, setSitemapStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle')
    const [sitemapError, setSitemapError] = useState<string>('')
    const [settingsOpen, setSettingsOpen] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            topic: '',
            main_keyword: '',
            langue: 'french',
            intention: 'informationnelle',
            region: 'france',
            remarque: '',
            sitemap_url: '',
        },
    })

    const sitemapUrl = form.watch('sitemap_url')
    const debouncedSitemapUrl = useDebounce(sitemapUrl, 800)

    // Show spinner instantly when user types
    useEffect(() => {
        if (sitemapUrl && sitemapUrl !== debouncedSitemapUrl) {
            setSitemapStatus('checking')
        }
    }, [sitemapUrl, debouncedSitemapUrl])

    // Load data from localStorage on mount
    useEffect(() => {
        setHasKeys(hasApiKeys())

        const savedData = localStorage.getItem(STORAGE_KEY)
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData)
                form.reset(parsedData)
            } catch (error) {
                console.error('Error loading data:', error)
            }
        }
    }, [])

    // Auto-save data to localStorage
    useEffect(() => {
        const subscription = form.watch(value => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
        })
        return () => subscription.unsubscribe()
    }, [form.watch])

    // Verify sitemap when URL changes (with debounce)
    useEffect(() => {
        const validateSitemap = async () => {
            if (!debouncedSitemapUrl || debouncedSitemapUrl === '') {
                setSitemapStatus('idle')
                setSitemapError('')
                return
            }

            // Verify that it's a valid URL
            try {
                new URL(debouncedSitemapUrl)
            } catch {
                setSitemapStatus('invalid')
                setSitemapError('Invalid URL')
                return
            }

            setSitemapStatus('checking')
            setSitemapError('')

            try {
                // Call API route to validate server-side (avoids CORS)
                const response = await fetch('/api/validate-sitemap', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: debouncedSitemapUrl }),
                })

                const data = await response.json()

                if (data.valid) {
                    setSitemapStatus('valid')
                    toast.success(`Valid sitemap (${data.urlCount} URL${data.urlCount > 1 ? 's' : ''} found)`)
                } else {
                    setSitemapStatus('invalid')
                    setSitemapError(data.error)
                    toast.error(data.error)
                }
            } catch (error) {
                setSitemapStatus('invalid')
                setSitemapError('Connection error')
                toast.error('Connection error')
            }
        }

        validateSitemap()
    }, [debouncedSitemapUrl])

    async function onSubmit(values: FormValues) {
        const keys = getApiKeys()
        if (!keys) {
            toast.error('Please configure your API keys')
            return
        }

        setIsGenerating(true)
        toast.info('Generating article...')

        try {
            const article = await generateArticle(values, keys, steps => setWorkflowSteps(steps))

            saveArticle(article)
            toast.success('Article successfully generated!')
            router.push(`/articles/${article.id}`)
        } catch (error) {
            console.error('Error generating article:', error)
            toast.error(error instanceof Error ? `Error: ${error.message}` : 'An error occurred during generation')
            setIsGenerating(false)
        }
    }

    function handleReset() {
        form.reset({
            topic: '',
            main_keyword: '',
            langue: 'french',
            intention: 'informationnelle',
            region: 'france',
            remarque: '',
            sitemap_url: '',
        })
        localStorage.removeItem(STORAGE_KEY)
        toast.success('Form reset')
    }

    return (
        <div className="container py-12">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Rerank - SEO Article Generator</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Generate optimized articles with AI powered by <Image src="https://retalk.bot/_next/image?url=%2Fimages%2Flogo.webp&w=256&q=75" alt="Retalk Logo" width={20} height={20} className="rounded inline-block mr-1" />
                        <Link href="https://retalk.bot" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800 font-semibold">
                            Retalk
                        </Link>
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/articles">
                        <Button variant="outline">📄 Articles</Button>
                    </Link>

                    <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} onKeysUpdated={() => setHasKeys(hasApiKeys())}>
                        <Button variant="outline" onClick={() => setSettingsOpen(true)} className="relative">
                            ⚙️ Settings
                            {!hasKeys && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                            )}
                        </Button>
                    </SettingsDialog>
                </div>
            </div>

            <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
                <Card className="shadow-lg border-border/60 col-span-2">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl">Article Information</CardTitle>
                        <CardDescription>Fill in the information to generate your article</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="topic"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Article Topic</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Ex: Best practices to optimize an AI chatbot in 2025" className="resize-none" rows={3} {...field} />
                                            </FormControl>
                                            <FormDescription>Describe the main topic of your article</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="main_keyword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Main Keyword</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: AI chatbot" {...field} />
                                            </FormControl>
                                            <FormDescription>The main SEO keyword to target</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="langue"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Language</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a language" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="french">Français</SelectItem>
                                                    <SelectItem value="english">English</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>⚠️ The article will first be written in French, then translated to English if needed</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="intention"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Search Intent</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select an intent" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="informationnelle">Informational</SelectItem>
                                                    <SelectItem value="commerciale">Commercial</SelectItem>
                                                    <SelectItem value="transactionnelle">Transactional</SelectItem>
                                                    <SelectItem value="navigationnelle">Navigational</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>The intent behind this keyword search</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="region"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Region</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: france, global, canada" {...field} />
                                            </FormControl>
                                            <FormDescription>The targeted geographic region</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="remarque"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Notes (optional)</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Ex: Must mention B2B use cases..." className="resize-none" rows={3} {...field} />
                                            </FormControl>
                                            <FormDescription>Specific information to include in the article</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="sitemap_url"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sitemap URL (optional)</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input placeholder="Ex: https://example.com/sitemap.xml" {...field} className={sitemapStatus === 'invalid' ? 'border-destructive' : sitemapStatus === 'valid' ? 'border-green-500' : ''} />
                                                    {sitemapStatus === 'checking' && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
                                                    {sitemapStatus === 'valid' && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />}
                                                    {sitemapStatus === 'invalid' && <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />}
                                                </div>
                                            </FormControl>
                                            <FormDescription>{sitemapError ? <span className="text-destructive">{sitemapError}</span> : sitemapStatus === 'checking' ? 'Checking...' : 'To add automatic internal links'}</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex gap-3">
                                    <Button type="button" variant="outline" size="lg" onClick={handleReset} disabled={isGenerating}>
                                        <RotateCcw className="h-4 w-4" />
                                    </Button>
                                    <Button type="submit" className="flex-1 shadow-md" size="lg" disabled={isGenerating || !hasKeys}>
                                        {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {isGenerating ? 'Generating...' : 'Generate Article'}
                                    </Button>
                                </div>

                                {isGenerating && <p className="text-sm text-muted-foreground text-center">⏱️ Estimated time: 5-10 minutes</p>}
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {isGenerating && workflowSteps.length > 0 ? (
                    <div className="lg:sticky lg:top-8 lg:self-start">
                        <WorkflowProgress steps={workflowSteps} />
                    </div>
                ) : (
                    <div className="lg:sticky lg:top-8 lg:self-start">
                        <WorkflowProgress steps={workflowSteps} />
                    </div>
                )}
            </div>
        </div>
    )
}
