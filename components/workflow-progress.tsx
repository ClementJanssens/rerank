'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { WorkflowStep } from '@/lib/types'
import { CheckCircle2, Eye, Loader2, XCircle } from 'lucide-react'
import { useState } from 'react'
import { StreamingDialog } from './streaming-dialog'

interface WorkflowProgressProps {
    steps: WorkflowStep[]
}

// Steps that use Claude
const CLAUDE_STEPS = ['plan-generation', 'final-plan', 'base-article', 'intro-improvement', 'seo-optimization', 'keyword-optimization', 'internal-links', 'stats-insertion', 'metadata-generation']

export function WorkflowProgress({ steps }: WorkflowProgressProps) {
    const [previewStepId, setPreviewStepId] = useState<string | null>(null)
    const completedSteps = steps.filter(s => s.status === 'completed').length
    const totalProgress = (completedSteps / steps.length) * 100

    const previewStep = previewStepId ? steps.find(s => s.id === previewStepId) : null

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Progress</span>
                        <Badge variant="secondary">
                            {completedSteps}/{steps.length}
                        </Badge>
                    </CardTitle>
                    <Progress value={totalProgress} className="mt-2" />
                </CardHeader>
                <CardContent className="space-y-3">
                    {steps.map(step => {
                        const isClaudeStep = CLAUDE_STEPS.includes(step.id)
                        const hasContent = step.streamContent && step.streamContent.length > 0

                        return (
                            <div key={step.id} className="flex items-center gap-3">
                                <div className="mt-0.5">
                                    {step.status === 'pending' && <div className="h-5 w-5 border-2 border-muted-foreground/50 border-dashed rounded-full" />}
                                    {step.status === 'running' && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
                                    {step.status === 'completed' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                                    {step.status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium">{step.name}</p>
                                    {step.status === 'error' && step.error && <p className="text-xs text-red-500 mt-1">{step.error}</p>}
                                </div>
                                {isClaudeStep && hasContent && (
                                    <Button variant="ghost" size="sm" onClick={() => setPreviewStepId(step.id)} className="shrink-0">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        )
                    })}
                </CardContent>
            </Card>

            {previewStep && <StreamingDialog open={!!previewStepId} onOpenChange={open => !open && setPreviewStepId(null)} stepName={previewStep.name} content={previewStep.streamContent || ''} isStreaming={previewStep.status === 'running'} />}
        </>
    )
}
