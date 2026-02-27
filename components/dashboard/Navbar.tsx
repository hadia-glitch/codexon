// /*Author:HadiaNoor Purpose:renders navbar Date:27-2-26*/
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    router.push('/auth/login');
  };

  const initials = user?.user_metadata?.full_name
    ? (user.user_metadata.full_name as string)
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500 rounded-md flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="font-display font-800 text-lg text-slate-100 tracking-tight hidden sm:block">
              TaskForge
            </span>
          </div>

          {/* Desktop user info */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="text-right">
              <p className="text-slate-200 text-sm font-medium leading-tight">
                {user?.user_metadata?.full_name ?? 'User'}
              </p>
              <p className="text-slate-500 font-mono text-xs">{user?.email}</p>
            </div>
            <div className="w-9 h-9 bg-amber-500/20 border border-amber-500/40 rounded-full flex items-center justify-center shrink-0">
              <span className="text-amber-400 font-mono text-sm font-600">{initials}</span>
            </div>
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-slate-100 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50"
            >
              {signingOut ? (
                <div className="w-4 h-4 border border-slate-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              )}
              Sign Out
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="sm:hidden flex items-center gap-2 p-2 rounded-lg bg-slate-800 border border-slate-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="w-8 h-8 bg-amber-500/20 border border-amber-500/40 rounded-full flex items-center justify-center">
              <span className="text-amber-400 font-mono text-xs font-600">{initials}</span>
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden border-t border-slate-800 py-4 space-y-3">
            <div>
              <p className="text-slate-200 text-sm font-medium">
                {user?.user_metadata?.full_name ?? 'User'}
              </p>
              <p className="text-slate-500 font-mono text-xs">{user?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-sm font-medium w-full disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}