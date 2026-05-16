export default function MomentosClaveLoading() {
  return (
    <div className="flex flex-col pb-12 px-6 pt-8 animate-pulse max-w-[430px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="h-8 w-8 bg-foreground/8 rounded-full" />
        <div className="h-4 w-16 bg-foreground/8 rounded" />
        <div className="h-8 w-8 bg-foreground/8 rounded-full" />
      </div>

      {/* Hero */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="h-3 w-28 bg-foreground/8 rounded" />
        <div className="h-9 w-40 bg-foreground/8 rounded-xl" />
        <div className="h-4 w-52 bg-foreground/8 rounded" />
        <div className="h-3 w-20 bg-foreground/8 rounded" />
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`h-9 bg-foreground/8 rounded-full ${i === 0 ? "w-20" : "w-16"}`} />
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 min-[340px]:grid-cols-2 min-[728px]:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="aspect-square w-full bg-foreground/8 rounded-2xl" />
            <div className="px-1 flex items-center justify-between">
              <div className="space-y-1">
                <div className="h-3 w-12 bg-foreground/8 rounded" />
                <div className="h-3 w-20 bg-foreground/8 rounded" />
              </div>
              <div className="h-5 w-5 bg-foreground/8 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
