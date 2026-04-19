import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';
import styles from './page.module.css';

// Mock data for services since we don't have a DB seed yet for this specific content
const serviceDetails = {
  'social-media': {
    title: 'Social Media Marketing',
    subtitle: 'Build an engaged community and drive measurable ROI across social channels.',
    description: 'We don\'t just post for the sake of posting. Our social media strategies are deeply rooted in data, designed to capture attention and convert followers into paying customers.',
    features: [
      'Platform-specific content strategy',
      'Community management and engagement',
      'Influencer partnership management',
      'Paid social advertising campaigns',
      'Advanced audience targeting',
      'Comprehensive performance analytics'
    ],
    pricing: 'Starting from £2,500/month',
    timeline: '1-2 weeks to launch'
  },
  'seo': {
    title: 'SEO Optimization',
    subtitle: 'Dominate search results and capture high-intent organic traffic.',
    description: 'Our technical and content SEO experts work together to ensure your website ranks for the keywords that matter most to your bottom line, not just vanity metrics.',
    features: [
      'Comprehensive technical site audits',
      'Keyword research and mapping',
      'On-page content optimization',
      'High-authority link building',
      'Local SEO and Google Business Profile',
      'Monthly ranking and traffic reports'
    ],
    pricing: 'Starting from £1,200/month',
    timeline: 'Ongoing (Initial audit 2 weeks)'
  },
  // Add fallback for others
  'default': {
    title: 'Digital Marketing Service',
    subtitle: 'Expert strategies tailored to your business goals.',
    description: 'Our specialized digital marketing services are designed to increase your visibility, engagement, and most importantly, your revenue.',
    features: [
      'Custom strategy development',
      'Dedicated account manager',
      'Bi-weekly performance reviews',
      'Data-driven optimizations',
      'Transparent reporting dashboard',
      'Continuous A/B testing'
    ],
    pricing: 'Custom quote based on scope',
    timeline: 'Typically 2-4 weeks'
  }
};

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = serviceDetails[params.slug as keyof typeof serviceDetails] || serviceDetails['default'];

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <Link href="/services" className={styles.backLink}>
            <ArrowLeft size={16} /> Back to Services
          </Link>
          <h1>{service.title}</h1>
          <p className={styles.subtitle}>{service.subtitle}</p>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.mainCol}>
          <section className={styles.section}>
            <h2>Overview</h2>
            <p className={styles.description}>{service.description}</p>
          </section>

          <section className={styles.section}>
            <h2>What's Included</h2>
            <ul className={styles.featuresList}>
              {service.features.map((feature, idx) => (
                <li key={idx}>
                  <CheckCircle2 size={20} className={styles.checkIcon} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.ctaCard}>
            <h3>Ready to scale your business?</h3>
            <p>Let's discuss how our {service.title} services can help you achieve your goals.</p>
            <Link href="/contact" className={styles.primaryBtn}>
              Request a Custom Quote <ArrowRight size={16} />
            </Link>
          </section>
        </div>

        <div className={styles.sidebarCol}>
          <div className={styles.infoCard}>
            <h3>Service Details</h3>
            <div className={styles.infoRow}>
              <span>Estimated Pricing:</span>
              <strong>{service.pricing}</strong>
            </div>
            <div className={styles.infoRow}>
              <span>Average Timeline:</span>
              <strong>{service.timeline}</strong>
            </div>
            <div className={styles.divider} />
            <Link href="/roi-calculator" className={styles.calcLink}>
              Calculate Potential ROI
            </Link>
          </div>

          <div className={styles.testimonialCard}>
            <p className={styles.quote}>"They completely transformed how we approach digital. The results speak for themselves."</p>
            <div className={styles.author}>
              <div className={styles.avatar}>T</div>
              <div>
                <strong>Tom Bradley</strong>
                <span>CEO, TechGrowth</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
