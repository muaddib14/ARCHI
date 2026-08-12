'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { KNOWLEDGE_ITEMS, CATEGORIES } from '@/data/knowledgeData';

export default function KnowledgePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Calculate counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: KNOWLEDGE_ITEMS.length };
    KNOWLEDGE_ITEMS.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filter items by search query and category
  const filteredItems = useMemo(() => {
    return KNOWLEDGE_ITEMS.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.actions.some(a => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <main style={{ minHeight: '100vh', background: 'var(--canvas, #faf5ff)' }}>
      {/* Top Announcement Bar */}
      <div className="announcement-bar">
        <span className="announcement-dot"></span>
        <span>ARCHI Knowledge Directory for Autonomous AI Agents</span>
        <a href="https://solana.com" target="_blank" rel="noopener noreferrer" className="announcement-link">
          Built on Solana →
        </a>
      </div>

      {/* Navigation */}
      <div className="nav-wrapper" style={{ top: '36px' }}>
        <nav className="nav-capsule">
          <Link href="/" className="nav-brand">
            <div className="nav-brand-icon">
              <img src="/logo.png" alt="ARCHI" />
            </div>
            <span className="nav-brand-text">ARCHI</span>
          </Link>
          <div className="nav-links">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/knowledge" className="nav-link active" style={{ color: 'var(--purple-main)', fontWeight: '800' }}>Knowledge</Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="nav-link">GitHub</a>
          </div>
          <Link href="/" className="nav-cta">
            Build Agent
          </Link>
        </nav>
      </div>

      {/* Knowledge Hero Header */}
      <section className="knowledge-hero">
        <div className="knowledge-hero-eyebrow">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          </svg>
          KNOWLEDGE DIRECTORY
        </div>

        <h1 className="knowledge-hero-title">
          100,060 tool knowledge.<br />
          Open source. Free forever.
        </h1>

        <p className="knowledge-hero-sub">
          Browse {KNOWLEDGE_ITEMS.length} integration platforms, search available API actions, and access complete structural knowledge for autonomous AI agents on Solana.
        </p>

        <div className="knowledge-hero-links">
          <a href="#how" className="knowledge-hero-link">How to use?</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="knowledge-hero-link-sub">GitHub</a>
          <a href="#contribute" className="knowledge-hero-link-sub">Contribute</a>
          <a href="#request" className="knowledge-hero-link-sub">Request a platform</a>
        </div>
      </section>

      {/* Main Search & Filter Section */}
      <section className="section" style={{ paddingTop: '0' }}>
        {/* Search Input */}
        <div className="search-wrapper">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search platforms, API actions, tool functions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filters */}
        <div className="filter-container">
          {CATEGORIES.map(category => (
            <button
              key={category}
              className={`filter-pill ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              <span>{category}</span>
              {categoryCounts[category] !== undefined && (
                <span className="filter-pill-count">({categoryCounts[category]})</span>
              )}
            </button>
          ))}
        </div>

        {/* 3-Column Integration Card Grid */}
        {filteredItems.length > 0 ? (
          <div className="knowledge-grid">
            {filteredItems.map(item => (
              <Link href={`/knowledge/${item.id}`} key={item.id}>
                <div className="knowledge-card">
                  <div>
                    <div className="knowledge-card-header">
                      <div className="knowledge-card-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                          <path d="M2 17L12 22L22 17" />
                        </svg>
                      </div>
                      <div>
                        <div className="knowledge-card-title">{item.name}</div>
                      </div>
                    </div>

                    <p className="knowledge-card-desc">{item.description}</p>
                  </div>

                  <div className="knowledge-card-meta">
                    <span className="knowledge-card-actions">{item.actionsCount} actions</span>
                    <span className="knowledge-card-category">{item.category}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '16px', border: '2px dashed var(--purple-deep)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--purple-deep)', marginBottom: '8px' }}>
              No platform integrations found
            </h3>
            <p style={{ color: 'var(--stone)', fontSize: '14px' }}>
              Try searching for "Solana", "GPT", "Database", or clear your filter criteria.
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-brand-name">ARCHI KNOWLEDGE</div>
            <p className="footer-brand-tag">Open API Knowledge base for AI agents on Solana.</p>
          </div>
          <div className="footer-columns">
            <div>
              <div className="footer-col-title">Navigation</div>
              <div className="footer-col-links">
                <Link href="/">Home</Link>
                <Link href="/knowledge">Knowledge Directory</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 ARCHI. Open Source Knowledge for AI Agents.</span>
        </div>
      </footer>
    </main>
  );
}
