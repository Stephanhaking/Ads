'use client'

import { useAppStore } from '@/lib/store'
import { Onboarding } from '@/components/app/onboarding'
import { AppShell } from '@/components/app/app-shell'

export default function Home() {
  const onboarded = useAppStore((s) => s.onboarded)

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <div className="phone-frame">
        {onboarded ? <AppShell /> : <Onboarding />}
      </div>
    </div>
  )
}
