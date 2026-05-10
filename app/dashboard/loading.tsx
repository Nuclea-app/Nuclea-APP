export default function DashboardLoading() {
  return (
    <div className="flex flex-col items-center pt-8 pb-12 px-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="w-full flex items-center justify-between mb-8">
        <div className="h-4 w-24 bg-surface rounded" />
        <div className="h-6 w-6 bg-surface rounded-full" />
      </div>

      {/* Badge Skeleton */}
      <div className="mb-8">
        <div className="h-6 w-32 bg-surface rounded-full" />
      </div>

      {/* Profile Image Skeleton */}
      <div className="relative mb-6">
        <div className="h-[120px] w-[120px] rounded-full bg-surface" />
      </div>

      {/* Name Skeleton */}
      <div className="h-10 w-48 bg-surface rounded mb-4" />

      {/* Description Skeleton */}
      <div className="space-y-2 flex flex-col items-center mb-10">
        <div className="h-4 w-64 bg-surface rounded" />
        <div className="h-4 w-48 bg-surface rounded" />
      </div>

      {/* Action Grid Skeleton */}
      <div className="grid grid-cols-4 gap-4 w-full mb-12">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="h-16 w-16 bg-surface rounded-2xl" />
            <div className="h-3 w-12 bg-surface rounded" />
          </div>
        ))}
      </div>

      {/* Stats Card Skeleton */}
      <div className="w-full border border-border rounded-3xl p-6 mb-12 bg-surface/30 h-[100px]" />

      {/* Calendar Skeleton */}
      <div className="w-full h-[300px] bg-surface/30 rounded-3xl border border-border" />
    </div>
  );
}
