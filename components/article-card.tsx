import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { GeneratedArticle } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { Eye, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface ArticleCardProps {
    article: GeneratedArticle
    onDelete: (id: string) => void
}

export function ArticleCard({ article, onDelete }: ArticleCardProps) {
    const date = new Date(article.createdAt)
    const timeAgo = formatDistanceToNow(date, { addSuffix: true, locale: enUS })

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="truncate">{article.title}</CardTitle>
                        <CardDescription className="mt-1 line-clamp-2">{article.meta_description}</CardDescription>
                    </div>
                    <Badge variant={article.input.langue === 'french' ? 'default' : 'secondary'}>{article.input.langue === 'french' ? 'FR' : 'EN'}</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                    <div>
                        <span className="font-medium">Keyword:</span> {article.input.main_keyword}
                    </div>
                    <div>
                        <span className="font-medium">Region:</span> {article.input.region}
                    </div>
                    <div>
                        <span className="font-medium">Created:</span> {timeAgo}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex gap-2">
                <Button asChild className="flex-1">
                    <Link href={`/articles/${article.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View article
                    </Link>
                </Button>
                <Button variant="destructive" size="icon" onClick={() => onDelete(article.id)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    )
}
