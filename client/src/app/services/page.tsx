'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Share2, 
  Search, 
  PenTool, 
  Target, 
  Lightbulb, 
  Mail, 
  Check,
  HelpCircle,
  X,
  Phone,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  Users,
  Video,
} from 'lucide-react';
import styles from './page.module.css';
import { Button } from '@/components/common/Button/Button';

const SERVICES = [
  {
    slug: 'social-media',
    name: 'Social Media Marketing',
    icon: Share2,
    iconBg: '#0E7490',
    description: 'Build engaged communities and drive conversions through strategic social media campaigns across all major platforms.',
    features: [
      'Platform strategy & content planning',
      'Community management & engagement',
      'Paid social advertising campaigns',
      'Analytics & performance reporting',
      'Influencer partnership coordination',
    ],
    price: '$2,500/mo',
  },
  {
    slug: 'seo',
    name: 'SEO Optimization',
    icon: Search,
    iconBg: '#15803D',
    description: 'Increase organic visibility and drive qualified traffic with data-driven search engine optimization strategies.',
    features: [
      'Technical SEO audit & implementation',
      'Keyword research & content optimization',
      'Link building & authority development',
      'Local SEO & Google Business optimization',
      'Monthly ranking reports & insights',
    ],
    price: '$2,500/mo',
  },
  {
    slug: 'content',
    name: 'Content Marketing',
    icon: PenTool,
    iconBg: '#C2410C',
    description: 'Engage your audience with compelling content that educates, entertains, and converts across all channels.',
    features: [
      'Content strategy & editorial calendar',
      'Blog writing & thought leadership',
      'Video scripts & multimedia content',
      'Infographics & visual storytelling',
      'Content distribution & amplification',
    ],
    price: '$2,500/mo',
  },
  {
    slug: 'ppc',
    name: 'PPC Advertising',
    icon: Target,
    iconBg: '#B91C1C',
    description: 'Maximize ROI with precision-targeted paid advertising campaigns across Google, Facebook, and LinkedIn.',
    features: [
      'Google Ads campaign management',
      'Facebook & Instagram ad campaigns',
      'LinkedIn B2B advertising',
      'Retargeting & remarketing strategies',
      'A/B testing & conversion optimization',
    ],
    price: '$2,500/mo',
  },
  {
    slug: 'branding',
    name: 'Brand Strategy',
    icon: Lightbulb,
    iconBg: '#7E22CE',
    description: 'Build a powerful brand identity that resonates with your target audience and differentiates you from competitors.',
    features: [
      'Brand positioning & messaging',
      'Visual identity & logo design',
      'Brand guidelines & style systems',
      'Market research & competitor analysis',
      'Brand launch & rollout strategy',
    ],
    price: '$2,500/mo',
  },
  {
    slug: 'email',
    name: 'Email Marketing',
    icon: Mail,
    iconBg: '#9D174D',
    description: 'Nurture leads and drive conversions with personalized email campaigns that deliver measurable results.',
    features: [
      'Email strategy & list segmentation',
      'Template design & copywriting',
      'Automated drip campaigns',
      'A/B testing & optimization',
      'Performance analytics & reporting',
    ],
    price: '$2,500/mo',
  },
  {
    slug: 'analytics',
    name: 'Analytics & Reporting',
    icon: BarChart2,
    iconBg: '#1D4ED8',
    description: 'Gain deep insights into your marketing performance with real-time dashboards and comprehensive reporting.',
    features: [
      'Custom KPI dashboard setup',
      'Multi-channel attribution tracking',
      'Monthly executive reports',
      'Funnel & conversion analysis',
      'Competitor benchmarking',
    ],
    price: '$1,800/mo',
  },
  {
    slug: 'influencer',
    name: 'Influencer Marketing',
    icon: Users,
    iconBg: '#BE185D',
    description: 'Amplify your reach by partnering with the right creators and influencers for your target market.',
    features: [
      'Influencer discovery & vetting',
      'Campaign strategy & brief creation',
      'Contract & deliverable management',
      'Content performance tracking',
      'ROI measurement & reporting',
    ],
    price: '$3,000/mo',
  },
  {
    slug: 'video',
    name: 'Video Marketing',
    icon: Video,
    iconBg: '#0F766E',
    description: 'Captivate your audience with high-impact video content that drives engagement and brand awareness.',
    features: [
      'Video strategy & concept development',
      'Script writing & storyboarding',
      'YouTube channel optimization',
      'Short-form content (Reels, TikTok)',
      'Video ad campaign management',
    ],
    price: '$2,800/mo',
  },
];

const PER_PAGE = 3;
const TOTAL_PAGES = Math.ceil(SERVICES.length / PER_PAGE);

export default function ServicesPage() {
  const [helpOpen, setHelpOpen] = useState(false);
  const [page, setPage] = useState(0);

  const visibleServices = SERVICES.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const prev = () => setPage(p => Math.max(0, p - 1));
  const next = () => setPage(p => Math.min(TOTAL_PAGES - 1, p + 1));

  return (
    <div className={styles.page}>
      {/* Hero Banner */}
      <section className={styles.heroBanner}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb}>
            <Link href="/">Home</Link>
            <span className={styles.breadSep}>/</span>
            <span className={styles.breadCurrent}>Services</span>
          </nav>
          <h1 className={styles.heroTitle}>Our Services</h1>
          <p className={styles.heroSubtitle}>
            Comprehensive digital marketing solutions tailored to accelerate your business growth
          </p>
        </div>

        {/* Floating ? Button */}
        <button className={styles.helpBtn} onClick={() => setHelpOpen(true)} aria-label="Need Help Choosing?">
          <HelpCircle size={22} />
        </button>
      </section>

      {/* Help Modal */}
      {helpOpen && (
        <div className={styles.modalOverlay} onClick={() => setHelpOpen(false)}>
          <div className={styles.helpModal} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setHelpOpen(false)}>
              <X size={18} />
            </button>
            <div className={styles.modalIconTop}><HelpCircle size={32} color="#06B6D4" /></div>
            <h3 className={styles.modalTitle}>Need Help Choosing?</h3>
            <p className={styles.modalText}>Our experts can guide you to the perfect solution</p>
            <form className={styles.modalForm} onSubmit={e => e.preventDefault()}>
              <input type="text" placeholder="Your Name" className={styles.modalInput} />
              <input type="email" placeholder="Your Email" className={styles.modalInput} />
              <input type="tel" placeholder="Phone Number" className={styles.modalInput} />
              <textarea placeholder="Tell us about your project" className={styles.modalTextarea} />
              <Button variant="primary" fullWidth className={styles.modalBtn}>Get Expert Advice</Button>
            </form>
            <div className={styles.callLine}>
              <Phone size={13} />
              <span>Or call us at <strong>1-800-DIGITAL</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Services Grid */}
      <section className={styles.mainSection}>
        <div className={styles.container}>
          <div className={styles.servicesGrid} key={page}>
            {visibleServices.map((service) => {
              const Icon = service.icon;
              return (
                <div key={service.slug} className={styles.serviceCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.iconBox} style={{ background: service.iconBg }}>
                      <Icon size={26} color="#fff" />
                    </div>
                    <h3 className={styles.serviceName}>{service.name}</h3>
                    <p className={styles.serviceDesc}>{service.description}</p>
                  </div>
                  <ul className={styles.featureList}>
                    {service.features.map((f, idx) => (
                      <li key={idx} className={styles.featureItem}>
                        <div className={styles.checkIcon}><Check size={11} strokeWidth={3.5} /></div>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className={styles.cardFooter}>
                    <Button variant="secondary" fullWidth className={styles.priceBtn}>
                      Starting at {service.price}
                    </Button>
                    <Link href={`/services/${service.slug}`} className={styles.learnMore}>Learn More</Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pagination */}
      <div className={styles.pagination}>
        <button
          className={`${styles.pageArrow} ${page === 0 ? styles.pageArrowDisabled : ''}`}
          onClick={prev}
          disabled={page === 0}
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
          <span>Prev</span>
        </button>

        <div className={styles.paginationDots}>
          {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === page ? styles.dotActive : ''}`}
              onClick={() => setPage(i)}
              aria-label={`Page ${i + 1}`}
            />
          ))}
        </div>

        <button
          className={`${styles.pageArrow} ${page === TOTAL_PAGES - 1 ? styles.pageArrowDisabled : ''}`}
          onClick={next}
          disabled={page === TOTAL_PAGES - 1}
          aria-label="Next page"
        >
          <span>Next</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
