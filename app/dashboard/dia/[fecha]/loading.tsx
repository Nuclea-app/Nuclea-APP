export default function DiaLoading() {
  return (
    <div className="min-h-screen px-6 pb-8 flex flex-col animate-pulse">
      {/* Hero */}
      <div className="flex flex-col items-center gap-3 mb-10">
        <div className="h-3 w-24 bg-foreground/8 rounded" />
        <div className="h-9 w-56 bg-foreground/8 rounded-xl" />
        <div className="h-4 w-64 bg-foreground/8 rounded" />
      </div>

      {/* Memory cards */}
      <div className="space-y-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-border p-5 flex flex-col gap-4">
            {/* Badge row */}
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 bg-foreground/8 rounded-full" />
                <div className="h-3 w-20 bg-foreground/8 rounded" />
              </div>
              <div className="h-3 w-10 bg-foreground/8 rounded" />
            </div>
            {/* Content */}
            <div className="aspect-square w-full bg-foreground/8 rounded-2xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
