// pages/dashboard.js
// Author:HadiaNoor Purpose:Part of Assigned task Date:27-2-26
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const { signOut } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push('/auth')
  }

  return (
    <div>
      <nav>
        <button onClick={handleLogout}>Logout</button>
      </nav>
      <p>dashboard</p>
    </div>
  )
}