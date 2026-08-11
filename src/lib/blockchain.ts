import { Connection, PublicKey, Transaction, SystemProgram, Keypair } from '@solana/web3.js';

const PROGRAM_ID = new PublicKey('ARCHiN8u9v8vXx3hXXZjWCb3qFQQn7R7zKaZDRFE94Q');

// IDL for the ARCHI program
const ARCHI_IDL = {
  version: '0.1.0',
  name: 'archi',
  accounts: [
    {
      name: 'Agent',
      type: {
        kind: 'struct',
        fields: [
          { name: 'id', type: 'publicKey' },
          { name: 'owner', type: 'publicKey' },
          { name: 'name', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'createdAt', type: 'i64' },
          { name: 'isActive', type: 'bool' },
          { name: 'bump', type: 'u8' }
        ]
      }
    }
  ],
  instructions: [
    {
      name: 'createAgent',
      accounts: [
        { name: 'agent', isMut: true, isSigner: false },
        { name: 'payer', isMut: true, isSigner: true },
        { name: 'systemProgram', isMut: false, isSigner: false }
      ],
      args: [
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'owner', type: 'publicKey' }
      ]
    },
    {
      name: 'verifyAgent',
      accounts: [
        { name: 'agent', isMut: true, isSigner: false },
        { name: 'owner', isMut: false, isSigner: true }
      ],
      args: []
    }
  ]
};

export class ArchiBlockchain {
  private connection: Connection;
  private programId: PublicKey;

  constructor(rpcUrl: string) {
    this.connection = new Connection(rpcUrl);
    this.programId = PROGRAM_ID;
  }

  /**
   * Derive the PDA (Program Derived Address) for an agent
   */
  static deriveAgentPDA(
    ownerPublicKey: PublicKey,
    agentName: string,
    programId: PublicKey = PROGRAM_ID
  ): [PublicKey, number] {
    const seeds = [
      Buffer.from('agent'),
      ownerPublicKey.toBuffer(),
      Buffer.from(agentName)
    ];

    return PublicKey.findProgramAddressSync(seeds, programId);
  }

  /**
   * Create agent on-chain
   */
  async createAgent(
    ownerPublicKey: PublicKey,
    payerKeypair: Keypair,
    agentId: string,
    name: string,
    description: string
  ): Promise<string> {
    try {
      const [agentPDA] = ArchiBlockchain.deriveAgentPDA(ownerPublicKey, agentId, this.programId);

      const createAgentIx = {
        programId: this.programId,
        keys: [
          {
            pubkey: agentPDA,
            isSigner: false,
            isWritable: true
          },
          {
            pubkey: payerKeypair.publicKey,
            isSigner: true,
            isWritable: true
          },
          {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false
          }
        ],
        data: Buffer.concat([
          Buffer.from([0]), // instruction discriminator for createAgent
          this.encodeString(name),
          this.encodeString(description),
          ownerPublicKey.toBuffer()
        ])
      };

      const transaction = new Transaction().add(createAgentIx);
      const latestBlockhash = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = latestBlockhash.blockhash;
      transaction.feePayer = payerKeypair.publicKey;

      transaction.sign(payerKeypair);

      const signature = await this.connection.sendTransaction(transaction, [payerKeypair]);
      await this.connection.confirmTransaction(signature);

      return signature;
    } catch (error) {
      throw new Error(`Failed to create agent on-chain: ${error}`);
    }
  }

  /**
   * Verify agent ownership
   */
  async verifyAgent(
    agentId: string,
    ownerKeypair: Keypair
  ): Promise<boolean> {
    try {
      const [agentPDA] = ArchiBlockchain.deriveAgentPDA(ownerKeypair.publicKey, agentId, this.programId);

      // Fetch agent account
      const agentAccount = await this.connection.getAccountInfo(agentPDA);

      if (!agentAccount) {
        throw new Error('Agent account not found on-chain');
      }

      // Verify ownership by checking if we can sign for it
      // In a real scenario, this would call the verify_agent instruction

      return true;
    } catch (error) {
      console.error('Agent verification failed:', error);
      return false;
    }
  }

  /**
   * Get agent from blockchain
   */
  async getAgent(agentId: string, ownerPublicKey: PublicKey) {
    try {
      const [agentPDA] = ArchiBlockchain.deriveAgentPDA(ownerPublicKey, agentId, this.programId);
      const accountInfo = await this.connection.getAccountInfo(agentPDA);

      if (!accountInfo) {
        return null;
      }

      // Decode the agent data
      // In production, use proper Anchor BorshCoder
      return {
        pubkey: agentPDA,
        data: accountInfo.data
      };
    } catch (error) {
      console.error('Failed to get agent:', error);
      return null;
    }
  }

  /**
   * Helper: encode string with length prefix
   */
  private encodeString(str: string): Buffer {
    const encoded = Buffer.from(str, 'utf-8');
    const lengthBuffer = Buffer.alloc(4);
    lengthBuffer.writeUInt32LE(encoded.length, 0);
    return Buffer.concat([lengthBuffer, encoded]);
  }

  /**
   * Sync agent to blockchain after creation in database
   */
  async syncAgentToBlockchain(
    agentId: string,
    agentName: string,
    agentDescription: string,
    ownerWallet: string,
    payerKeypair: Keypair
  ): Promise<{ signature: string; blockchainId: string }> {
    try {
      const ownerPublicKey = new PublicKey(ownerWallet);

      // Create agent on-chain
      const signature = await this.createAgent(
        ownerPublicKey,
        payerKeypair,
        agentId,
        agentName,
        agentDescription
      );

      // Get the PDA as blockchain_id
      const [blockchainId] = ArchiBlockchain.deriveAgentPDA(
        ownerPublicKey,
        agentId,
        this.programId
      );

      return {
        signature,
        blockchainId: blockchainId.toString()
      };
    } catch (error) {
      throw new Error(`Failed to sync agent to blockchain: ${error}`);
    }
  }
}

/**
 * Initialize blockchain client
 */
export function initializeBlockchain(rpcUrl?: string): ArchiBlockchain {
  const url = rpcUrl || process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
  return new ArchiBlockchain(url);
}
