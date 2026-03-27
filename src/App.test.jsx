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

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Pesquisa em educação e tecnologia.' } })
    fireEvent.click(screen.getByRole('button', { name: /próxima/i }))

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Organizar referências e escrever com foco.' } })
    fireEvent.click(screen.getByRole('button', { name: /próxima/i }))

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Uso IA para estruturar ideias e revisar.' } })
    fireEvent.click(screen.getByRole('button', { name: /próxima/i }))

    fireEvent.click(screen.getByRole('button', { name: /corte clássico/i }))
    fireEvent.click(screen.getByRole('button', { name: /finalizar/i }))

    expect(screen.getByText(/cartão de certificado de pesquisa/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /resgatar 10 horas/i })).toBeInTheDocument()
  })

  it('shows customization choices after 3 discursive questions and requires answer before continuing', () => {
    render(<App />)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    fireEvent.click(screen.getByRole('button', { name: /iniciar quest/i }))

    const nextButton = screen.getByRole('button', { name: /próxima/i })
    expect(nextButton).toBeDisabled()

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Resposta 1' } })
    expect(nextButton).toBeEnabled()
    fireEvent.click(nextButton)

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Resposta 2' } })
    fireEvent.click(screen.getByRole('button', { name: /próxima/i }))

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Resposta 3' } })
    fireEvent.click(screen.getByRole('button', { name: /próxima/i }))

    expect(screen.getByText(/a cada 3 perguntas discursivas/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /corte clássico/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /visual criativo/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /estilo curto/i })).toBeInTheDocument()
  })
})
