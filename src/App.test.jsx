import { act, fireEvent, render, screen } from '@testing-library/react'
import App from './App'
import { buildAvatarUrl } from './avatar'

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}))

describe('buildAvatarUrl', () => {
  it('builds DiceBear URL with selected traits', () => {
    const url = buildAvatarUrl('Ana', {
      top: 'shaggy',
      clothing: 'overall',
      accessories: 'round',
      backgroundColor: 'ffd5dc',
    })

    expect(url).toContain('seed=Ana')
    expect(url).toContain('top=shaggy')
    expect(url).toContain('clothing=overall')
    expect(url).toContain('accessories=round')
    expect(url).toContain('backgroundColor=ffd5dc')
  })
})

describe('Research quest flow', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('completes survey and shows certificate card', () => {
    render(<App />)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    fireEvent.click(screen.getByRole('button', { name: /iniciar quest/i }))

    fireEvent.click(screen.getByRole('button', { name: /exatas/i }))
    fireEvent.click(screen.getByRole('button', { name: /próxima/i }))

    fireEvent.click(screen.getByRole('button', { name: /diária/i }))
    fireEvent.click(screen.getByRole('button', { name: /próxima/i }))

    fireEvent.click(screen.getByRole('button', { name: /foco/i }))
    fireEvent.click(screen.getByRole('button', { name: /próxima/i }))

    fireEvent.click(screen.getByRole('button', { name: /uso intenso/i }))
    fireEvent.click(screen.getByRole('button', { name: /finalizar/i }))

    expect(screen.getByText(/cartão de certificado de pesquisa/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /resgatar 10 horas/i })).toBeInTheDocument()
  })
})
