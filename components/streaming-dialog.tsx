'use client'

import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2 } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface StreamingDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    stepName: string
    content: string
    isStreaming?: boolean
}

export function StreamingDialog({ open, onOpenChange, stepName, content, isStreaming = false }: StreamingDialogProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [content])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {isStreaming && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
                        {stepName}
                        <Badge variant="secondary" className="ml-auto">
                            {content.length} characters
                        </Badge>
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[60vh] w-full rounded-md border p-4" ref={scrollRef}>
                    <div className="whitespace-pre-wrap text-sm font-mono">{content || 'Waiting for content...'}</div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
