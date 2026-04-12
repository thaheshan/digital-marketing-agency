'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { usePortfolioStore } from '@/store/portfolioStore';
import styles from './page.module.css';
import { CheckCircle2, TrendingUp, Users, DollarSign, Flag, ArrowRight } from 'lucide-react';

export default function FullCaseStudyPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const { items } = usePortfolioStore();
  const item = items.find(i => i.id.toString() === slug || i.slug === slug);

  // Mock full case study detailed data perfectly matching screenshot 5
  const project = {
    title: 'Case Study',
    subtitle: 'Comprehensive digital marketing solutions tailored to accelerate your business growth',
    execSummary: 'Our strategic digital marketing campaign for TechFlow drastically re-positioned them in the market. Over a 6-month period, we completely overhauled their go-to-market strategy across social, SEO, and paid channels, resulting in unprecedented engagement metrics and a pipeline multiplying by 3x.',
    challenge: 'TechFlow entered a saturated market with an amazing product but nonexistent brand awareness. Their CAC (Customer Acquisition Cost) was completely unsustainable via standard search ads, and their social footprint yielded less than 50 interactions per post.',
    approach: [
      { num: 1, title: 'Discovery & Audit', desc: 'We began with a comprehensive audit of existing marketing channels, competitor analysis, and audience research to identify key missing opportunities.' },
      { num: 2, title: 'Strategy Development', desc: 'Based on insights gathered, we developed a data-driven strategy tailored to the target audience with measurable KPIs, focusing heavily on B2B LinkedIn growth.' },
      { num: 3, title: 'Campaign Execution', desc: 'Creative assets were produced and campaigns launched across selected channels with continuous optimisation through A/B testing on ad creative.' },
      { num: 4, title: 'Analysis & Scaling', desc: 'Once the winning formulas surfaced, we scaled the budget dynamically to capture 80% more impression share.' }
    ],
    impact: {
      leads: '+425%',
      revenue: '+380%',
      sales: '$300K'
    },
    takeaways: [
      'Content velocity is more important than achieving initial perfection in A/B testing.',
      'Audience segmentation yielded 4x greater returns than broad-appeal messaging.',
      'Integrating a unified CRM feedback loop allowed real-time ad budget reallocation.'
    ]
  };

  // Mock Bar Chart Data
  const chartData = [
    { label: 'Q1', old: 20, new: 80 },
    { label: 'Q2', old: 25, new: 120 },
    { label: 'Q3', old: 30, new: 150 },
    { label: 'Q4', old: 35, new: 200 }
  ];

  return (
    <div className={styles.page}>
      
      {/* Hero Banner */}
      <section className={styles.heroBanner}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}>
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/portfolio">Portfolio</Link>
            <span>/</span>
            <span>Case Study</span>
          </div>
          <h1 className={styles.heroTitle}>Case Study</h1>
          <p className={styles.heroSub}>Comprehensive digital marketing solutions tailored to accelerate your business growth</p>
        </div>
      </section>

      {/* Main Massive Card */}
      <div className={styles.mainCard}>
        
        {/* Intro Split */}
        <section className={styles.introSection}>
          <div>
            <span className={styles.execPill}>Executive Summary</span>
            <p>{project.execSummary}</p>
            <ul className={styles.checkList}>
              <li><CheckCircle2 size={18} className={styles.checkIcon} /> Tripled inbound lead volume</li>
              <li><CheckCircle2 size={18} className={styles.checkIcon} /> Reduced Customer Acquisition Cost by 42%</li>
              <li><CheckCircle2 size={18} className={styles.checkIcon} /> Achieved 380% increase in gross revenue</li>
            </ul>
          </div>
          <div>
            <h3>Client Background & Challenge</h3>
            <p>{project.challenge}</p>
          </div>
        </section>

        {/* Our Approach Timeline */}
        <section>
          <h2 className={styles.sectionTitle}>Our Approach</h2>
          <div className={styles.timeline}>
            {project.approach.map(step => (
              <div key={step.num} className={styles.timelineItem}>
                <div className={styles.timelineNum}>{step.num}</div>
                <div className={styles.timelineContent}>
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                  <a href="#" className={styles.timelineLink}>Read more</a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Implementation Details */}
        <section>
          <h2 className={styles.sectionTitle}>Implementation Details</h2>
          <p style={{ color: '#475569', fontSize: '16px', lineHeight: 1.7, marginBottom: '24px' }}>
            We redesigned their entire analytics tracking architecture, implementing server-side tagging alongside advanced unified conversion tracking across Meta, LinkedIn, and Google Ads frameworks. 
          </p>
          <div className={styles.hugeImageWrapper}>
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200" 
              alt="Dashboard" 
              className={styles.hugeImage}
              referrerPolicy="no-referrer"
            />
          </div>
          <ul className={styles.checkList}>
            <li><CheckCircle2 size={18} className={styles.checkIcon} /> Deployed custom automated API reporting dashboards</li>
            <li><CheckCircle2 size={18} className={styles.checkIcon} /> Utilized dynamic keyword insertion parameter scaling</li>
            <li><CheckCircle2 size={18} className={styles.checkIcon} /> Advanced CRM integration for lifecycle tracking</li>
            <li><CheckCircle2 size={18} className={styles.checkIcon} /> Multi-touch attribution modeling implemented via Tag Manager</li>
          </ul>
        </section>

        {/* Results & Impact */}
        <section>
          <h2 className={styles.sectionTitle} style={{ textAlign: 'center' }}>Results & Impact</h2>
          <div className={styles.impactGrid}>
            <div className={styles.impactCard}>
              <TrendingUp size={32} className={styles.impactIcon} />
              <div className={styles.impactValue}>{project.impact.leads}</div>
              <div className={styles.impactLabel}>Traffic Increase</div>
            </div>
            <div className={styles.impactCard}>
              <Users size={32} className={styles.impactIcon} />
              <div className={styles.impactValue}>{project.impact.revenue}</div>
              <div className={styles.impactLabel}>User Growth</div>
            </div>
            <div className={styles.impactCard}>
              <DollarSign size={32} className={styles.impactIcon} />
              <div className={styles.impactValue}>{project.impact.sales}</div>
              <div className={styles.impactLabel}>Revenue Generated</div>
            </div>
          </div>

          {/* Visual Bar Chart */}
          <div className={styles.barChartContainer}>
            <h4 className={styles.chartTitle}>Traffic Source Growth</h4>
            <div className={styles.chartArea}>
              {chartData.map(d => (
                <div key={d.label} className={styles.chartBarGroup}>
                  <div className={`${styles.bar} ${styles.barGray}`} style={{ height: `${d.old}px` }}></div>
                  <div className={`${styles.bar} ${styles.barCyan}`} style={{ height: `${d.new}px` }}></div>
                </div>
              ))}
            </div>
            <div className={styles.chartLabels}>
              {chartData.map(d => <span key={d.label}>{d.label}</span>)}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className={styles.testimonialBlock}>
          <p className={styles.testiText}>"Working with DigitalPulse completely transformed our digital presence. By month 4 we were exceeding every historical benchmark recorded in the company's existence. The team is genuinely unmatched."</p>
          <div className={styles.testiAuthor}>
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=100&h=100" className={styles.testiAvatar} alt="Michael Chen" referrerPolicy="no-referrer" />
            <div className={styles.testiInfo}>
              <strong>Michael Chen</strong>
              <span>CEO, GrowthTech Inc.</span>
            </div>
          </div>
        </section>

        {/* Key Takeaways */}
        <section>
          <h2 className={styles.sectionTitle}>Key Takeaways</h2>
          <div className={styles.takeawayList}>
            {project.takeaways.map((task, idx) => (
              <div key={idx} className={styles.takeawayItem}>
                <Flag size={20} className={styles.takeawayIcon} />
                <p>{task}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Projects */}
        <section>
          <h2 className={styles.sectionTitle} style={{ textAlign: 'center' }}>Related Projects</h2>
          <div className={styles.relatedGrid}>
            {[1, 2, 3].map(i => (
              <Link key={i} href={`/portfolio/${i}`} className={styles.relatedItem}>
                <img src={`https://picsum.photos/seed/related${i}/400/300`} className={styles.relatedImg} referrerPolicy="no-referrer" alt="Related" />
                <div className={styles.relatedInfo}>
                  <h4>{i === 1 ? 'SEO Restructure' : i === 2 ? 'App Launch' : 'Brand Overhaul'}</h4>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Read case study <ArrowRight size={14} /></p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA Footer */}
        <div className={styles.ctaFooter}>
          <h2 className={styles.ctaTitle}>Ready to Write Your Success Story?</h2>
          <p className={styles.ctaSub}>Our proven methodology gets results. See exactly what we can do for you.</p>
          <Link href="/roi-calculator" className={styles.ctaBtn}>Calculate ROI</Link>
        </div>

      </div>
    </div>
  );
}
