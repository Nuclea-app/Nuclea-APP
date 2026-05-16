export default function EntregarLoading() {
  return (
    <div className="flex flex-col pb-16 px-6 pt-8 min-h-screen animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="h-8 w-8 bg-foreground/8 rounded-full" />
        <div className="h-4 w-16 bg-foreground/8 rounded" />
        <div className="h-8 w-8 bg-foreground/8 rounded-full" />
      </div>

      {/* Separador */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="h-px w-8 bg-foreground/8" />
        <div className="h-3 w-3 bg-foreground/8 rounded-full" />
        <div className="h-px w-8 bg-foreground/8" />
      </div>

      {/* Título */}
      <div className="flex flex-col items-center gap-3 mb-10">
        <div className="h-8 w-64 bg-foreground/8 rounded-xl" />
        <div className="h-8 w-48 bg-foreground/8 rounded-xl" />
        <div className="h-4 w-52 bg-foreground/8 rounded" />
      </div>

      {/* Nombre */}
      <div className="mb-8 space-y-3">
        <div className="h-3 w-36 bg-foreground/8 rounded" />
        <div className="h-12 w-full bg-foreground/8 rounded-2xl" />
      </div>

      {/* Relación */}
      <div className="mb-8 space-y-3">
        <div className="h-3 w-36 bg-foreground/8 rounded" />
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 bg-foreground/8 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Emails */}
      <div className="mb-8 space-y-3">
        <div className="h-3 w-44 bg-foreground/8 rounded" />
        <div className="h-4 w-64 bg-foreground/8 rounded" />
        <div className="h-14 w-full bg-foreground/8 rounded-2xl" />
      </div>

      {/* Info card */}
      <div className="h-24 w-full bg-foreground/8 rounded-3xl mb-8" />

      {/* Botón */}
      <div className="h-14 w-full bg-foreground/8 rounded-2xl" />
    </div>
  );
}
