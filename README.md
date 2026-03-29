# tt

Research Quest Builder MVP built with React + Tailwind + Framer Motion.

## Como usar

```bash
npm ci
npm run dev
```

Abra a aplicação, passe o mouse na bolinha chamativa no canto inferior direito para expandir o popup.  
Depois, clique em **Iniciar Quest**, responda as perguntas e faça as escolhas configuradas no payload.

## Configuração do popup

Você pode configurar uma imagem de fundo opcional no popup:

```bash
VITE_POPUP_BACKGROUND_URL=https://seu-dominio/imagem.png
```

Se a variável não for informada, o popup mantém o fundo padrão.

## Configuração do payload (perguntas e acessórios)

O payload fica em:

- `src/payload.js`

Nesse arquivo você pode alterar:

- textos do popup (`popup`)
- lista de perguntas (`questions`)
- etapas de escolhas (`choiceSteps`)

### Como funciona agora (bolinha chamativa)

- A tela inicial **não mostra** o conteúdo completo do quest.
- No canto inferior direito aparece uma **bolinha chamativa**.
- Ao passar o mouse sobre a bolinha, ela expande para a caixa chamativa.
- Ao clicar na caixa, o usuário entra no fluxo de respostas com avatar.

### Definir em que momento entram escolhas (cadência)

No `src/payload.js`, use `choiceSteps` para decidir **depois de quantas perguntas** cada bloco de escolhas aparece:

```js
choiceSteps: [
  {
    id: 'accessory-selection',
    insertAfterQuestion: 5, // mostra após responder 5 perguntas discursivas
    question: 'Escolha 1 acessório dentre 3 opções para seu personagem',
    trait: 'accessories',
    upgrades: [
      { label: 'Óculos Redondos', value: 'round' },
      { label: 'Óculos de Sol', value: 'wayfarers' },
      { label: 'Brinco', value: 'kurt' },
    ],
  },
]
```

Regras:
- `insertAfterQuestion: 0` mostra a escolha antes da 1ª pergunta.
- `insertAfterQuestion: 5` mostra após a 5ª pergunta.
- Se você adicionar mais objetos em `choiceSteps`, múltiplos blocos de escolha são inseridos no fluxo.
- A quantidade de botões em cada bloco é o tamanho de `upgrades`.

### Manutenção rápida

- Para aumentar/diminuir perguntas: edite `questions`.
- Para aumentar/diminuir escolhas por etapa: edite `choiceSteps[].upgrades`.
- Para mudar o texto do popup chamativo: edite `popup`.

## Validação

```bash
npm run lint
npm run test -- --run
npm run build
```
