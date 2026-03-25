# Aeterna.ia — Landing Page

> A Gênese da Inteligência Soberana.

Landing page para a rodada de captação Friends & Family da Aeterna.ia.
Construída com React + Vite + Tailwind CSS + Framer Motion.

## Stack

- **React 18** — UI
- **Vite 5** — Build & Dev Server
- **Tailwind CSS 3** — Estilização utilitária
- **Framer Motion 11** — Animações

## Estrutura do Projeto

```
aeterna-ia/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx        ← Componente principal (toda a página)
│   ├── main.jsx       ← Entry point React
│   └── index.css      ← Tailwind directives + reset
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── netlify.toml       ← Config de deploy (SPA redirect)
└── package.json
```

## Rodando localmente

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

## Deploy no Netlify

### Via GitHub (recomendado)

1. Suba este repositório no GitHub
2. Acesse [app.netlify.com](https://app.netlify.com)
3. Clique em **"Add new site" → "Import an existing project"**
4. Conecte ao GitHub e selecione o repositório
5. As configurações são detectadas automaticamente via `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Clique em **Deploy site**

### Via Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify deploy --build --prod
```

## Personalizações Rápidas

| O que mudar | Onde |
|---|---|
| Email do CTA | `src/App.jsx` → `href="mailto:..."` |
| Título / textos | `src/App.jsx` → seções Hero, Captacao |
| Cores de acento | Buscar por `#00D2C8`, `#7C3AED`, `#10B981` |
| Fases do Roadmap | Array `PHASES` em `src/App.jsx` |
| Cards da Arquitetura | Array `PILLARS` em `src/App.jsx` |

---

**© 2025 Aeterna.ia** — Construindo soberania, uma iteração por vez.
