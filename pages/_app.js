// pages/_app.js
//Author:HadiaNoor Purpose:Part of Assigned task Date:27-2-26
import { AuthProvider } from '../context/AuthContext'
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}