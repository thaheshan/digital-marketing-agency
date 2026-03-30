import styles from './page.module.css';
import Link from 'next/link';
import { Button } from '@/components/common/Button/Button';

export const metadata = {
  title: 'Testimonials | Digital Marketing Agency',
  description: 'See what our clients say about the results we\'ve delivered for their businesses.',
};

const testimonials = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'CEO',
    company: 'RetailCo',
    avatar: '👩‍💼',
    rating: 5,
    category: 'Social Media',
    quote: 'Working with DigitalAgency transformed our social media presence. Our engagement went up 320% in the first 60 days, and we\'ve seen a 2.5x increase in online sales directly attributed to their campaigns.',
    result: '+320% Engagement',
  },
  {
    id: 2,
    name: 'Marcus Chen',
    role: 'Founder',
    company: 'TechFlow Solutions',
    avatar: '👨‍💻',
    rating: 5,
    category: 'SEO',
    quote: 'We\'ve tried three other SEO agencies before. None came close. Within 4 months, we were ranking on page 1 for 47 of our target keywords. Our organic traffic tripled.',
    result: '3x Organic Traffic',
  },
  {
    id: 3,
    name: 'Priya Patel',
    role: 'CMO',
    company: 'HealthPlus',
    avatar: '👩‍⚕️',
    rating: 5,
    category: 'Content Marketing',
    quote: 'The content team truly understands our industry. They produce articles that rank AND convert. Our lead quality from content has improved dramatically.',
    result: '+65% Lead Quality',
  },
  {
    id: 4,
    name: 'James Okafor',
    role: 'Marketing Director',
    company: 'Propel Finance',
    avatar: '👨‍💼',
    rating: 5,
    category: 'PPC',
    quote: 'We cut our cost-per-acquisition by 40% while doubling volume. Their Google Ads team is exceptional — real experts who test constantly and explain their reasoning clearly.',
    result: '-40% CPA',
  },
  {
    id: 5,
    name: 'Emily Nakamura',
    role: 'E-commerce Manager',
    company: 'FashionFirst',
    avatar: '👩‍🎨',
    rating: 5,
    category: 'Social Media',
    quote: 'Our Instagram-driven revenue went from $0 to $85K per month in 6 months. The content they create for us consistently stops the scroll. Absolutely remarkable ROI.',
    result: '$85K/mo from Instagram',
  },
  {
    id: 6,
    name: 'David Okonkwo',
    role: 'CEO',
    company: 'Buildscape',
    avatar: '👨‍🔧',
    rating: 5,
    category: 'Branding',
    quote: 'We rebranded and relaunched with their help. The new identity resonates perfectly with our target market. We\'ve closed three enterprise deals citing our polished brand as a key factor.',
    result: '3 Enterprise Deals Won',
  },
];

const metrics = [
  { value: '4.9/5', label: 'Average Rating', sub: 'Across 250+ reviews' },
  { value: '98%', label: 'Client Retention', sub: 'Year-over-year' },
  { value: '180%', label: 'Average ROI', sub: 'Across all campaigns' },
  { value: '24hr', label: 'Response Time', sub: 'Guaranteed for all clients' },
];

export default function TestimonialsPage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>What Our Clients Say</h1>
        <p className={styles.heroSub}>Real results from real businesses. Here&apos;s what our clients have to say about working with us.</p>
      </section>

      {/* Metrics Bar */}
      <section className={styles.metricsBar}>
        <div className={styles.container}>
          <div className={styles.metricsGrid}>
            {metrics.map(m => (
              <div key={m.label} className={styles.metricItem}>
                <div className={styles.metricValue}>{m.value}</div>
                <div className={styles.metricLabel}>{m.label}</div>
                <div className={styles.metricSub}>{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className={styles.testimonialsSection}>
        <div className={styles.container}>
          <div className={styles.testimonialsGrid}>
            {testimonials.map(t => (
              <div key={t.id} className={styles.testimonialCard}>
                <div className={styles.cardTop}>
                  <div className={styles.stars}>{'★'.repeat(t.rating)}</div>
                  <span className={styles.categoryTag}>{t.category}</span>
                </div>
                <blockquote className={styles.quote}>&ldquo;{t.quote}&rdquo;</blockquote>
                <div className={styles.resultBadge}>
                  <span className={styles.resultIcon}>📈</span>
                  <span>{t.result}</span>
                </div>
                <div className={styles.author}>
                  <div className={styles.avatarWrap}>
                    <span className={styles.avatar}>{t.avatar}</span>
                  </div>
                  <div className={styles.authorInfo}>
                    <strong className={styles.authorName}>{t.name}</strong>
                    <span className={styles.authorRole}>{t.role}, {t.company}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <h2 className={styles.ctaTitle}>Ready to Be Our Next Success Story?</h2>
            <p className={styles.ctaSub}>Join 250+ businesses that have transformed their digital presence with us.</p>
            <div className={styles.ctaBtns}>
              <Link href="/contact"><Button variant="primary" size="large">Start Your Journey</Button></Link>
              <Link href="/roi-calculator"><Button variant="outline" size="medium">Calculate Your ROI</Button></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
