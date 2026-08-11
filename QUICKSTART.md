# ARCHI Quick Start Guide

## 1. Prerequisites Setup (5 minutes)

### Create Neon Database
1. Go to [neon.tech](https://neon.tech)
2. Create new project
3. Copy your `DATABASE_URL`
4. Open Neon SQL Editor and run `db/schema.sql`

### Get API Keys
1. Get `ANTHROPIC_API_KEY` from [console.anthropic.com](https://console.anthropic.com)
2. Optionally: Get `OPENROUTER_API_KEY` for multi-model support

### Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local and fill in:
# - DATABASE_URL (from Neon)
# - ANTHROPIC_API_KEY (from Anthropic)
# - SOLANA_RPC_URL (optional, use default)
```

## 2. Install & Run (2 minutes)

```bash
npm install
npm run dev
```

Server runs at `http://localhost:3000`

## 3. Test the API (5 minutes)

### Test 1: Create an Agent
```bash
AGENT_ID=$(curl -s -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My First Agent",
    "description": "Testing ARCHI",
    "owner_wallet": "11111111111111111111111111111111",
    "system_prompt": "You are a helpful AI assistant that answers questions about Solana."
  }' | jq -r '.id')

echo "Created agent: $AGENT_ID"
```

### Test 2: Enable HTTP Tool
```bash
curl -X POST http://localhost:3000/api/agents/$AGENT_ID/tools \
  -H "Content-Type: application/json" \
  -d '{
    "tool_name": "http_request"
  }'
```

### Test 3: Execute Query
```bash
curl -X POST http://localhost:3000/api/execute \
  -H "Content-Type: application/json" \
  -d "{
    \"agent_id\": \"$AGENT_ID\",
    \"query\": \"What is the Solana blockchain and what can it do?\"
  }" | jq '.result'
```

### Test 4: View Execution History
```bash
curl "http://localhost:3000/api/interactions?agent_id=$AGENT_ID&limit=5" | jq '.interactions'
```

### Test 5: List All Tools
```bash
curl http://localhost:3000/api/tools | jq '.tools'
```

## 4. Web UI (Optional)

Visit `http://localhost:3000` for:
- Home page with API documentation
- `/agents` - View all agents
- Agent detail pages (coming soon)

## 5. Next Steps

### Option A: Build Frontend Pages
Incomplete pages waiting for implementation:
- `/agents/forge` - Create new agent
- `/agents/[id]` - Agent dashboard with execution console
- `/dashboard` - Stats and analytics

See `IMPLEMENTATION_SUMMARY.md` Phase 4 section.

### Option B: Add More Tools
Each tool lives in `lib/tools/`:
1. Create new file: `lib/tools/your_tool.ts`
2. Define tool with `definition` + `handler`
3. Export from `lib/tools/index.ts`
4. Use via API: `POST /api/agents/[id]/tools` with `tool_name: "your_tool"`

### Option C: Deploy to Production
Ready to deploy on Vercel with Neon:
```bash
git push origin main
# Vercel auto-detects Next.js
# Set env vars in Vercel dashboard
```

## 6. Troubleshooting

### "ANTHROPIC_API_KEY not set"
```bash
# Check .env.local exists and has value
cat .env.local | grep ANTHROPIC
```

### "DATABASE_URL not set"
```bash
# Verify Neon connection string is correct
# Should start with: postgresql://
psql $DATABASE_URL -c "SELECT 1"  # Test connection
```

### API returns 500 error
```bash
# Check server logs in terminal:
npm run dev
# Look for error messages

# Debug specific query:
curl -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}' | jq '.error'
```

### Tool execution returns error
1. Check tool name is correct: `GET /api/tools`
2. Ensure tool is enabled for agent: `GET /api/agents/[id]`
3. Check tool input matches schema

## 7. Architecture Quick Ref

```
Request → Next.js API Route → DB or Agent Executor → Response

Agent Execution Flow:
1. Load agent config from DB
2. Get enabled tools
3. Send query to Claude + tool definitions
4. Claude returns response or tool calls
5. Execute requested tools
6. Send results back to Claude
7. Claude returns final response
8. Store interaction in DB
```

## 8. Project Files

**Core Logic:**
- `lib/executor.ts` - Agent execution engine
- `lib/db.ts` - Database connection
- `lib/tools/` - Tool implementations

**API:**
- `app/api/agents/route.ts` - Agent management
- `app/api/execute/route.ts` - Query execution
- `app/api/tools/route.ts` - Tool listing
- `app/api/interactions/route.ts` - History

**Frontend:**
- `app/page.tsx` - Home page
- `app/agents/page.tsx` - Agent list
- `app/layout.tsx` - Site layout
- `app/globals.css` - Styling

## 9. Environment Variables

```bash
# Required
DATABASE_URL=postgresql://...       # Neon connection
ANTHROPIC_API_KEY=sk_live_...       # Claude API key

# Optional
SOLANA_RPC_URL=https://api...       # Solana RPC endpoint
OPENROUTER_API_KEY=sk_live_...      # For multi-model routing
NEXT_PUBLIC_SOLANA_NETWORK=mainnet  # Public var for Solana network
```

---

**Status**: Ready for testing & frontend development.  
**Time to first working agent**: ~10 minutes  
**Total implementation time so far**: ~4 weeks core + UI  
