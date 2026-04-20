import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface WriteBackModalProps {
  isOpen: boolean
  to: string
  onClose: () => void
}

export function WriteBackModal({ isOpen, to, onClose }: WriteBackModalProps) {
  const [sent, setSent] = useState(false)

  function handleSend() {
    setSent(true)
    setTimeout(() => { setSent(false); onClose() }, 1200)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-fade-up"
      style={{ background: 'rgba(26,20,16,0.36)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
    >
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="pb-3 pr-12 relative">
          <p className="font-serif text-lg text-foreground leading-snug">{to || 'Writing back…'}</p>
          <button
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition-colors text-sm"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            className="font-serif italic text-sm min-h-[110px] bg-muted/30 border-border resize-none"
            placeholder="I noticed something similar. Here's what I saw from the outside…"
          />
          <Button className="w-full" size="lg" onClick={handleSend} disabled={sent}>
            {sent ? 'Sent ✓' : 'Send your response →'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
