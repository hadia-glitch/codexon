//author:HadiaNoor Purpose:Custom 404 Not Found page for Task Management App Date:29-2-26
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="font-mono text-amber-500 text-sm tracking-widest uppercase mb-4">
          Error 404
        </p>
        <h1 className="font-display text-7xl sm:text-9xl font-800 text-slate-800 mb-4">
          404
        </h1>
        <p className="text-slate-400 text-lg mb-8">
          This page doesn&apos;t exist in the system.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-slate-950 font-semibold rounded-lg hover:bg-amber-400 transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}