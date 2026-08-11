export interface ApiParameter {
  name: string;
  type: string;
  required: boolean;
  desc: string;
}

export interface ApiAction {
  name: string;
  description: string;
  method: 'GET' | 'POST' | 'ON_CHAIN';
  parameters?: ApiParameter[];
  samplePayload?: string;
}

export interface KnowledgeItem {
  id: string;
  name: string;
  category: string;
  description: string;
  actionsCount: number;
  icon: string; // SVG icon type key
  website?: string;
  github?: string;
  docs?: string;
  actions: ApiAction[];
}

export const CATEGORIES = [
  'All',
  'Solana & Web3',
  'AI Models',
  'Oracles & Data',
  'Database & Vector',
  'Messaging',
  'Automation',
  'Payments & DeFi',
  'Developer Tools',
  'Security & Identity'
];

export const KNOWLEDGE_ITEMS: KnowledgeItem[] = [
  {
    id: 'solana-agent-kit',
    name: 'Solana Agent Kit',
    category: 'Solana & Web3',
    description: 'Connect any AI framework to Solana protocols for token deployment, swaps, NFT minting, and staking.',
    actionsCount: 42,
    icon: 'solana',
    website: 'https://solana.com',
    github: 'https://github.com/sendai/solana-agent-kit',
    docs: 'https://docs.solana.com',
    actions: [
      {
        name: 'deploy_token',
        description: 'Deploy a new SPL token or meme coin on Solana with customizable supply and metadata.',
        method: 'ON_CHAIN',
        parameters: [
          { name: 'name', type: 'string', required: true, desc: 'Name of the token' },
          { name: 'symbol', type: 'string', required: true, desc: 'Token ticker symbol' },
          { name: 'initialSupply', type: 'number', required: true, desc: 'Total initial mint supply' },
          { name: 'decimals', type: 'number', required: false, desc: 'Token decimals (default 9)' }
        ],
        samplePayload: '{\n  "name": "ARCHI Agent Token",\n  "symbol": "ARCHI",\n  "initialSupply": 1000000000,\n  "decimals": 9\n}'
      },
      {
        name: 'swap_tokens',
        description: 'Execute token swaps via Jupiter DEX aggregator with optimal routing.',
        method: 'ON_CHAIN',
        parameters: [
          { name: 'inputMint', type: 'string', required: true, desc: 'Input token mint address' },
          { name: 'outputMint', type: 'string', required: true, desc: 'Output token mint address' },
          { name: 'amount', type: 'number', required: true, desc: 'Amount to swap' },
          { name: 'slippageBps', type: 'number', required: false, desc: 'Max allowed slippage in basis points' }
        ],
        samplePayload: '{\n  "inputMint": "So11111111111111111111111111111111111111112",\n  "outputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",\n  "amount": 1000000000,\n  "slippageBps": 50\n}'
      },
      {
        name: 'get_balance',
        description: 'Retrieve SOL and SPL token balances for a wallet public key.',
        method: 'GET',
        parameters: [
          { name: 'publicKey', type: 'string', required: true, desc: 'Solana wallet address' }
        ],
        samplePayload: '{\n  "publicKey": "7v9W...xQ8z"\n}'
      }
    ]
  },
  {
    id: 'anchor-lang',
    name: 'Anchor Protocol',
    category: 'Solana & Web3',
    description: 'Rust-based framework for writing secure Solana smart contracts and building client interfaces for AI agents.',
    actionsCount: 28,
    icon: 'anchor',
    website: 'https://www.anchor-lang.com',
    github: 'https://github.com/coral-xyz/anchor',
    actions: [
      {
        name: 'invoke_instruction',
        description: 'Call Anchor program instruction with serialized CPI arguments and account context.',
        method: 'ON_CHAIN',
        parameters: [
          { name: 'programId', type: 'string', required: true, desc: 'Target Anchor program ID' },
          { name: 'instructionName', type: 'string', required: true, desc: 'Name of Rust instruction' },
          { name: 'accounts', type: 'array', required: true, desc: 'List of account metadatas' }
        ]
      },
      {
        name: 'fetch_account_data',
        description: 'Fetch and deserialize Anchor state account data from Solana ledger.',
        method: 'GET',
        parameters: [
          { name: 'accountAddress', type: 'string', required: true, desc: 'PDA or account address' }
        ]
      }
    ]
  },
  {
    id: 'openai',
    name: 'OpenAI API',
    category: 'AI Models',
    description: 'Access GPT-4o, o3-mini, embeddings, and vision models for multi-step reasoning and function calling.',
    actionsCount: 84,
    icon: 'openai',
    website: 'https://openai.com',
    docs: 'https://platform.openai.com/docs',
    actions: [
      {
        name: 'chat_completion',
        description: 'Generate chat completion with tool calling schema validation.',
        method: 'POST',
        parameters: [
          { name: 'model', type: 'string', required: true, desc: 'Model name (e.g. gpt-4o)' },
          { name: 'messages', type: 'array', required: true, desc: 'System and conversation messages' },
          { name: 'tools', type: 'array', required: false, desc: 'JSON schema functions for tools' }
        ]
      },
      {
        name: 'create_embedding',
        description: 'Vectorize text inputs into 1536-dimensional floating point embeddings.',
        method: 'POST',
        parameters: [
          { name: 'input', type: 'string | array', required: true, desc: 'Text to embed' },
          { name: 'model', type: 'string', required: true, desc: 'Embedding model (e.g. text-embedding-3-small)' }
        ]
      }
    ]
  },
  {
    id: 'anthropic-claude',
    name: 'Anthropic Claude',
    category: 'AI Models',
    description: 'Claude 3.5 Sonnet & Claude 3 Opus models optimized for complex code execution, analysis, and tool use.',
    actionsCount: 38,
    icon: 'anthropic',
    website: 'https://anthropic.com',
    docs: 'https://docs.anthropic.com',
    actions: [
      {
        name: 'create_message',
        description: 'Send structured prompt to Claude model with extended thinking and computer use capabilities.',
        method: 'POST',
        parameters: [
          { name: 'model', type: 'string', required: true, desc: 'claude-3-5-sonnet-latest' },
          { name: 'max_tokens', type: 'number', required: true, desc: 'Max completion tokens' },
          { name: 'messages', type: 'array', required: true, desc: 'Structured message objects' }
        ]
      }
    ]
  },
  {
    id: 'supabase',
    name: 'Supabase',
    category: 'Database & Vector',
    description: 'Open-source Postgres database with pgvector, real-time subscriptions, row-level security, and auth.',
    actionsCount: 112,
    icon: 'supabase',
    website: 'https://supabase.com',
    github: 'https://github.com/supabase/supabase',
    actions: [
      {
        name: 'match_documents',
        description: 'Perform similarity vector search over pgvector embeddings using cosine distance.',
        method: 'POST',
        parameters: [
          { name: 'query_embedding', type: 'number[]', required: true, desc: 'Query vector array' },
          { name: 'match_threshold', type: 'number', required: true, desc: 'Similarity score cutoff (0 to 1)' },
          { name: 'match_count', type: 'number', required: true, desc: 'Max matches to return' }
        ]
      },
      {
        name: 'insert_record',
        description: 'Insert new structured row into Postgres table with row-level security enforcement.',
        method: 'POST',
        parameters: [
          { name: 'table', type: 'string', required: true, desc: 'Database table name' },
          { name: 'data', type: 'object', required: true, desc: 'JSON object payload' }
        ]
      }
    ]
  },
  {
    id: 'pyth-network',
    name: 'Pyth Network',
    category: 'Oracles & Data',
    description: 'Low-latency financial oracle delivering real-time crypto, FX, equity, and commodity price feeds to AI agents.',
    actionsCount: 19,
    icon: 'pyth',
    website: 'https://pyth.network',
    docs: 'https://docs.pyth.network',
    actions: [
      {
        name: 'get_latest_price_feed',
        description: 'Fetch real-time price feed with confidence interval for any supported asset pair.',
        method: 'GET',
        parameters: [
          { name: 'priceFeedId', type: 'string', required: true, desc: 'Asset price feed hex ID' }
        ],
        samplePayload: '{\n  "priceFeedId": "0xe62df6e05d63772585c00737092908faded93d3bc624419d2557a10cc41e58ce"\n}'
      }
    ]
  },
  {
    id: 'jupiter-aggregator',
    name: 'Jupiter DEX',
    category: 'Payments & DeFi',
    description: 'Solana liquidity aggregator for best-price swap execution, limit orders, dollar-cost averaging, and perpetuals.',
    actionsCount: 34,
    icon: 'jupiter',
    website: 'https://jup.ag',
    docs: 'https://station.jup.ag',
    actions: [
      {
        name: 'quote_swap',
        description: 'Get real-time route quote and price impact for Solana token pair.',
        method: 'GET',
        parameters: [
          { name: 'inputMint', type: 'string', required: true, desc: 'Source mint' },
          { name: 'outputMint', type: 'string', required: true, desc: 'Destination mint' },
          { name: 'amount', type: 'number', required: true, desc: 'Amount in atomic units' }
        ]
      }
    ]
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    category: 'AI Models',
    description: 'Unified API gateway to query 200+ AI models (DeepSeek R1, Llama 3, Claude, Mistral) with auto-fallback.',
    actionsCount: 54,
    icon: 'openrouter',
    website: 'https://openrouter.ai',
    actions: [
      {
        name: 'completion_route',
        description: 'Dispatch prompt across optimal LLM model with automatic price and latency routing.',
        method: 'POST',
        parameters: [
          { name: 'models', type: 'array', required: true, desc: 'Ranked list of model candidates' },
          { name: 'messages', type: 'array', required: true, desc: 'Chat context payload' }
        ]
      }
    ]
  },
  {
    id: 'helius-rpc',
    name: 'Helius RPC & Webhooks',
    category: 'Developer Tools',
    description: 'High-speed Solana RPCs, transaction parsing APIs, geyser webhooks, and NFT metadata indexing.',
    actionsCount: 46,
    icon: 'helius',
    website: 'https://helius.dev',
    actions: [
      {
        name: 'parse_transaction',
        description: 'Parse raw Solana transaction signature into human-readable agent activity object.',
        method: 'POST',
        parameters: [
          { name: 'transactions', type: 'string[]', required: true, desc: 'Array of transaction hashes' }
        ]
      }
    ]
  },
  {
    id: 'inngest',
    name: 'Inngest Workflow',
    category: 'Automation',
    description: 'Event-driven durable execution engine for reliable AI agent step functions, retries, and background queues.',
    actionsCount: 26,
    icon: 'inngest',
    website: 'https://inngest.com',
    actions: [
      {
        name: 'send_event',
        description: 'Trigger serverless workflow function with structured event payload.',
        method: 'POST',
        parameters: [
          { name: 'name', type: 'string', required: true, desc: 'Event identifier' },
          { name: 'data', type: 'object', required: true, desc: 'Payload attributes' }
        ]
      }
    ]
  },
  {
    id: 'pgvector',
    name: 'pgvector',
    category: 'Database & Vector',
    description: 'Open-source vector similarity search extension for PostgreSQL powering RAG and long-term agent memory.',
    actionsCount: 16,
    icon: 'pgvector',
    website: 'https://github.com/pgvector/pgvector',
    actions: [
      {
        name: 'vector_search_hnsw',
        description: 'Execute HNSW index vector similarity lookup with L2 distance or inner product.',
        method: 'GET',
        parameters: [
          { name: 'embedding', type: 'number[]', required: true, desc: 'Query vector' }
        ]
      }
    ]
  },
  {
    id: 'redis',
    name: 'Redis Agent State',
    category: 'Database & Vector',
    description: 'Ultra-fast in-memory data store for agent session state, rate limiting, pub/sub channels, and memory caching.',
    actionsCount: 65,
    icon: 'redis',
    website: 'https://redis.io',
    actions: [
      {
        name: 'set_session_state',
        description: 'Store transient agent conversation state with TTL expiration.',
        method: 'POST',
        parameters: [
          { name: 'key', type: 'string', required: true, desc: 'Session key' },
          { name: 'value', type: 'string', required: true, desc: 'Serialized state' },
          { name: 'ttlSeconds', type: 'number', required: false, desc: 'Expiry time in seconds' }
        ]
      }
    ]
  },
  {
    id: 'wormhole-bridge',
    name: 'Wormhole Interoperability',
    category: 'Solana & Web3',
    description: 'Cross-chain messaging and token bridge connecting Solana agents to Ethereum, Arbitrum, Base, and Sui.',
    actionsCount: 31,
    icon: 'wormhole',
    website: 'https://wormhole.com',
    actions: [
      {
        name: 'transfer_tokens_cross_chain',
        description: 'Lock tokens on source chain and mint/unlock equivalent on destination chain via VAA attestation.',
        method: 'ON_CHAIN',
        parameters: [
          { name: 'targetChain', type: 'string', required: true, desc: 'Destination blockchain name' },
          { name: 'recipient', type: 'string', required: true, desc: 'Recipient wallet address' }
        ]
      }
    ]
  },
  {
    id: 'chainlink-data',
    name: 'Chainlink Oracles',
    category: 'Oracles & Data',
    description: 'Decentralized oracle networks delivering off-chain data computation, proof of reserves, and VRF randomness.',
    actionsCount: 40,
    icon: 'chainlink',
    website: 'https://chain.link',
    actions: [
      {
        name: 'get_verifiable_random_number',
        description: 'Request cryptographically provable random seed for AI agent decision trees.',
        method: 'ON_CHAIN',
        parameters: [
          { name: 'keyHash', type: 'string', required: true, desc: 'VRF Gas lane key hash' }
        ]
      }
    ]
  },
  {
    id: '1password-secrets',
    name: '1Password Vault',
    category: 'Security & Identity',
    description: 'Zero-knowledge secret management vault for securely storing AI agent private keys, API tokens, and credentials.',
    actionsCount: 15,
    icon: '1password',
    website: 'https://1password.com',
    actions: [
      {
        name: 'get_item_credential',
        description: 'Securely retrieve API token or private key from agent zero-knowledge vault.',
        method: 'GET',
        parameters: [
          { name: 'vaultId', type: 'string', required: true, desc: 'Vault ID' },
          { name: 'itemId', type: 'string', required: true, desc: 'Secret Item ID' }
        ]
      }
    ]
  }
];
