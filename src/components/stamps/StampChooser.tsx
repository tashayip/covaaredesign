import { StampSVG, STAMP_CONFIGS, STAMP_ORDER } from './StampSVG'
import type { StampId } from '@/types'
import { cn } from '@/lib/utils'

// ─── small stamp chooser (used in step 3 detail bar if needed) ───────────────

interface StampChooserProps {
  selected: StampId
  onChange: (id: StampId) => void
  customLabel?: string
  onCustomLabel?: (label: string) => void
}

export function StampChooser({ selected, onChange, customLabel = '', onCustomLabel }: StampChooserProps) {
  return (
    <div className="space-y-2">
      <div className="lb-stamp-row" role="radiogroup" aria-label="Choose a stamp">
        {STAMP_ORDER.map((id) => {
          const cfg = STAMP_CONFIGS[id]
          const isSel = selected === id
          return (
            <button
              key={id}
              className={`lb-stamp-opt${isSel ? ' sel' : ''}`}
              role="radio"
              aria-checked={isSel}
              aria-label={`${cfg.label} stamp`}
              tabIndex={isSel ? 0 : -1}
              onClick={() => onChange(id)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') {
                  const next = STAMP_ORDER[(STAMP_ORDER.indexOf(id) + 1) % STAMP_ORDER.length]
                  onChange(next)
                }
                if (e.key === 'ArrowLeft') {
                  const prev = STAMP_ORDER[(STAMP_ORDER.indexOf(id) - 1 + STAMP_ORDER.length) % STAMP_ORDER.length]
                  onChange(prev)
                }
              }}
            >
              <StampSVG id={id} W={64} H={78} maskSuffix={`-chooser`} />
              <span className="lb-stamp-name">{id === 'other' ? (customLabel || 'Custom') : cfg.label}</span>
            </button>
          )
        })}
      </div>

      {/* Custom label input */}
      {selected === 'other' && (
        <input
          type="text"
          className="w-full px-3 py-2 text-sm font-sans rounded-xl border border-dashed border-border bg-transparent outline-none focus:border-foreground/40 transition-colors placeholder:text-muted-foreground"
          placeholder="Name your focus area…"
          value={customLabel}
          onChange={(e) => onCustomLabel?.(e.target.value)}
        />
      )}
    </div>
  )
}

// ─── large domain row (used in step 2 + learning goals) ─────────────────────

interface DomainRowProps {
  id: StampId
  selected: boolean
  onToggle: () => void
  customLabel?: string
  onCustomLabel?: (label: string) => void
}

const DOMAIN_DESCRIPTIONS: Record<StampId, string> = {
  culture:     'Building trust, routines, and a safe learning environment',
  preparation: 'Planning objectives, questions, and lesson sequencing',
  enactment:   'Classroom delivery, explanations, and facilitation',
  assessment:  'Checking understanding and giving meaningful feedback',
  other:       "I'll describe my own focus area",
}

export function DomainRow({ id, selected, onToggle, customLabel = '', onCustomLabel }: DomainRowProps) {
  const cfg = STAMP_CONFIGS[id]
  const displayLabel = id === 'other' ? (customLabel || 'Custom') : cfg.label

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'w-full flex items-center gap-5 px-5 py-4 rounded-2xl border-2 text-left transition-all',
          selected
            ? 'border-primary/40 bg-primary/5'
            : 'border-border bg-background hover:border-primary/20 hover:bg-muted/40'
        )}
      >
        <div className="shrink-0" style={{ transform: selected ? 'rotate(-2deg)' : 'none', transition: 'transform 0.2s' }}>
          <StampSVG id={id} W={56} H={70} maskSuffix={`-domain-${id}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-snug">{displayLabel}</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{DOMAIN_DESCRIPTIONS[id]}</p>
        </div>
        <div className={cn(
          'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
          selected ? 'border-primary bg-primary' : 'border-border'
        )}>
          {selected && <span className="text-primary-foreground text-[9px] font-bold leading-none">✓</span>}
        </div>
      </button>

      {/* Custom label input when 'other' selected */}
      {id === 'other' && selected && (
        <input
          type="text"
          className="w-full px-4 py-2.5 text-sm font-sans rounded-xl border border-dashed border-foreground/20 bg-transparent outline-none focus:border-foreground/40 transition-colors placeholder:text-muted-foreground"
          placeholder="e.g. Inclusive pedagogy, Questioning techniques…"
          value={customLabel}
          onChange={(e) => onCustomLabel?.(e.target.value)}
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>
  )
}
