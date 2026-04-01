export const QUEST_PAYLOAD = {
  popup: {
    badge: 'Popup chamativo',
    title: 'Ganhe 10 Horas Complementares! 🎓',
    description: 'Monte seu Avatar de Especialista enquanto nos ajuda a evoluir.',
    buttonLabel: 'Iniciar Quest',
  },
  questions: [
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
    {
      id: 4,
      question: 'Qual resultado você quer atingir com este estudo?',
      field: 'discursive-4',
    },
    {
      id: 5,
      question: 'Que tipo de suporte te ajuda a manter consistência?',
      field: 'discursive-5',
    },
  ],
  accessorySelection: {
    question: 'Escolha 1 acessório dentre 3 opções para seu personagem',
    trait: 'accessories',
    slot: 'face',
    layer: 100,
    upgrades: [
      { label: 'Óculos Redondos', value: 'round' },
      { label: 'Óculos de Sol', value: 'wayfarers' },
      { label: 'Brinco', value: 'kurt' },
    ],
  },
}
