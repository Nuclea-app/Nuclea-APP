export default function MemoriesLoading() {
  return (
    <div className="flex flex-col pb-12 px-6 animate-pulse">
      {/* Hero */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="h-3 w-28 bg-foreground/8 rounded" />
        <div className="h-9 w-48 bg-foreground/8 rounded-xl" />
        <div className="h-4 w-36 bg-foreground/8 rounded" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-square bg-foreground/8 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
