'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './ContentScorePanel.module.css';

interface ContentScorePanelProps {
  text: string;
  serviceCategory?: string;
}

interface ScoreDimension {
  label: string;
  score: number;
  max: number;
  suggestions: string[];
}

function scoreReadability(text: string): ScoreDimension {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5);
  const words = text.split(/\s+/).filter(Boolean);
  const avgSentenceLen = sentences.length > 0 ? words.length / sentences.length : 0;
  const hasNumbers = /\d/.test(text);
  const actionVerbs = ['drive', 'boost', 'grow', 'deliver', 'achieve', 'generate', 'increase', 'improve', 'transform', 'reduce'];
  const verbCount = actionVerbs.filter(v => text.toLowerCase().includes(v)).length;
  const paragraphs = text.split('\n').filter(p => p.trim().length > 10);

  let s = 0;
  if (words.length >= 80) s += 5;
  if (words.length >= 120) s += 3;
  if (avgSentenceLen >= 10 && avgSentenceLen <= 25) s += 6;
  if (hasNumbers) s += 4;
  if (verbCount >= 2) s += 4;
  if (paragraphs.length >= 1) s += 3;

  const suggestions: string[] = [];
  if (words.length < 80) suggestions.push('Write at least 80 words for better depth');
  if (avgSentenceLen > 30) suggestions.push('Break up long sentences (aim for under 25 words)');
  if (!hasNumbers) suggestions.push('Add specific numbers to improve credibility');
  if (verbCount < 2) suggestions.push('Include action verbs like "drive", "achieve", or "generate"');

  return { label: 'Readability', score: Math.min(s, 25), max: 25, suggestions };
}

function scoreKeywords(text: string, category: string): ScoreDimension {
  const lower = text.toLowerCase();
  const allKeywords = ['roi', 'roas', 'ctr', 'conversion', 'cpa', 'impressions', 'clicks', 'leads', 'revenue',
    'traffic', 'engagement', 'reach', 'performance', 'campaign', 'strategy', 'brand', 'digital', 'marketing',
    'social media', 'seo', 'ppc', 'content', 'email', 'analytics', 'data-driven', 'target', 'audience'];
  const catKeywords: Record<string, string[]> = {
    'Social Media Marketing': ['instagram', 'facebook', 'tiktok', 'engagement rate', 'social', 'influencer'],
    'SEO Optimization': ['organic', 'search ranking', 'keyword', 'backlinks', 'domain authority', 'serp'],
    'PPC Advertising': ['google ads', 'cost per click', 'quality score', 'ad spend', 'paid', 'bidding'],
    'Content Marketing': ['blog', 'content', 'thought leadership', 'editorial', 'copy', 'narrative'],
    'Email Marketing': ['open rate', 'click rate', 'drip', 'newsletter', 'segment', 'deliverability'],
  };
  const relevant = [...allKeywords, ...(catKeywords[category] || [])];
  const matched = relevant.filter(k => lower.includes(k));

  let s = Math.min(matched.length * 3, 25);
  const missing = relevant.filter(k => !lower.includes(k)).slice(0, 3);
  const suggestions = missing.length > 0 ? [`Consider adding: ${missing.slice(0, 3).join(', ')}`] : [];

  return { label: 'Keyword Relevance', score: s, max: 25, suggestions };
}

function scoreResults(text: string): ScoreDimension {
  const pcts = (text.match(/\d+%/g) || []).length;
  const currencies = (text.match(/[£$€]\d+/g) || []).length;
  const numbers = (text.match(/\b\d[\d,]+\b/g) || []).length;
  const comparisons = ['above', 'exceed', 'below', 'outperform', 'improve', 'vs', 'compared to', 'benchmark'].filter(c => text.toLowerCase().includes(c)).length;

  let s = 0;
  s += Math.min(pcts * 5, 12);
  s += Math.min(currencies * 3, 6);
  s += Math.min(numbers * 2, 5);
  s += Math.min(comparisons * 2, 4);

  const suggestions: string[] = [];
  if (pcts === 0) suggestions.push('Add percentage metrics (e.g., "150% ROI", "3.2% CTR")');
  if (currencies === 0) suggestions.push('Include specific monetary values (e.g., "£8.90 CPA")');
  if (comparisons === 0) suggestions.push('Compare results to benchmarks (e.g., "40% above industry average")');

  return { label: 'Results Evidence', score: Math.min(s, 25), max: 25, suggestions };
}

function scoreEmotional(text: string): ScoreDimension {
  const lower = text.toLowerCase();
  const trustWords = ['proven', 'certified', 'award', 'trusted', 'expert', 'guarantee', 'verified', 'recognised'];
  const urgencyWords = ['exclusive', 'rapid', 'fast', 'immediate', 'accelerate', 'quickly'];
  const valueWords = ['boost', 'grow', 'transform', 'maximise', 'unlock', 'scale', 'elevate'];

  const trust = trustWords.filter(w => lower.includes(w)).length;
  const urgency = urgencyWords.filter(w => lower.includes(w)).length;
  const value = valueWords.filter(w => lower.includes(w)).length;

  const s = Math.min(trust * 4 + urgency * 3 + value * 4, 25);
  const suggestions: string[] = [];
  if (trust === 0) suggestions.push('Add trust signals: "proven", "certified", "award-winning"');
  if (value === 0) suggestions.push('Use value words: "transform", "unlock", "elevate"');

  return { label: 'Emotional Impact', score: s, max: 25, suggestions };
}

export function ContentScorePanel({ text, serviceCategory = '' }: ContentScorePanelProps) {
  const [dimensions, setDimensions] = useState<ScoreDimension[]>([
    { label: 'Readability', score: 0, max: 25, suggestions: [] },
    { label: 'Keyword Relevance', score: 0, max: 25, suggestions: [] },
    { label: 'Results Evidence', score: 0, max: 25, suggestions: [] },
    { label: 'Emotional Impact', score: 0, max: 25, suggestions: [] },
  ]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const r = scoreReadability(text);
      const k = scoreKeywords(text, serviceCategory);
      const res = scoreResults(text);
      const e = scoreEmotional(text);
      setDimensions([r, k, res, e]);
    }, 200);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [text, serviceCategory]);

  const total = dimensions.reduce((acc, d) => acc + d.score, 0);
  const totalColor = total >= 80 ? '#22c55e' : total >= 60 ? '#06b6d4' : total >= 40 ? '#f59e0b' : '#ef4444';
  const totalLabel = total >= 80 ? 'Excellent' : total >= 60 ? 'Good' : total >= 40 ? 'Needs Work' : 'Weak';
  const allSuggestions = dimensions.flatMap(d => d.suggestions).slice(0, 4);

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>Content Score</span>
        <span className={styles.badge} style={{ background: `${totalColor}15`, color: totalColor }}>
          {totalLabel}
        </span>
      </div>

      <div className={styles.totalRing}>
        <span className={styles.totalNum} style={{ color: totalColor }}>{total}</span>
        <span className={styles.totalDen}>/100</span>
      </div>

      <div className={styles.dimensions}>
        {dimensions.map(d => (
          <div key={d.label} className={styles.dimension}>
            <div className={styles.dimTop}>
              <span className={styles.dimLabel}>{d.label}</span>
              <span className={styles.dimScore}>{d.score}/{d.max}</span>
            </div>
            <div className={styles.track}>
              <div className={styles.fill}
                style={{ width: `${(d.score / d.max) * 100}%`, background: totalColor }} />
            </div>
          </div>
        ))}
      </div>

      {allSuggestions.length > 0 && (
        <div className={styles.suggestions}>
          <span className={styles.suggTitle}>Suggestions</span>
          {allSuggestions.map((s, i) => (
            <div key={i} className={styles.suggestion}>
              <span className={styles.suggDot} />
              {s}
            </div>
          ))}
        </div>
      )}

      {total < 40 && (
        <div className={styles.lockNote}>
          ⚠ Score must be ≥ 40 to publish
        </div>
      )}
    </div>
  );
}
