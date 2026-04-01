export function resolveAccessoryValue(answers) {
  const safeAnswers = answers && typeof answers === 'object' ? answers : {}
  const accessorySlots = safeAnswers.accessorySlots && typeof safeAnswers.accessorySlots === 'object'
    ? safeAnswers.accessorySlots
    : null

  if (accessorySlots) {
    const layeredSlots = Object.values(accessorySlots)
      .map((slot) => ({
        value: typeof slot?.value === 'string' ? slot.value.trim() : '',
        layer: Number.isFinite(slot?.layer) ? slot.layer : 0,
      }))
      .filter((slot) => slot.value)
      .sort((a, b) => b.layer - a.layer)

    if (layeredSlots[0]) return layeredSlots[0].value
  }

  if (typeof safeAnswers.accessories === 'string') {
    return safeAnswers.accessories
      .split(',')
      .map((value) => value.trim())
      .find(Boolean)
  }

  return ''
}

export function buildAvatarUrl(seed, answers) {
  const safeAnswers = answers && typeof answers === 'object' ? answers : {}
  const params = new URLSearchParams({ seed: seed || 'Especialista' })

  if (safeAnswers.top) params.set('top', safeAnswers.top)
  if (safeAnswers.clothing) params.set('clothing', safeAnswers.clothing)
  const accessoryValue = resolveAccessoryValue(safeAnswers)
  if (accessoryValue) {
    params.set('accessories', accessoryValue)
    params.set('accessoriesProbability', '100')
  }
  if (safeAnswers.backgroundColor) params.set('backgroundColor', safeAnswers.backgroundColor)

  return `https://api.dicebear.com/7.x/avataaars/svg?${params.toString()}`
}

export function generateHexCode() {
  const length = 8

  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(length / 2)
    crypto.getRandomValues(bytes)
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  }

  return Math.floor(Math.random() * 0xffffffff)
    .toString(16)
    .padStart(length, '0')
    .toUpperCase()
}
