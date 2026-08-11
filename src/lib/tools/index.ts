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

export async function executeTool(name: string, input: any): Promise<any> {
  switch (name) {
    case 'solana_swap':
      return {
        success: true,
        data: {
          txSignature: 'mock_signature_' + Date.now(),
          inputAmount: input.amount,
          message: `Queued swap: ${input.amount} from ${input.inputMint} to ${input.outputMint}`
        }
      };
    case 'mint_nft':
      return {
        success: true,
        data: {
          mintAddress: 'mock_mint_' + Date.now(),
          name: input.name,
          symbol: input.symbol,
          message: `Minted NFT: ${input.name}`
        }
      };
    case 'query_pgvector':
      return {
        success: true,
        data: {
          results: [
            { text: 'Related document 1', score: 0.95 },
            { text: 'Related document 2', score: 0.87 }
          ],
          query: input.query
        }
      };
    case 'pyth_price_feed':
      return {
        success: true,
        data: {
          price: (Math.random() * 100).toFixed(2),
          timestamp: Date.now(),
          priceFeedId: input.priceFeedId
        }
      };
    default:
      return {
        success: false,
        error: `Unknown tool: ${name}`
      };
  }
}
