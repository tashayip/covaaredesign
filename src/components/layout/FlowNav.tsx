import { cn } from '@/lib/utils'
import type { FlowState } from '@/types'

const STEPS: { id: FlowState; label: string; num: number }[] = [
  { id: 'write',   label: 'Write',    num: 1 },
  { id: 'transit', label: 'In Transit', num: 2 },
  { id: 'discover',label: 'Discover', num: 3 },
]

export function FlowNav({ current }: { current: FlowState }) {
  const currentIdx = STEPS.findIndex((s) => s.id === current)

  return (
    <nav className="flex items-center mb-8" aria-label="Progress">
      {STEPS.map((step, i) => {
        const isDone   = i < currentIdx
        const isActive = i === currentIdx

        return (
          <div key={step.id} style={{ display: 'contents' }}>
            {i > 0 && (
              <div className="flex-1 h-px mx-3 bg-border relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-primary transition-all duration-500"
                  style={{ width: currentIdx >= i ? '100%' : '0%' }}
                />
              </div>
            )}
            <div
              className="flex items-center gap-2.5"
              {...(isActive ? { 'aria-current': 'step' } : {})}
            >
              <div
                className={cn(
                  'w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-semibold transition-all',
                  isActive && 'border-primary bg-primary text-primary-foreground scale-110',
                  isDone  && 'border-border bg-muted text-muted-foreground',
                  !isActive && !isDone && 'border-border bg-background text-muted-foreground'
                )}
              >
                {isDone ? '✓' : step.num}
              </div>
              <span
                className={cn(
                  'text-xs font-medium hidden sm:block',
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>
          </div>
        )
      })}
    </nav>
  )
}
