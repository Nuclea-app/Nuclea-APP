export default function MensajeFuturoDetalleLoading() {
  return (
    <div className="flex flex-col pb-12 px-6 animate-pulse">
      {/* Status badge */}
      <div className="flex justify-center mb-6">
        <div className="h-7 w-32 bg-foreground/8 rounded-full" />
      </div>

      {/* Title */}
      <div className="flex flex-col items-center gap-3 mb-8">
        <div className="h-8 w-56 bg-foreground/8 rounded-xl" />
        <div className="h-4 w-44 bg-foreground/8 rounded" />
      </div>

      {/* Unlock date card */}
      <div className="w-full h-20 bg-foreground/8 rounded-3xl mb-8" />

      {/* Content area */}
      <div className="w-full h-48 bg-foreground/8 rounded-3xl" />
    </div>
  );
}
