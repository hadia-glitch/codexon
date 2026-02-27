/*Author:HadiaNoor Purpose:fallback for not found Date:27-2-26*/
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white gap-4">
      <h1 className="text-6xl font-bold text-violet-500">404</h1>
      <p className="text-gray-400 text-lg">Page not found</p>
      <Link
        href="/auth/login"
        className="mt-4 px-6 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-medium transition-colors"
      >
        Go Home
      </Link>
    </div>
  )
}