# Research Quest Builder (tt)

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

## Guia do Payload (perguntas e escolhas)

### Onde editar

Todo o payload de conteúdo fica em:

- `src/payload.js`

### Formato de dados

O arquivo exporta o objeto `QUEST_PAYLOAD` no formato de objeto JavaScript (estrutura equivalente a JSON).

Campos principais:

- `popup`: textos do popup flutuante.
- `questions`: array de perguntas discursivas.
- `accessorySelection`: configuração da etapa de acessórios.

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
  accessories: 'round'
},
discursiveAnswers: {
  'discursive-1': '...'
}
```

---

## Regras de Negócio (Acessórios)

1. A etapa de acessório é obrigatória para concluir a quest.
2. Apenas um acessório pode ficar ativo por vez.
3. Ao selecionar outro botão, o valor anterior é substituído em `answers.accessories`.
4. O preview do avatar usa `buildAvatarUrl(seed, answers)` (`src/avatar.js`).
5. Quando `answers.accessories` está preenchido, a URL inclui:
   - `accessories=<valor>`
   - `accessoriesProbability=100` (garante aplicação visual do acessório)

---

## Guia de Assets (Background)

### Popup flutuante

O popup aceita imagem de background pela variável:

```bash
VITE_POPUP_BACKGROUND_URL=https://seu-dominio/imagem.png
```

Comportamento atual:

- Se a variável existir, ela é usada no popup.
- Se não existir, a aplicação usa fallback local: `src/assets/hero.png`.

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

### 1) Acessório não aparece no avatar

Checklist:

- Confirme que a etapa de acessório foi respondida.
- Verifique se `trait` em `src/payload.js` está como `accessories`.
- Verifique se o `value` da opção é válido para o estilo DiceBear `avataaars`.
- Inspecione a URL do avatar e confirme presença de `accessories=` e `accessoriesProbability=100`.

### 2) Background do popup não carrega

Checklist:

- Se usa variável de ambiente, confirme `VITE_POPUP_BACKGROUND_URL` definida no ambiente do Vite.
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
npm run test
npm run build
```
