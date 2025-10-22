'use client'

import { ArticleCard } from '@/components/article-card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { deleteArticle, getArticles } from '@/lib/storage'
import { GeneratedArticle } from '@/lib/types'
import { FileText } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function ArticlesPage() {
    const [articles, setArticles] = useState<GeneratedArticle[]>([])
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [articleToDelete, setArticleToDelete] = useState<string | null>(null)

    useEffect(() => {
        loadArticles()
    }, [])

    const loadArticles = () => {
        setArticles(getArticles())
    }

    const handleDeleteClick = (id: string) => {
        setArticleToDelete(id)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = () => {
        if (articleToDelete) {
            deleteArticle(articleToDelete)
            loadArticles()
            toast.success('Article deleted')
            setDeleteDialogOpen(false)
            setArticleToDelete(null)
        }
    }

    return (
        <div className="container py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold">Article History</h1>
                <p className="text-muted-foreground mt-2">View and manage all your generated articles</p>
            </div>

            {articles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">No articles</h2>
                    <p className="text-muted-foreground mb-6">Start by generating your first SEO article</p>
                    <Button asChild>
                        <Link href="/">Generate an article</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {articles.map(article => (
                        <ArticleCard key={article.id} article={article} onDelete={handleDeleteClick} />
                    ))}
                </div>
            )}

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete article?</DialogTitle>
                        <DialogDescription>This action is irreversible. The article will be permanently deleted from your local history.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteConfirm}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
