// Zustand store for The 1% app. Persists user state to localStorage so the
// app behaves like an installed app: restarts keep your progress.

'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { RANK_TIERS, getRankByPoints, getNextRank, getEffectiveRank, PROOF_REQUIREMENTS } from './ranks'
import { ACHIEVEMENTS, WEEKLY_CHALLENGES } from '@/data/mock-data'
import type { TaskRating } from '@/data/energy-map'
import {
  MAX_STAKE_EUR,
  POINTS_PENALTY,
  REVIEW_CREDIT_REWARD,
  type Commitment,
  type StakeKind,
} from '@/data/commitments'
import { DEMO_MODE } from './demo'

export type FocusArea = 'Mind' | 'Body' | 'Craft' | 'Wealth' | 'Network'

export type ActivityEntry = {
  id: string
  ts: number
  kind: 'checkin' | 'join' | 'rank-up' | 'achievement' | 'proof' | 'lock' | 'commitment'
  text: string
  points?: number
}

export type Proof = {
  id: string
  challengeId: string
  challengeTitle: string
  text: string
  url?: string
  submittedAt: number
  status: 'pending' | 'validated' | 'rejected'
  validatedBy?: string
}

export type FocusLockState = {
  startedAt: number
  durationDays: number
  endsAt: number
  task: string
}

export type FocusLockEntry = {
  startedAt: number
  endedAt: number
  durationDays: number
  completed: boolean
  task: string
}

/** Points awarded for finishing a Focus Lock, by length in days. */
export const FOCUS_LOCK_REWARD: Record<number, number> = { 1: 100, 3: 250, 7: 500 }

type AppState = {
  // Onboarding
  onboarded: boolean
  name: string
  focus: FocusArea

  // Progress
  points: number
  streak: number
  lastCheckInDate: string | null
  checkInDates: string[] // local dates (YYYY-MM-DD) with a check-in, newest first
  totalCheckIns: number

  // Communities
  joinedCommunities: string[]
  completedTasks: Record<string, string[]>
  completedChallenges: string[]

  // Achievements + activity
  achievements: string[]
  activity: ActivityEntry[]

  // Social feed
  likedPosts: string[]
  userPosts: { id: string; text: string; ts: number; category: FocusArea }[]

  // Time-in-app meter
  cognitiveLoad: number // 0-100
  lastLoadDate: string // daily reset key
  feedLockedUntil: number | null // timestamp; feed locked when Date.now() < this
  saturationDismissed: boolean

  // Energy map
  taskRatings: TaskRating[]

  // Real-world proofs
  proofs: Proof[]
  reviewedPeerProofs: string[]

  // Focus Lock (the app locks itself for a set period)
  focusLock: FocusLockState | null
  focusLockHistory: FocusLockEntry[]

  // Commitments (something at stake)
  commitments: Commitment[]
  commitmentNotice: string | null
  commitmentsCheckedDate: string | null
  pledgedTotalEur: number // demo only: no payment is made

  // Mentors
  focusCredits: number // earned by reviewing peers' proofs
  mentorPurchases: { offerId: string; mentorName: string; title: string; ts: number; cost: number }[]

  // Actions
  onboard: (name: string, focus: FocusArea) => void
  resetAll: () => void
  toggleCommunity: (id: string) => void
  toggleTask: (challengeId: string, taskId: string, pointsForTask: number) => void
  addActivity: (entry: Omit<ActivityEntry, 'id' | 'ts'>) => void
  toggleLikePost: (postId: string) => void
  addPost: (text: string, category: FocusArea) => void

  tickCognitiveLoad: () => void
  dismissSaturation: () => void
  lockFeed: (minutes: number) => void
  unlockFeed: () => void

  addTaskRating: (taskLabel: string, mastery: number, energy: number) => void

  submitProof: (challengeId: string, challengeTitle: string, text: string, url?: string) => void
  /** Demo only: stands in for a reviewer approving your proof. */
  validateProof: (proofId: string) => void
  /** Demo only: stands in for a reviewer rejecting your proof. */
  rejectProof: (proofId: string) => void
  reviewPeerProof: (peerProofId: string) => void

  enterFocusLock: (days: number, task: string) => void
  exitFocusLock: (broken: boolean) => void

  addCommitment: (c: Pick<Commitment, 'triggerId' | 'stake' | 'amountEur' | 'causeId'>) => void
  toggleCommitment: (id: string) => void
  removeCommitment: (id: string) => void
  /** Records a failure. Called by detectors, or by the demo "simulate" button. */
  failCommitment: (id: string) => void
  dismissCommitmentNotice: () => void
  evaluateCommitments: () => void

  purchaseMentorOffer: (offerId: string, mentorName: string, title: string, cost: number) => void
}

// Local calendar date, not UTC: a streak must roll over at the member's midnight.
function dateKey(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

function todayKey(): string {
  return dateKey(new Date())
}

function yesterdayKey(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return dateKey(d)
}

function pushActivity(activity: ActivityEntry[], entry: Omit<ActivityEntry, 'id' | 'ts'>): ActivityEntry[] {
  return [{ id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, ts: Date.now(), ...entry }, ...activity].slice(0, 30)
}

// Points earned for a single micro-task inside a challenge.
export function pointsPerTask(challengePoints: number, taskCount: number): number {
  if (taskCount <= 0) return 0
  return Math.round(challengePoints / taskCount)
}

const INITIAL_STATE = {
  onboarded: false,
  name: '',
  focus: 'Mind' as FocusArea,
  points: 0,
  streak: 0,
  lastCheckInDate: null as string | null,
  checkInDates: [] as string[],
  totalCheckIns: 0,
  joinedCommunities: [] as string[],
  completedTasks: {} as Record<string, string[]>,
  completedChallenges: [] as string[],
  achievements: [] as string[],
  activity: [] as ActivityEntry[],
  likedPosts: [] as string[],
  userPosts: [] as AppState['userPosts'],
  cognitiveLoad: 0,
  saturationDismissed: false,
  feedLockedUntil: null as number | null,
  taskRatings: [] as TaskRating[],
  proofs: [] as Proof[],
  reviewedPeerProofs: [] as string[],
  focusLock: null as FocusLockState | null,
  focusLockHistory: [] as FocusLockEntry[],
  commitments: [] as Commitment[],
  commitmentNotice: null as string | null,
  commitmentsCheckedDate: null as string | null,
  pledgedTotalEur: 0,
  focusCredits: 0,
  mentorPurchases: [] as AppState['mentorPurchases'],
}

// Applies one failed commitment to the state and returns the changed fields.
function applyFailure(
  state: AppState,
  commitment: Commitment
): Pick<AppState, 'commitments' | 'activity' | 'points' | 'pledgedTotalEur' | 'commitmentNotice'> {
  const isDonation = commitment.stake === 'donation'
  const amount = Math.min(commitment.amountEur, MAX_STAKE_EUR)
  const commitments = state.commitments.map((c) =>
    c.id === commitment.id ? { ...c, failedCount: c.failedCount + 1, lastFailedAt: Date.now() } : c
  )
  const text = isDonation
    ? `Commitment failed: €${amount} goes to your chosen cause.${DEMO_MODE ? ' (Demo: nothing was charged.)' : ''}`
    : `Commitment failed: -${POINTS_PENALTY} points.`
  return {
    commitments,
    activity: pushActivity(state.activity, { kind: 'commitment', text, points: isDonation ? undefined : -POINTS_PENALTY }),
    points: isDonation ? state.points : Math.max(0, state.points - POINTS_PENALTY),
    pledgedTotalEur: isDonation ? state.pledgedTotalEur + amount : state.pledgedTotalEur,
    commitmentNotice: text,
  }
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,
      lastLoadDate: todayKey(),

      onboard: (name, focus) => {
        const activity = pushActivity([], { kind: 'achievement', text: `Joined The 1% with focus on ${focus}` })
        set({
          onboarded: true,
          name: name.trim() || 'Outlier',
          focus,
          activity,
        })
      },

      resetAll: () => {
        set({ ...INITIAL_STATE, lastLoadDate: todayKey() })
      },

      toggleCommunity: (id) => {
        const state = get()
        const isJoined = state.joinedCommunities.includes(id)
        const joinedCommunities = isJoined
          ? state.joinedCommunities.filter((c) => c !== id)
          : [...state.joinedCommunities, id]

        let activity = state.activity
        let achievements = state.achievements

        if (!isJoined) {
          activity = pushActivity(activity, { kind: 'join', text: `Joined a new community` })
          if (joinedCommunities.length >= 3 && !achievements.includes('join-3')) {
            achievements = [...achievements, 'join-3']
            activity = pushActivity(activity, { kind: 'achievement', text: `Unlocked: Belonging` })
          }
        }

        set({ joinedCommunities, activity, achievements })
      },

      toggleTask: (challengeId, taskId, pointsForTask) => {
        const state = get()
        const challenge = WEEKLY_CHALLENGES.find((c) => c.id === challengeId)
        if (!challenge) return

        const currentTasks = state.completedTasks[challengeId] || []
        const isDone = currentTasks.includes(taskId)

        let newTasks: string[]
        let pointsDelta: number

        if (isDone) {
          newTasks = currentTasks.filter((t) => t !== taskId)
          pointsDelta = -pointsForTask
        } else {
          newTasks = [...currentTasks, taskId]
          pointsDelta = pointsForTask
        }

        const completedTasks = { ...state.completedTasks, [challengeId]: newTasks }
        const wasComplete = state.completedChallenges.includes(challengeId)
        const isNowComplete = newTasks.length === challenge.microTasks.length

        let completedChallenges = state.completedChallenges
        let achievements = state.achievements
        let activity = state.activity

        if (!wasComplete && isNowComplete) {
          completedChallenges = [...completedChallenges, challengeId]
          activity = pushActivity(activity, {
            kind: 'checkin',
            text: `Completed ${challenge.title}`,
            points: challenge.pointsReward,
          })

          if (!achievements.includes('first-checkin')) {
            achievements = [...achievements, 'first-checkin']
            activity = pushActivity(activity, { kind: 'achievement', text: `Unlocked: First Rep` })
          }
          if (!achievements.includes('week-one')) {
            achievements = [...achievements, 'week-one']
            activity = pushActivity(activity, { kind: 'achievement', text: `Unlocked: Week One` })
          }
          if (challenge.difficulty === 'Outlier' && !achievements.includes('first-outlier')) {
            achievements = [...achievements, 'first-outlier']
            activity = pushActivity(activity, { kind: 'achievement', text: `Unlocked: The Outlier Cut` })
          }
        } else if (wasComplete && !isNowComplete) {
          completedChallenges = completedChallenges.filter((c) => c !== challengeId)
        }

        // Update streak on the first check-in of the (local) day.
        const today = todayKey()
        let streak = state.streak
        let lastCheckInDate = state.lastCheckInDate
        let totalCheckIns = state.totalCheckIns
        let checkInDates = state.checkInDates
        if (!isDone && lastCheckInDate !== today) {
          streak = lastCheckInDate === yesterdayKey() ? streak + 1 : 1
          lastCheckInDate = today
          totalCheckIns = totalCheckIns + 1
          checkInDates = [today, ...checkInDates.filter((d) => d !== today)].slice(0, 60)
          if (!achievements.includes('streak-7') && streak >= 7) {
            achievements = [...achievements, 'streak-7']
            activity = pushActivity(activity, { kind: 'achievement', text: `Unlocked: Quiet Streak` })
          }
          if (!achievements.includes('streak-30') && streak >= 30) {
            achievements = [...achievements, 'streak-30']
            activity = pushActivity(activity, { kind: 'achievement', text: `Unlocked: Compound` })
          }
        }

        const oldRank = getRankByPoints(state.points)
        const newPointsRaw = Math.max(0, state.points + pointsDelta)
        const newRank = getRankByPoints(newPointsRaw)
        if (newRank.id !== oldRank.id && newRank.minPoints > oldRank.minPoints) {
          activity = pushActivity(activity, {
            kind: 'rank-up',
            text: `Reached ${newRank.name} — ${newRank.percentile}`,
          })
          if (newRank.id === 'elite' && !achievements.includes('reach-elite')) {
            achievements = [...achievements, 'reach-elite']
            activity = pushActivity(activity, { kind: 'achievement', text: `Unlocked: Edge of the Curve` })
          }
          if (newRank.id === 'outlier' && !achievements.includes('reach-outlier')) {
            achievements = [...achievements, 'reach-outlier']
            activity = pushActivity(activity, { kind: 'achievement', text: `Unlocked: The 1%` })
          }
        }

        set({
          points: newPointsRaw,
          completedTasks,
          completedChallenges,
          achievements,
          activity,
          streak,
          lastCheckInDate,
          checkInDates,
          totalCheckIns,
        })
      },

      addActivity: (entry) => {
        set({ activity: pushActivity(get().activity, entry) })
      },

      // Reacting to a post is not progress, so it never awards points or streaks.
      toggleLikePost: (postId) => {
        const { likedPosts } = get()
        set({
          likedPosts: likedPosts.includes(postId)
            ? likedPosts.filter((p) => p !== postId)
            : [...likedPosts, postId],
        })
      },

      addPost: (text, category) => {
        const state = get()
        const newPost = {
          id: `user-${Date.now()}`,
          text: text.trim(),
          ts: Date.now(),
          category,
        }
        const activity = pushActivity(state.activity, {
          kind: 'checkin',
          text: `Posted: "${text.slice(0, 60)}${text.length > 60 ? '…' : ''}"`,
        })
        set({ userPosts: [newPost, ...state.userPosts], activity })
      },

      // ── Time-in-app meter ────────────────────────────────────────────
      tickCognitiveLoad: () => {
        const state = get()
        const today = todayKey()
        let cognitiveLoad = state.cognitiveLoad
        let lastLoadDate = state.lastLoadDate
        let saturationDismissed = state.saturationDismissed
        if (lastLoadDate !== today) {
          cognitiveLoad = 0
          lastLoadDate = today
          saturationDismissed = false
        }
        // ~1.5 per 5s tick: saturation (70%) after roughly 23 minutes of use.
        cognitiveLoad = Math.min(100, cognitiveLoad + 1.5)

        let feedLockedUntil = state.feedLockedUntil
        if (cognitiveLoad >= 95 && !feedLockedUntil) {
          feedLockedUntil = Date.now() + 30 * 60 * 1000
        }

        set({ cognitiveLoad, lastLoadDate, saturationDismissed, feedLockedUntil })
      },

      dismissSaturation: () => set({ saturationDismissed: true }),

      lockFeed: (minutes) => {
        set({ feedLockedUntil: Date.now() + minutes * 60 * 1000 })
      },

      // Unlocking early is allowed, but the meter stays high so it does not
      // wipe the record of how long you have been scrolling.
      unlockFeed: () => {
        set({ feedLockedUntil: null, cognitiveLoad: 60, saturationDismissed: true })
      },

      // ── Energy map ───────────────────────────────────────────────────
      // Rating a task is data entry, not output, so it earns no points.
      addTaskRating: (taskLabel, mastery, energy) => {
        const state = get()
        const now = new Date()
        const rating: TaskRating = {
          id: `tr-${Date.now()}`,
          ts: now.getTime(),
          taskLabel: taskLabel.trim(),
          mastery,
          energy,
          hour: now.getHours(),
          day: now.getDay(),
        }
        const activity = pushActivity(state.activity, {
          kind: 'checkin',
          text: `Rated task: "${taskLabel.slice(0, 40)}" — M${mastery}/E${energy}`,
        })
        set({ taskRatings: [rating, ...state.taskRatings], activity })
      },

      // ── Real-world proofs ────────────────────────────────────────────
      submitProof: (challengeId, challengeTitle, text, url) => {
        const state = get()
        const proof: Proof = {
          id: `proof-${Date.now()}`,
          challengeId,
          challengeTitle,
          text: text.trim(),
          url: url?.trim() || undefined,
          submittedAt: Date.now(),
          status: 'pending',
        }
        const activity = pushActivity(state.activity, {
          kind: 'proof',
          text: `Submitted proof for "${challengeTitle}", waiting for peer review`,
        })
        set({ proofs: [proof, ...state.proofs], activity })
      },

      validateProof: (proofId) => {
        const state = get()
        const proof = state.proofs.find((p) => p.id === proofId)
        if (!proof || proof.status !== 'pending') return

        const proofs = state.proofs.map((p) =>
          p.id === proofId ? { ...p, status: 'validated' as const, validatedBy: 'Peer review' } : p
        )

        const validatedCount = proofs.filter((p) => p.status === 'validated').length
        let activity = pushActivity(state.activity, {
          kind: 'proof',
          text: `Proof validated for "${proof.challengeTitle}"`,
          points: 50,
        })

        let achievements = state.achievements
        const points = state.points + 50

        const oldEffective = getEffectiveRank(state.points, validatedCount - 1)
        const newEffective = getEffectiveRank(points, validatedCount)
        if (newEffective.rank.id !== oldEffective.rank.id) {
          activity = pushActivity(activity, {
            kind: 'rank-up',
            text: `Reached ${newEffective.rank.name} — ${newEffective.rank.percentile} (proof-validated)`,
          })
          if (newEffective.rank.id === 'elite' && !achievements.includes('reach-elite')) {
            achievements = [...achievements, 'reach-elite']
            activity = pushActivity(activity, { kind: 'achievement', text: `Unlocked: Edge of the Curve` })
          }
          if (newEffective.rank.id === 'outlier' && !achievements.includes('reach-outlier')) {
            achievements = [...achievements, 'reach-outlier']
            activity = pushActivity(activity, { kind: 'achievement', text: `Unlocked: The 1%` })
          }
        }

        set({ proofs, activity, achievements, points })
      },

      rejectProof: (proofId) => {
        const proofs = get().proofs.map((p) =>
          p.id === proofId ? { ...p, status: 'rejected' as const } : p
        )
        set({ proofs })
      },

      // Reviewing someone else's proof is how you earn focus credits.
      reviewPeerProof: (peerProofId) => {
        const state = get()
        if (state.reviewedPeerProofs.includes(peerProofId)) return
        const activity = pushActivity(state.activity, {
          kind: 'proof',
          text: `Reviewed a peer's proof, +${REVIEW_CREDIT_REWARD} focus credits`,
        })
        set({
          reviewedPeerProofs: [...state.reviewedPeerProofs, peerProofId],
          focusCredits: state.focusCredits + REVIEW_CREDIT_REWARD,
          activity,
        })
      },

      // ── Focus Lock ───────────────────────────────────────────────────
      enterFocusLock: (days, task) => {
        const state = get()
        const now = Date.now()
        const focusLock: FocusLockState = {
          startedAt: now,
          durationDays: days,
          endsAt: now + days * 86400000,
          task: task.trim(),
        }
        const activity = pushActivity(state.activity, {
          kind: 'lock',
          text: `Started a ${days}-day Focus Lock. Task: ${task.trim().slice(0, 50)}`,
        })
        set({ focusLock, activity })
      },

      exitFocusLock: (broken) => {
        const state = get()
        if (!state.focusLock) return
        const now = Date.now()
        const completed = !broken && now >= state.focusLock.endsAt
        const reward = FOCUS_LOCK_REWARD[state.focusLock.durationDays] ?? 0
        const entry: FocusLockEntry = {
          startedAt: state.focusLock.startedAt,
          endedAt: now,
          durationDays: state.focusLock.durationDays,
          completed,
          task: state.focusLock.task,
        }
        let activity = broken
          ? pushActivity(state.activity, {
              kind: 'lock',
              text: `Ended the Focus Lock early. No seal this time, the work continues.`,
            })
          : pushActivity(state.activity, {
              kind: 'lock',
              text: `Completed a ${entry.durationDays}-day Focus Lock. Seal earned.`,
              points: reward,
            })

        let next: Partial<AppState> = {}
        if (broken) {
          // Ending early triggers any "end a Focus Lock early" commitment.
          const failing = state.commitments.filter((c) => c.active && c.triggerId === 'broke-lock')
          let working: AppState = { ...state, activity }
          for (const c of failing) {
            const applied = applyFailure(working, c)
            working = { ...working, ...applied }
          }
          next = {
            commitments: working.commitments,
            points: working.points,
            pledgedTotalEur: working.pledgedTotalEur,
            commitmentNotice: working.commitmentNotice,
          }
          activity = working.activity
        }

        set({
          ...next,
          focusLock: null,
          focusLockHistory: [entry, ...state.focusLockHistory],
          activity,
          ...(completed ? { points: state.points + reward } : {}),
        })
      },

      // ── Commitments ──────────────────────────────────────────────────
      addCommitment: ({ triggerId, stake, amountEur, causeId }) => {
        const now = Date.now()
        const commitment: Commitment = {
          id: `commit-${now}`,
          triggerId,
          stake: stake as StakeKind,
          amountEur: Math.min(Math.max(amountEur, 0), MAX_STAKE_EUR),
          causeId,
          active: true,
          createdAt: now,
          failedCount: 0,
          lastFailedAt: null,
        }
        set({ commitments: [...get().commitments, commitment] })
      },

      toggleCommitment: (id) => {
        set({
          commitments: get().commitments.map((c) => (c.id === id ? { ...c, active: !c.active } : c)),
        })
      },

      removeCommitment: (id) => {
        set({ commitments: get().commitments.filter((c) => c.id !== id) })
      },

      failCommitment: (id) => {
        const state = get()
        const commitment = state.commitments.find((c) => c.id === id)
        if (!commitment) return
        set(applyFailure(state, commitment))
      },

      dismissCommitmentNotice: () => set({ commitmentNotice: null }),

      // Runs once per day when the app opens: a "miss a daily check-in"
      // commitment fails if yesterday had no check-in.
      evaluateCommitments: () => {
        const state = get()
        const today = todayKey()
        if (state.commitmentsCheckedDate === today) return
        const yesterday = yesterdayKey()
        const missedYesterday = !state.checkInDates.includes(yesterday)

        let working: AppState = { ...state, commitmentsCheckedDate: today }
        if (missedYesterday) {
          const failing = state.commitments.filter(
            (c) =>
              c.active &&
              c.triggerId === 'missed-checkin' &&
              // Only count days after the commitment existed.
              dateKey(new Date(c.createdAt)) < yesterday
          )
          for (const c of failing) {
            working = { ...working, ...applyFailure(working, c) }
          }
        }
        set({
          commitmentsCheckedDate: today,
          commitments: working.commitments,
          activity: working.activity,
          points: working.points,
          pledgedTotalEur: working.pledgedTotalEur,
          commitmentNotice: working.commitmentNotice,
        })
      },

      // ── Mentors ──────────────────────────────────────────────────────
      purchaseMentorOffer: (offerId, mentorName, title, cost) => {
        const state = get()
        if (state.focusCredits < cost) return
        const purchase = { offerId, mentorName, title, ts: Date.now(), cost }
        const activity = pushActivity(state.activity, {
          kind: 'proof',
          text: `Booked "${title}" with ${mentorName} for ${cost} focus credits`,
        })
        set({
          focusCredits: state.focusCredits - cost,
          mentorPurchases: [purchase, ...state.mentorPurchases],
          activity,
        })
      },
    }),
    {
      name: 'the-1-percent-app',
    }
  )
)

export { RANK_TIERS, getRankByPoints, getNextRank, getEffectiveRank, PROOF_REQUIREMENTS }
export { ACHIEVEMENTS, WEEKLY_CHALLENGES }
