'use client';

import { useParams } from 'next/navigation';
import styles from './page.module.css';
import Link from 'next/link';

const portfolioData: Record<string, any> = {
  '1': {
    title: 'RetailCo: Scaling E-commerce by 300%',
    category: 'Full-Service Marketing',
    client: 'RetailCo Ltd.',
    heroImage: '🎨',
    stats: [
      { label: 'Revenue Growth', value: '+312%' },
      { label: 'Cost Per Acquisition', value: '-45%' },
      { label: 'Organic Traffic', value: '+210%' }
    ],
    challenge: 'RetailCo faced stagnated growth and rising ad costs. Their legacy SEO was failing and they had no clear social strategy.',
    solution: 'We implemented a full-funnel approach: technical SEO overhaul, high-performance PPC strategy, and a data-driven content engine.',
    results: 'Within 12 months, RetailCo became the market leader in their niche, achieving a record-breaking $8.2M in annual recurring revenue.'
  },
  '2': {
    title: 'TechFlow: Dominating Search for SaaS',
    category: 'SEO & Content',
    client: 'TechFlow Solutions',
    heroImage: '🚀',
    stats: [
      { label: 'Keyword Rankings', value: '+450' },
      { label: 'Demo Requests', value: '+188%' },
      { label: 'Search Visibility', value: '+85%' }
    ],
    challenge: 'As a new SaaS player, TechFlow had zero search authority against established competitors.',
    solution: 'We targeted high-intent long-tail keywords and built a massive topical authority map using white-hat link building and technical PR.',
    results: 'TechFlow now ranks #1 for 14 primary industry terms, driving over 50,000 targeted sessions per month.'
  }
};

export default function PortfolioDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const content = portfolioData[id] || {
    title: 'Case Study: Driving Digital Transformation',
    category: 'Strategic Growth',
    client: 'Confidential Client',
    heroImage: '📈',
    stats: [
      { label: 'ROI', value: '+140%' },
      { label: 'Efficiency', value: '+30%' },
      { label: 'Growth', value: '+55%' }
    ],
    challenge: 'The client needed a modern digital presence to compete in a rapidly evolving market.',
    solution: 'A comprehensive digital strategy focused on data-driven marketing and user experience optimization.',
    results: 'Consistent growth across all key performance indicators and a stronger brand positioning.'
  };

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroLayout}>
             <div className={styles.heroText}>
                <span className={styles.category}>{content.category}</span>
                <h1 className={styles.title}>{content.title}</h1>
                <div className={styles.clientInfo}>
                   <strong>Client:</strong> {content.client}
                </div>
             </div>
             <div className={styles.heroVisual}>
                <div className={styles.visualCard}>{content.heroImage}</div>
             </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className={styles.statsBar}>
        <div className={styles.container}>
           <div className={styles.statsGrid}>
              {content.stats.map((s: any) => (
                <div key={s.label} className={styles.statItem}>
                   <span className={styles.statVal}>{s.value}</span>
                   <span className={styles.statLab}>{s.label}</span>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Study Content */}
      <section className={styles.study}>
         <div className={styles.container}>
            <div className={styles.studyGrid}>
               <div className={styles.studySection}>
                  <h2>The Challenge</h2>
                  <p>{content.challenge}</p>
               </div>
               <div className={styles.studySection}>
                  <h2>The Solution</h2>
                  <p>{content.solution}</p>
               </div>
               <div className={styles.studySectionFull}>
                  <div className={styles.resultBox}>
                     <h2>The Final Results</h2>
                     <p>{content.results}</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Next Projects */}
      <section className={styles.ctaSection}>
         <div className={styles.container}>
            <div className={styles.ctaBox}>
               <h3>Want similar results for your brand?</h3>
               <p>Let's discuss how our data-driven approach can scale your business.</p>
               <div className={styles.ctaBtns}>
                  <Link href="/contact" className={styles.primary}>Get Strategic Audit</Link>
                  <Link href="/portfolio" className={styles.secondary}>Browse All Work</Link>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
