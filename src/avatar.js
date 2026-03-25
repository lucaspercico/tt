export function buildAvatarUrl(seed, answers) {
  const params = new URLSearchParams({ seed: seed || 'Especialista' })

  if (answers.top) params.set('top', answers.top)
  if (answers.clothing) params.set('clothing', answers.clothing)
  if (answers.accessories) params.set('accessories', answers.accessories)
  if (answers.backgroundColor) params.set('backgroundColor', answers.backgroundColor)

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
