export function TopNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[var(--color-page-bg)]/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="font-serif text-sm text-foreground">Letterbox — CoVAA</span>
        </div>
        <span className="text-xs text-muted-foreground tracking-wide hidden sm:block">
          Teachers · Notes · Growth
        </span>
      </div>
    </header>
  )
}
