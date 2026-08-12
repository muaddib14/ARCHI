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
  'Security & Identity',
  'Web Scraping',
  'CRM & Sales',
  'Analytics & Monitoring',
  'File & Documents',
  'Search & Indexing',
  'Cloud & Infrastructure'
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
  },
  {
    id: 'magic-eden',
    name: 'Magic Eden',
    category: 'Solana & Web3',
    description: 'Leading Solana NFT marketplace API for listing, bidding, and collection floor price analytics.',
    actionsCount: 22,
    icon: 'magiceden',
    website: 'https://magiceden.io',
    actions: [
      {
        name: 'list_nft',
        description: 'Create a listing for an NFT on the Magic Eden marketplace with a fixed price.',
        method: 'ON_CHAIN',
        parameters: [
          { name: 'tokenMint', type: 'string', required: true, desc: 'NFT mint address' },
          { name: 'price', type: 'number', required: true, desc: 'Listing price in SOL' }
        ]
      },
      {
        name: 'get_collection_stats',
        description: 'Fetch floor price, volume, and listed count for an NFT collection.',
        method: 'GET',
        parameters: [
          { name: 'symbol', type: 'string', required: true, desc: 'Collection symbol' }
        ]
      }
    ]
  },
  {
    id: 'metaplex',
    name: 'Metaplex',
    category: 'Solana & Web3',
    description: 'Standard protocol and SDK for minting, managing, and verifying NFTs and compressed NFTs on Solana.',
    actionsCount: 37,
    icon: 'metaplex',
    website: 'https://metaplex.com',
    github: 'https://github.com/metaplex-foundation/js',
    actions: [
      {
        name: 'mint_nft',
        description: 'Mint a new NFT with on-chain metadata, image URI, and royalty configuration.',
        method: 'ON_CHAIN',
        parameters: [
          { name: 'name', type: 'string', required: true, desc: 'NFT display name' },
          { name: 'uri', type: 'string', required: true, desc: 'Off-chain metadata URI' },
          { name: 'sellerFeeBasisPoints', type: 'number', required: false, desc: 'Royalty in basis points' }
        ]
      },
      {
        name: 'mint_compressed_nft',
        description: 'Mint state-compressed NFTs in bulk at a fraction of standard mint cost.',
        method: 'ON_CHAIN',
        parameters: [
          { name: 'merkleTree', type: 'string', required: true, desc: 'Merkle tree account address' }
        ]
      }
    ]
  },
  {
    id: 'drift-protocol',
    name: 'Drift Protocol',
    category: 'Solana & Web3',
    description: 'Decentralized perpetuals and spot trading exchange with cross-margin accounts built for agent-driven strategies.',
    actionsCount: 29,
    icon: 'drift',
    website: 'https://drift.trade',
    actions: [
      {
        name: 'open_perp_position',
        description: 'Open a leveraged perpetual futures position on a supported market.',
        method: 'ON_CHAIN',
        parameters: [
          { name: 'marketIndex', type: 'number', required: true, desc: 'Perp market index' },
          { name: 'direction', type: 'string', required: true, desc: 'long or short' },
          { name: 'baseAssetAmount', type: 'number', required: true, desc: 'Position size' }
        ]
      }
    ]
  },
  {
    id: 'marinade-finance',
    name: 'Marinade Finance',
    category: 'Solana & Web3',
    description: 'Liquid staking protocol issuing mSOL, letting agents earn staking yield while keeping capital composable.',
    actionsCount: 14,
    icon: 'marinade',
    website: 'https://marinade.finance',
    actions: [
      {
        name: 'stake_sol',
        description: 'Deposit SOL and receive liquid-staked mSOL in return.',
        method: 'ON_CHAIN',
        parameters: [
          { name: 'amount', type: 'number', required: true, desc: 'Amount of SOL to stake' }
        ]
      }
    ]
  },
  {
    id: 'google-gemini',
    name: 'Google Gemini',
    category: 'AI Models',
    description: 'Multimodal reasoning models with native long-context, code execution, and grounded search tool use.',
    actionsCount: 46,
    icon: 'gemini',
    website: 'https://ai.google.dev',
    docs: 'https://ai.google.dev/docs',
    actions: [
      {
        name: 'generate_content',
        description: 'Generate multimodal completions from text, image, or video input.',
        method: 'POST',
        parameters: [
          { name: 'model', type: 'string', required: true, desc: 'gemini-2.0-flash or similar' },
          { name: 'contents', type: 'array', required: true, desc: 'Multimodal content parts' }
        ]
      }
    ]
  },
  {
    id: 'mistral-ai',
    name: 'Mistral AI',
    category: 'AI Models',
    description: 'Efficient open-weight and hosted models (Large, Codestral) tuned for low-latency agentic tool calling.',
    actionsCount: 31,
    icon: 'mistral',
    website: 'https://mistral.ai',
    docs: 'https://docs.mistral.ai',
    actions: [
      {
        name: 'chat_completion',
        description: 'Generate a chat completion with function-calling schema support.',
        method: 'POST',
        parameters: [
          { name: 'model', type: 'string', required: true, desc: 'mistral-large-latest' },
          { name: 'messages', type: 'array', required: true, desc: 'Conversation messages' }
        ]
      }
    ]
  },
  {
    id: 'groq',
    name: 'Groq',
    category: 'AI Models',
    description: 'LPU-accelerated inference engine delivering sub-100ms token latency for open-weight LLMs.',
    actionsCount: 18,
    icon: 'groq',
    website: 'https://groq.com',
    docs: 'https://console.groq.com/docs',
    actions: [
      {
        name: 'chat_completion',
        description: 'Run ultra-low-latency inference against Llama, Mixtral, or Gemma models.',
        method: 'POST',
        parameters: [
          { name: 'model', type: 'string', required: true, desc: 'llama-3.3-70b-versatile' },
          { name: 'messages', type: 'array', required: true, desc: 'Conversation messages' }
        ]
      }
    ]
  },
  {
    id: 'cohere',
    name: 'Cohere',
    category: 'AI Models',
    description: 'Enterprise-grade language models specialized in retrieval-augmented generation, rerank, and embeddings.',
    actionsCount: 27,
    icon: 'cohere',
    website: 'https://cohere.com',
    docs: 'https://docs.cohere.com',
    actions: [
      {
        name: 'rerank_documents',
        description: 'Rerank a set of retrieved documents by relevance to a query for higher-precision RAG.',
        method: 'POST',
        parameters: [
          { name: 'query', type: 'string', required: true, desc: 'Search query' },
          { name: 'documents', type: 'string[]', required: true, desc: 'Candidate documents' }
        ]
      }
    ]
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    category: 'AI Models',
    description: 'High-fidelity text-to-speech and voice cloning API for giving autonomous agents a spoken voice.',
    actionsCount: 21,
    icon: 'elevenlabs',
    website: 'https://elevenlabs.io',
    docs: 'https://elevenlabs.io/docs',
    actions: [
      {
        name: 'text_to_speech',
        description: 'Convert text into natural-sounding speech audio using a chosen voice model.',
        method: 'POST',
        parameters: [
          { name: 'text', type: 'string', required: true, desc: 'Text to synthesize' },
          { name: 'voiceId', type: 'string', required: true, desc: 'Target voice ID' }
        ]
      }
    ]
  },
  {
    id: 'switchboard',
    name: 'Switchboard',
    category: 'Oracles & Data',
    description: 'Permissionless oracle network for custom on-chain data feeds, VRF randomness, and off-chain compute.',
    actionsCount: 24,
    icon: 'switchboard',
    website: 'https://switchboard.xyz',
    actions: [
      {
        name: 'read_aggregator',
        description: 'Read the latest resolved value from a Switchboard data feed aggregator.',
        method: 'GET',
        parameters: [
          { name: 'aggregatorAddress', type: 'string', required: true, desc: 'Feed aggregator account' }
        ]
      }
    ]
  },
  {
    id: 'redstone-oracles',
    name: 'RedStone Oracles',
    category: 'Oracles & Data',
    description: 'Modular oracle delivering on-demand, cryptographically signed price data optimized for gas efficiency.',
    actionsCount: 17,
    icon: 'redstone',
    website: 'https://redstone.finance',
    actions: [
      {
        name: 'get_signed_price',
        description: 'Fetch a cryptographically signed price payload ready for on-chain verification.',
        method: 'GET',
        parameters: [
          { name: 'symbol', type: 'string', required: true, desc: 'Asset ticker symbol' }
        ]
      }
    ]
  },
  {
    id: 'dia-data',
    name: 'DIA',
    category: 'Oracles & Data',
    description: 'Transparent, open-source financial data and oracle infrastructure sourced from verifiable on-chain trades.',
    actionsCount: 12,
    icon: 'dia',
    website: 'https://diadata.org',
    actions: [
      {
        name: 'get_asset_price',
        description: 'Retrieve the latest verified price for an asset from DIA data feeds.',
        method: 'GET',
        parameters: [
          { name: 'assetSymbol', type: 'string', required: true, desc: 'Asset symbol' }
        ]
      }
    ]
  },
  {
    id: 'pinecone',
    name: 'Pinecone',
    category: 'Database & Vector',
    description: 'Fully-managed vector database purpose-built for fast, filterable similarity search at scale.',
    actionsCount: 20,
    icon: 'pinecone',
    website: 'https://www.pinecone.io',
    docs: 'https://docs.pinecone.io',
    actions: [
      {
        name: 'query_index',
        description: 'Query a vector index for the nearest neighbors of an embedding.',
        method: 'POST',
        parameters: [
          { name: 'vector', type: 'number[]', required: true, desc: 'Query embedding' },
          { name: 'topK', type: 'number', required: true, desc: 'Number of matches to return' }
        ]
      }
    ]
  },
  {
    id: 'weaviate',
    name: 'Weaviate',
    category: 'Database & Vector',
    description: 'Open-source vector database with hybrid keyword + semantic search and built-in embedding modules.',
    actionsCount: 25,
    icon: 'weaviate',
    website: 'https://weaviate.io',
    github: 'https://github.com/weaviate/weaviate',
    actions: [
      {
        name: 'hybrid_search',
        description: 'Combine vector similarity and BM25 keyword search in a single ranked query.',
        method: 'POST',
        parameters: [
          { name: 'query', type: 'string', required: true, desc: 'Search text' },
          { name: 'alpha', type: 'number', required: false, desc: 'Balance between vector and keyword score' }
        ]
      }
    ]
  },
  {
    id: 'mongodb-atlas',
    name: 'MongoDB Atlas',
    category: 'Database & Vector',
    description: 'Managed document database with native Atlas Vector Search for combining structured data and embeddings.',
    actionsCount: 33,
    icon: 'mongodb',
    website: 'https://www.mongodb.com/atlas',
    actions: [
      {
        name: 'vector_search',
        description: 'Run an Atlas Vector Search aggregation stage against an embedding field.',
        method: 'POST',
        parameters: [
          { name: 'collection', type: 'string', required: true, desc: 'Target collection' },
          { name: 'queryVector', type: 'number[]', required: true, desc: 'Embedding to search by' }
        ]
      }
    ]
  },
  {
    id: 'discord-bot-api',
    name: 'Discord Bot API',
    category: 'Messaging',
    description: 'Build interactive agent presences in Discord servers with slash commands, embeds, and webhooks.',
    actionsCount: 58,
    icon: 'discord',
    website: 'https://discord.com/developers',
    actions: [
      {
        name: 'send_message',
        description: 'Post a message or rich embed to a Discord channel via bot token or webhook.',
        method: 'POST',
        parameters: [
          { name: 'channelId', type: 'string', required: true, desc: 'Target channel ID' },
          { name: 'content', type: 'string', required: true, desc: 'Message text' }
        ]
      }
    ]
  },
  {
    id: 'telegram-bot-api',
    name: 'Telegram Bot API',
    category: 'Messaging',
    description: 'Lightweight HTTP bot API for deploying conversational agents with inline keyboards and file transfer.',
    actionsCount: 44,
    icon: 'telegram',
    website: 'https://core.telegram.org/bots/api',
    actions: [
      {
        name: 'send_message',
        description: 'Send a text message to a chat or channel via bot token.',
        method: 'POST',
        parameters: [
          { name: 'chatId', type: 'string', required: true, desc: 'Target chat ID' },
          { name: 'text', type: 'string', required: true, desc: 'Message body' }
        ]
      }
    ]
  },
  {
    id: 'slack-api',
    name: 'Slack API',
    category: 'Messaging',
    description: 'Workspace messaging platform API for posting updates, handling events, and building agent workflows.',
    actionsCount: 61,
    icon: 'slack',
    website: 'https://api.slack.com',
    actions: [
      {
        name: 'chat_post_message',
        description: 'Post a message to a Slack channel or thread as an agent bot user.',
        method: 'POST',
        parameters: [
          { name: 'channel', type: 'string', required: true, desc: 'Channel ID or name' },
          { name: 'text', type: 'string', required: true, desc: 'Message content' }
        ]
      }
    ]
  },
  {
    id: 'twilio',
    name: 'Twilio',
    category: 'Messaging',
    description: 'Programmable SMS, voice, and WhatsApp messaging API for reaching users outside chat platforms.',
    actionsCount: 39,
    icon: 'twilio',
    website: 'https://www.twilio.com',
    actions: [
      {
        name: 'send_sms',
        description: 'Send an SMS message to a phone number from a Twilio-provisioned sender.',
        method: 'POST',
        parameters: [
          { name: 'to', type: 'string', required: true, desc: 'Recipient phone number' },
          { name: 'body', type: 'string', required: true, desc: 'SMS text content' }
        ]
      }
    ]
  },
  {
    id: 'zapier',
    name: 'Zapier',
    category: 'Automation',
    description: 'No-code automation platform connecting agents to 7,000+ apps via triggers and multi-step Zaps.',
    actionsCount: 20,
    icon: 'zapier',
    website: 'https://zapier.com',
    actions: [
      {
        name: 'trigger_zap',
        description: 'Fire a configured Zap via webhook to kick off a downstream automation.',
        method: 'POST',
        parameters: [
          { name: 'webhookUrl', type: 'string', required: true, desc: 'Zap webhook endpoint' },
          { name: 'payload', type: 'object', required: true, desc: 'Trigger data' }
        ]
      }
    ]
  },
  {
    id: 'n8n',
    name: 'n8n',
    category: 'Automation',
    description: 'Self-hostable, open-source workflow automation engine with a visual node editor for agent pipelines.',
    actionsCount: 18,
    icon: 'n8n',
    website: 'https://n8n.io',
    github: 'https://github.com/n8n-io/n8n',
    actions: [
      {
        name: 'trigger_workflow',
        description: 'Invoke an n8n workflow via its webhook trigger node.',
        method: 'POST',
        parameters: [
          { name: 'webhookPath', type: 'string', required: true, desc: 'Workflow webhook path' }
        ]
      }
    ]
  },
  {
    id: 'temporal',
    name: 'Temporal',
    category: 'Automation',
    description: 'Durable execution platform for orchestrating long-running, fault-tolerant agent workflows as code.',
    actionsCount: 23,
    icon: 'temporal',
    website: 'https://temporal.io',
    github: 'https://github.com/temporalio/temporal',
    actions: [
      {
        name: 'start_workflow',
        description: 'Start a durable workflow execution with retry and timeout policies.',
        method: 'POST',
        parameters: [
          { name: 'workflowType', type: 'string', required: true, desc: 'Registered workflow name' },
          { name: 'input', type: 'object', required: true, desc: 'Workflow input arguments' }
        ]
      }
    ]
  },
  {
    id: 'stripe-crypto',
    name: 'Stripe',
    category: 'Payments & DeFi',
    description: 'Payments infrastructure API supporting fiat on-ramps, subscriptions, and stablecoin payout rails.',
    actionsCount: 71,
    icon: 'stripe',
    website: 'https://stripe.com',
    docs: 'https://stripe.com/docs',
    actions: [
      {
        name: 'create_payment_intent',
        description: 'Create a payment intent to charge a customer for agent-provided services.',
        method: 'POST',
        parameters: [
          { name: 'amount', type: 'number', required: true, desc: 'Amount in smallest currency unit' },
          { name: 'currency', type: 'string', required: true, desc: 'ISO currency code' }
        ]
      }
    ]
  },
  {
    id: 'circle-usdc',
    name: 'Circle USDC',
    category: 'Payments & DeFi',
    description: 'Native issuance and cross-chain transfer APIs for USDC, including Solana settlement rails.',
    actionsCount: 26,
    icon: 'circle',
    website: 'https://www.circle.com',
    actions: [
      {
        name: 'transfer_usdc',
        description: 'Send USDC between wallets using Circle programmable wallet infrastructure.',
        method: 'POST',
        parameters: [
          { name: 'sourceWalletId', type: 'string', required: true, desc: 'Source wallet ID' },
          { name: 'destinationAddress', type: 'string', required: true, desc: 'Recipient address' },
          { name: 'amount', type: 'number', required: true, desc: 'Amount of USDC to send' }
        ]
      }
    ]
  },
  {
    id: 'kamino-finance',
    name: 'Kamino Finance',
    category: 'Payments & DeFi',
    description: 'Automated liquidity and lending vaults on Solana for concentrated yield strategies.',
    actionsCount: 19,
    icon: 'kamino',
    website: 'https://kamino.finance',
    actions: [
      {
        name: 'deposit_vault',
        description: 'Deposit assets into an automated Kamino yield vault strategy.',
        method: 'ON_CHAIN',
        parameters: [
          { name: 'vaultAddress', type: 'string', required: true, desc: 'Target vault account' },
          { name: 'amount', type: 'number', required: true, desc: 'Deposit amount' }
        ]
      }
    ]
  },
  {
    id: 'raydium',
    name: 'Raydium',
    category: 'Payments & DeFi',
    description: 'Automated market maker and concentrated liquidity protocol powering swaps and yield farms on Solana.',
    actionsCount: 32,
    icon: 'raydium',
    website: 'https://raydium.io',
    actions: [
      {
        name: 'swap',
        description: 'Execute a token swap through a Raydium liquidity pool.',
        method: 'ON_CHAIN',
        parameters: [
          { name: 'poolId', type: 'string', required: true, desc: 'Liquidity pool address' },
          { name: 'amountIn', type: 'number', required: true, desc: 'Input token amount' }
        ]
      }
    ]
  },
  {
    id: 'vercel-api',
    name: 'Vercel',
    category: 'Developer Tools',
    description: 'Deployment and hosting platform API for triggering builds, managing domains, and reading analytics.',
    actionsCount: 41,
    icon: 'vercel',
    website: 'https://vercel.com',
    docs: 'https://vercel.com/docs/rest-api',
    actions: [
      {
        name: 'create_deployment',
        description: 'Trigger a new deployment for a project from a Git commit or file upload.',
        method: 'POST',
        parameters: [
          { name: 'name', type: 'string', required: true, desc: 'Project name' },
          { name: 'gitSource', type: 'object', required: false, desc: 'Git repo reference' }
        ]
      }
    ]
  },
  {
    id: 'github-api',
    name: 'GitHub API',
    category: 'Developer Tools',
    description: 'REST and GraphQL APIs for repository management, issues, pull requests, and CI workflow automation.',
    actionsCount: 96,
    icon: 'github',
    website: 'https://github.com',
    docs: 'https://docs.github.com/rest',
    actions: [
      {
        name: 'create_issue',
        description: 'Open a new issue on a repository with title, body, and labels.',
        method: 'POST',
        parameters: [
          { name: 'repo', type: 'string', required: true, desc: 'owner/repo identifier' },
          { name: 'title', type: 'string', required: true, desc: 'Issue title' }
        ]
      },
      {
        name: 'create_pull_request',
        description: 'Open a pull request between two branches with a title and description.',
        method: 'POST',
        parameters: [
          { name: 'repo', type: 'string', required: true, desc: 'owner/repo identifier' },
          { name: 'head', type: 'string', required: true, desc: 'Source branch' },
          { name: 'base', type: 'string', required: true, desc: 'Target branch' }
        ]
      }
    ]
  },
  {
    id: 'sentry',
    name: 'Sentry',
    category: 'Developer Tools',
    description: 'Error tracking and performance monitoring API for surfacing agent runtime failures in real time.',
    actionsCount: 28,
    icon: 'sentry',
    website: 'https://sentry.io',
    docs: 'https://docs.sentry.io',
    actions: [
      {
        name: 'list_issues',
        description: 'Fetch recent unresolved issues for a project to feed into an agent triage loop.',
        method: 'GET',
        parameters: [
          { name: 'projectSlug', type: 'string', required: true, desc: 'Sentry project slug' }
        ]
      }
    ]
  },
  {
    id: 'docker-hub',
    name: 'Docker Hub',
    category: 'Developer Tools',
    description: 'Container registry API for pulling, tagging, and publishing images used by agent execution sandboxes.',
    actionsCount: 16,
    icon: 'docker',
    website: 'https://hub.docker.com',
    actions: [
      {
        name: 'get_image_tags',
        description: 'List available tags for a container image repository.',
        method: 'GET',
        parameters: [
          { name: 'repository', type: 'string', required: true, desc: 'Image repository name' }
        ]
      }
    ]
  },
  {
    id: 'privy',
    name: 'Privy',
    category: 'Security & Identity',
    description: 'Embedded wallet and authentication infrastructure for issuing agent-controlled keys with policy guardrails.',
    actionsCount: 24,
    icon: 'privy',
    website: 'https://privy.io',
    docs: 'https://docs.privy.io',
    actions: [
      {
        name: 'create_wallet',
        description: 'Provision a new embedded wallet scoped to an agent or end user.',
        method: 'POST',
        parameters: [
          { name: 'userId', type: 'string', required: true, desc: 'Owner user identifier' },
          { name: 'chainType', type: 'string', required: true, desc: 'e.g. solana or ethereum' }
        ]
      }
    ]
  },
  {
    id: 'turnkey',
    name: 'Turnkey',
    category: 'Security & Identity',
    description: 'Secure, policy-driven key management infrastructure for signing transactions on behalf of AI agents.',
    actionsCount: 19,
    icon: 'turnkey',
    website: 'https://turnkey.com',
    actions: [
      {
        name: 'sign_transaction',
        description: 'Request a policy-checked signature for a raw transaction payload.',
        method: 'POST',
        parameters: [
          { name: 'walletId', type: 'string', required: true, desc: 'Signing wallet ID' },
          { name: 'unsignedTransaction', type: 'string', required: true, desc: 'Serialized transaction' }
        ]
      }
    ]
  },
  {
    id: 'civic-pass',
    name: 'Civic Pass',
    category: 'Security & Identity',
    description: 'On-chain identity verification and gating layer for restricting agent actions to verified wallets.',
    actionsCount: 11,
    icon: 'civic',
    website: 'https://www.civic.com',
    actions: [
      {
        name: 'verify_gateway_token',
        description: 'Check whether a wallet holds a valid Civic gateway token for a given gatekeeper network.',
        method: 'GET',
        parameters: [
          { name: 'wallet', type: 'string', required: true, desc: 'Wallet address to verify' },
          { name: 'gatekeeperNetwork', type: 'string', required: true, desc: 'Gatekeeper network ID' }
        ]
      }
    ]
  },
  {
    id: 'firecrawl',
    name: 'Firecrawl',
    category: 'Web Scraping',
    description: 'Turn any website into clean, LLM-ready markdown or structured data with a single API call.',
    actionsCount: 22,
    icon: 'firecrawl',
    website: 'https://firecrawl.dev',
    actions: [
      {
        name: 'scrape_url',
        description: 'Fetch a URL and return clean markdown, HTML, or structured JSON extraction.',
        method: 'POST',
        parameters: [
          { name: 'url', type: 'string', required: true, desc: 'Target page URL' },
          { name: 'formats', type: 'string[]', required: false, desc: 'Output formats, e.g. markdown' }
        ]
      }
    ]
  },
  {
    id: 'apify',
    name: 'Apify',
    category: 'Web Scraping',
    description: 'Cloud platform for running pre-built or custom web scraping and browser automation actors at scale.',
    actionsCount: 35,
    icon: 'apify',
    website: 'https://apify.com',
    actions: [
      {
        name: 'run_actor',
        description: 'Trigger an Apify actor run with custom input and wait for dataset results.',
        method: 'POST',
        parameters: [
          { name: 'actorId', type: 'string', required: true, desc: 'Actor identifier' },
          { name: 'input', type: 'object', required: true, desc: 'Actor run input JSON' }
        ]
      }
    ]
  },
  {
    id: 'brightdata',
    name: 'Bright Data',
    category: 'Web Scraping',
    description: 'Enterprise-grade proxy network and scraping infrastructure for reliable large-scale data collection.',
    actionsCount: 29,
    icon: 'brightdata',
    website: 'https://brightdata.com',
    actions: [
      {
        name: 'fetch_via_proxy',
        description: 'Route a request through a rotating residential or datacenter proxy pool.',
        method: 'GET',
        parameters: [
          { name: 'url', type: 'string', required: true, desc: 'Target URL' },
          { name: 'zone', type: 'string', required: true, desc: 'Proxy zone name' }
        ]
      }
    ]
  },
  {
    id: 'browserbase',
    name: 'Browserbase',
    category: 'Web Scraping',
    description: 'Headless browser infrastructure for AI agents to navigate, click, and extract data from live web pages.',
    actionsCount: 18,
    icon: 'browserbase',
    website: 'https://browserbase.com',
    actions: [
      {
        name: 'create_session',
        description: 'Spin up a remote headless browser session an agent can control step by step.',
        method: 'POST',
        parameters: [
          { name: 'projectId', type: 'string', required: true, desc: 'Browserbase project ID' }
        ]
      }
    ]
  },
  {
    id: 'attio',
    name: 'Attio',
    category: 'CRM & Sales',
    description: 'Flexible, data-driven CRM API for syncing contacts, companies, and deal pipelines with agent workflows.',
    actionsCount: 33,
    icon: 'attio',
    website: 'https://attio.com',
    actions: [
      {
        name: 'create_record',
        description: 'Create a new record (person, company, or deal) in an Attio object.',
        method: 'POST',
        parameters: [
          { name: 'object', type: 'string', required: true, desc: 'Target object slug' },
          { name: 'values', type: 'object', required: true, desc: 'Record field values' }
        ]
      }
    ]
  },
  {
    id: 'close-crm',
    name: 'Close',
    category: 'CRM & Sales',
    description: 'Inside-sales CRM with built-in calling, SMS, and email sequencing for agent-driven outreach.',
    actionsCount: 40,
    icon: 'close',
    website: 'https://close.com',
    actions: [
      {
        name: 'create_lead',
        description: 'Create a new lead with contact details and custom fields.',
        method: 'POST',
        parameters: [
          { name: 'name', type: 'string', required: true, desc: 'Lead / company name' },
          { name: 'contacts', type: 'array', required: false, desc: 'Associated contact objects' }
        ]
      }
    ]
  },
  {
    id: 'apollo-io',
    name: 'Apollo.io',
    category: 'CRM & Sales',
    description: 'B2B contact database and sales engagement platform for prospecting and enrichment at scale.',
    actionsCount: 27,
    icon: 'apollo',
    website: 'https://apollo.io',
    actions: [
      {
        name: 'search_people',
        description: 'Search the Apollo B2B database for contacts matching title, company, or industry filters.',
        method: 'GET',
        parameters: [
          { name: 'jobTitle', type: 'string', required: false, desc: 'Filter by job title' },
          { name: 'organizationDomain', type: 'string', required: false, desc: 'Filter by company domain' }
        ]
      }
    ]
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    category: 'CRM & Sales',
    description: 'All-in-one CRM, marketing, and service platform with a broad public API for contacts and pipelines.',
    actionsCount: 88,
    icon: 'hubspot',
    website: 'https://hubspot.com',
    docs: 'https://developers.hubspot.com',
    actions: [
      {
        name: 'create_contact',
        description: 'Create a new contact record with properties like email, name, and lifecycle stage.',
        method: 'POST',
        parameters: [
          { name: 'properties', type: 'object', required: true, desc: 'Contact property map' }
        ]
      }
    ]
  },
  {
    id: 'datadog',
    name: 'Datadog',
    category: 'Analytics & Monitoring',
    description: 'Unified observability platform for metrics, logs, and traces across an agent’s entire infrastructure.',
    actionsCount: 64,
    icon: 'datadog',
    website: 'https://www.datadoghq.com',
    docs: 'https://docs.datadoghq.com',
    actions: [
      {
        name: 'submit_metric',
        description: 'Submit a custom timeseries metric point to Datadog for monitoring agent performance.',
        method: 'POST',
        parameters: [
          { name: 'metric', type: 'string', required: true, desc: 'Metric name' },
          { name: 'points', type: 'array', required: true, desc: 'Timestamp/value pairs' }
        ]
      }
    ]
  },
  {
    id: 'posthog',
    name: 'PostHog',
    category: 'Analytics & Monitoring',
    description: 'Open-source product analytics with event tracking, session replay, and feature flags in one API.',
    actionsCount: 30,
    icon: 'posthog',
    website: 'https://posthog.com',
    github: 'https://github.com/PostHog/posthog',
    actions: [
      {
        name: 'capture_event',
        description: 'Record a custom analytics event with associated properties for a user or agent session.',
        method: 'POST',
        parameters: [
          { name: 'event', type: 'string', required: true, desc: 'Event name' },
          { name: 'distinct_id', type: 'string', required: true, desc: 'User or session identifier' }
        ]
      }
    ]
  },
  {
    id: 'mixpanel',
    name: 'Mixpanel',
    category: 'Analytics & Monitoring',
    description: 'Product analytics platform for tracking user and agent behavior funnels, retention, and cohorts.',
    actionsCount: 24,
    icon: 'mixpanel',
    website: 'https://mixpanel.com',
    actions: [
      {
        name: 'track_event',
        description: 'Send an analytics event with custom properties to a Mixpanel project.',
        method: 'POST',
        parameters: [
          { name: 'event', type: 'string', required: true, desc: 'Event name' },
          { name: 'properties', type: 'object', required: true, desc: 'Event properties' }
        ]
      }
    ]
  },
  {
    id: 'grafana',
    name: 'Grafana',
    category: 'Analytics & Monitoring',
    description: 'Open-source dashboarding and alerting platform for visualizing agent metrics and infrastructure health.',
    actionsCount: 21,
    icon: 'grafana',
    website: 'https://grafana.com',
    github: 'https://github.com/grafana/grafana',
    actions: [
      {
        name: 'query_datasource',
        description: 'Run a query against a configured Grafana data source and return time-series results.',
        method: 'POST',
        parameters: [
          { name: 'datasourceUid', type: 'string', required: true, desc: 'Data source identifier' },
          { name: 'query', type: 'object', required: true, desc: 'Query definition' }
        ]
      }
    ]
  },
  {
    id: 'docraptor',
    name: 'DocRaptor',
    category: 'File & Documents',
    description: 'HTML-to-PDF and Excel generation API for turning agent output into polished downloadable documents.',
    actionsCount: 13,
    icon: 'docraptor',
    website: 'https://docraptor.com',
    actions: [
      {
        name: 'create_pdf',
        description: 'Convert HTML content into a formatted PDF document.',
        method: 'POST',
        parameters: [
          { name: 'document_content', type: 'string', required: true, desc: 'HTML content to render' }
        ]
      }
    ]
  },
  {
    id: 'cloudconvert',
    name: 'CloudConvert',
    category: 'File & Documents',
    description: 'Universal file conversion API supporting 200+ formats including documents, audio, video, and images.',
    actionsCount: 45,
    icon: 'cloudconvert',
    website: 'https://cloudconvert.com',
    docs: 'https://cloudconvert.com/api/v2',
    actions: [
      {
        name: 'create_job',
        description: 'Create a conversion job with import, convert, and export task chains.',
        method: 'POST',
        parameters: [
          { name: 'tasks', type: 'object', required: true, desc: 'Task graph defining the conversion pipeline' }
        ]
      }
    ]
  },
  {
    id: 'carbone',
    name: 'Carbone',
    category: 'File & Documents',
    description: 'Template-based document generation engine producing PDF, DOCX, and XLSX from JSON data.',
    actionsCount: 17,
    icon: 'carbone',
    website: 'https://carbone.io',
    actions: [
      {
        name: 'render_report',
        description: 'Render a document template with a JSON data payload into the requested output format.',
        method: 'POST',
        parameters: [
          { name: 'templateId', type: 'string', required: true, desc: 'Uploaded template identifier' },
          { name: 'data', type: 'object', required: true, desc: 'Data to inject into template' }
        ]
      }
    ]
  },
  {
    id: 'pdfco',
    name: 'PDF.co',
    category: 'File & Documents',
    description: 'PDF manipulation API for parsing, merging, splitting, and extracting structured data from documents.',
    actionsCount: 38,
    icon: 'pdfco',
    website: 'https://pdf.co',
    actions: [
      {
        name: 'extract_text',
        description: 'Extract raw or structured text content from a PDF document by URL.',
        method: 'POST',
        parameters: [
          { name: 'url', type: 'string', required: true, desc: 'Source PDF URL' }
        ]
      }
    ]
  },
  {
    id: 'algolia',
    name: 'Algolia',
    category: 'Search & Indexing',
    description: 'Hosted search-as-a-service delivering typo-tolerant, sub-50ms full-text and faceted search.',
    actionsCount: 52,
    icon: 'algolia',
    website: 'https://algolia.com',
    docs: 'https://www.algolia.com/doc',
    actions: [
      {
        name: 'search_index',
        description: 'Query an Algolia index with full-text search, filters, and facets.',
        method: 'POST',
        parameters: [
          { name: 'indexName', type: 'string', required: true, desc: 'Target index name' },
          { name: 'query', type: 'string', required: true, desc: 'Search query text' }
        ]
      }
    ]
  },
  {
    id: 'elasticsearch',
    name: 'Elasticsearch',
    category: 'Search & Indexing',
    description: 'Distributed search and analytics engine powering full-text, vector, and log search at scale.',
    actionsCount: 67,
    icon: 'elasticsearch',
    website: 'https://www.elastic.co',
    github: 'https://github.com/elastic/elasticsearch',
    actions: [
      {
        name: 'search',
        description: 'Execute a query DSL search against an Elasticsearch index.',
        method: 'POST',
        parameters: [
          { name: 'index', type: 'string', required: true, desc: 'Target index name' },
          { name: 'query', type: 'object', required: true, desc: 'Elasticsearch query DSL body' }
        ]
      }
    ]
  },
  {
    id: 'exa-search',
    name: 'Exa',
    category: 'Search & Indexing',
    description: 'Neural search engine built for AI agents, returning semantically relevant web results and content.',
    actionsCount: 15,
    icon: 'exa',
    website: 'https://exa.ai',
    docs: 'https://docs.exa.ai',
    actions: [
      {
        name: 'search',
        description: 'Run a neural or keyword search across the web and return ranked results with content.',
        method: 'POST',
        parameters: [
          { name: 'query', type: 'string', required: true, desc: 'Search query' },
          { name: 'numResults', type: 'number', required: false, desc: 'Number of results to return' }
        ]
      }
    ]
  },
  {
    id: 'typesense',
    name: 'Typesense',
    category: 'Search & Indexing',
    description: 'Open-source, typo-tolerant search engine optimized for instant search-as-you-type experiences.',
    actionsCount: 20,
    icon: 'typesense',
    website: 'https://typesense.org',
    github: 'https://github.com/typesense/typesense',
    actions: [
      {
        name: 'search_collection',
        description: 'Search a Typesense collection with typo tolerance and faceted filtering.',
        method: 'GET',
        parameters: [
          { name: 'collection', type: 'string', required: true, desc: 'Collection name' },
          { name: 'q', type: 'string', required: true, desc: 'Search query text' }
        ]
      }
    ]
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    category: 'Cloud & Infrastructure',
    description: 'Global edge network API for DNS, CDN, Workers serverless compute, and R2 object storage.',
    actionsCount: 78,
    icon: 'cloudflare',
    website: 'https://cloudflare.com',
    docs: 'https://developers.cloudflare.com',
    actions: [
      {
        name: 'deploy_worker',
        description: 'Deploy a serverless Worker script to Cloudflare’s edge network.',
        method: 'POST',
        parameters: [
          { name: 'scriptName', type: 'string', required: true, desc: 'Worker script name' },
          { name: 'script', type: 'string', required: true, desc: 'Worker JavaScript source' }
        ]
      }
    ]
  },
  {
    id: 'aws-s3',
    name: 'AWS S3',
    category: 'Cloud & Infrastructure',
    description: 'Durable object storage service for agent-generated files, datasets, and model artifacts.',
    actionsCount: 55,
    icon: 'aws',
    website: 'https://aws.amazon.com/s3',
    actions: [
      {
        name: 'put_object',
        description: 'Upload a file object to an S3 bucket with a specified key.',
        method: 'POST',
        parameters: [
          { name: 'bucket', type: 'string', required: true, desc: 'Target bucket name' },
          { name: 'key', type: 'string', required: true, desc: 'Object key/path' }
        ]
      }
    ]
  },
  {
    id: 'fly-io',
    name: 'Fly.io',
    category: 'Cloud & Infrastructure',
    description: 'Global application deployment platform for running agent workloads close to users on physical servers.',
    actionsCount: 25,
    icon: 'flyio',
    website: 'https://fly.io',
    actions: [
      {
        name: 'deploy_app',
        description: 'Deploy a new release of an application to Fly.io’s edge regions.',
        method: 'POST',
        parameters: [
          { name: 'appName', type: 'string', required: true, desc: 'Fly application name' },
          { name: 'image', type: 'string', required: true, desc: 'Container image reference' }
        ]
      }
    ]
  },
  {
    id: 'railway',
    name: 'Railway',
    category: 'Cloud & Infrastructure',
    description: 'Instant deployment platform for provisioning databases, services, and agent backends from Git.',
    actionsCount: 19,
    icon: 'railway',
    website: 'https://railway.app',
    actions: [
      {
        name: 'trigger_deployment',
        description: 'Trigger a new deployment for a service from its latest Git commit.',
        method: 'POST',
        parameters: [
          { name: 'serviceId', type: 'string', required: true, desc: 'Target service ID' }
        ]
      }
    ]
  }
];
