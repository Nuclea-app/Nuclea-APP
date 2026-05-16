export default function MensajeFuturoLoading() {
  return (
    <div className="flex flex-col pb-12 px-6 pt-8 min-h-screen animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="h-8 w-8 bg-foreground/8 rounded-full" />
        <div className="h-4 w-16 bg-foreground/8 rounded" />
        <div className="h-8 w-8 bg-foreground/8 rounded-full" />
      </div>

      {/* Hero */}
      <div className="flex flex-col items-center gap-3 mb-10">
        <div className="h-3 w-24 bg-foreground/8 rounded" />
        <div className="h-9 w-52 bg-foreground/8 rounded-xl" />
        <div className="h-4 w-60 bg-foreground/8 rounded" />
      </div>

      {/* Tipo selector */}
      <div className="mb-8 space-y-3">
        <div className="h-3 w-28 bg-foreground/8 rounded" />
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-foreground/8 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Fecha selector */}
      <div className="mb-8 space-y-3">
        <div className="h-3 w-32 bg-foreground/8 rounded" />
        <div className="h-14 w-full bg-foreground/8 rounded-2xl" />
      </div>

      {/* Contenido */}
      <div className="mb-8 space-y-3">
        <div className="h-3 w-24 bg-foreground/8 rounded" />
        <div className="h-40 w-full bg-foreground/8 rounded-2xl" />
      </div>

      {/* Botón */}
      <div className="h-14 w-full bg-foreground/8 rounded-2xl mt-auto" />
    </div>
  );
}
