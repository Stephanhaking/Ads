'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Target, Users, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store'
import { HomeScreen } from '@/components/screens/home-screen'
import { ChallengesScreen } from '@/components/screens/challenges-screen'
import { CommunitiesScreen } from '@/components/screens/communities-screen'
import { ProfileScreen } from '@/components/screens/profile-screen'
import { CognitiveLoadTracker } from '@/components/app/cognitive-load-tracker'
import { SaturationAlert } from '@/components/app/cognitive-load-widget'
import { FocusLockScreen } from '@/components/app/focus-lock-screen'

export type TabId = 'home' | 'challenges' | 'communities' | 'profile'

const TABS: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'challenges', label: 'Challenges', icon: Target },
  { id: 'communities', label: 'Communities', icon: Users },
  { id: 'profile', label: 'Profile', icon: User },
]

export function AppShell() {
  const [active, setActive] = useState<TabId>('home')
  const focusLock = useAppStore((s) => s.focusLock)
  const evaluateCommitments = useAppStore((s) => s.evaluateCommitments)

  // Once a day, settle any commitment the member failed by not checking in.
  useEffect(() => {
    evaluateCommitments()
  }, [evaluateCommitments])

  // During a Focus Lock the app shows only the countdown and the task.
  if (focusLock) {
    return (
      <>
        <CognitiveLoadTracker />
        <FocusLockScreen />
      </>
    )
  }

  return (
    <div className="relative min-h-[100dvh] flex flex-col">
      <CognitiveLoadTracker />
      <SaturationAlert />

      <main className="flex-1 pb-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {active === 'home' && <HomeScreen onNavigate={setActive} />}
            {active === 'challenges' && <ChallengesScreen />}
            {active === 'communities' && <CommunitiesScreen />}
            {active === 'profile' && <ProfileScreen />}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[460px] z-30"
          aria-label="Primary"
        >
          <div className="mx-3 mb-3 rounded-2xl glass-card shadow-2xl shadow-black/40">
            <div className="grid grid-cols-4">
              {TABS.map((tab) => {
                const Icon = tab.icon
                const isActive = active === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActive(tab.id)}
                    className={cn(
                      'relative flex flex-col items-center justify-center gap-1 py-3 transition-colors',
                      isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="tab-glow"
                        className="absolute inset-x-3 top-1 h-9 rounded-xl bg-primary/15"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    <Icon className="relative h-5 w-5" strokeWidth={isActive ? 2.4 : 1.8} />
                    <span className="relative text-[10px] font-medium tracking-wide">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
      </nav>
    </div>
  )
}

