# tt

Research Quest Builder MVP built with React + Tailwind + Framer Motion.

## Como usar

```bash
npm ci
npm run dev
```

Abra a aplicação e clique em qualquer ponto da tela para abrir o popup.  
Depois, clique em **Iniciar Quest**, responda as 5 perguntas e escolha 1 entre 3 acessórios.

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
- opções dos 3 acessórios (`accessorySelection.upgrades`)

## Validação

```bash
npm run lint
npm run test -- --run
npm run build
```
