import { useEffect, useState } from 'react'
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
  status: 'in_transit' | 'replied' | 'draft'
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
]

// ─── tab config ──────────────────────────────────────────────────────────────

type Tab = 'received' | 'awaiting' | 'drafts'

// ─── letter card ─────────────────────────────────────────────────────────────

function LetterCard({
  letter, index, onViewDetail,
}: {
  letter: SentLetter
  index: number
  onViewDetail: (id: number) => void
}) {
  const canOpen = letter.status !== 'draft'

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: index * 0.07, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        'rounded-xl border bg-background overflow-hidden transition-colors',
        canOpen
          ? 'border-border hover:border-foreground/20 cursor-pointer'
          : 'border-border cursor-default opacity-60'
      )}
      onClick={() => canOpen && onViewDetail(letter.id)}
      role={canOpen ? 'button' : undefined}
      tabIndex={canOpen ? 0 : undefined}
      onKeyDown={(e) => { if (canOpen && (e.key === 'Enter' || e.key === ' ')) onViewDetail(letter.id) }}
    >
      <div className="flex items-start gap-3.5 p-4">
        {/* Envelope icon */}
        <span className="text-xl mt-0.5 shrink-0 select-none" aria-hidden="true">
          {letter.status === 'replied' ? (letter.isNew ? '📬' : '✉️') : '📤'}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-foreground leading-snug truncate">{letter.lesson}</p>
            <span className="text-[10px] text-muted-foreground shrink-0 pt-px">{letter.sentAt}</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{letter.recipients.join(', ')}</p>

          {/* Status */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className={cn(
              'w-1.5 h-1.5 rounded-full shrink-0',
              letter.status === 'in_transit' ? 'bg-amber-400 animate-pulse' :
              letter.status === 'replied' ? 'bg-blue-500' : 'bg-muted-foreground/40'
            )} />
            <span className={cn(
              'text-[10px] font-semibold',
              letter.status === 'in_transit' ? 'text-amber-600' :
              letter.status === 'replied' ? 'text-blue-600' : 'text-muted-foreground'
            )}>
              {letter.status === 'in_transit'
                ? letter.recipients.includes('Orchid AI')
                  ? 'Orchid AI is drafting a reply — coming soon'
                  : 'Sent — awaiting reply'
                : letter.status === 'replied'
                  ? letter.isNew ? 'New reply received ✦' : 'Reply received'
                  : 'Draft'}
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
    awaiting: { icon: '📤', text: 'Nothing in transit right now.' },
    drafts:   { icon: '📝', text: 'No drafts saved.' },
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

  const [mailboxOpen, setMailboxOpen] = useState(false)
  const [seenIds, setSeenIds] = useState<Set<number>>(new Set())
  const [activeTab, setActiveTab] = useState<Tab>('received')

  useEffect(() => {
    const t = setTimeout(() => setMailboxOpen(true), 400)
    return () => clearTimeout(t)
  }, [])

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
  const awaiting  = lettersWithSeen.filter((l) => l.status === 'in_transit')
  const drafts    = lettersWithSeen.filter((l) => l.status === 'draft')

  const newLetters = received.filter((l) => l.isNew)
  const hasNewMail = newLetters.length > 0

  function handleViewDetail(id: number) {
    const wasNew = lettersWithSeen.find((l) => l.id === id)?.isNew
    setSeenIds((prev) => new Set([...prev, id]))
    if (wasNew) decrementNewLetterCount()
    setSelectedLetter(id)
    setFlow('letter-detail')
  }

  return (
    <div className="space-y-5">

      {/* ── Header: no-mail state ── */}
      <AnimatePresence mode="wait">
        {!mailboxOpen || !hasNewMail ? (
          <motion.div
            key="nomail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-4"
          >
            <motion.span
              className="text-4xl select-none"
              animate={mailboxOpen ? { rotate: [0, -6, 6, -3, 0] } : {}}
              transition={{ delay: 0.1, duration: 0.5 }}
              aria-hidden="true"
            >
              {mailboxOpen ? '📭' : '📪'}
            </motion.span>
            <div>
              <p className="font-semibold text-foreground">My letters</p>
              <p className="text-xs text-muted-foreground">
                {allLetters.length} {allLetters.length === 1 ? 'letter' : 'letters'} total
              </p>
            </div>
          </motion.div>
        ) : (
          /* ── Header: you've got mail! ── */
          <motion.div
            key="newmail"
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ delay: 0.2, duration: 0.45, ease: [0.34, 1.3, 0.64, 1] }}
            className="rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-50/30 overflow-hidden shadow-sm"
          >
            <div className="px-5 py-4">
              <div className="flex items-center gap-3 mb-3">
                <motion.span
                  className="text-3xl select-none"
                  animate={{ rotate: [0, -10, 10, -5, 0] }}
                  transition={{ delay: 0.55, duration: 0.7 }}
                  aria-hidden="true"
                >
                  📬
                </motion.span>
                <div>
                  <p className="font-semibold text-foreground">You've got mail ✦</p>
                  <p className="text-xs text-muted-foreground">
                    {newLetters.length} new {newLetters.length === 1 ? 'reply' : 'replies'} arrived
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {newLetters.slice(0, 3).map((l) => (
                  <button
                    key={l.id}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-white/70 border border-amber-100 hover:bg-white/90 transition-colors text-left"
                    onClick={() => handleViewDetail(l.id)}
                  >
                    <span className="text-base select-none" aria-hidden="true">✉️</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-foreground truncate">{l.lesson}</p>
                      <p className="text-[10px] text-muted-foreground">Reply from {l.recipients.join(', ')}</p>
                    </div>
                    <span className="text-[10px] text-amber-600 font-medium shrink-0">Open →</span>
                  </button>
                ))}
                {newLetters.length > 3 && (
                  <p className="text-[11px] text-amber-700 font-medium text-center pt-1">
                    +{newLetters.length - 3} more —{' '}
                    <button
                      className="underline underline-offset-2 hover:text-amber-900"
                      onClick={() => setActiveTab('received')}
                    >
                      see all in Received
                    </button>
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Tab)}>
        <TabsList className="w-full bg-black/[0.07]">
          <TabsTrigger value="received" className="flex-1 text-xs">
            Received
            {received.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 text-blue-600">{received.length}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="awaiting" className="flex-1 text-xs">
            Awaiting reply
            {awaiting.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-muted-foreground/15 text-muted-foreground">{awaiting.length}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="drafts" className="flex-1 text-xs">
            Drafts
            {drafts.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-muted-foreground/15 text-muted-foreground">{drafts.length}</span>
            )}
          </TabsTrigger>
        </TabsList>

        {(['received', 'awaiting', 'drafts'] as Tab[]).map((tabId) => {
          const letters = tabId === 'received' ? received : tabId === 'awaiting' ? awaiting : drafts
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
        While you wait —{' '}
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
