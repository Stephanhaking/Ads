// Energy analysis for the "Rating the Tasks" feature. It only ever uses the
// member's own ratings; nothing is pre-filled.
// Based on the clinical psychology technique of rating Mastery & Energy
// throughout the day to map cognitive circadian rhythms.

export type TaskRating = {
  id: string
  ts: number
  taskLabel: string
  mastery: number // 1-10
  energy: number // 1-10
  hour: number // 0-23
  day: number // 0-6 (0 = Sunday)
}

/** Ratings needed before the map gives a recommendation. */
export const MIN_RATINGS = 5

// Build a 7×24 heatmap: for each (day, hour) cell, compute the average energy.
export type HeatmapCell = {
  day: number
  hour: number
  avgEnergy: number | null
  avgMastery: number | null
  count: number
}

export function buildHeatmap(ratings: TaskRating[]): HeatmapCell[][] {
  // 7 rows (days) × 24 columns (hours)
  const grid: HeatmapCell[][] = []
  for (let d = 0; d < 7; d++) {
    const row: HeatmapCell[] = []
    for (let h = 0; h < 24; h++) {
      row.push({ day: d, hour: h, avgEnergy: null, avgMastery: null, count: 0 })
    }
    grid.push(row)
  }

  const buckets: Record<string, { energy: number; mastery: number; count: number }> = {}
  for (const r of ratings) {
    const key = `${r.day}-${r.hour}`
    if (!buckets[key]) buckets[key] = { energy: 0, mastery: 0, count: 0 }
    buckets[key].energy += r.energy
    buckets[key].mastery += r.mastery
    buckets[key].count += 1
  }

  for (const [key, val] of Object.entries(buckets)) {
    const [d, h] = key.split('-').map(Number)
    grid[d][h] = {
      day: d,
      hour: h,
      avgEnergy: val.energy / val.count,
      avgMastery: val.mastery / val.count,
      count: val.count,
    }
  }

  return grid
}

// Analyze the heatmap and produce a dynamic recommendation.
export type EnergyInsight = {
  peakHours: { start: number; end: number; avgEnergy: number }
  dipHours: { start: number; end: number; avgEnergy: number }
  recommendation: string
  workoutWindow: string
}

export function analyzeEnergy(ratings: TaskRating[]): EnergyInsight | null {
  if (ratings.length < MIN_RATINGS) return null

  // Average energy per hour across all days.
  const hourlyEnergy: { sum: number; count: number }[] = Array.from({ length: 24 }, () => ({ sum: 0, count: 0 }))
  for (const r of ratings) {
    hourlyEnergy[r.hour].sum += r.energy
    hourlyEnergy[r.hour].count += 1
  }

  const avgByHour: (number | null)[] = hourlyEnergy.map((b) => (b.count > 0 ? b.sum / b.count : null))

  // Find the 3-hour window with the highest average energy.
  let peakStart = 0
  let peakAvg = 0
  let dipStart = 0
  let dipAvg = 10

  for (let h = 0; h < 24; h++) {
    const window = [h, (h + 1) % 24, (h + 2) % 24]
      .map((hr) => avgByHour[hr])
      .filter((v): v is number => v !== null)
    if (window.length === 0) continue
    const avg = window.reduce((a, b) => a + b, 0) / window.length
    if (avg > peakAvg) {
      peakAvg = avg
      peakStart = h
    }
    if (avg < dipAvg) {
      dipAvg = avg
      dipStart = h
    }
  }

  const peakHours = { start: peakStart, end: (peakStart + 3) % 24, avgEnergy: peakAvg }
  const dipHours = { start: dipStart, end: (dipStart + 3) % 24, avgEnergy: dipAvg }

  const fmt = (h: number) => `${h.toString().padStart(2, '0')}:00`

  const recommendation =
    `Historically, your mastery and energy peak between ${fmt(peakStart)} and ${fmt((peakStart + 3) % 24)}. ` +
    `Schedule your hardest deep-work block — code, writing, strategy — in this window. ` +
    `Your focus crashes between ${fmt(dipStart)} and ${fmt((dipStart + 3) % 24)}. ` +
    `Instead of forcing cognitive work then, move your body: train, walk, or do admin. ` +
    `Don't fight the dip. Route around it.`

  const workoutWindow = `${fmt(dipStart)}–${fmt((dipStart + 3) % 24)}`

  return { peakHours, dipHours, recommendation, workoutWindow }
}
