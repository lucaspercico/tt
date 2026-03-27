import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Rocket,
  Sparkles,
  Trophy,
} from 'lucide-react'
import { buildAvatarUrl, generateHexCode } from './avatar'

const STORAGE_KEY = 'research-quest-progress-v1'
const DISCURSIVE_PER_REWARD = 3

const DISCURSIVE_QUESTIONS = [
  {
    id: 1,
    question: 'Qual tema você pesquisa hoje?',
    field: 'discursive-1',
  },
  {
    id: 2,
    question: 'Qual é sua maior dificuldade na escrita acadêmica?',
    field: 'discursive-2',
  },
  {
    id: 3,
    question: 'Como você está usando IA no seu processo de estudo?',
    field: 'discursive-3',
  },
]

const CUSTOMIZATION_REWARDS = [
  {
    id: 'reward-top',
    question: 'Escolha 1 visual para seu personagem',
    trait: 'top',
    upgrades: [
      { label: 'Corte Clássico', value: 'shaggy' },
      { label: 'Visual Criativo', value: 'longButNotTooLong' },
      { label: 'Estilo Curto', value: 'shortCurly' },
    ],
  },
]

const SURVEY_STEPS = DISCURSIVE_QUESTIONS.flatMap((question, index) => {
  const steps = [{ ...question, type: 'discursive' }]

  if (index % DISCURSIVE_PER_REWARD === DISCURSIVE_PER_REWARD - 1 && CUSTOMIZATION_REWARDS[Math.floor(index / DISCURSIVE_PER_REWARD)]) {
    steps.push({ ...CUSTOMIZATION_REWARDS[Math.floor(index / DISCURSIVE_PER_REWARD)], type: 'customization' })
  }

  return steps
})

const DEFAULT_STATE = {
  hasStarted: false,
  step: 0,
  avatarSeed: 'Especialista',
  answers: {},
  discursiveAnswers: {},
  completed: false,
  certificateCode: '',
}

function FloatingQuest({ onStart, backgroundUrl = '' }) {
  const MotionAside = motion.aside
  const hasBackground = Boolean(backgroundUrl)

  return (
    <MotionAside
      initial={{ opacity: 0, y: 30, scale: 0.92 }}
      animate={{ opacity: 1, y: [0, -8, 0], scale: 1 }}
      transition={{ duration: 0.7, y: { repeat: Infinity, duration: 1.4, ease: 'easeInOut' } }}
      className="fixed bottom-6 right-6 z-30 max-w-sm rounded-2xl border-4 border-black bg-amber-300 p-5 text-left shadow-[8px_8px_0px_#111827]"
      style={hasBackground
        ? {
            backgroundImage: `linear-gradient(rgba(252, 211, 77, 0.94), rgba(252, 211, 77, 0.94)), url(${backgroundUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }
        : undefined}
      aria-live="polite"
    >
      <span className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white/85 px-3 py-1 text-sm font-black text-gray-900">
        <MessageCircle size={16} aria-hidden="true" />
        Popup chamativo
      </span>
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

function SurveyManager({ step, answers, discursiveAnswers, onChoose, onDiscursiveChange }) {
  const currentQuestion = SURVEY_STEPS[step]

  return (
    <section aria-live="polite" className="rounded-2xl border-4 border-black bg-white p-5 shadow-[6px_6px_0px_#111827]">
      <p className="text-lg font-bold text-gray-900">Pergunta {step + 1} de {SURVEY_STEPS.length}</p>
      <h2 className="mt-2 text-2xl font-black text-gray-900">{currentQuestion.question}</h2>
      {currentQuestion.type === 'discursive' ? (
        <textarea
          value={discursiveAnswers[currentQuestion.field] || ''}
          onChange={(event) => onDiscursiveChange(currentQuestion.field, event.target.value)}
          placeholder="Escreva sua resposta..."
          className="mt-4 min-h-36 w-full rounded-2xl border-4 border-black bg-gray-50 p-4 text-lg font-medium text-gray-900 outline-none transition focus:border-indigo-600"
        />
      ) : (
        <>
          <p className="mt-3 rounded-xl border-2 border-black bg-amber-100 px-3 py-2 text-sm font-bold text-gray-900">
            A cada {DISCURSIVE_PER_REWARD} perguntas discursivas você desbloqueia 3 escolhas para o personagem.
          </p>
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
                </button>
              )
            })}
          </div>
        </>
      )}
    </section>
  )
}

function App() {
  const MotionBar = motion.div
  const [state, setState] = useState(DEFAULT_STATE)
  const [showQuestTrigger, setShowQuestTrigger] = useState(false)
  const hasLoaded = useRef(false)
  const popupBackgroundUrl = import.meta.env.VITE_POPUP_BACKGROUND_URL || ''

  useEffect(() => {
    if (typeof window === 'undefined') return

    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      hasLoaded.current = true
      return
    }

    try {
      const parsed = JSON.parse(raw)
      setState((current) => ({
        ...current,
        ...parsed,
        answers: parsed.answers || {},
        discursiveAnswers: parsed.discursiveAnswers || {},
      }))
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

  const answeredSteps = useMemo(() => (
    SURVEY_STEPS.reduce((count, question) => {
      if (question.type === 'discursive') {
        return (state.discursiveAnswers[question.field] || '').trim() ? count + 1 : count
      }

      return state.answers[question.trait] ? count + 1 : count
    }, 0)
  ), [state.answers, state.discursiveAnswers])
  const progress = useMemo(
    () => (state.completed ? 100 : Math.round((answeredSteps / SURVEY_STEPS.length) * 100)),
    [answeredSteps, state.completed],
  )
  const currentQuestion = SURVEY_STEPS[state.step]
  const hasCurrentAnswer = currentQuestion
    ? currentQuestion.type === 'discursive'
      ? Boolean((state.discursiveAnswers[currentQuestion.field] || '').trim())
      : Boolean(state.answers[currentQuestion.trait])
    : false

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

  const updateDiscursiveAnswer = (field, value) => {
    setState((current) => ({
      ...current,
      discursiveAnswers: {
        ...current.discursiveAnswers,
        [field]: value,
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
    if (state.step === SURVEY_STEPS.length - 1) {
      finishQuest()
      return
    }

    setState((current) => ({ ...current, step: Math.min(current.step + 1, SURVEY_STEPS.length - 1) }))
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
                <SurveyManager
                  step={state.step}
                  answers={state.answers}
                  discursiveAnswers={state.discursiveAnswers}
                  onChoose={chooseUpgrade}
                  onDiscursiveChange={updateDiscursiveAnswer}
                />
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
                    {state.step === SURVEY_STEPS.length - 1 ? 'Finalizar' : 'Próxima'}
                    <ChevronRight size={18} aria-hidden="true" />
                  </button>
                </div>
              </>
            )}
          </section>

          <AvatarPreview
            seed={state.avatarSeed}
            answers={state.answers}
            title={state.completed ? 'Avatar do Certificado' : 'Avatar em Evolução'}
          />
        </div>
      </div>

      {!state.hasStarted && showQuestTrigger && (
        <FloatingQuest onStart={startQuest} backgroundUrl={popupBackgroundUrl} />
      )}
    </main>
  )
}

export default App
