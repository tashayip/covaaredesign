import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLetterboxStore } from '@/store/letterbox-store'
import { useShallow } from 'zustand/react/shallow'
import { StampSVGSmall } from '@/components/stamps/StampSVG'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import type { StampId } from '@/types'

// ─── mock data ───────────────────────────────────────────────────────────────

interface SentLetter {
  id: number
  lesson: string
  stamp: StampId
  recipients: string[]
  sentAt: string
  status: 'in_transit' | 'replied' | 'sent'
  isNew: boolean
}

const MOCK_LETTERS: SentLetter[] = [
  {
    id: 1,
    lesson: 'Year 5 Maths – Fractions',
    stamp: 'preparation',
    recipients: ['Orchid AI', 'Marcus'],
    sentAt: '2 hours ago',
    status: 'in_transit',
    isNew: false,
  },
  {
    id: 2,
    lesson: 'P3 Science – Living Things',
    stamp: 'culture',
    recipients: ['Sarah'],
    sentAt: '3 days ago',
    status: 'replied',
    isNew: true,
  },
  {
    id: 3,
    lesson: 'P4 English – Descriptive Writing',
    stamp: 'enactment',
    recipients: ['Orchid AI', 'Marcus', 'James'],
    sentAt: '1 week ago',
    status: 'replied',
    isNew: false,
  },
  {
    id: 4,
    lesson: 'P5 Science – Forces Audio Reflection',
    stamp: 'assessment',
    recipients: ['Orchid AI'],
    sentAt: 'Yesterday',
    status: 'replied',
    isNew: false,
  },
  {
    id: 101,
    lesson: 'Year 4 Maths – Transitions',
    stamp: 'preparation',
    recipients: ['A teacher in Tampines'],
    sentAt: '2 hours ago',
    status: 'sent',
    isNew: false,
  },
]

// ─── tab config ──────────────────────────────────────────────────────────────

type Tab = 'received' | 'sent'

// ─── letter card ─────────────────────────────────────────────────────────────

function LetterCard({
  letter, index, onViewDetail,
}: {
  letter: SentLetter
  index: number
  onViewDetail: (id: number) => void
}) {
  const canOpen = true
  const isNewReply = letter.status === 'replied' && letter.isNew

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: index * 0.07, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={canOpen ? { y: -1 } : undefined}
      whileTap={canOpen ? { scale: 0.995 } : undefined}
      className={cn(
        'relative rounded-xl border bg-background overflow-hidden transition-colors',
        isNewReply
          ? 'border-primary/45 bg-primary/[0.035] shadow-[0_8px_24px_rgba(200,105,72,0.10)]'
          : 'border-border hover:border-foreground/20 cursor-pointer'
      )}
      onClick={() => canOpen && onViewDetail(letter.id)}
      role={canOpen ? 'button' : undefined}
      tabIndex={canOpen ? 0 : undefined}
      onKeyDown={(e) => { if (canOpen && (e.key === 'Enter' || e.key === ' ')) onViewDetail(letter.id) }}
    >
      <div className="relative flex items-start gap-3.5 p-4">
        {/* Envelope icon */}
        <motion.span
          className="text-xl mt-0.5 shrink-0 select-none"
          animate={isNewReply ? { rotate: [0, -8, 6, -3, 0], y: [0, -2, 0] } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.34, 1.3, 0.64, 1] }}
          aria-hidden="true"
        >
          {letter.status === 'replied' ? (letter.isNew ? '📬' : '✉️') : '📤'}
        </motion.span>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <p className="truncate text-sm font-semibold leading-snug text-foreground">{letter.lesson}</p>
              {isNewReply && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.18, duration: 0.2 }}
                  className="shrink-0 rounded-full border border-primary/25 bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-primary [letter-spacing:0.12em]"
                >
                  New
                </motion.span>
              )}
            </div>
            <span className="text-[10px] text-muted-foreground shrink-0 pt-px">{letter.sentAt}</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{letter.recipients.join(', ')}</p>

          {/* Status */}
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            <motion.span
              className={cn(
              'w-1.5 h-1.5 rounded-full shrink-0',
              letter.status === 'in_transit' ? 'bg-amber-400 animate-pulse' :
              letter.status === 'replied' ? 'bg-blue-500' : 'bg-emerald-500'
              )}
              animate={isNewReply ? { scale: [1, 1.6, 1], opacity: [1, 0.55, 1] } : {}}
              transition={{ duration: 1.35, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span className={cn(
              'text-[10px] font-semibold',
              letter.status === 'in_transit' ? 'text-amber-600' :
              letter.status === 'replied' ? 'text-blue-600' : 'text-emerald-600'
            )}>
              {letter.status === 'in_transit'
                ? letter.recipients.includes('Orchid AI')
                  ? 'Orchid AI is drafting a reply — coming soon'
                  : 'Sent — reply pending'
                : letter.status === 'replied'
                  ? letter.isNew ? 'New reply received ✦' : 'Reply received'
                  : 'Response sent'}
            </span>
          </div>
        </div>

        {/* Stamp thumbnail */}
        <div className="shrink-0 mt-0.5 opacity-80" style={{ transform: 'rotate(-1.5deg)' }}>
          <StampSVGSmall id={letter.stamp} maskSuffix={`-ml${letter.id}`} />
        </div>

        {/* Arrow for openable letters */}
        {canOpen && (
          <span className="text-[10px] text-muted-foreground shrink-0 mt-1.5 select-none" aria-hidden="true">›</span>
        )}
      </div>
    </motion.div>
  )
}

// ─── empty state ─────────────────────────────────────────────────────────────

function EmptyState({ tab }: { tab: Tab }) {
  const messages: Record<Tab, { icon: string; text: string }> = {
    received: { icon: '📭', text: "No replies yet — they'll appear here when someone writes back." },
    sent: { icon: '📤', text: 'No sent letters yet.' },
  }
  const { icon, text } = messages[tab]
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center gap-2 py-14 text-center"
    >
      <span className="text-3xl">{icon}</span>
      <p className="text-sm text-muted-foreground max-w-xs">{text}</p>
    </motion.div>
  )
}

// ─── main export ─────────────────────────────────────────────────────────────

export function MyLetters() {
  const { draft, contacts, selectedIds, setFlow, setSelectedLetter, decrementNewLetterCount } = useLetterboxStore(
    useShallow((s) => ({
      draft: s.draft, contacts: s.contacts, selectedIds: s.selectedIds,
      setFlow: s.setFlow, setSelectedLetter: s.setSelectedLetter,
      decrementNewLetterCount: s.decrementNewLetterCount,
    }))
  )

  const [seenIds, setSeenIds] = useState<Set<number>>(new Set())
  const [activeTab, setActiveTab] = useState<Tab>('received')

  const justSent: SentLetter | null = draft.lesson
    ? {
        id: 0,
        lesson: draft.lesson,
        stamp: draft.stampId,
        recipients: selectedIds
          .map((id) => contacts.find((c) => c.id === id)?.name)
          .filter(Boolean) as string[],
        sentAt: 'Just now',
        status: 'in_transit',
        isNew: false,
      }
    : null

  const allLetters = justSent ? [justSent, ...MOCK_LETTERS] : MOCK_LETTERS

  const lettersWithSeen = allLetters.map((l) => ({
    ...l,
    isNew: l.isNew && !seenIds.has(l.id),
  }))

  const received = lettersWithSeen.filter((l) => l.status === 'replied')
  const sent = lettersWithSeen.filter((l) => l.status === 'in_transit' || l.status === 'sent')

  function handleViewDetail(id: number) {
    const wasNew = lettersWithSeen.find((l) => l.id === id)?.isNew
    setSeenIds((prev) => new Set([...prev, id]))
    if (wasNew) decrementNewLetterCount()
    setSelectedLetter(id)
    setFlow('letter-detail')
  }

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Tab)}>
        <TabsList className="w-full bg-black/[0.07]">
          <TabsTrigger value="received" className="flex-1 text-xs">
            Received
            {received.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 text-blue-600">{received.length}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent" className="flex-1 text-xs">
            Sent
            {sent.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-muted-foreground/15 text-muted-foreground">{sent.length}</span>
            )}
          </TabsTrigger>
        </TabsList>

        {(['received', 'sent'] as Tab[]).map((tabId) => {
          const letters = tabId === 'received' ? received : sent
          return (
            <TabsContent key={tabId} value={tabId} className="mt-4">
              <AnimatePresence mode="wait">
                {letters.length === 0 ? (
                  <EmptyState key={`empty-${tabId}`} tab={tabId} />
                ) : (
                  <motion.div
                    key={`list-${tabId}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2"
                  >
                    {letters.map((letter, i) => (
                      <LetterCard
                        key={letter.id}
                        letter={letter}
                        index={i}
                        onViewDetail={handleViewDetail}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>
          )
        })}
      </Tabs>

      {/* Footer CTA */}
      <motion.p
        className="text-xs text-center text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Looking for another letter?{' '}
        <button
          className="text-blue-600 font-medium hover:underline underline-offset-2"
          onClick={() => useLetterboxStore.getState().setFlow('discover')}
        >
          browse Open Letters from other teachers →
        </button>
      </motion.p>
    </div>
  )
}

// Keep old export name for any stale imports
export const TransitMap = MyLetters
