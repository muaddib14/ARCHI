'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { KNOWLEDGE_ITEMS, CATEGORIES } from '@/data/knowledgeData';

interface MockupRow {
  title: string;
  meta: string;
  status: 'active' | 'idle';
  avatar: 1 | 2 | 3 | 4;
}

interface AgentTab {
  id: string;
  label: string;
  headerTitle: string;
  glowColor: string;
  rows: MockupRow[];
}

const AGENT_TABS: AgentTab[] = [
  {
    id: 'trading',
    label: 'Trading Sentinel',
    headerTitle: 'Trading & Execution',
    glowColor: '#7c71e8',
    rows: [
      { title: 'Trading Sentinel', meta: 'claude-3-sonnet / Last run 2m ago / 847 interactions', status: 'active', avatar: 1 },
      { title: 'SOL/USDC Arbitrage', meta: 'Jupiter route / executed 90s ago / +0.42% spread', status: 'active', avatar: 3 },
      { title: 'Price Feed Monitor', meta: 'Pyth oracle / streaming / 12,204 ticks today', status: 'active', avatar: 4 },
    ],
  },
  {
    id: 'data',
    label: 'Data Harvester',
    headerTitle: 'Data & Retrieval',
    glowColor: '#22d3ee',
    rows: [
      { title: 'Data Harvester', meta: 'gpt-4-turbo / Last run 18m ago / 1,204 interactions', status: 'active', avatar: 2 },
      { title: 'Vector Index Sync', meta: 'pgvector / 4,880 embeddings indexed', status: 'active', avatar: 4 },
      { title: 'RAG Query Cache', meta: 'knowledge base / 92% hit rate', status: 'idle', avatar: 1 },
    ],
  },
  {
    id: 'auditor',
    label: 'Contract Auditor',
    headerTitle: 'Security & Audits',
    glowColor: '#f59e0b',
    rows: [
      { title: 'Contract Auditor', meta: 'claude-3-opus / Last run 1h ago / 312 interactions', status: 'idle', avatar: 3 },
      { title: 'Anchor Program Scan', meta: 'lib.rs / 3 findings / 0 critical', status: 'active', avatar: 1 },
      { title: 'Audit Log Writer', meta: 'on-chain / 312 entries committed', status: 'active', avatar: 4 },
    ],
  },
];

const EASE_OUT_EXPRESSIVE = [0.22, 1, 0.36, 1] as const;

interface MegaMenuItem {
  label: string;
  desc?: string;
  href: string;
}

interface MegaMenuColumn {
  title: string;
  items: MegaMenuItem[];
}

interface MegaMenuDef {
  align: 'left' | 'center' | 'right';
  columns: MegaMenuColumn[];
}

const MEGA_MENUS: Record<string, MegaMenuDef> = {
  why: {
    align: 'left',
    columns: [
      {
        title: 'Why ARCHI',
        items: [
          { label: 'You Own Your Agents', desc: 'Full control, no vendor lock-in', href: '#why' },
          { label: 'Every Action Auditable', desc: 'On-chain logs, nothing hidden', href: '#why' },
          { label: 'On Solana', desc: 'Sub-second finality, low fees', href: '#why' },
        ],
      },
    ],
  },
  knowledge: {
    align: 'center',
    columns: [
      {
        title: 'Popular Integrations',
        items: [
          { label: 'Solana Agent Kit', href: '/knowledge/solana-agent-kit' },
          { label: 'Anchor Lang', href: '/knowledge/anchor-lang' },
          { label: 'OpenAI', href: '/knowledge/openai' },
        ],
      },
      {
        title: 'Resources',
        items: [
          { label: 'Browse full directory', href: '/knowledge' },
          { label: 'Request a platform', href: '/knowledge#request' },
        ],
      },
    ],
  },
  compare: {
    align: 'center',
    columns: [
      {
        title: 'ARCHI vs Centralized',
        items: [
          { label: 'Ownership', desc: 'You own your agent, not rented', href: '#compare' },
          { label: 'Transparency', desc: 'On-chain audit trail', href: '#compare' },
          { label: 'Cost Model', desc: 'One-time mint + gas', href: '#compare' },
        ],
      },
    ],
  },
  tech: {
    align: 'right',
    columns: [
      {
        title: 'Stack',
        items: [
          { label: 'Next.js', desc: 'App Router + TypeScript', href: '#tech' },
          { label: 'Rust + Anchor', desc: 'Solana smart contracts', href: '#tech' },
          { label: 'PostgreSQL', desc: 'Supabase + pgvector', href: '#tech' },
          { label: 'Solana', desc: 'On-chain execution & audit', href: '#tech' },
        ],
      },
    ],
  },
};

const NAV_ITEMS: { id: string; label: string; href: string; highlight?: boolean }[] = [
  { id: 'why', label: 'Why ARCHI', href: '#why' },
  { id: 'knowledge', label: 'Knowledge', href: '/knowledge', highlight: true },
  { id: 'compare', label: 'Compare', href: '#compare' },
  { id: 'tech', label: 'Tech', href: '#tech' },
];

const HOW_IT_WORKS_STEPS = [
  {
    title: 'Connect Wallet',
    desc: 'Authenticate with Phantom. No email, no password — your wallet is your identity.',
  },
  {
    title: 'Configure Agent',
    desc: 'Name it, write a system prompt, pick tools. Deployed to the on-chain registry in seconds.',
  },
  {
    title: 'Execute & Monitor',
    desc: 'Run queries through the execution console. Every response and tool call logged live.',
  },
  {
    title: 'Audit Anytime',
    desc: 'Full interaction history and audit trail — nothing hidden, nothing editable after the fact.',
  },
];

const SHOWCASE_CATEGORIES = [
  'Solana & Web3',
  'AI Models',
  'Web Scraping',
  'CRM & Sales',
  'Cloud & Infrastructure',
  'Security & Identity',
];

const FAQ_ITEMS = [
  {
    q: 'Which AI models does ARCHI use?',
    a: 'ARCHI routes through OpenRouter with automatic fallback across 7 free-tier models (Nemotron, Gemma, and more) — so a single model outage never takes your agent down. Bring your own OpenRouter key to unlock paid models like GPT-4 or Claude.',
  },
  {
    q: 'Do I need my own API key?',
    a: 'You need an OpenRouter API key and a Solana wallet (Phantom). No separate Anthropic or OpenAI account required — OpenRouter handles routing to whichever model you configure.',
  },
  {
    q: 'Which blockchain does ARCHI run on?',
    a: 'Solana. Agent metadata and interaction history are designed around an on-chain registry and a Postgres audit log, so every action stays traceable.',
  },
  {
    q: 'Is agent activity really auditable?',
    a: 'Every query, tool call, and response is logged with a timestamp and execution time in the interaction history — visible on your agent’s detail page, not hidden behind a vendor dashboard.',
  },
  {
    q: 'Can I add my own tools?',
    a: 'Yes. ARCHI ships with a tool registry (Solana swaps, NFT minting, vector search, price feeds) plus a 72-integration knowledge directory you can wire into any agent’s system prompt.',
  },
];

function SectionDivider() {
  return (
    <div className="section-divider" aria-hidden="true">
      <span className="section-divider-line" />
      <span className="section-divider-icon">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" />
          <path d="M2 17L12 22L22 17" />
          <path d="M2 12L12 17L22 12" />
        </svg>
      </span>
      <span className="section-divider-line" />
    </div>
  );
}

const revealContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const revealItem = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE_OUT_EXPRESSIVE } },
};

export default function LandingClient() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const prefersReducedMotion = useReducedMotion();

  const handleBuildAgent = useCallback(() => {
    router.push('/agents');
  }, [router]);

  // --- T1 + T2: scroll-linked hero zoom + glow ---
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const rawHeadlineOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const rawHeadlineY = useTransform(scrollYProgress, [0, 0.5], [0, -40]);
  const rawMockupScale = useTransform(scrollYProgress, [0, 0.6], [0.9, 1.02]);
  const rawMockupY = useTransform(scrollYProgress, [0, 0.6], [30, 0]);

  const headlineOpacity = prefersReducedMotion ? 1 : rawHeadlineOpacity;
  const headlineY = prefersReducedMotion ? 0 : rawHeadlineY;
  const mockupScale = prefersReducedMotion ? 1 : rawMockupScale;
  const mockupY = prefersReducedMotion ? 0 : rawMockupY;

  // --- T3: agent tab switcher, auto-rotate every 4s, pause on interaction ---
  const [activeTab, setActiveTab] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (isHovering || prefersReducedMotion) return;
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % AGENT_TABS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isHovering, prefersReducedMotion]);

  const tab = AGENT_TABS[activeTab];

  // --- T6: mega-menu nav dropdown ---
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState(0);

  // --- T7: background gradient transition tied to whole-page scroll ---
  const { scrollYProgress: pageScrollProgress } = useScroll();
  const rawBgColor = useTransform(
    pageScrollProgress,
    [0, 0.06, 0.22, 1],
    ['#2e1065', '#4c1d95', '#f3e8ff', '#faf5ff']
  );
  const bgColor = prefersReducedMotion ? 'var(--canvas)' : rawBgColor;

  // --- Knowledge showcase: real counts + sample tools per category ---
  const totalTools = KNOWLEDGE_ITEMS.length;
  const totalCategories = CATEGORIES.length - 1; // exclude 'All'
  const showcaseCards = SHOWCASE_CATEGORIES.map((category) => {
    const items = KNOWLEDGE_ITEMS.filter((item) => item.category === category);
    return {
      category,
      count: items.length,
      sample: items.slice(0, 3).map((i) => i.name),
    };
  });

  return (
    <motion.main style={{ background: bgColor }}>
      {/* NAVIGATION */}
      <div className="nav-wrapper">
        <nav className="nav-capsule">
          <a href="#" className="nav-brand">
            <div className="nav-brand-icon">
              <img src="/logo.png" alt="ARCHI" />
            </div>
            <span className="nav-brand-text">ARCHI</span>
          </a>
          <div className="nav-links">
            {NAV_ITEMS.map((item) => {
              const menu = MEGA_MENUS[item.id];
              return (
                <div
                  key={item.id}
                  className="nav-item"
                  onMouseEnter={() => setOpenMenu(item.id)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <a
                    href={item.href}
                    className="nav-link"
                    style={item.highlight ? { color: 'var(--purple-main)', fontWeight: '800' } : undefined}
                  >
                    {item.label}
                  </a>
                  {menu && (
                    <div className="mega-menu-wrap" data-align={menu.align}>
                      <AnimatePresence>
                        {openMenu === item.id && (
                          <motion.div
                            className="mega-menu"
                            initial={{ opacity: 0, y: 8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.98 }}
                            transition={{ duration: 0.18, ease: EASE_OUT_EXPRESSIVE }}
                          >
                            {menu.columns.map((col) => (
                              <div className="mega-menu-col" key={col.title}>
                                <div className="mega-menu-col-title">{col.title}</div>
                                {col.items.map((mi) => (
                                  <a href={mi.href} className="mega-menu-item" key={mi.label}>
                                    <div className="mega-menu-item-label">{mi.label}</div>
                                    {mi.desc && <div className="mega-menu-item-desc">{mi.desc}</div>}
                                  </a>
                                ))}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <button className="nav-cta" onClick={handleBuildAgent}>
            Build Agent
          </button>
        </nav>
      </div>

      {/* HERO */}
      <section className="hero" ref={heroRef}>
        <span className="hero-eyebrow">
          <span className="hero-eyebrow-dot"></span>
          Agentic AI on Solana
        </span>
        <motion.h1 className="hero-headline" style={{ opacity: headlineOpacity, y: headlineY }}>
          Your AI Agents.<br />On Solana. <em>Own Them.</em>
        </motion.h1>
        <p className="hero-sub">
          Deploy autonomous AI agents with full ownership and transparency. No rent to OpenAI. No black boxes. Your infrastructure, on-chain.
        </p>
        <div className="hero-buttons">
          <button className="btn-hero-primary" onClick={handleBuildAgent}>
            Build Your Agent
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <a href="/knowledge" className="btn-hero-secondary">
            Knowledge Base →
          </a>
        </div>

        {/* Agent Tab Switcher */}
        <div
          className="hero-tabs"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {AGENT_TABS.map((t, i) => (
            <button
              key={t.id}
              className={`hero-tab ${i === activeTab ? 'active' : ''}`}
              style={{ position: 'relative' }}
              onClick={() => setActiveTab(i)}
            >
              {i === activeTab && (
                <motion.span
                  className="hero-tab-bg"
                  layoutId="hero-tab-bg"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span style={{ position: 'relative', zIndex: 1 }}>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Hero Mockup */}
        <motion.div className="hero-mockup" style={{ scale: mockupScale, y: mockupY }}>
          <div className="hero-glow" style={{ ['--glow-color' as string]: tab.glowColor }} />
          <div className="mockup-frame" style={{ position: 'relative', zIndex: 1 }}>
            <div className="mockup-bar">
              <span className="mockup-dot mockup-dot--r"></span>
              <span className="mockup-dot mockup-dot--y"></span>
              <span className="mockup-dot mockup-dot--g"></span>
              <span className="mockup-url">app.arc.fun/agents</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={tab.id}
                className="mockup-screen"
                initial={prefersReducedMotion ? undefined : { opacity: 0, filter: 'blur(6px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, filter: 'blur(6px)' }}
                transition={{ duration: 0.4, ease: EASE_OUT_EXPRESSIVE }}
              >
                <div className="mockup-sidebar">
                  <div className="mockup-sidebar-brand">ARCHI Dashboard</div>
                  <div className="mockup-sidebar-item active">Dashboard</div>
                  <div className="mockup-sidebar-item">Agent Registry</div>
                  <div className="mockup-sidebar-item">Agent Forge</div>
                  <div className="mockup-sidebar-item">Audit Logs</div>
                </div>
                <div className="mockup-main">
                  <div className="mockup-header">
                    <span className="mockup-header-title">{tab.headerTitle}</span>
                    <span className="mockup-header-btn">+ Deploy Agent</span>
                  </div>
                  {tab.rows.map((row) => (
                    <div className="mockup-row" key={row.title}>
                      <div className={`mockup-avatar mockup-avatar--${row.avatar}`}></div>
                      <div className="mockup-row-content">
                        <div className="mockup-row-title">{row.title}</div>
                        <div className="mockup-row-meta">{row.meta}</div>
                      </div>
                      <span className={`mockup-row-badge mockup-row-badge--${row.status}`}>
                        {row.status === 'active' ? 'Active' : 'Idle'}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Landscape Silhouette */}
        <div className="hero-landscape">
          <svg viewBox="0 0 1440 180" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 180V120C240 70 480 140 720 90C960 40 1200 110 1440 80V180H0Z" fill="rgba(30,27,75,0.25)" />
            <path d="M0 180V140C320 90 640 150 960 110C1120 90 1280 130 1440 100V180H0Z" fill="rgba(30,27,75,0.15)" />
          </svg>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="logos-section">
        <div className="logos-label">Built on proven infrastructure</div>
        <div className="marquee">
          <div className="marquee-track">
            <div className="logo-item">
              <span
                className="logo-item-mark"
                style={{ WebkitMaskImage: 'url(https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/solana.svg)', maskImage: 'url(https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/solana.svg)' }}
                aria-hidden="true"
              />
              <span>Solana</span>
            </div>
            <div className="logo-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="5" r="3" />
                <line x1="12" y1="22" x2="12" y2="8" />
                <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
              </svg>
              <span>Anchor</span>
            </div>
            <div className="logo-item">
              <span
                className="logo-item-mark"
                style={{ WebkitMaskImage: 'url(https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/supabase.svg)', maskImage: 'url(https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/supabase.svg)' }}
                aria-hidden="true"
              />
              <span>Supabase</span>
            </div>
            <div className="logo-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              <span>pgvector</span>
            </div>
            <div className="logo-item">
              <span
                className="logo-item-mark"
                style={{ WebkitMaskImage: 'url(https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/nextdotjs.svg)', maskImage: 'url(https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/nextdotjs.svg)' }}
                aria-hidden="true"
              />
              <span>Next.js</span>
            </div>

            {/* Duplicate */}
            <div className="logo-item">
              <span
                className="logo-item-mark"
                style={{ WebkitMaskImage: 'url(https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/solana.svg)', maskImage: 'url(https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/solana.svg)' }}
                aria-hidden="true"
              />
              <span>Solana</span>
            </div>
            <div className="logo-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="5" r="3" />
                <line x1="12" y1="22" x2="12" y2="8" />
                <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
              </svg>
              <span>Anchor</span>
            </div>
            <div className="logo-item">
              <span
                className="logo-item-mark"
                style={{ WebkitMaskImage: 'url(https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/supabase.svg)', maskImage: 'url(https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/supabase.svg)' }}
                aria-hidden="true"
              />
              <span>Supabase</span>
            </div>
            <div className="logo-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              <span>pgvector</span>
            </div>
            <div className="logo-item">
              <span
                className="logo-item-mark"
                style={{ WebkitMaskImage: 'url(https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/nextdotjs.svg)', maskImage: 'url(https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/nextdotjs.svg)' }}
                aria-hidden="true"
              />
              <span>Next.js</span>
            </div>
          </div>
        </div>
      </div>

      {/* BENEFITS */}
      <section className="section" id="why">
        <div className="section-centered">
          <span className="section-eyebrow">Why ARCHI</span>
          <h2 className="section-heading">Own your AI. Not rent it.</h2>
          <p className="section-desc">
            Unlike centralized AI services, your agents live on-chain. You control the code. You control the data. You own the tokens.
          </p>
        </div>

        <motion.div
          className="benefits-grid"
          variants={prefersReducedMotion ? undefined : revealContainer}
          initial={prefersReducedMotion ? undefined : 'hidden'}
          whileInView={prefersReducedMotion ? undefined : 'show'}
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div className="benefit-card" variants={prefersReducedMotion ? undefined : revealItem}>
            <div className="benefit-visual">
              <div className="benefit-badge-glow" />
              <div className="benefit-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="4" y="10" width="16" height="10" rx="2" />
                  <path d="M8 10V7a4 4 0 018 0v3" />
                </svg>
              </div>
            </div>
            <div className="benefit-title">You Own Your Agents</div>
            <p className="benefit-text">Deploy with full control. No vendor lock-in. Your agents, your rules — not rented from a centralized provider.</p>
          </motion.div>
          <motion.div className="benefit-card" variants={prefersReducedMotion ? undefined : revealItem}>
            <div className="benefit-visual">
              <div className="benefit-ledger">
                <div className="benefit-ledger-row" />
                <div className="benefit-ledger-row" />
                <div className="benefit-ledger-row" />
                <div className="benefit-ledger-row benefit-ledger-row--done">
                  <div className="benefit-ledger-seal">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M4 12l6 6L20 6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="benefit-title">Every Action Auditable</div>
            <p className="benefit-text">Every action is logged on-chain. No one — not even us — can hide or alter what your agent did. Nothing hidden.</p>
          </motion.div>
          <motion.div className="benefit-card" variants={prefersReducedMotion ? undefined : revealItem}>
            <div className="benefit-visual">
              <div className="benefit-gauge">
                <div className="benefit-gauge-arc" />
                <div className="benefit-gauge-mask" />
                {[0, 30, 60, 90, 120, 150, 180].map((deg) => (
                  <div key={deg} className="benefit-gauge-tick" style={{ transform: `translateX(-50%) rotate(${deg - 90}deg)` }} />
                ))}
                <div className="benefit-gauge-needle" />
                <div className="benefit-gauge-hub" />
              </div>
            </div>
            <div className="benefit-title">On Solana for Cost and Speed</div>
            <p className="benefit-text">Leverage Solana's sub-second finality and minimal gas fees. Production-grade performance without the heavy bill.</p>
          </motion.div>
        </motion.div>

        <motion.div
          className="model-card"
          variants={prefersReducedMotion ? undefined : revealItem}
          initial={prefersReducedMotion ? undefined : 'hidden'}
          whileInView={prefersReducedMotion ? undefined : 'show'}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="model-card-icons">
            <div className="model-card-icon">
              <span
                className="model-card-icon-mark"
                style={{ WebkitMaskImage: 'url(https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/openai.svg)', maskImage: 'url(https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/openai.svg)' }}
                aria-label="OpenAI GPT"
              />
            </div>
            <div className="model-card-icon">
              <span
                className="model-card-icon-mark"
                style={{ WebkitMaskImage: 'url(https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/anthropic.svg)', maskImage: 'url(https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/anthropic.svg)' }}
                aria-label="Anthropic Claude"
              />
            </div>
            <div className="model-card-icon model-card-icon--main">
              <img src="/logo.png" alt="ARCHI" />
            </div>
            <div className="model-card-icon">
              <span
                className="model-card-icon-mark"
                style={{ WebkitMaskImage: 'url(https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/googlegemini.svg)', maskImage: 'url(https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/googlegemini.svg)' }}
                aria-label="Google Gemini"
              />
            </div>
            <div className="model-card-icon">
              <span
                className="model-card-icon-mark"
                style={{ WebkitMaskImage: 'url(https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/meta.svg)', maskImage: 'url(https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/meta.svg)' }}
                aria-label="Meta Llama"
              />
            </div>
          </div>
          <div className="model-card-title">Bring Your Own Model</div>
          <p className="model-card-text">
            Your agent isn&apos;t locked to one AI provider. Route through Claude, GPT, Gemini, Llama, and more via OpenRouter — swap the model, keep the agent.
          </p>
        </motion.div>
      </section>

      <SectionDivider />

      {/* HOW IT WORKS */}
      <section className="section" id="how">
        <div className="section-centered">
          <span className="section-eyebrow">How It Works</span>
          <h2 className="section-heading">From wallet to deployed agent.</h2>
          <p className="section-desc">Four steps. No infrastructure to manage, no vendor to trust blindly.</p>
        </div>

        <motion.div
          className="steps-grid"
          variants={prefersReducedMotion ? undefined : revealContainer}
          initial={prefersReducedMotion ? undefined : 'hidden'}
          whileInView={prefersReducedMotion ? undefined : 'show'}
          viewport={{ once: true, amount: 0.3 }}
        >
          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <motion.div className="step-card" key={step.title} variants={prefersReducedMotion ? undefined : revealItem}>
              <div className="step-number">{i + 1}</div>
              <div className="step-title">{step.title}</div>
              <p className="step-desc">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* COMPARISON */}
      <section className="section section-centered" id="compare">
        <span className="section-eyebrow">Compare</span>
        <h2 className="section-heading">Why decentralized AI?</h2>
        <p className="section-desc">Centralized providers own your data and meter your usage. ARCHI puts you in control.</p>

        <motion.div
          className="comparison-wrapper"
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24, scale: 0.98 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPRESSIVE }}
        >
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Aspect</th>
                <th>OpenAI API (Centralized)</th>
                <th>ARCHI (Decentralized)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ownership</td>
                <td><span className="table-badge table-badge--old">Provider owns data & model</span></td>
                <td><span className="table-badge table-badge--arc">You own your agent</span></td>
              </tr>
              <tr>
                <td>Transparency</td>
                <td>Blackbox — trust provider</td>
                <td>On-chain audit trail</td>
              </tr>
              <tr>
                <td>Cost Model</td>
                <td>Pay-per-call, metered</td>
                <td>Own it — one-time mint + gas</td>
              </tr>
              <tr>
                <td>Control</td>
                <td><span className="table-badge table-badge--old">Limited customization</span></td>
                <td><span className="table-badge table-badge--arc">Full control over deployment</span></td>
              </tr>
            </tbody>
          </table>
        </motion.div>
      </section>

      {/* LIVE STATS */}
      <div className="stats-band">
        <div className="stat-item">
          <div className="stat-value">{totalTools}+</div>
          <div className="stat-label">Integrations</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{totalCategories}</div>
          <div className="stat-label">Categories</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">7</div>
          <div className="stat-label">Fallback Models</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">$0</div>
          <div className="stat-label">Required to Start</div>
        </div>
      </div>

      {/* KNOWLEDGE SHOWCASE */}
      <section className="section" id="integrations">
        <div className="section-centered">
          <span className="section-eyebrow">Knowledge Directory</span>
          <h2 className="section-heading">Plug in any tool your agent needs.</h2>
          <p className="section-desc">
            {totalTools} integrations across {totalCategories} categories — from on-chain DeFi to web scraping to CRM. All documented, all ready to wire into a system prompt.
          </p>
        </div>

        <motion.div
          className="knowledge-grid"
          style={{ marginTop: '48px', marginBottom: '32px' }}
          variants={prefersReducedMotion ? undefined : revealContainer}
          initial={prefersReducedMotion ? undefined : 'hidden'}
          whileInView={prefersReducedMotion ? undefined : 'show'}
          viewport={{ once: true, amount: 0.3 }}
        >
          {showcaseCards.map((card) => (
            <motion.div className="knowledge-card" key={card.category} variants={prefersReducedMotion ? undefined : revealItem}>
              <div>
                <div className="knowledge-card-header">
                  <div className="knowledge-card-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                      <path d="M2 17L12 22L22 17" />
                      <path d="M2 12L12 17L22 12" />
                    </svg>
                  </div>
                  <div className="knowledge-card-title">{card.category}</div>
                </div>
                <p className="knowledge-card-desc">{card.sample.join(', ')}{card.count > card.sample.length ? ', and more' : ''}</p>
              </div>
              <div className="knowledge-card-meta">
                <span className="knowledge-card-actions">{card.count} tools</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div style={{ textAlign: 'center' }}>
          <a href="/knowledge" className="knowledge-hero-link">Browse the full directory →</a>
        </div>
      </section>

      <SectionDivider />

      {/* TECH STACK */}
      <section className="section" id="tech">
        <div className="section-centered">
          <span className="section-eyebrow">Infrastructure</span>
          <h2 className="section-heading">Production-grade stack</h2>
          <p className="section-desc">Open-source, battle-tested components chosen for reliability at scale.</p>
        </div>

        <motion.div
          className="tech-grid"
          variants={prefersReducedMotion ? undefined : revealContainer}
          initial={prefersReducedMotion ? undefined : 'hidden'}
          whileInView={prefersReducedMotion ? undefined : 'show'}
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div className="tech-card" variants={prefersReducedMotion ? undefined : revealItem}>
            <div className="tech-visual">
              <div className="tech-badge-glow" />
              <div className="tech-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
            </div>
            <div className="tech-card-name">next.js</div>
            <div className="tech-card-desc">App Router + TypeScript</div>
          </motion.div>
          <motion.div className="tech-card" variants={prefersReducedMotion ? undefined : revealItem}>
            <div className="tech-visual">
              <div className="tech-badge-glow" />
              <div className="tech-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
            </div>
            <div className="tech-card-name">rust + anchor</div>
            <div className="tech-card-desc">Solana smart contracts</div>
          </motion.div>
          <motion.div className="tech-card" variants={prefersReducedMotion ? undefined : revealItem}>
            <div className="tech-visual">
              <div className="tech-badge-glow" />
              <div className="tech-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                </svg>
              </div>
            </div>
            <div className="tech-card-name">postgresql</div>
            <div className="tech-card-desc">Supabase + pgvector</div>
          </motion.div>
          <motion.div className="tech-card" variants={prefersReducedMotion ? undefined : revealItem}>
            <div className="tech-visual">
              <div className="tech-badge-glow" />
              <div className="tech-badge">
                <span
                  className="tech-badge-mark"
                  style={{ WebkitMaskImage: 'url(https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/solana.svg)', maskImage: 'url(https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/solana.svg)' }}
                  aria-label="Solana"
                />
              </div>
            </div>
            <div className="tech-card-name">solana</div>
            <div className="tech-card-desc">On-chain execution & audit</div>
          </motion.div>
        </motion.div>
      </section>

      <SectionDivider />

      {/* FAQ */}
      <section className="section" id="faq">
        <div className="section-centered">
          <span className="section-eyebrow">FAQ</span>
          <h2 className="section-heading">Questions, answered.</h2>
        </div>

        <div className="faq-shell">
          <div className="faq-list">
            {FAQ_ITEMS.map((item, i) => (
              <div className={`faq-item${i === activeFaq ? ' faq-item--active' : ''}`} key={item.q}>
                <button
                  type="button"
                  className="faq-summary"
                  onClick={() => setActiveFaq(i)}
                  aria-expanded={i === activeFaq}
                >
                  {item.q}
                  <span className="faq-plus" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>

          <div className="faq-preview">
            <div className="faq-preview-glow" />
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFaq}
                className="faq-preview-card"
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10, scale: 0.98 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.3, ease: EASE_OUT_EXPRESSIVE }}
              >
                <div className="faq-preview-row faq-preview-row--head">
                  <span className="faq-preview-check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M4 12l6 6L20 6" />
                    </svg>
                  </span>
                  <div>
                    <div className="faq-preview-title">{FAQ_ITEMS[activeFaq].q}</div>
                    <div className="faq-preview-meta">Answered by ARCHI</div>
                  </div>
                </div>
                <div className="faq-preview-divider" />
                <p className="faq-preview-body">{FAQ_ITEMS[activeFaq].a}</p>
                <div className="faq-preview-divider" />
                <div className="faq-preview-row faq-preview-row--foot">
                  <span className="faq-preview-check faq-preview-check--sm">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M4 12l6 6L20 6" />
                    </svg>
                  </span>
                  <span>Verified against the current build</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="cta">
        <div className="cta-glow" />
        <div className="cta-inner">
          <span className="cta-eyebrow">
            <span className="hero-eyebrow-dot"></span>
            Ready when you are
          </span>
          <h2 className="cta-heading">
            Build your agent.<br /><em>Own</em> your infrastructure.
          </h2>
          <p className="cta-desc">Deploy your first autonomous agent on Solana today. Full control. Full transparency.</p>
          <div className="cta-buttons">
            <button className="btn-cta-primary" onClick={handleBuildAgent}>
              Build Your Agent
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <a href="https://github.com/yourusername/archi" className="btn-cta-ghost">Explore Docs</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-brand">
              <div className="footer-brand-icon">
                <img src="/logo.png" alt="ARCHI" />
              </div>
              <span className="footer-brand-name">ARCHI</span>
            </div>
            <p className="footer-brand-tag">Decentralized autonomous AI agents on Solana. Your agents. Your rules.</p>
          </div>
          <div className="footer-columns">
            <div>
              <div className="footer-col-title">Product</div>
              <div className="footer-col-links">
                <a href="/agents">Agent Registry</a>
                <a href="/agents">Agent Forge</a>
                <a href="/dashboard">Dashboard</a>
              </div>
            </div>
            <div>
              <div className="footer-col-title">Resources</div>
              <div className="footer-col-links">
                <a href="/knowledge">Documentation</a>
                <a href="#tech">Architecture</a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 ARCHI. Decentralized AI on Solana.</span>
          <span className="footer-status-badge">
            <span className="footer-status-dot"></span>
            All systems operational
          </span>
        </div>
      </footer>
    </motion.main>
  );
}
