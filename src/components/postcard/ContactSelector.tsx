import { useRef, useState, useEffect } from 'react'
import { useLetterboxStore } from '@/store/letterbox-store'
import { useShallow } from 'zustand/react/shallow'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function ContactSelector({ excludeId }: { excludeId?: string } = {}) {
  const [open, setOpen] = useState(false)
  const [addEmail, setAddEmail] = useState('')
  const wrapRef = useRef<HTMLDivElement>(null)

  const { contacts, selectedIds, toggleContact, addCustomContact, removeContact } = useLetterboxStore(
    useShallow((s) => ({
      contacts: s.contacts,
      selectedIds: s.selectedIds,
      toggleContact: s.toggleContact,
      addCustomContact: s.addCustomContact,
      removeContact: s.removeContact,
    }))
  )

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  function handleAddEmail(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const email = addEmail.trim().replace(/,$/, '')
      if (!email) return
      addCustomContact(email)
      setAddEmail('')
    }
  }

  const visibleContacts = excludeId ? contacts.filter((c) => c.id !== excludeId) : contacts
  const selected = selectedIds
    .filter((id) => id !== excludeId)
    .map((id) => contacts.find((c) => c.id === id))
    .filter(Boolean) as typeof contacts

  const typeColor: Record<string, string> = {
    mentor: 'bg-primary text-primary-foreground',
    ai:     'bg-foreground text-background',
    peer:   'bg-[#5A8B58] text-white',
  }

  return (
    <div className="relative" ref={wrapRef}>
      {/* Trigger */}
      <div
        className={cn(
          'min-h-[42px] flex items-center gap-2 px-3 py-2 rounded-md border bg-background cursor-pointer transition-colors',
          open ? 'border-primary ring-2 ring-primary/20' : 'border-input hover:border-primary/50'
        )}
        role="combobox"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen((v) => !v) }
          if (e.key === 'Escape') setOpen(false)
        }}
      >
        <div className="flex flex-wrap gap-1.5 flex-1">
          {selected.length === 0 ? (
            <span className="text-sm text-muted-foreground italic">Choose recipients…</span>
          ) : selected.map((c) => (
            <span
              key={c.id}
              className="inline-flex items-center gap-1 bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5 text-xs font-medium text-foreground"
            >
              <span className={cn('w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0', typeColor[c.type] ?? 'bg-muted')}>
                {c.type === 'ai' ? '✦' : c.name[0]}
              </span>
              {c.name}
              <button
                className="text-muted-foreground hover:text-primary ml-0.5 leading-none"
                aria-label={`Remove ${c.name}`}
                onClick={(e) => { e.stopPropagation(); removeContact(c.id) }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <span className="text-muted-foreground text-xs shrink-0" style={{ transform: open ? 'rotate(180deg)' : undefined, transition: 'transform 0.2s' }}>▾</span>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-0 bg-background border border-border rounded-b-lg shadow-lg overflow-hidden animate-fade-up">
          <p className="px-3 py-2 text-[9px] font-semibold uppercase tracking-[2px] text-muted-foreground border-b border-border">
            Your contacts
          </p>
          {visibleContacts.map((c) => {
            const isSel = selectedIds.includes(c.id)
            return (
              <button
                key={c.id}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors',
                  isSel ? 'bg-primary/5' : 'hover:bg-muted'
                )}
                role="option"
                aria-selected={isSel}
                onClick={() => toggleContact(c.id)}
              >
                <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-serif text-white shrink-0', typeColor[c.type] ?? 'bg-muted-foreground')}>
                  {c.type === 'ai' ? '✦' : c.name[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground leading-tight">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.role}</p>
                </div>
                <div className={cn(
                  'w-4 h-4 rounded-full border flex items-center justify-center text-[8px] transition-all shrink-0',
                  isSel ? 'bg-primary border-primary text-primary-foreground' : 'border-border text-transparent'
                )}>
                  ✓
                </div>
              </button>
            )
          })}
          <div className="px-3 py-2 border-t border-border">
            <input
              type="email"
              className="w-full px-3 py-2 text-sm rounded-md border border-dashed border-border bg-muted/50 outline-none focus:border-primary focus:border-solid transition-colors text-foreground placeholder:text-muted-foreground placeholder:italic"
              placeholder="Add a colleague — colleague@school.edu.sg"
              value={addEmail}
              onChange={(e) => setAddEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault()
                  const email = addEmail.trim().replace(/,$/, '')
                  if (!email) return
                  addCustomContact(email)
                  setAddEmail('')
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
