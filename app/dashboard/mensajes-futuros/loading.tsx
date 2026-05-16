export default function MensajesFuturosLoading() {
  return (
    <div className="flex flex-col pb-12 px-6 pt-8 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="h-8 w-8 bg-foreground/8 rounded-full" />
        <div className="h-4 w-16 bg-foreground/8 rounded" />
        <div className="h-8 w-8 bg-foreground/8 rounded-full" />
      </div>

      {/* Hero icon */}
      <div className="flex flex-col items-center gap-3 mb-8">
        <div className="h-16 w-16 bg-foreground/8 rounded-full" />
        <div className="h-8 w-48 bg-foreground/8 rounded-xl" />
        <div className="h-3 w-28 bg-foreground/8 rounded" />
        <div className="h-px w-16 bg-foreground/8" />
      </div>

      {/* Toggle tabs */}
      <div className="flex rounded-2xl border border-border overflow-hidden mb-8">
        <div className="flex-1 h-12 bg-foreground/8" />
        <div className="w-px bg-border" />
        <div className="flex-1 h-12 bg-foreground/8" />
      </div>

      {/* Section label */}
      <div className="h-3 w-32 bg-foreground/8 rounded mb-4" />

      {/* Message cards */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-3xl border border-border p-4">
            <div className="h-11 w-11 bg-foreground/8 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 bg-foreground/8 rounded" />
              <div className="h-4 w-40 bg-foreground/8 rounded" />
            </div>
            <div className="h-5 w-5 bg-foreground/8 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
