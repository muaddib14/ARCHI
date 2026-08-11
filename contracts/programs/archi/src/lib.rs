use anchor_lang::prelude::*;

declare_id!("ARCHiN8u9v8vXx3hXXZjWCb3qFQQn7R7zKaZDRFE94Q");

#[program]
pub mod archi {
    use super::*;

    pub fn create_agent(
        ctx: Context<CreateAgent>,
        name: String,
        description: String,
        owner: Pubkey,
    ) -> Result<()> {
        let agent = &mut ctx.accounts.agent;
        agent.id = ctx.accounts.agent.key();
        agent.owner = owner;
        agent.name = name;
        agent.description = description;
        agent.created_at = Clock::get()?.unix_timestamp;
        agent.is_active = true;
        agent.bump = ctx.bumps.agent;

        emit!(AgentCreated {
            id: agent.id,
            owner,
            name: agent.name.clone(),
            created_at: agent.created_at,
        });

        Ok(())
    }

    pub fn verify_agent(ctx: Context<VerifyAgent>) -> Result<()> {
        let agent = &ctx.accounts.agent;
        require_eq!(agent.owner, ctx.accounts.owner.key(), AgentError::Unauthorized);
        require!(agent.is_active, AgentError::AgentInactive);

        emit!(AgentVerified {
            id: agent.id,
            owner: agent.owner,
            verified_at: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    pub fn deactivate_agent(ctx: Context<DeactivateAgent>) -> Result<()> {
        let agent = &mut ctx.accounts.agent;
        require_eq!(agent.owner, ctx.accounts.owner.key(), AgentError::Unauthorized);

        agent.is_active = false;

        emit!(AgentDeactivated {
            id: agent.id,
            deactivated_at: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreateAgent<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + 32 + 32 + 200 + 200 + 8 + 1 + 1,
        seeds = [b"agent", payer.key().as_ref(), name.as_bytes()],
        bump
    )]
    pub agent: Account<'info, Agent>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct VerifyAgent<'info> {
    #[account(mut)]
    pub agent: Account<'info, Agent>,

    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct DeactivateAgent<'info> {
    #[account(mut)]
    pub agent: Account<'info, Agent>,

    pub owner: Signer<'info>,
}

#[account]
pub struct Agent {
    pub id: Pubkey,
    pub owner: Pubkey,
    pub name: String,
    pub description: String,
    pub created_at: i64,
    pub is_active: bool,
    pub bump: u8,
}

#[event]
pub struct AgentCreated {
    pub id: Pubkey,
    pub owner: Pubkey,
    pub name: String,
    pub created_at: i64,
}

#[event]
pub struct AgentVerified {
    pub id: Pubkey,
    pub owner: Pubkey,
    pub verified_at: i64,
}

#[event]
pub struct AgentDeactivated {
    pub id: Pubkey,
    pub deactivated_at: i64,
}

#[error_code]
pub enum AgentError {
    #[msg("Unauthorized: Only agent owner can perform this action")]
    Unauthorized,

    #[msg("Agent is not active")]
    AgentInactive,

    #[msg("Invalid agent ID")]
    InvalidAgentId,
}
