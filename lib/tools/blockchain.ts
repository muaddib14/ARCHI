import { ToolDefinition, ToolResult } from '../types';

export const blockchainTool = {
  name: 'blockchain_call',
  definition: {
    name: 'blockchain_call',
    description: 'Interact with Solana blockchain (transfer SOL, check balance, etc)',
    input_schema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['get_balance', 'transfer_sol', 'call_program', 'get_account'],
          description: 'Action to perform',
        },
        wallet: {
          type: 'string',
          description: 'Solana wallet address',
        },
        amount: {
          type: 'number',
          description: 'Amount in SOL (for transfer)',
        },
        recipient: {
          type: 'string',
          description: 'Recipient wallet (for transfer)',
        },
        program: {
          type: 'string',
          description: 'Program ID (for contract calls)',
        },
        instruction: {
          type: 'object',
          description: 'Instruction data (for contract calls)',
        },
      },
      required: ['action', 'wallet'],
    },
  } as ToolDefinition,

  handler: async (input: {
    action: string;
    wallet: string;
    amount?: number;
    recipient?: string;
    program?: string;
    instruction?: Record<string, any>;
  }): Promise<ToolResult> => {
    try {
      // Placeholder: integrate with @solana/web3.js
      if (!input.wallet.match(/^[1-9A-HJ-NP-Z]{32,44}$/)) {
        return {
          success: false,
          error: 'Invalid Solana wallet address',
        };
      }

      switch (input.action) {
        case 'get_balance':
          return {
            success: true,
            data: {
              wallet: input.wallet,
              balance: 5.5,
              balanceLamports: 5500000000,
            },
          };

        case 'transfer_sol':
          if (!input.recipient || !input.amount) {
            return {
              success: false,
              error: 'recipient and amount required for transfer',
            };
          }
          return {
            success: true,
            data: {
              signature: `sig_${Date.now()}`,
              from: input.wallet,
              to: input.recipient,
              amount: input.amount,
              status: 'pending',
            },
          };

        case 'call_program':
          if (!input.program) {
            return {
              success: false,
              error: 'program ID required',
            };
          }
          return {
            success: true,
            data: {
              program: input.program,
              signature: `sig_${Date.now()}`,
              status: 'pending',
            },
          };

        default:
          return {
            success: false,
            error: 'Unknown action',
          };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Blockchain call failed',
      };
    }
  },
};
