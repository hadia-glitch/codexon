/*Author:HadiaNoor Purpose:defines main route css Date:27-2-26*/
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.signOut().then(() => {
      router.replace('/auth/login')
    })
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-8 h-8 border-2 border-gray-700 border-t-violet-500 rounded-full animate-spin" />
    </div>
  )
}