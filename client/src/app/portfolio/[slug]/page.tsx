'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { usePortfolioStore } from '@/store';
import styles from './page.module.css';
import { ArrowLeft, Calendar, Tag, Users } from 'lucide-react';

export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  const { items } = usePortfolioStore();
  const item = items.find(i => i.slug === slug);

  if (!item) {
    return (
      <div className={styles.notFound}>
        <h1>Case Study Not Found</h1>
        <Link href="/portfolio" className={styles.backLink}>← Back to Portfolio</Link>
      </div>
    );
  }

  const metricCards = [
    { label: 'Impressions', value: item.metrics.impressions },
    { label: 'Conversions', value: item.metrics.conversions },
    { label: 'CTR', value: item.metrics.ctr },
    { label: 'ROI', value: item.metrics.roi },
  ];

  const process = [
    { step: 1, title: 'Discovery & Audit', desc: 'We began with a comprehensive audit of existing marketing channels, competitor analysis, and audience research to identify key opportunities.' },
    { step: 2, title: 'Strategy Development', desc: 'Based on insights gathered, we developed a data-driven strategy tailored to the target audience with measurable KPIs and timelines.' },
    { step: 3, title: 'Campaign Execution', desc: 'Creative assets were produced and campaigns launched across selected channels with continuous optimisation through A/B testing.' },
    { step: 4, title: 'Results & Reporting', desc: 'Weekly performance reviews and transparent reporting led to iterative improvements and consistently exceeded targets.' },
  ];

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/portfolio" className={styles.breadBack}>
            <ArrowLeft size={15} /> Portfolio
          </Link>
          <div className={styles.meta}>
            <span className={styles.catBadge}>{item.serviceCategory}</span>
            <h1 className={styles.headline}>{item.title}</h1>
            <div className={styles.metaRow}>
              <span><Users size={14} />{item.clientName}</span>
              <span><Tag size={14} />{item.clientIndustry}</span>
              <span><Calendar size={14} />{item.dateRange}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        {/* Key metrics */}
        <div className={styles.metricsStrip}>
          {metricCards.map(m => (
            <div key={m.label} className={styles.metricCard}>
              <strong>{m.value}</strong>
              <span>{m.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.twoCol}>
          {/* Main content */}
          <div className={styles.mainContent}>
            <div className={styles.section}>
              <h2>Campaign Overview</h2>
              <p>{item.description}</p>
            </div>

            <div className={styles.section}>
              <h2>Channels Used</h2>
              <div className={styles.channelTags}>
                {item.channels.map(ch => (
                  <span key={ch} className={styles.channelTag}>{ch}</span>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <h2>Our Process</h2>
              <div className={styles.timeline}>
                {process.map(p => (
                  <div key={p.step} className={styles.timelineItem}>
                    <div className={styles.timelineNum}>{p.step}</div>
                    <div>
                      <strong>{p.title}</strong>
                      <p>{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.quoteBlock}>
              <p className={styles.quoteText}>"Working with DigitalPulse completely transformed our digital presence. The results exceeded everything we expected and the team kept us informed every step of the way."</p>
              <div className={styles.quoteAuthor}>
                <div className={styles.quoteAvatar}>{item.clientName.split(' ').map(n => n[0]).join('').slice(0,2)}</div>
                <div>
                  <strong>CEO, {item.clientName}</strong>
                  <span>{item.clientIndustry}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.sideCard}>
              <h3>Full Metrics</h3>
              <div className={styles.fullMetrics}>
                {Object.entries(item.metrics).map(([k, v]) => (
                  <div key={k} className={styles.metricRow}>
                    <span>{k.toUpperCase()}</span>
                    <strong>{v}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.sideCard}>
              <h3>Tags</h3>
              <div className={styles.tags}>
                {item.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
              </div>
            </div>

            <div className={styles.ctaCard}>
              <h3>Get Similar Results</h3>
              <p>Let's discuss how we can achieve results like these for your business.</p>
              <Link href="/contact" className={styles.ctaBtn}>Get a Free Quote</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
