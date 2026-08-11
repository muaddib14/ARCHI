# ARCHI Setup Guide

## Prerequisites

- Node.js 18+
- Neon DB account (https://neon.tech)
- Anthropic API key (https://console.anthropic.com)

## 1. Database Setup

1. Create a Neon project at https://neon.tech
2. Get your `DATABASE_URL` from the Neon console
3. Run the schema in `db/schema.sql`:
   - Copy the SQL content
   - Open Neon SQL editor
   - Paste and execute

## 2. Environment Variables

Create `.env.local`:

```bash
cp .env.example .env.local
```

Fill in:
- `DATABASE_URL` - from Neon
- `ANTHROPIC_API_KEY` - from Anthropic console
- `SOLANA_RPC_URL` - Solana mainnet or devnet URL

## 3. Install Dependencies

```bash
npm install
```

## 4. Run Development Server

```bash
npm run dev
```

Server runs at `http://localhost:3000`

## 5. API Routes

### Create Agent
```bash
curl -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Agent",
    "description": "Test agent",
    "owner_wallet": "11111111111111111111111111111111",
    "system_prompt": "You are helpful"
  }'
```

### Execute Agent
```bash
curl -X POST http://localhost:3000/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "uuid-here",
    "query": "What is the weather?"
  }'
```

### Get Agents
```bash
curl http://localhost:3000/api/agents
```

### Get Available Tools
```bash
curl http://localhost:3000/api/tools
```

### Get Interactions
```bash
curl http://localhost:3000/api/interactions?agent_id=uuid&limit=10
```

## 6. Project Structure

```
archi/
├── app/
│   ├── api/              # API routes
│   ├── agents/           # Frontend pages (coming)
│   └── layout.tsx
├── lib/
│   ├── db.ts            # Neon DB client
│   ├── executor.ts      # Agent executor
│   ├── types.ts         # TypeScript types
│   └── tools/           # Tool implementations
├── db/
│   └── schema.sql       # Database schema
└── public/              # Static assets
```

## Next Steps

1. **Frontend Pages** - Build Agent Registry, Forge, Dashboard
2. **Tool Integration** - Add more tools (email, blockchain, etc)
3. **Authentication** - Integrate Solana Wallet Adapter
4. **Blockchain** - Deploy Anchor program for agent ownership

## Troubleshooting

### Database Connection Error
- Verify `DATABASE_URL` is correct
- Check Neon project is active
- Ensure network allows PostgreSQL connections

### API Key Errors
- Verify `ANTHROPIC_API_KEY` is correct
- Ensure key has not expired

### Tool Execution Fails
- Check tool configuration
- Review execution logs
- Verify external API endpoints are accessible
