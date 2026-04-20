import { useState } from 'react'
import { toast } from 'sonner'
import { useLetterboxStore } from '@/store/letterbox-store'
import { useShallow } from 'zustand/react/shallow'
import { Button } from '@/components/ui/button'
import { DomainRow } from '@/components/stamps/StampChooser'
import { STAMP_ORDER } from '@/components/stamps/StampSVG'
import type { StampId } from '@/types'

export function LearningGoals() {
  const { defaultStampIds, setDefaultStamps, setFlow } = useLetterboxStore(
    useShallow((s) => ({
      defaultStampIds: s.defaultStampIds,
      setDefaultStamps: s.setDefaultStamps,
      setFlow: s.setFlow,
    }))
  )

  const [selected, setSelected] = useState<StampId[]>(
    defaultStampIds.length > 0 ? [...defaultStampIds] : ['culture']
  )
  const [customLabel, setCustomLabel] = useState('')

  function toggleDomain(id: StampId) {
    setSelected((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      return next.length === 0 ? prev : next // must keep at least one
    })
  }

  function handleSave() {
    setDefaultStamps(selected)
    toast.success('Learning goals saved ✦', {
      description: "These domains will be pre-selected next time you write a letter.",
    })
    setFlow('write')
  }

  return (
    <main className="w-full px-8 xl:px-12 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[2rem] font-semibold leading-none text-foreground mb-2">
            What area of teaching are you focusing on?
          </h1>
          <p className="text-sm text-muted-foreground max-w-[65ch]">
            Choose your default feedback domains. These will be pre-selected when you start a new feedback letter.
          </p>
        </div>

        {/* Domain rows */}
        <div className="space-y-3">
          {STAMP_ORDER.map((id) => (
            <DomainRow
              key={id}
              id={id}
              selected={selected.includes(id)}
              onToggle={() => toggleDomain(id)}
              customLabel={customLabel}
              onCustomLabel={setCustomLabel}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" size="default" onClick={() => setFlow('write')}>
            Cancel
          </Button>
          <Button size="default" onClick={handleSave} disabled={selected.length === 0}>
            Save goals
          </Button>
        </div>
      </div>
    </main>
  )
}
