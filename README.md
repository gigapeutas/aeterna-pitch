# Aeterna.ia — A Gênese da Inteligência Soberana

> A primeira infraestrutura digital capaz de pensar, validar, evoluir e se auto-financiar.

Este repositório contém o código-fonte da Landing Page oficial para a rodada de captação institucional (Startup Pre-Seed Round) da Aeterna.ia.

## 🛡️ Tese de Investimento (Modelo Equity-Free)

A Aeterna.ia opera sob um modelo de **Financiamento Baseado em Receita (Revenue-Based Financing)** atrelado a um contrato de mútuo de alto risco. O projeto foi estruturado para manter 100% da soberania com o Fundador, operando sob 4 diretrizes inegociáveis:

1. **Risco Total (All-in):** O capital financia a construção da infraestrutura de IA. Não há garantias físicas ou bancárias.
2. **Zero Equity:** Os investidores não adquirem poder de voto, controle de diretoria ou participação societária. A Aeterna.ia permanece 100% soberana.
3. **Participação em Resultados (P&L):** O retorno baseia-se na devolução do Principal + um percentual de lucro atrelado à receita autônoma gerada na Fase 2 do projeto.
4. **Opção de Recompra (Call Option):** O Fundador retém o direito de recompra do contrato a qualquer momento, mediante pagamento de prêmio pré-acordado, garantindo a liquidez antecipada ao investidor.

## 🚀 Arquitetura do Projeto

A página foi construída com foco em performance extrema e design de alta conversão (Deep Tech padrão):

- **Core:** React 18 + Vite 5
- **Estilização:** Tailwind CSS 3 (Utilitário)
- **Animações Fluidas:** Framer Motion 11
- **Tipografia Premium:** DM Sans & Inter (Google Fonts)
- **Deploy Automático:** CI/CD via Netlify (Edge)

## 📁 Estrutura do Repositório

```text
aeterna-pitch/
├── src/
│   ├── App.jsx            ← Componente principal (UI + Framer Motion)
│   ├── index.css          ← Diretrizes do Tailwind
│   └── main.jsx           ← Entry point do React
├── .gitignore             ← Regras de ignorar do Git
├── index.html             ← Injeção de Fontes e Ponto de Montagem
├── netlify.toml           ← Configuração de Deploy (SPA Redirect)
├── package.json           ← Dependências do projeto
├── postcss.config.js      ← Configuração do PostCSS
├── README.md              ← Documentação oficial da tese
├── tailwind.config.js     ← Mapeamento de Classes (Tailwind)
└── vite.config.js         ← Configuração do Bundler Vite
