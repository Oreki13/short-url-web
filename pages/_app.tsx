import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { AuthProvider } from '@/lib/context/AuthContext'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useEffect, useState } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)

  // Wait for router to be ready
  useEffect(() => {
    setIsReady(router.isReady)
  }, [router.isReady])

  // Skip redirect on login page to prevent conflicts
  const skipRedirectOnNoToken = router.pathname === '/login'

  if (!isReady) {
    return <LoadingSpinner message="Initializing..." fullScreen />
  }

  return (
    <AuthProvider skipRedirectOnNoToken={skipRedirectOnNoToken}>
      <Component {...pageProps} />
    </AuthProvider>
  )
}
