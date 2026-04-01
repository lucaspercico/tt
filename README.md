# Research Quest Builder

Aplicação React (Vite + Tailwind + Framer Motion) para coletar respostas discursivas e montar um avatar final com acessório selecionado.

## Como usar

```bash
npm ci
npm run dev
```

Ao abrir a tela inicial:

1. Passe o mouse no ícone flutuante do canto inferior direito para expandir o popup.
2. Clique em **Iniciar Quest**.
3. Responda as perguntas discursivas.
4. Escolha 1 acessório.
5. Finalize e gere o código do certificado.

---

## Manual Operacional

### Gestão de Backgrounds (Tela Inicial x Tela da Quest)

O app usa **dois backgrounds independentes**, configurados por variáveis de ambiente em `src/App.jsx`:

- `homeBackgroundUrl`: controla a **Tela Inicial**
- `questBackgroundUrl`: controla a **Tela da Quest**

Na renderização do `<main>` no componente `App`, a regra é:

1. Se `!state.hasStarted` e existir `VITE_HOME_BACKGROUND_URL`, aplica o fundo inicial.
2. Se `state.hasStarted` e existir `VITE_QUEST_BACKGROUND_URL`, aplica o fundo da quest.
3. Sem variáveis, mantém o fundo branco padrão.

Exemplo de configuração (arquivo `.env`):

```bash
VITE_HOME_BACKGROUND_URL=/background-home.png
VITE_QUEST_BACKGROUND_URL=/background-quest.png
VITE_POPUP_BACKGROUND_URL=https://seu-dominio/imagem-popup.png
```

> Onde mexer rapidamente: `src/App.jsx` nas constantes de environment e no `style` do `<main>`.

---

## Configuração do Payload (perguntas, alternativas e vínculo com acessórios)

### Onde editar (arquivo principal)

Todo o payload de conteúdo fica em:

- `src/payload.js` (toda a estrutura de conteúdo da quest)

### Formato de dados

O arquivo exporta o objeto `QUEST_PAYLOAD` no formato de objeto JavaScript (estrutura equivalente a JSON).

Campos principais do `QUEST_PAYLOAD`:

- `popup`: textos do popup flutuante.
- `questions`: array de perguntas discursivas.
- `accessorySelection`: etapa de acessórios (inclui `trait`, `slot`, `layer` e `upgrades`).

Exemplo resumido:

```js
export const QUEST_PAYLOAD = {
  popup: {
    badge: '...',
    title: '...',
    description: '...',
    buttonLabel: '...',
  },
  questions: [
    { id: 1, question: '...', field: 'discursive-1' },
  ],
  accessorySelection: {
    question: '...',
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
```

### Como adicionar novas perguntas discursivas

No array `questions`, adicione um novo objeto com:

- `id`: identificador numérico único.
- `question`: texto exibido na interface.
- `field`: chave única usada para armazenar a resposta no estado/localStorage.

Exemplo:

```js
{
  id: 6,
  question: 'Qual metodologia você pretende usar no próximo artigo?',
  field: 'discursive-6',
}
```

### Como adicionar/alterar escolhas de acessórios

No objeto `accessorySelection`:

- `trait` deve continuar como `accessories` para manter compatibilidade com a montagem da URL do avatar.
- `slot` define o slot lógico do acessório (ex.: `face`). Cada slot aceita **apenas um item por vez**.
- `layer` define prioridade de camada (maior valor = maior prioridade visual).
- `upgrades` é um array de opções renderizadas como botões.

Cada item precisa de:

- `label`: texto visível para o usuário.
- `value`: valor técnico enviado para o gerador de avatar.

Exemplo:

```js
{ label: 'Monóculo', value: 'prescription02' }
```

> Observação: use valores válidos para o estilo `avataaars` da API do DiceBear.

---

## Estrutura de Dados e Persistência

- Estado principal: `src/App.jsx` (`state` com `answers` e `discursiveAnswers`).
- Persistência local: `localStorage` com chave `research-quest-progress-v1`.
- Formato persistido: objeto com progresso, respostas e código de certificado.

Exemplo de parte do estado:

```js
answers: {
  accessories: 'round',
  accessorySlots: {
    face: {
      value: 'round',
      layer: 100
    }
  }
},
discursiveAnswers: {
  'discursive-1': '...'
}
```

---

## Regras de Negócio (Acessórios)

1. A etapa de acessório é obrigatória para concluir a quest.
2. Cada `slot` de acessório aceita somente 1 item ativo.
3. Ao selecionar novo item do mesmo slot, o anterior é substituído em `answers.accessorySlots[slot]`.
4. `answers.accessories` é mantido para retrocompatibilidade e preview rápido.
5. O preview do avatar usa `buildAvatarUrl(seed, answers)` (`src/avatar.js`) e resolve o acessório por camada com `resolveAccessoryValue`.
6. Quando houver acessório resolvido, a URL inclui:
   - `accessories=<valor>`
   - `accessoriesProbability=100` (garante aplicação visual do acessório)

---

## Guia de Assets (Background)

### Popup flutuante (ícone/caixa)

O popup aceita imagem de background pela variável:

```bash
VITE_POPUP_BACKGROUND_URL=https://seu-dominio/imagem.png
```

Comportamento atual:

- Se a variável existir, ela é usada no popup.
- Se não existir, a aplicação usa fallback local: `src/assets/hero.png`.

### Tela Inicial

- Variável: `VITE_HOME_BACKGROUND_URL`
- Código: `src/App.jsx` (constante `homeBackgroundUrl` e `style` do `<main>`)

### Tela da Quest

- Variável: `VITE_QUEST_BACKGROUND_URL`
- Código: `src/App.jsx` (constante `questBackgroundUrl` e `style` do `<main>`)

### Onde colocar arquivos de background

Você pode usar:

1. **Asset local versionado**: `src/assets/` (recomendado para background padrão).
2. **URL externa/CDN**: via `VITE_POPUP_BACKGROUND_URL`.
3. **Arquivo em `public/`**: referenciado por URL absoluta (`/nome-do-arquivo.ext`).

### Formatos aceitos

Para browser/web modernos, priorize:

- `.png`
- `.jpg` / `.jpeg`
- `.webp`
- `.svg` (quando fizer sentido)

---

## Troubleshooting (Solução de Problemas)

### Seções exatas para manutenção rápida

1. **Fluxo de navegação e hover popup**
   - Arquivo: `src/App.jsx`
   - Trechos: `FloatingQuest`, `state.hasStarted`, render condicional da tela
2. **Perguntas e alternativas**
   - Arquivo: `src/payload.js`
   - Trechos: `questions`, `accessorySelection.upgrades`
3. **Lógica de acessórios (slot/camada)**
   - Arquivos: `src/App.jsx` (`withLayeredAccessory`) e `src/avatar.js` (`resolveAccessoryValue`)
4. **Preview/renderização do avatar**
   - Arquivo: `src/avatar.js` (`buildAvatarUrl`)
5. **Testes da jornada**
   - Arquivo: `src/App.test.jsx`

### 1) Acessório não aparece no avatar

Checklist:

- Confirme que a etapa de acessório foi respondida.
- Verifique se `trait` em `src/payload.js` está como `accessories`.
- Verifique se o `value` da opção é válido para o estilo DiceBear `avataaars`.
- Inspecione a URL do avatar e confirme presença de `accessories=` e `accessoriesProbability=100`.

### 2) Background da tela não carrega

Checklist:

- Se usa variável de ambiente, confirme:
  - `VITE_HOME_BACKGROUND_URL` (tela inicial)
  - `VITE_QUEST_BACKGROUND_URL` (tela da quest)
  - `VITE_POPUP_BACKGROUND_URL` (popup)
- Valide se a URL retorna imagem com status 200.
- Verifique possíveis bloqueios de rede/CORS.
- Sem variável definida, confirme existência de `src/assets/hero.png` (fallback).

### 3) Popup não expande no hover

Checklist:

- Verifique se o cursor está sobre o ícone flutuante no canto inferior direito.
- Confira se não há CSS externo cobrindo o elemento.
- Em ambiente de testes automatizados, prefira disparar `mouseEnter` no elemento com `aria-label="Abrir detalhes da quest"`.

### 4) Build/testes falham após alterar payload

Checklist:

- Garanta que `questions` continua sendo array.
- Garanta que cada pergunta possui `field` único.
- Garanta que `accessorySelection.upgrades` continua sendo array com `label` e `value`.

---

## Validação

```bash
npm run lint
npm run test -- --run
npm run build
```

> Observação: neste repositório, `npm run test` já executa `vitest run` (modo não interativo de CI), então `npm run test` e `npm run test -- --run` são equivalentes.
