export default function DashboardLoading() {
  return (
    <div className="flex flex-col min-h-screen pb-20 px-6 animate-pulse">
      {/* Greeting */}
      <div className="mb-8 space-y-2">
        <div className="h-3 w-32 bg-foreground/8 rounded" />
        <div className="h-9 w-44 bg-foreground/8 rounded-xl" />
        <div className="h-4 w-64 bg-foreground/8 rounded" />
      </div>

      {/* Search */}
      <div className="h-12 w-full bg-foreground/8 rounded-2xl mb-8" />

      {/* Label */}
      <div className="h-3 w-28 bg-foreground/8 rounded mb-4" />

      {/* Capsule list */}
      <div className="space-y-3 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-3xl border border-border p-4">
            <div className="h-14 w-14 bg-foreground/8 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-20 bg-foreground/8 rounded" />
              <div className="h-5 w-36 bg-foreground/8 rounded" />
              <div className="h-3 w-16 bg-foreground/8 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Create button */}
      <div className="h-14 w-full bg-foreground/8 rounded-2xl" />
    </div>
  );
}
