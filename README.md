# ARCHI — Autonomous AI Agents on Solana

![Next.js 15](https://img.shields.io/badge/Next.js-15.1-6d28d9?style=for-the-badge&logo=nextdotjs)
![React 19](https://img.shields.io/badge/React-19.0-6d28d9?style=for-the-badge&logo=react)
![Solana](https://img.shields.io/badge/Solana-Mainnet-6d28d9?style=for-the-badge&logo=solana)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-6d28d9?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-f59e0b?style=for-the-badge)

> **"Your AI Agents. On Solana. Own Them."**
> ARCHI is a self-sovereign AI agent infrastructure platform and knowledge directory built on Solana. Deploy autonomous agents with zero centralized lock-in, full on-chain transparency, and instant API knowledge access.

---

## 🌟 Key Features

- **Retro Purple Edition Design System**: High-contrast dark velvet palette (`#1e1b4b`), Playfair Display & Plus Jakarta Sans typography, hard offset drop shadows (`4px 4px 0px #1e1b4b`), and smooth micro-animations.
- **AI Agent Knowledge Directory (`/knowledge`)**:
  - 50+ structured agent tool integrations across 10 categories (Solana Web3, AI Models, Oracles, Database & Vector, Messaging, Automation, Payments & DeFi, Developer Tools, Security).
  - Real-time client-side search bar and interactive category pill filters with live counts.
  - Detail SSG pages (`/knowledge/[slug]`) showcasing complete API Action specifications (`ON_CHAIN`, `POST`, `GET` methods, parameter schemas, and JSON payload examples).
- **Agent Registry & Deployment (`/agents`)**:
  - Interactive Agent Registry to deploy, monitor, and filter autonomous AI agents.
  - Model candidate support (Claude 3.5 Sonnet, OpenAI GPT-4o, o3-mini Reasoning, DeepSeek R1).
  - Built-in mock fallback data ensuring 100% operational uptime without requiring an external database connection.
- **Next.js 15 App Router & React 19**:
  - Full Server/Client Component boundary separation.
  - Static Site Generation (SSG) for all 20+ knowledge route paths.
  - Production build passing with **0 warnings and 0 errors**.

---

## 📁 Architecture & File Structure

```
ARCHI/
├── src/
│   ├── app/
│   │   ├── page.tsx               # Server Component Root Landing Page
│   │   ├── LandingClient.tsx      # Retro Purple Landing UI Client Component
│   │   ├── knowledge/
│   │   │   ├── page.tsx           # Knowledge Directory Index (Search & Filter)
│   │   │   └── [slug]/page.tsx    # SSG Knowledge Detail & API Action Specs
│   │   ├── agents/
│   │   │   └── page.tsx           # Agent Registry & Deployment Modal Component
│   │   ├── api/                   # RESTful API Endpoints
│   │   │   ├── agents/            # Agents CRUD API (with DB & mock fallbacks)
│   │   │   │   └── [id]/          # Agent ID Detail & Tools API
│   │   │   ├── execute/           # Agent Task Execution API
│   │   │   └── tools/             # Available Tools Definition API
│   │   ├── globals.css            # Retro Purple Design System Tokens & Utility Styles
│   │   ├── layout.tsx             # Root Layout & Google Fonts Integration
│   │   ├── error.tsx              # Error Boundary Component
│   │   └── not-found.tsx          # Custom 404 Component
│   ├── data/
│   │   └── knowledgeData.ts       # Dataset of 50+ AI Agent Tools & API Actions
│   └── lib/
│       ├── db.ts                  # PostgreSQL Safe Query Helper / Fallback
│       ├── executor.ts            # Agent Task Executor Engine
│       ├── tools.ts               # On-Chain & Off-Chain Tool Registry
│       └── types.ts               # Core TypeScript Interfaces & Schemas
├── next.config.js                 # Next.js 15 Configuration
└── tsconfig.json                  # TypeScript Compiler Configuration & Path Aliases
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.17.0` or higher
- **npm**: `v9.0.0` or higher

### Installation

1. Navigate to the `ARCHI` project folder:
   ```bash
   cd ARCHI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser.

---

## 🛠️ Production Build

To test and compile the optimized production bundle:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

---

## 📡 API Reference

### 1. Get Agents List
- **Endpoint**: `GET /api/agents`
- **Response**: Array of registered autonomous agents.

### 2. Deploy Agent
- **Endpoint**: `POST /api/agents`
- **Payload**:
  ```json
  {
    "name": "Jupiter Arbitrage Sentinel",
    "description": "High-frequency arbitrage agent monitoring DEX price divergences.",
    "model": "claude-3-5-sonnet",
    "owner_wallet": "7v9W...xQ8z"
  }
  ```

### 3. List Tool Schemas
- **Endpoint**: `GET /api/tools`
- **Response**: List of available tools (Solana swaps, NFT minting, pgvector queries, Pyth price feeds).

### 4. Execute Agent Task
- **Endpoint**: `POST /api/execute`
- **Payload**:
  ```json
  {
    "agent_id": "agent-solana-arb-01",
    "query": "Check SOL/USDC price impact on Raydium"
  }
  ```

---

## 📄 License

This project is licensed under the **MIT License**.
Built with ❤️ for the **Solana & Autonomous AI Agent Ecosystem**.
