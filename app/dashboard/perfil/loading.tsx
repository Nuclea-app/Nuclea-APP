export default function PerfilLoading() {
  return (
    <div className="flex flex-col items-center pt-8 pb-12 px-6 animate-pulse max-w-[430px] mx-auto">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-8">
        <div className="h-8 w-8 bg-foreground/8 rounded-full" />
        <div className="h-4 w-16 bg-foreground/8 rounded" />
        <div className="h-8 w-8 bg-foreground/8 rounded-full" />
      </div>

      {/* Badge */}
      <div className="h-7 w-36 bg-foreground/8 rounded-full mb-8" />

      {/* Avatar */}
      <div className="h-[120px] w-[120px] rounded-full bg-foreground/8 mb-6" />

      {/* Name */}
      <div className="h-9 w-52 bg-foreground/8 rounded-xl mb-4" />

      {/* Divider */}
      <div className="flex gap-2 items-center w-full justify-center mb-4">
        <div className="w-[35%] h-px bg-foreground/8" />
        <div className="h-3 w-3 bg-foreground/8 rounded-full" />
        <div className="w-[35%] h-px bg-foreground/8" />
      </div>

      {/* Description */}
      <div className="space-y-2 flex flex-col items-center mb-10">
        <div className="h-4 w-64 bg-foreground/8 rounded" />
        <div className="h-4 w-48 bg-foreground/8 rounded" />
      </div>

      <div className="h-3 w-3 bg-foreground/8 rounded-full mb-10" />

      {/* Action Grid */}
      <div className="grid grid-cols-4 gap-4 w-full mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="h-16 w-full bg-foreground/8 rounded-2xl" />
            <div className="h-3 w-10 bg-foreground/8 rounded" />
          </div>
        ))}
      </div>

      {/* Stats Card */}
      <div className="w-full rounded-3xl border border-border p-6 mb-6">
        <div className="flex w-full items-center justify-between mb-4">
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="h-6 w-6 bg-foreground/8 rounded-full" />
            <div className="h-4 w-12 bg-foreground/8 rounded" />
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="h-6 w-6 bg-foreground/8 rounded-full" />
            <div className="h-4 w-16 bg-foreground/8 rounded" />
          </div>
        </div>
        <div className="h-px w-full bg-border my-3" />
        <div className="flex flex-col items-center gap-2 mt-4">
          <div className="h-6 w-6 bg-foreground/8 rounded-full" />
          <div className="h-4 w-24 bg-foreground/8 rounded" />
        </div>
      </div>

      {/* Calendar */}
      <div className="w-full h-[280px] bg-foreground/8 rounded-3xl mb-6" />

      {/* Memory strip */}
      <div className="w-full mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-32 bg-foreground/8 rounded" />
          <div className="h-4 w-16 bg-foreground/8 rounded" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="shrink-0 h-[120px] w-[120px] bg-foreground/8 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full flex flex-col gap-3">
        <div className="h-14 w-full bg-foreground/8 rounded-2xl" />
        <div className="h-14 w-full bg-foreground/8 rounded-2xl" />
      </div>
    </div>
  );
}
