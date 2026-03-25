import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  ChevronLeft,
  ChevronRight,
  Rocket,
  Sparkles,
  Trophy,
} from 'lucide-react'
import { buildAvatarUrl, generateHexCode } from './avatar'

const STORAGE_KEY = 'research-quest-progress-v1'

const QUESTIONS = [
  {
    id: 1,
    question: 'Área de Atuação?',
    trait: 'top',
    upgrades: [
      { label: 'Exatas', value: 'shaggy' },
      { label: 'Humanas', value: 'longButNotTooLong' },
      { label: 'Saúde', value: 'shortCurly' },
    ],
  },
  {
    id: 2,
    question: 'Frequência de Pesquisa?',
    trait: 'clothing',
    upgrades: [
      { label: 'Diária', value: 'blazerAndShirt' },
      { label: 'Semanal', value: 'overall' },
      { label: 'Mensal', value: 'shirtVNeck' },
    ],
  },
  {
    id: 3,
    question: 'Principal Desafio?',
    trait: 'accessories',
    upgrades: [
      { label: 'Foco', value: 'round' },
      { label: 'Tempo', value: 'prescription02' },
      { label: 'Recursos', value: 'wayfarers' },
    ],
  },
  {
    id: 4,
    question: 'Uso de IA?',
    trait: 'backgroundColor',
    upgrades: [
      { label: 'Uso intenso', value: 'b6e3f4' },
      { label: 'Uso moderado', value: 'ffd5dc' },
      { label: 'Ainda explorando', value: 'd1d4f9' },
    ],
  },
]

const DEFAULT_STATE = {
  hasStarted: false,
  step: 0,
  avatarSeed: 'Especialista',
  answers: {},
  completed: false,
  certificateCode: '',
}

function FloatingQuest({ onStart }) {
  const MotionAside = motion.aside

  return (
    <MotionAside
      initial={{ opacity: 0, y: 30, scale: 0.92 }}
      animate={{ opacity: 1, y: [0, -8, 0], scale: 1 }}
      transition={{ duration: 0.7, y: { repeat: Infinity, duration: 1.4, ease: 'easeInOut' } }}
      className="fixed bottom-6 right-6 z-30 max-w-sm rounded-2xl border-4 border-black bg-amber-300 p-5 text-left shadow-[8px_8px_0px_#111827]"
      aria-live="polite"
    >
      <p className="text-lg font-semibold leading-snug text-black">
        Ganhe 10 Horas Complementares! 🎓 Monte seu Avatar de Especialista enquanto nos ajuda a evoluir.
      </p>
      <button
        type="button"
        onClick={onStart}
        className="mt-4 inline-flex items-center gap-2 rounded-xl border-2 border-black bg-indigo-500 px-4 py-2 text-lg font-bold text-white transition hover:-translate-y-0.5"
      >
        <Rocket size={20} aria-hidden="true" />
        Iniciar Quest
      </button>
    </MotionAside>
  )
}

function AvatarPreview({ seed, answers, title = 'Avatar em evolução' }) {
  const avatarUrl = useMemo(() => buildAvatarUrl(seed, answers), [seed, answers])

  return (
    <section className="rounded-2xl border-4 border-black bg-white p-4 shadow-[6px_6px_0px_#111827]">
      <h2 className="mb-3 text-xl font-extrabold text-gray-900">{title}</h2>
      <img
        src={avatarUrl}
        alt="Pré-visualização do avatar"
        className="mx-auto h-44 w-44 rounded-xl bg-gray-100"
      />
    </section>
  )
}

function SurveyManager({ step, answers, onChoose }) {
  const currentQuestion = QUESTIONS[step]

  return (
    <section aria-live="polite" className="rounded-2xl border-4 border-black bg-white p-5 shadow-[6px_6px_0px_#111827]">
      <p className="text-lg font-bold text-gray-900">Pergunta {step + 1} de {QUESTIONS.length}</p>
      <h2 className="mt-2 text-2xl font-black text-gray-900">{currentQuestion.question}</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {currentQuestion.upgrades.map((upgrade) => {
          const isSelected = answers[currentQuestion.trait] === upgrade.value

          return (
            <button
              key={upgrade.value}
              type="button"
              onClick={() => onChoose(currentQuestion.trait, upgrade.value)}
              className={`rounded-2xl border-4 p-4 text-left text-lg font-semibold transition ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-100 text-gray-900 shadow-[5px_5px_0px_#4f46e5]'
                  : 'border-black bg-gray-50 text-gray-900 hover:-translate-y-0.5 hover:bg-amber-100'
              }`}
              aria-pressed={isSelected}
            >
              <span className="block text-xl font-black">{upgrade.label}</span>
              <span className="mt-2 block text-base font-medium text-gray-700">Loot: {upgrade.value}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function App() {
  const MotionBar = motion.div
  const [state, setState] = useState(DEFAULT_STATE)
  const [showQuestTrigger, setShowQuestTrigger] = useState(false)
  const hasLoaded = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      hasLoaded.current = true
      return
    }

    try {
      const parsed = JSON.parse(raw)
      setState((current) => ({ ...current, ...parsed, answers: parsed.answers || {} }))
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
    } finally {
      hasLoaded.current = true
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => setShowQuestTrigger(true), 2000)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!hasLoaded.current || typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const progress = state.completed ? 100 : Math.round((Object.keys(state.answers).length / QUESTIONS.length) * 100)
  const currentQuestion = QUESTIONS[state.step]
  const hasCurrentAnswer = currentQuestion ? Boolean(state.answers[currentQuestion.trait]) : false

  const startQuest = () => {
    setState((current) => ({ ...current, hasStarted: true }))
  }

  const chooseUpgrade = (trait, value) => {
    setState((current) => ({
      ...current,
      answers: {
        ...current.answers,
        [trait]: value,
      },
    }))
  }

  const goBack = () => {
    setState((current) => ({ ...current, step: Math.max(current.step - 1, 0) }))
  }

  const finishQuest = () => {
    setState((current) => ({ ...current, completed: true }))
    confetti({ particleCount: 120, spread: 85, origin: { y: 0.65 } })
  }

  const goNext = () => {
    if (state.step === QUESTIONS.length - 1) {
      finishQuest()
      return
    }

    setState((current) => ({ ...current, step: Math.min(current.step + 1, QUESTIONS.length - 1) }))
  }

  const generateCertificate = () => {
    setState((current) => ({ ...current, certificateCode: current.certificateCode || generateHexCode() }))
  }

  return (
    <main className="min-h-screen bg-[#F3F4F6] px-4 py-8 text-lg text-gray-900">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-6 rounded-2xl border-4 border-black bg-white p-5 shadow-[8px_8px_0px_#111827]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-3xl font-black text-gray-900 md:text-4xl">Research Quest Builder</h1>
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-amber-300 px-3 py-1 text-base font-bold">
              <Sparkles size={18} aria-hidden="true" /> {progress}% energia
            </span>
          </div>
          <div className="mt-4 h-5 w-full rounded-full border-2 border-black bg-gray-200 p-0.5">
            <MotionBar
              className="h-full rounded-full bg-indigo-500"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_330px]">
          <section className="space-y-4">
            {!state.hasStarted ? (
              <section className="rounded-2xl border-4 border-black bg-white p-6 shadow-[6px_6px_0px_#111827]">
                <h2 className="text-2xl font-black text-gray-900">Sua jornada começa em instantes</h2>
                <p className="mt-2 text-lg text-gray-800">
                  Responda as perguntas e desbloqueie partes do seu avatar de especialista.
                </p>
              </section>
            ) : state.completed ? (
              <section className="rounded-2xl border-4 border-black bg-white p-6 shadow-[6px_6px_0px_#111827]">
                <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-amber-300 px-3 py-1 text-base font-bold">
                  <Trophy size={18} aria-hidden="true" /> Missão completa
                </div>
                <h2 className="mt-3 text-3xl font-black text-gray-900">Cartão de Certificado de Pesquisa</h2>
                <p className="mt-2 text-lg text-gray-800">
                  Avatar final desbloqueado! Gere seu código único para validar as 10 horas complementares.
                </p>
                <button
                  type="button"
                  onClick={generateCertificate}
                  className="mt-5 rounded-xl border-2 border-black bg-indigo-500 px-5 py-3 text-lg font-black text-white transition hover:-translate-y-0.5"
                >
                  Resgatar 10 Horas
                </button>
                {state.certificateCode && (
                  <p className="mt-4 rounded-xl border-2 border-black bg-amber-100 px-4 py-3 text-xl font-black tracking-wider">
                    Código de Validação: {state.certificateCode}
                  </p>
                )}
              </section>
            ) : (
              <>
                <SurveyManager step={state.step} answers={state.answers} onChoose={chooseUpgrade} />
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={state.step === 0}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-white px-4 py-2 text-lg font-bold text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft size={18} aria-hidden="true" /> Voltar
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!hasCurrentAnswer}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-indigo-500 px-4 py-2 text-lg font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {state.step === QUESTIONS.length - 1 ? 'Finalizar' : 'Próxima'}
                    <ChevronRight size={18} aria-hidden="true" />
                  </button>
                </div>
              </>
            )}
          </section>

          <AvatarPreview
            seed={state.avatarSeed}
            answers={state.answers}
            title={state.completed ? 'Avatar do Certificado' : 'AvatarPreview'}
          />
        </div>
      </div>

      {!state.hasStarted && showQuestTrigger && <FloatingQuest onStart={startQuest} />}
    </main>
  )
}

export default App
