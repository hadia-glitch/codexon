//Author:HadiaNoor Purpose:Renders register page Date:27-2-26
'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RegisterForm() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, fullName);
      setSuccess('Account created! Check your email to confirm, then sign in.');
      setTimeout(() => router.push('/auth/login'), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 glow-amber-sm">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-700 text-slate-100 mb-1">
          Create account
        </h1>
        <p className="text-slate-500 text-sm">Set up your TaskForge workspace</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-mono text-xs text-slate-500 uppercase tracking-wider mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="John Doe"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all font-mono text-sm"
          />
        </div>

        <div>
          <label className="block font-mono text-xs text-slate-500 uppercase tracking-wider mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all font-mono text-sm"
          />
        </div>

        <div>
          <label className="block font-mono text-xs text-slate-500 uppercase tracking-wider mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Min. 6 characters"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all font-mono text-sm"
          />
        </div>

        <div>
          <label className="block font-mono text-xs text-slate-500 uppercase tracking-wider mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all font-mono text-sm"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
            <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-400 text-sm font-mono">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-3">
            <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-emerald-400 text-sm font-mono">{success}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-slate-950 font-display font-700 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Create Account
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-800 text-center">
        <p className="text-slate-600 text-sm">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}