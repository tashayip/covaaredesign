import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLetterboxStore } from '@/store/letterbox-store'
import { useShallow } from 'zustand/react/shallow'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Lightbulb, Eye, Sparkles } from 'lucide-react'

// ─── STP framework data ──────────────────────────────────────────────────────

const STP_PROCESSES = [
  {
    id: 'culture',
    title: 'Positive Classroom Culture',
    areas: [
      'Establishing Interaction and Rapport',
      'Maintaining Positive Discipline',
      'Setting Expectations and Routines',
      'Building Trust',
      'Empowering Learners',
    ],
  },
  {
    id: 'preparation',
    title: 'Lesson Preparation',
    areas: [
      'Determining Lesson Objectives',
      "Considering Learners' Profile",
      'Selecting and Sequencing Content',
      'Planning Key Questions',
      'Sequencing Learning',
      'Deciding on Instructional Strategies',
      'Deciding on Teaching Aids and Learning Resources',
    ],
  },
  {
    id: 'enactment',
    title: 'Lesson Enactment',
    areas: [
      'Activating Prior Knowledge',
      'Arousing Interest',
      'Encouraging Learner Engagement',
      'Exercising Flexibility',
      'Providing Clear Explanation',
      'Pacing and Maintaining Momentum',
      'Facilitating Collaborative Learning',
      'Using Questions to Deepen Learning',
      'Concluding the Lesson',
    ],
  },
  {
    id: 'assessment',
    title: 'Assessment and Feedback',
    areas: [
      'Checking for Understanding and Providing Feedback',
      'Supporting Self-Directed Learning',
      'Setting Meaningful Assignments',
    ],
  },
]

// ─── mock data ────────────────────────────────────────────────────────────────

interface MockLetterData {
  id: number
  lesson: string
  date: string
  youtubeId?: string
  hasRecording?: boolean
  context: string
  ask: string
  status: 'in_transit' | 'replied'
  from: string
  hasAiFeedback?: boolean
  letter?: {
    greeting: string
    wellDone: string[]
    tryNext: string[]
    reflect: string[]
    teachingActions: string[]
    closing: string
    signature: string
  }
}

const MOCK_LETTERS: Record<number, MockLetterData> = {
  1: {
    id: 1,
    lesson: 'Year 5 Maths – Fractions',
    date: '2 hours ago',
    youtubeId: undefined,
    hasRecording: true,
    context: 'Year 5 Maths, 35 pupils. Objective: introduce equivalent fractions using area models. I tried a new visual approach at the 12-minute mark and wasn\'t sure it landed.',
    ask: 'Was my pacing right after the group work segment? Did students seem to understand before I moved on?',
    status: 'in_transit',
    from: 'Orchid AI',
  },
  2: {
    id: 2,
    lesson: 'P3 Science – Living Things',
    date: '3 days ago',
    youtubeId: 'lhS6rpMgULM',
    context: "P3 Science, 36 pupils. Objective: categorise living vs non-living things using observable characteristics. The plant observation activity at 14 min was new — I'd never done it before and I wasn't sure students were on track.",
    ask: 'Did the plant observation activity land? Were students genuinely engaged, or just compliant? And did I handle the questioning well after the activity?',
    status: 'replied',
    from: 'Sarah',
    letter: {
      greeting: 'Dear Tasha,',
      wellDone: [
        "The plant observation activity at the 14-minute mark was a genuine highlight. Students were leaning in, touching the leaves, writing notes. That's real curiosity — well earned.",
        "Your pacing in the opening was measured and confident. You gave students time to settle before diving into content, which set a calm tone for the whole lesson.",
        "The categorisation task at the close was well-sequenced: you moved from concrete (observation) to abstract (classification) in a way that felt natural.",
      ],
      tryNext: [
        'When you asked "do plants need sunlight?" at 17 min, three students at the back showed uncertain faces but didn\'t raise their hands. A quick whole-class check — show of fingers, 1 to 5 — takes 20 seconds and catches these moments.',
        'Your cold-calling was warm in tone, but you called only from the front two rows. Widening your gaze to the sides and back signals to those students that they\'re part of the lesson too.',
      ],
      reflect: [
        'At 19 min you said "does everyone understand?" — it\'s the most natural question in the world, but it rarely surfaces genuine confusion. What question could you ask instead that would make a student\'s understanding (or misunderstanding) visible?',
        'The transition out of the group task felt slightly rushed. What would 60 seconds of quiet reflection before pulling them back together look like?',
      ],
      teachingActions: [
        'Getting students actively involved — the observation activity created genuine hands-on participation',
        'Questioning to deepen thinking — targeted questions after the activity had mixed effectiveness',
        'Checking understanding — "does everyone understand?" rarely surfaces real confusion; needs rethinking',
        'Keeping the lesson moving — strong pacing overall, with one transition that felt rushed',
      ],
      closing: "This was a warm and purposeful lesson. You clearly know your students and care about their learning. Keep trusting the slower moments — they're working.",
      signature: '— Sarah',
    },
  },
  3: {
    id: 3,
    lesson: 'P4 English – Descriptive Writing',
    date: '1 week ago',
    youtubeId: 'xKxrkht7CpY',
    context: "P4 English, 34 pupils. Objective: use sensory details in descriptive writing. The pre-writing discussion at 8 min was unplanned — I went with the energy in the room.",
    ask: 'Was the wait time after questions long enough? Did I ask enough higher-order questions? The transition at 28 min felt rushed — would love a second view.',
    status: 'replied',
    from: 'Orchid AI',
    letter: {
      greeting: 'Dear Tasha,',
      wellDone: [
        "The pre-writing discussion at 8 min — the one you said was unplanned — was the best part of the lesson. Students were generating ideas aloud, building on each other's language. That's exactly what effective scaffolding looks like.",
        "Your use of mentor text was well-chosen. Reading the passage twice (once for pleasure, once annotated) gave students two different entry points into the same material.",
        "The descriptive writing samples shared at the end showed genuine progress. The range of sensory vocabulary was noticeably richer.",
      ],
      tryNext: [
        'Your wait time after higher-order questions averaged about 2 seconds. Extending to 4–5 seconds tends to improve the quality and diversity of responses, and invites quieter students in. Try counting silently to five after your next open question.',
        'The transition at 28 min felt abrupt. A deliberate "pause and listen" moment before switching tasks would smooth this considerably.',
      ],
      reflect: [
        'Of your 14 questions in the lesson, 11 were recall or comprehension level. The 3 higher-order questions produced your richest student responses. What would it look like to plan 2–3 of these deliberately before each lesson?',
        "You said the pre-writing discussion was unplanned. What made you decide to go with it in that moment? That instinct is worth examining — it might tell you something about how you read the room.",
      ],
      teachingActions: [
        'Building on each other\'s ideas — the pre-writing discussion sparked genuine peer knowledge-sharing',
        'Scaffolding with a good example — mentor text gave students two entry points into the same material',
        'Questioning to deepen thinking — wait time is the main area to develop',
        'Keeping the lesson moving — transition at 28 min identified for improvement',
        'Reading the room — the unplanned discussion revealed strong situational instinct',
      ],
      closing: 'A thoughtful lesson with a strong arc. The unplanned moments were often the most alive. Trust them more.',
      signature: '— Orchid AI, using the STP Framework',
    },
  },
  101: {
    id: 101,
    lesson: 'Year 4 Maths – Transitions',
    date: '2 hours ago',
    context: 'Year 4 Maths. I tried something new with transitions this week — moving from whole-class to pairs, then back again. I want to know if the rhythm felt right from the outside.',
    ask: 'Did the pacing between transitions feel natural? Were students ready to move each time I shifted the grouping?',
    status: 'replied',
    from: 'A teacher in Tampines',
    hasAiFeedback: false,
  },
  102: {
    id: 102,
    lesson: 'Year 8 English – Cold-calling',
    date: '5 hours ago',
    context: "Year 8 English. There's a student in the back who never puts her hand up. I asked her directly and it landed — but I'm not sure if I handled the follow-up well.",
    ask: 'Was my cold-call handled sensitively? Did the follow-up keep her engaged or did it feel like a spotlight?',
    status: 'replied',
    from: 'A teacher in Bedok',
    hasAiFeedback: false,
  },
}

// ─── annotation ──────────────────────────────────────────────────────────────

interface Annotation {
  id: number
  timeStart: string
  timeEnd: string
  note: string
  author: string
  createdAt: string
}

// ─── STP panel ───────────────────────────────────────────────────────────────

function STPPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>('enactment')

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-80 bg-background border-l border-border z-50 overflow-y-auto"
      >
        <div className="px-5 py-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-foreground">STP Framework</h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">Singapore Teaching Practice</p>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">×</button>
          </div>
          <div className="space-y-2">
            {STP_PROCESSES.map((proc) => (
              <div key={proc.id} className="border border-border rounded-lg overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition-colors"
                  onClick={() => setExpanded((p) => p === proc.id ? null : proc.id)}
                >
                  <span className="text-[13px] font-semibold text-foreground">{proc.title}</span>
                  <motion.span animate={{ rotate: expanded === proc.id ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-[10px] text-muted-foreground">▾</motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {expanded === proc.id && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                      <ul className="px-4 pb-3 space-y-1.5 border-t border-border pt-2.5">
                        {proc.areas.map((area) => (
                          <li key={area} className="flex items-start gap-2">
                            <span className="text-muted-foreground/50 text-[11px] mt-0.5 shrink-0">•</span>
                            <span className="text-[12px] text-muted-foreground leading-snug">{area}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </motion.aside>
    </>
  )
}

// ─── feedback accordion ───────────────────────────────────────────────────────

function FeedbackAccordion({ title, icon, items }: { title: string; icon?: React.ReactNode; items: string[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-background">
      <button
        className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-muted/40 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
          {icon}
          {title}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-white bg-blue-500 rounded-full px-2 py-0.5 leading-tight">{items.length}</span>
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-[10px] text-muted-foreground">▾</motion.span>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <ul className="px-5 pb-4 space-y-3 border-t border-border pt-3">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-muted-foreground/40 text-[11px] mt-0.5 shrink-0">•</span>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── annotation tab ───────────────────────────────────────────────────────────

function NotesTab({ annotations, annTimeStart, annTimeEnd, annNote, setAnnTimeStart, setAnnTimeEnd, setAnnNote, addAnnotation, removeAnnotation }: {
  annotations: Annotation[]
  annTimeStart: string; annTimeEnd: string; annNote: string
  setAnnTimeStart: (v: string) => void; setAnnTimeEnd: (v: string) => void; setAnnNote: (v: string) => void
  addAnnotation: () => void; removeAnnotation: (id: number) => void
}) {
  const [copyDone, setCopyDone] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href).catch(() => {})
    setCopyDone(true)
    setTimeout(() => setCopyDone(false), 2000)
  }

  return (
    <div className="space-y-5">

      {/* Share with colleagues */}
      <div className="rounded-xl border border-border bg-background p-4 space-y-3">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-foreground/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          <p className="text-sm font-semibold text-foreground">Invite a colleague</p>
        </div>
        <p className="text-xs text-muted-foreground">Share this letter and its feedback with a colleague — they can read the replies and add their own annotations.</p>
        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          {copyDone ? 'Link copied!' : 'Copy link'}
        </button>
      </div>

      {/* Annotations */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-foreground/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <p className="text-sm font-semibold text-foreground">Annotations</p>
          </div>
          <button
            onClick={addAnnotation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
          >
            + Add Note
          </button>
        </div>

        {/* Add form */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            className="w-[68px] px-2 py-2 text-xs rounded-lg border border-border bg-background outline-none focus:border-foreground/40 transition-colors font-mono placeholder:text-muted-foreground"
            placeholder="0:00"
            value={annTimeStart}
            onChange={(e) => setAnnTimeStart(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addAnnotation()}
          />
          <span className="self-center text-xs text-muted-foreground shrink-0">–</span>
          <input
            type="text"
            className="w-[68px] px-2 py-2 text-xs rounded-lg border border-border bg-background outline-none focus:border-foreground/40 transition-colors font-mono placeholder:text-muted-foreground"
            placeholder="0:00"
            value={annTimeEnd}
            onChange={(e) => setAnnTimeEnd(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addAnnotation()}
          />
          <input
            type="text"
            className="flex-1 px-2.5 py-2 text-xs rounded-lg border border-border bg-background outline-none focus:border-foreground/40 transition-colors placeholder:text-muted-foreground"
            placeholder="Add a note about this moment…"
            value={annNote}
            onChange={(e) => setAnnNote(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addAnnotation()}
          />
        </div>

        <AnimatePresence>
          {annotations.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-2xl mb-2">📝</p>
              <p className="text-xs text-muted-foreground">No notes yet — add timestamps while you watch.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {annotations.map((ann) => (
                <motion.li
                  key={ann.id}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3.5 rounded-xl bg-background border border-border group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-semibold text-primary">
                      {ann.timeStart} – {ann.timeEnd}
                    </span>
                    <button onClick={() => removeAnnotation(ann.id)} className="text-muted-foreground/30 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-base leading-none">×</button>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed mb-2">{ann.note}</p>
                  <p className="text-[11px] text-muted-foreground">{ann.author} · {ann.createdAt}</p>
                </motion.li>
              ))}
            </ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── in-transit empty state ───────────────────────────────────────────────────

function PendingReplyState({ from }: { from: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-3xl">
          📬
        </div>
        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 border-2 border-background animate-pulse" />
      </div>
      <h3 className="font-semibold text-foreground mb-2">Letter on its way</h3>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
        {from} is reading your lesson and writing back. A letter takes thought — this is a good sign.
      </p>
      <div className="mt-6 flex items-center gap-2 text-[11px] text-muted-foreground">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        Awaiting reply
      </div>
    </div>
  )
}

// ─── main ─────────────────────────────────────────────────────────────────────

export function LetterDetail() {
  const { selectedLetterId, setFlow, setSelectedLetter, draft, contacts, selectedIds } = useLetterboxStore(
    useShallow((s) => ({
      selectedLetterId: s.selectedLetterId,
      setFlow: s.setFlow,
      setSelectedLetter: s.setSelectedLetter,
      draft: s.draft,
      contacts: s.contacts,
      selectedIds: s.selectedIds,
    }))
  )

  const [stpOpen, setStpOpen] = useState(false)
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [annTimeStart, setAnnTimeStart] = useState('')
  const [annTimeEnd, setAnnTimeEnd] = useState('')
  const [annNote, setAnnNote] = useState('')

  const data = selectedLetterId ? MOCK_LETTERS[selectedLetterId] : null

  function handleBack() {
    setSelectedLetter(null)
    setFlow('transit')
  }

  function addAnnotation() {
    if (!annNote.trim()) return
    const now = new Date()
    const dateStr = now.toLocaleDateString('en-SG', { year: 'numeric', month: 'short', day: 'numeric' })
    setAnnotations((prev) =>
      [...prev, {
        id: Date.now(),
        timeStart: annTimeStart.trim() || '0:00',
        timeEnd: annTimeEnd.trim() || annTimeStart.trim() || '0:00',
        note: annNote.trim(),
        author: 'teacher@covaa.edu.sg',
        createdAt: dateStr,
      }].sort((a, b) => a.timeStart.localeCompare(b.timeStart))
    )
    setAnnTimeStart('')
    setAnnTimeEnd('')
    setAnnNote('')
  }

  function removeAnnotation(id: number) {
    setAnnotations((prev) => prev.filter((a) => a.id !== id))
  }

  if (!data) {
    // Just-sent letter (id=0) — show pending state using draft info
    if (selectedLetterId === 0 && draft.lesson) {
      const recipientNames = selectedIds
        .map((id) => contacts.find((c) => c.id === id)?.name)
        .filter(Boolean)
        .join(', ') || 'your recipients'
      return (
        <main className="w-full px-8 xl:px-12 py-8">
          <div className="mx-auto max-w-5xl">
            <button onClick={handleBack} className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 flex items-center gap-1.5">← My letters</button>
            <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-10 items-start">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-foreground leading-snug">{draft.lesson}</h2>
                <p className="text-[12px] text-muted-foreground">📅 Just now</p>
              </div>
              <PendingReplyState from={recipientNames} />
            </div>
          </div>
        </main>
      )
    }
    return (
      <main className="w-full px-8 xl:px-12 py-8">
        <button onClick={handleBack} className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">← My letters</button>
        <p className="text-sm text-muted-foreground">Letter not found.</p>
      </main>
    )
  }

  const isPending = data.status === 'in_transit'
  const hasAiFeedback = data.hasAiFeedback !== false

  return (
    <>
      <STPPanel open={stpOpen} onClose={() => setStpOpen(false)} />

      <main className="w-full px-8 xl:px-12 py-8">

        {/* Top nav */}
        <div className="flex items-center justify-between mb-8 mx-auto max-w-5xl">
          <button onClick={handleBack} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
            ← My letters
          </button>
          {!isPending && (
            <button
              onClick={() => setStpOpen(true)}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 transition-colors hover:bg-muted"
            >
              STP Framework ≡
            </button>
          )}
        </div>

        {/* Two-column grid */}
        <div className="mx-auto max-w-5xl grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-10 items-start">

          {/* ── Left: lesson info ── */}
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-foreground leading-snug mb-1">{data.lesson}</h2>
              <p className="text-[12px] text-muted-foreground">
                📅 {data.date}
                {!isPending && ` · from ${data.from}`}
              </p>
            </div>

            {/* Video */}
            {data.youtubeId ? (
              <div className="aspect-video rounded-xl overflow-hidden border border-border bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${data.youtubeId}?rel=0&modestbranding=1`}
                  title="Lesson recording"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            ) : data.hasRecording ? (
              <div className="aspect-video rounded-xl border border-border bg-muted/60 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl mb-2">📹</p>
                  <p className="text-sm font-medium text-foreground/70">Recording attached</p>
                  <p className="text-xs text-muted-foreground mt-1">Processing for viewing…</p>
                </div>
              </div>
            ) : (
              <div className="aspect-video rounded-xl border border-dashed border-border bg-muted flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl mb-1">🎬</p>
                  <p className="text-xs text-muted-foreground">No recording attached</p>
                </div>
              </div>
            )}

            {/* Lesson context */}
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-[2px] text-muted-foreground">Lesson context</p>
              <p className="font-serif italic text-sm text-foreground/75 leading-relaxed">{data.context}</p>
            </div>

            {/* Your ask */}
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-[2px] text-muted-foreground">Your ask</p>
              <p className="font-serif italic text-sm text-foreground/80 leading-relaxed">{data.ask}</p>
            </div>
          </div>

          {/* ── Right: feedback ── */}
          <div>
            {isPending ? (
              <PendingReplyState from={data.from} />
            ) : (
              <Tabs defaultValue={hasAiFeedback ? 'feedback' : 'notes'}>
                <TabsList className="w-full bg-black/[0.07] mb-6">
                  {hasAiFeedback ? (
                    <>
                      <TabsTrigger value="feedback" className="flex-1 text-xs">AI Feedback</TabsTrigger>
                      <TabsTrigger value="notes"    className="flex-1 text-xs">Notes</TabsTrigger>
                    </>
                  ) : (
                    <>
                      <TabsTrigger value="notes"    className="flex-1 text-xs">Notes</TabsTrigger>
                      <TabsTrigger value="feedback" className="flex-1 text-xs">AI Feedback</TabsTrigger>
                    </>
                  )}
                </TabsList>

                <TabsContent value="feedback" className="space-y-4">
                  {!data.letter || !hasAiFeedback ? (
                    <div className="flex flex-col items-center gap-4 py-16 text-center">
                      <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-violet-500" />
                      </div>
                      <div className="space-y-1.5">
                        <p className="font-semibold text-foreground">No AI feedback yet</p>
                        <p className="text-sm text-muted-foreground max-w-xs">
                          This letter was shared for peer feedback. Send it to Orchid AI to get
                          structured feedback using the STP Framework too.
                        </p>
                      </div>
                      <button
                        onClick={() => setFlow('write')}
                        className="px-5 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
                      >
                        Get feedback from Orchid AI →
                      </button>
                    </div>
                  ) : (<>
                  {/* Greeting — prominent */}
                  <div className="mb-2">
                    <p className="font-serif text-2xl text-foreground leading-tight">{data.letter.greeting}</p>
                  </div>

                  {/* What went well */}
                  <div className="rounded-xl border border-green-200 bg-green-50/60 overflow-hidden">
                    <div className="px-5 py-3 border-b border-green-200/60 flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-[9px] font-bold shrink-0">✓</span>
                      <p className="text-sm font-semibold text-green-800">What went well</p>
                    </div>
                    <ul className="px-5 py-4 space-y-3">
                      {data.letter.wellDone.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-green-400 text-[11px] mt-0.5 shrink-0">•</span>
                          <p className="text-sm text-green-900 leading-relaxed">{item}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Try this next time */}
                  <div className="rounded-xl border border-amber-200 bg-amber-50/60 overflow-hidden">
                    <div className="px-5 py-3 border-b border-amber-200/60 flex items-center gap-2">
                      <span className="text-amber-600 text-base leading-none">→</span>
                      <p className="text-sm font-semibold text-amber-800">Try this next time</p>
                    </div>
                    <ul className="px-5 py-4 space-y-3">
                      {data.letter.tryNext.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-amber-400 text-[11px] mt-0.5 shrink-0">•</span>
                          <p className="text-sm text-amber-900 leading-relaxed">{item}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Collapsible sections */}
                  <FeedbackAccordion title="Before you move on…" icon={<Lightbulb className="w-4 h-4 text-violet-500 shrink-0" />} items={data.letter.reflect} />
                  <FeedbackAccordion title="What caught my attention" icon={<Eye className="w-4 h-4 text-sky-500 shrink-0" />} items={data.letter.teachingActions} />
                  </>)}
                </TabsContent>

                <TabsContent value="notes">
                  <NotesTab
                    annotations={annotations}
                    annTimeStart={annTimeStart} annTimeEnd={annTimeEnd} annNote={annNote}
                    setAnnTimeStart={setAnnTimeStart} setAnnTimeEnd={setAnnTimeEnd} setAnnNote={setAnnNote}
                    addAnnotation={addAnnotation} removeAnnotation={removeAnnotation}
                  />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
