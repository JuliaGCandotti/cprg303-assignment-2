import { supabase } from '@/lib/supabase'
import { Stack, router } from 'expo-router'
import { useEffect } from 'react'

export default function RootLayout() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace('/login')
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace('/login')
    })
  }, [])

  return <Stack screenOptions={{ headerShown: false }} />
}