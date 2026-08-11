export function getToolDefinitions() {
  return [
    {
      name: 'solana_swap',
      description: 'Swap tokens on Solana via Jupiter aggregator',
      input_schema: {
        type: 'object',
        properties: {
          inputMint: { type: 'string' },
          outputMint: { type: 'string' },
          amount: { type: 'number' }
        }
      }
    },
    {
      name: 'mint_nft',
      description: 'Mint NFT with Metaplex metadata on Solana',
      input_schema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          symbol: { type: 'string' }
        }
      }
    },
    {
      name: 'query_pgvector',
      description: 'Query vector database embeddings with RAG',
      input_schema: {
        type: 'object',
        properties: {
          query: { type: 'string' }
        }
      }
    },
    {
      name: 'pyth_price_feed',
      description: 'Fetch real-time Pyth price feeds',
      input_schema: {
        type: 'object',
        properties: {
          priceFeedId: { type: 'string' }
        }
      }
    }
  ];
}

export const AVAILABLE_TOOLS = getToolDefinitions();
