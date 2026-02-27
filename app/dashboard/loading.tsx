//Author:HadiaNoor Purpose:Loading screen Date:27-2-26
export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-slate-800 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-32 bg-slate-800/60 rounded animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-slate-800 rounded-lg animate-pulse" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 animate-pulse">
            <div className="h-4 w-16 bg-slate-800 rounded mb-3" />
            <div className="h-8 w-12 bg-slate-800 rounded" />
          </div>
        ))}
      </div>

      {/* Task cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 animate-pulse">
            <div className="flex justify-between mb-4">
              <div className="h-5 w-20 bg-slate-800 rounded" />
              <div className="h-5 w-12 bg-slate-800 rounded" />
            </div>
            <div className="h-6 w-3/4 bg-slate-800 rounded mb-2" />
            <div className="h-4 w-full bg-slate-800/60 rounded mb-1" />
            <div className="h-4 w-2/3 bg-slate-800/60 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}