export function buildAvatarUrl(seed, answers) {
  const safeAnswers = answers && typeof answers === 'object' ? answers : {}
  const params = new URLSearchParams({ seed: seed || 'Especialista' })

  if (safeAnswers.top) params.set('top', safeAnswers.top)
  if (safeAnswers.clothing) params.set('clothing', safeAnswers.clothing)
  if (safeAnswers.accessories) {
    params.set('accessories', safeAnswers.accessories)
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
