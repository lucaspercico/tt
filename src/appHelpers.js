import { QUEST_PAYLOAD } from './payload'

export function withLayeredAccessory(answers, trait, value, accessoryConfig = QUEST_PAYLOAD?.accessorySelection) {
  const currentAnswers = answers && typeof answers === 'object' ? answers : {}
  const currentSlots = currentAnswers.accessorySlots && typeof currentAnswers.accessorySlots === 'object'
    ? currentAnswers.accessorySlots
    : {}
  const defaultSlot = accessoryConfig?.slot || 'face'
  const defaultLayer = Number.isFinite(accessoryConfig?.layer) ? accessoryConfig.layer : 100
  const normalizedTrait = typeof trait === 'string' ? trait : ''

  if (normalizedTrait !== 'accessories') {
    return {
      ...currentAnswers,
      [trait]: value,
    }
  }

  return {
    ...currentAnswers,
    accessories: value,
    accessorySlots: {
      ...currentSlots,
      [defaultSlot]: {
        value,
        layer: defaultLayer,
      },
    },
  }
}

export function sanitizeBackgroundUrl(rawValue) {
  if (typeof rawValue !== 'string') return ''
  const value = rawValue.trim()
  if (!value) return ''
  if (/["'`()\\;\n\r<>{}\0\f]/.test(value)) return ''

  if (value.startsWith('/')) return value
  if (value.startsWith('./') || value.startsWith('../')) return value

  try {
    const parsed = new URL(value)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') return value
  } catch {
    return ''
  }

  return ''
}

export function getMainBackgroundStyle(hasStarted, homeBackgroundUrl, questBackgroundUrl) {
  const selectedUrl = hasStarted ? questBackgroundUrl : homeBackgroundUrl
  if (!selectedUrl) return undefined

  return {
    backgroundImage: `url(${selectedUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
}
