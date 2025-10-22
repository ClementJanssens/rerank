'use client'

import { MarkdownViewer } from '@/components/markdown-viewer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getArticleById } from '@/lib/storage'
import { GeneratedArticle } from '@/lib/types'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { ArrowLeft, CheckCircle2, Copy, Download, XCircle } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function ArticlePage() {
    const params = useParams()
    const router = useRouter()
    const [article, setArticle] = useState<GeneratedArticle | null>(null)

    useEffect(() => {
        const id = params.id as string
        const foundArticle = getArticleById(id)
        if (!foundArticle) {
            toast.error('Article not found')
            router.push('/articles')
            return
        }
        setArticle(foundArticle)
    }, [params.id, router])

    const handleDownload = () => {
        if (!article) return

        const blob = new Blob([article.content], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${article.slug || 'article'}.md`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success('Article downloaded')
    }

    const handleCopy = async () => {
        if (!article) return

        try {
            await navigator.clipboard.writeText(article.content)
            toast.success('Article copied to clipboard')
        } catch (error) {
            toast.error('Error copying')
        }
    }

    if (!article) {
        return (
            <div className="container py-8">
                <div className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }

    const createdDate = new Date(article.createdAt)

    return (
        <div className="container py-8">
            <Button variant="ghost" size="sm" className="mb-4" onClick={() => router.push('/articles')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>

            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <CardTitle className="text-2xl">{article.title}</CardTitle>
                                    <CardDescription className="mt-2">{article.meta_description}</CardDescription>
                                </div>
                                <Badge variant={article.input.langue === 'french' ? 'default' : 'secondary'}>{article.input.langue === 'french' ? 'FR' : 'EN'}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="flex gap-2">
                            <Button onClick={handleDownload} size="sm">
                                <Download className="mr-2 h-4 w-4" />
                                Download .md
                            </Button>
                            <Button onClick={handleCopy} variant="outline" size="sm">
                                <Copy className="mr-2 h-4 w-4" />
                                Copy
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Content</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <MarkdownViewer content={article.content} />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6 lg:sticky lg:top-8 lg:self-start">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Metadata</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div>
                                <span className="font-medium text-muted-foreground">Slug:</span>
                                <p className="mt-1 font-mono text-xs bg-muted p-2 rounded">{article.slug}</p>
                            </div>
                            <div>
                                <span className="font-medium text-muted-foreground">Keyword:</span>
                                <p className="mt-1">{article.input.main_keyword}</p>
                            </div>
                            <div>
                                <span className="font-medium text-muted-foreground">Region:</span>
                                <p className="mt-1">{article.input.region}</p>
                            </div>
                            <div>
                                <span className="font-medium text-muted-foreground">Intent:</span>
                                <p className="mt-1">{article.input.intention}</p>
                            </div>
                            <div>
                                <span className="font-medium text-muted-foreground">Created:</span>
                                <p className="mt-1">{format(createdDate, "PPP 'at' HH:mm", { locale: enUS })}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Workflow Steps</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[400px] pr-4">
                                <div className="space-y-2">
                                    {article.steps.map((step, index) => (
                                        <div key={step.id} className="flex items-start gap-2 text-sm">
                                            <span className="text-muted-foreground shrink-0">{index + 1}.</span>
                                            <div className="flex-1 min-w-0">
                                                <span className="block truncate">{step.name}</span>
                                            </div>
                                            {step.status === 'completed' && <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />}
                                            {step.status === 'error' && <XCircle className="h-4 w-4 text-red-500 shrink-0" />}
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
