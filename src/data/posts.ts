// Sample posts for the home feed. Every author here is a fictional community or
// persona, never a real person, so nothing is attributed to someone who did not
// write it. Replace with real member posts once there is a backend.

import type { FocusArea } from '@/lib/store'

export type PostAuthor = {
  name: string
  handle: string
  avatarColor: string // accent hex for the avatar circle
  initials: string
}

export type Post = {
  id: string
  author: PostAuthor
  timeAgo: string
  text: string
  category: FocusArea
  likes: number
  comments: number
}

export const POST_AUTHORS: Record<string, PostAuthor> = {
  ironhabit: { name: 'Iron Habit', handle: '@ironhabit', avatarColor: '#fb923c', initials: 'IH' },
  daylight: { name: 'Daylight Lab', handle: '@daylightlab', avatarColor: '#22d3ee', initials: 'DL' },
  longgame: { name: 'The Long Game', handle: '@thelonggame', avatarColor: '#c084fc', initials: 'LG' },
  offerlab: { name: 'Offer Lab', handle: '@offerlab', avatarColor: '#fbbf24', initials: 'OL' },
  systems: { name: 'Systems Over Lists', handle: '@systemsnotlists', avatarColor: '#a3e635', initials: 'SL' },
  coldstart: { name: '5AM Club', handle: '@5amclub', avatarColor: '#22d3ee', initials: '5A' },
  deepwork: { name: 'Deep Work Society', handle: '@deepwork', avatarColor: '#a3e635', initials: 'DW' },
  antifragile: { name: 'Anti-Fragile', handle: '@antifragile', avatarColor: '#fb923c', initials: 'AF' },
  strongties: { name: 'Strong Ties', handle: '@strong.ties', avatarColor: '#f472b6', initials: 'ST' },
  monkmode: { name: 'Monk Mode', handle: '@monkmode', avatarColor: '#c084fc', initials: 'MM' },
  shipdaily: { name: 'Ship Daily', handle: '@shipdaily', avatarColor: '#a3e635', initials: 'SD' },
}

export const POSTS: Post[] = [
  {
    id: 'p1',
    author: POST_AUTHORS.ironhabit,
    timeAgo: '2h',
    text: "Nobody is coming to do it for you. The alarm is yours to set. The first rep is yours to take.\n\nShow up, then log it.",
    category: 'Body',
    likes: 482,
    comments: 37,
  },
  {
    id: 'p2',
    author: POST_AUTHORS.coldstart,
    timeAgo: '4h',
    text: "Day 30 of waking at 5. Week one was hard. Week two was negotiable. Week three was habit. Week four was identity.\n\nProof: 30 check-ins, 22 deep-work blocks, 1 finished course.",
    category: 'Body',
    likes: 321,
    comments: 24,
  },
  {
    id: 'p3',
    author: POST_AUTHORS.daylight,
    timeAgo: '6h',
    text: "Small experiment worth trying: ten minutes of outdoor light within an hour of waking, every day for two weeks. Track your energy at 3pm before and after.\n\nOne variable, one log. Share what you find.",
    category: 'Mind',
    likes: 894,
    comments: 52,
  },
  {
    id: 'p4',
    author: POST_AUTHORS.deepwork,
    timeAgo: '8h',
    text: "90 minutes. One window. One task. Phone in another room.\n\nToday's block: finished the API client and wrote its tests. Tomorrow: docs.",
    category: 'Craft',
    likes: 163,
    comments: 18,
  },
  {
    id: 'p5',
    author: POST_AUTHORS.longgame,
    timeAgo: '12h',
    text: "Returns compound only when you let the principal sit.\n\nPeople who keep switching games, careers and projects never reach the steep part of the curve. Pick the game. Pick the people. Stay.",
    category: 'Wealth',
    likes: 1450,
    comments: 61,
  },
  {
    id: 'p6',
    author: POST_AUTHORS.antifragile,
    timeAgo: '14h',
    text: "Zone 2 is boring on purpose.\n\nThe point is not to feel like you're working hard. It is to build the base that lets you work hard later. This week: 3 strength, 2 easy cardio, 1 hard session.",
    category: 'Body',
    likes: 218,
    comments: 12,
  },
  {
    id: 'p7',
    author: POST_AUTHORS.shipdaily,
    timeAgo: '18h',
    text: "Public reps, every day.\n\nA commit, a sketch, a paragraph, a 30-second voice memo. The streak is the metric, the streak is the identity.\n\nWhat did you ship today?",
    category: 'Craft',
    likes: 410,
    comments: 29,
  },
  {
    id: 'p8',
    author: POST_AUTHORS.offerlab,
    timeAgo: '22h',
    text: "Most small businesses die from doing too much, not too little.\n\nCut half your pipeline by Friday. Put the saved hours into the half that already converts, then compare the numbers in two weeks.",
    category: 'Wealth',
    likes: 782,
    comments: 40,
  },
  {
    id: 'p9',
    author: POST_AUTHORS.strongties,
    timeAgo: '1d',
    text: "This week's prompt: call one person you haven't spoken to in 6 months. Not a text. A voice call, at least 15 minutes.\n\nThe depth you rebuild in one conversation beats fifty group chats.",
    category: 'Network',
    likes: 189,
    comments: 24,
  },
  {
    id: 'p10',
    author: POST_AUTHORS.monkmode,
    timeAgo: '1d',
    text: "Strict inputs only.\n\nNo news, no feed scrolling, no podcasts that don't move a current project forward. We replace the noise slot with one 90-minute block and meet on Sundays to share what shipped.",
    category: 'Mind',
    likes: 352,
    comments: 33,
  },
  {
    id: 'p11',
    author: POST_AUTHORS.systems,
    timeAgo: '2d',
    text: "Most productivity advice fails because it confuses outcomes ('write a book') with the first part ('open the doc').\n\nSystems sit in between: the repeatable routine that turns small parts into outcomes. Build systems, not to-do lists.",
    category: 'Craft',
    likes: 564,
    comments: 31,
  },
  {
    id: 'p12',
    author: POST_AUTHORS.longgame,
    timeAgo: '2d',
    text: "Boring money rule: automate a fixed amount into a low-fee index fund on payday, then stop checking it daily.\n\nThis is general information, not financial advice. Do your own research.",
    category: 'Wealth',
    likes: 289,
    comments: 22,
  },
]
