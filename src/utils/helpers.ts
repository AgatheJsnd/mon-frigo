export function formatExpiry(days: number): string {
  if (days <= 0) return 'expire aujourd’hui'
  if (days === 1) return 'expire demain'
  return `expirent dans ${days} jours`
}

export function formatExpiryShort(days: number): string {
  if (days <= 0) return 'aujourd’hui'
  if (days === 1) return 'demain'
  return `dans ${days} jours`
}

export function isUrgent(days: number, threshold = 3): boolean {
  return days <= threshold
}

export function greetingForHour(hour = new Date().getHours()): string {
  if (hour < 12) return 'Bonjour'
  if (hour < 18) return 'Bon après-midi'
  return 'Bonsoir'
}

export function uid(prefix = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function matchFoodName(a: string, b: string): boolean {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/s$/, '')
  return norm(a) === norm(b) || norm(a).includes(norm(b)) || norm(b).includes(norm(a))
}
