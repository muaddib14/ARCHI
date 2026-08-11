# OpenRouter Integration Guide

ARCHI uses **OpenRouter** for cost-effective LLM inference instead of direct Anthropic API.

## What is OpenRouter?

OpenRouter is a unified API gateway for LLMs with:
- ✅ Multiple model options (Mixtral, Grok, Llama, etc.)
- ✅ Competitive pricing (often cheaper than direct APIs)
- ✅ API-compatible with OpenAI format
- ✅ Token counting and usage tracking
- 🌐 https://openrouter.ai

## Setup

### 1. Get OpenRouter API Key

1. Visit: https://openrouter.ai/keys
2. Sign up / Log in
3. Click "Create Key"
4. Copy the key (starts with `sk_`)

### 2. Configure Environment

Add to `.env.local`:

```bash
OPENROUTER_API_KEY=sk_live_xxxxxxxxxxxxx
OPENROUTER_MODEL=nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free
```

**Default model: free tier (no credits needed).** ARCHI uses OpenRouter's `:free` models
(see https://openrouter.ai/collections/free-models) so it works out of the box without
topping up credits. `mistralai/mixtral-8x7b-instruct` was tried first but is deprecated
on OpenRouter (404, no endpoints) — replaced with the free-model chain below.

### Automatic Model Fallback

`AgentExecutor` (`src/lib/executor.ts`) does not depend on a single model. It tries
`OPENROUTER_MODEL` (or the built-in chain if unset) first, and if that call errors —
rate limited, provider down, timeout, no endpoints — it automatically retries the next
model in the fallback chain until one succeeds. This means a single free model going
down does not take the whole agent down.

```
OPENROUTER_MODEL (your .env choice, tried first)
  → nemotron-3-nano-omni-30b-a3b-reasoning:free
  → nemotron-3-nano-30b-a3b:free
  → nemotron-3.5-lightning:free
  → gemma-4-26b-a4b-it:free
  → laguna-s-2.1:free
  → nemotron-3-super-120b-a12b:free
  → nemotron-3-ultra-550b-a55b:free
```

### Free Model Benchmark (2026-08-11)

Benchmarked all 14 models in OpenRouter's [free-models collection](https://openrouter.ai/collections/free-models)
with a trivial prompt (`"Say hello in 3 words"`, `max_tokens: 30`). Ranked fastest → slowest,
reliable general-chat models only:

| Rank | Model | Latency | Notes |
|------|-------|---------|-------|
| 1 (fastest) | `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` | ~606ms | Clean response, current default |
| 2 | `nvidia/nemotron-3-nano-30b-a3b:free` | ~696ms | Verbose reasoning trace, works |
| 3 | `nvidia/nemotron-3.5-lightning:free` | ~723ms | Verbose reasoning trace, works |
| 4 | `google/gemma-4-26b-a4b-it:free` | ~1522ms | Clean response |
| 5 | `poolside/laguna-s-2.1:free` | ~2160ms | Clean response |
| 6 | `nvidia/nemotron-3-super-120b-a12b:free` | ~6771ms | Slow but reliable |
| 7 (slowest, in chain) | `nvidia/nemotron-3-ultra-550b-a55b:free` | ~10416ms | Most capable, but slow — last resort |

**Excluded from the fallback chain** (errored or returned empty completions in testing —
not suitable for general agent chat):

| Model | Issue |
|-------|-------|
| `google/gemma-4-31b-it:free` | Provider returned error |
| `nvidia/nemotron-nano-12b-v2-vl:free` | Upstream idle timeout |
| `openai/gpt-oss-20b:free` | Empty completion |
| `nvidia/nemotron-nano-9b-v2:free` | Empty completion |
| `inclusionai/ling-3.0-tiny:free` | Empty completion (too small) |
| `cohere/north-mini-code:free` | Empty completion (code-only model) |
| `poolside/laguna-xs-2.1:free` | Empty completion (code-only model) |

Re-run the benchmark yourself any time with the script pattern in
`scripts/test-executor.ts`, or a quick loop calling `/chat/completions` for each
model ID from https://openrouter.ai/api/v1/models filtered to `id.includes(':free')`.
OpenRouter's free-tier lineup changes over time — re-benchmark periodically and update
`FREE_MODEL_FALLBACK_CHAIN` in `src/lib/executor.ts` if a model disappears or a faster
one shows up.

Model IDs: https://openrouter.ai/docs/models

### 3. Verify Setup

```bash
npm run test:db      # Test database
npm run test:executor  # Test executor (requires API key)
```

## Usage

### Via API Endpoint

```bash
curl -X POST http://localhost:3000/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "agent-123",
    "query": "What is 2 + 2?"
  }'
```

Response:
```json
{
  "status": "completed",
  "result": "2 + 2 equals 4.",
  "tokens_used": 142,
  "execution_ms": 1250
}
```

### Programmatically

```typescript
import { executeAgentTask } from '@/lib/executor';

const result = await executeAgentTask(
  'agent-123',
  'Your query here',
  'Optional system prompt'
);

console.log(result.result);        // AI response
console.log(result.tokens_used);   // Token count
console.log(result.execution_ms);  // Execution time
```

## Tool Use (Agentic Loop)

The executor automatically detects and executes tools:

```typescript
const result = await executeAgentTask(
  'agent-123',
  'Check the Solana price and swap SOL for USDC',
  'You can use these tools: solana_swap, pyth_price_feed, etc.'
);

// If tools were used:
if (result.tool_calls) {
  result.tool_calls.forEach(call => {
    console.log(`Called: ${call.name}`, call.input);
    console.log(`Result: ${call.result}`);
  });
}
```

Available tools in `/src/lib/tools/`:
- `solana_swap` - Token swaps via Jupiter
- `mint_nft` - NFT minting via Metaplex
- `query_pgvector` - RAG vector search
- `pyth_price_feed` - Real-time price feeds

## Monitoring Costs

### Per Request

Each API response includes:
```typescript
result.tokens_used  // Total tokens (input + output)
result.execution_ms // Latency in milliseconds
```

### Cost Calculator

For Mixtral 8x7B Instruct:
- Input: $0.27 / 1M tokens
- Output: $0.81 / 1M tokens

Example:
```
500 input + 200 output = 700 tokens total
Cost = (500 * 0.27 / 1M) + (200 * 0.81 / 1M) ≈ $0.00027
```

Track spending at: https://openrouter.ai/activity

## Troubleshooting

### "OPENROUTER_API_KEY not configured"

```bash
# Check .env.local exists
cat .env.local | grep OPENROUTER

# Should output:
# OPENROUTER_API_KEY=sk_...
```

### 401 Unauthorized

- Key is wrong or expired
- Get new key: https://openrouter.ai/keys
- Restart dev server: `npm run dev`

### 429 Rate Limited

- OpenRouter rate limit hit
- Try a cheaper model (DeepSeek)
- Or wait a few minutes

### Model Not Found

```
Error: "mistralai/mixtral-8x7b-instruct" not found
```

- Check model ID at: https://openrouter.ai/docs/models
- Update `.env.local`

## Development vs Production

### Local Development

```bash
OPENROUTER_API_KEY=sk_live_test_xxxxx
OPENROUTER_MODEL=mistralai/mixtral-8x7b-instruct
```

### Production (Vercel)

1. Go to: https://vercel.com/[project]/settings/environment-variables
2. Add: `OPENROUTER_API_KEY` (production key)
3. Add: `OPENROUTER_MODEL` (e.g., mixtral-8x7b-instruct)
4. Redeploy

## Cost Optimization

### Strategy 1: Smart Model Selection

Use cheaper models for simple tasks:
```typescript
// For simple queries
OPENROUTER_MODEL=mistralai/mixtral-8x7b-instruct

// For complex reasoning (more expensive)
OPENROUTER_MODEL=openai/gpt-4-turbo-preview
```

### Strategy 2: Batch Requests

Instead of multiple single calls:
```typescript
// ❌ Expensive: 3 API calls
await executeAgentTask(id, 'Query 1');
await executeAgentTask(id, 'Query 2');
await executeAgentTask(id, 'Query 3');

// ✅ Cheaper: 1 API call with batch prompt
await executeAgentTask(id, 'Answer these 3 queries: ...');
```

### Strategy 3: Caching

Cache embeddings for RAG queries to avoid re-processing.

## Next Steps

1. ✅ Add API key to `.env.local`
2. ✅ Test: `npm run test:executor`
3. ✅ Deploy to Vercel with env vars
4. ✅ Monitor costs at OpenRouter dashboard

## Useful Links

- 📖 Docs: https://openrouter.ai/docs
- 💰 Pricing: https://openrouter.ai/docs/pricing
- 🔑 API Keys: https://openrouter.ai/keys
- 📊 Activity/Costs: https://openrouter.ai/activity
- 📋 Models: https://openrouter.ai/docs/models
