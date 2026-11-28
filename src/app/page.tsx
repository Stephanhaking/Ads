'use client'

import { useEffect } from 'react'
import { useStore } from '@/lib/store'
import { AuthScreen } from '@/components/auth'
import { AppShell } from '@/components/shell'
import { Wordmark } from '@/components/brand'
import { Button } from '@/components/kit'

export default function Home() {
  const status = useStore((s) => s.status)
  const load = useStore((s) => s.load)
  const notice = useStore((s) => s.notice)

  useEffect(() => {
    load()
  }, [load])

  if (status === 'loading') {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <Wordmark className="text-[28px] opacity-60" />
      </div>
    )
  }
  if (status === 'error') {
    return (
      <div className="mx-auto flex min-h-[100dvh] max-w-[420px] flex-col items-start justify-center gap-4 px-6">
        <Wordmark className="text-[24px]" />
        <p className="text-[15px] text-muted-foreground">{notice?.text ?? 'Could not reach the server.'}</p>
        <Button onClick={load}>Try again</Button>
      </div>
    )
  }
  if (status === 'anon') return <AuthScreen />
  return <AppShell />
}
