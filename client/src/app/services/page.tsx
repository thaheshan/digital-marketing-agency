import Link from 'next/link';
import { ArrowRight, BarChart3, Smartphone, Search, PenTool, Mail, Megaphone } from 'lucide-react';
import styles from './page.module.css';

const services = [
  {
    id: 'social-media',
    title: 'Social Media Marketing',
    description: 'Data-driven campaigns across Instagram, Facebook, and TikTok designed to build brand awareness and drive conversions.',
    icon: <Smartphone size={32} />,
    color: '#0ea5e9'
  },
  {
    id: 'seo',
    title: 'SEO Optimization',
    description: 'Improve search rankings, drive organic traffic, and establish your brand as an authority with technical and content SEO.',
    icon: <Search size={32} />,
    color: '#10b981'
  },
  {
    id: 'ppc',
    title: 'PPC Advertising',
    description: 'High-ROI paid search and display campaigns on Google Ads and Bing to capture active demand for your services.',
    icon: <BarChart3 size={32} />,
    color: '#f59e0b'
  },
  {
    id: 'content',
    title: 'Content Marketing',
    description: 'Compelling copywriting, blog writing, and video production that engages your audience and supports the buyer journey.',
    icon: <PenTool size={32} />,
    color: '#8b5cf6'
  },
  {
    id: 'email',
    title: 'Email Marketing',
    description: 'Automated drip sequences and targeted newsletters that nurture leads into loyal customers over time.',
    icon: <Mail size={32} />,
    color: '#ec4899'
  },
  {
    id: 'branding',
    title: 'Brand Strategy',
    description: 'Develop a distinct voice, visual identity, and positioning strategy that sets you apart from competitors.',
    icon: <Megaphone size={32} />,
    color: '#f43f5e'
  }
];

export default function ServicesPage() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Data-Driven <span className={styles.highlight}>Services</span></h1>
          <p>We combine creative excellence with rigorous analytics to deliver marketing campaigns that directly impact your bottom line.</p>
        </div>
      </header>

      <section className={styles.servicesGrid}>
        {services.map((svc) => (
          <div key={svc.id} className={styles.serviceCard}>
            <div className={styles.iconWrapper} style={{ backgroundColor: `${svc.color}15`, color: svc.color }}>
              {svc.icon}
            </div>
            <h2>{svc.title}</h2>
            <p>{svc.description}</p>
            <Link href={`/services/${svc.id}`} className={styles.readMore}>
              Learn more <ArrowRight size={16} />
            </Link>
          </div>
        ))}
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2>Not sure which service is right for you?</h2>
          <p>Use our ROI Calculator to estimate the potential returns of different marketing approaches for your specific business.</p>
          <div className={styles.ctaButtons}>
            <Link href="/roi-calculator" className={styles.primaryBtn}>
              Use ROI Calculator
            </Link>
            <Link href="/contact" className={styles.secondaryBtn}>
              Talk to an Expert
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
