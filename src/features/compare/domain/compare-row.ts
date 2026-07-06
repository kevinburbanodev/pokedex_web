import type { Pokemon } from '@/features/pokemon/domain/pokemon.entity'
import { STAT_LABELS, statPercent } from '@/features/pokemon/domain/stat-labels'

export interface CompareRow {
  label: string
  aValue: number
  bValue: number
  aPercent: number
  bPercent: number
  aLeads: boolean
  bLeads: boolean
  aWinsStrictly: boolean
  bWinsStrictly: boolean
}

export function buildCompareRows(a: Pokemon, b: Pokemon): CompareRow[] {
  return a.stats.map((stat, index) => {
    const bStat = b.stats[index]!
    return {
      label: STAT_LABELS[stat.slug] ?? stat.label,
      aValue: stat.value,
      bValue: bStat.value,
      aPercent: statPercent(stat.value),
      bPercent: statPercent(bStat.value),
      aLeads: stat.value >= bStat.value,
      bLeads: bStat.value >= stat.value,
      aWinsStrictly: stat.value > bStat.value,
      bWinsStrictly: bStat.value > stat.value,
    }
  })
}

export function statTotal(pokemon: Pokemon): number {
  return pokemon.stats.reduce((sum, stat) => sum + stat.value, 0)
}

export function buildVerdict(a: Pokemon, b: Pokemon): string {
  const totalA = statTotal(a)
  const totalB = statTotal(b)
  if (totalA === totalB) return 'Empate técnico en estadísticas base'
  if (totalA > totalB) return `${a.name} domina en total (${totalA} vs ${totalB})`
  return `${b.name} domina en total (${totalB} vs ${totalA})`
}
