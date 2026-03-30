'use client';

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
  Phone,
  BarChart2,
  TrendingUp,
  Star
} from 'lucide-react';
import styles from './page.module.css';
import { Button } from '@/components/common/Button/Button';

export default function ServicesPage() {
  const services = [
    {
      slug: 'social-media',
      name: 'Social Media Marketing',
      icon: Share2,
      iconColor: '#06B6D4',
      description: 'Build engaged communities and drive conversions through strategic social media campaigns across all major platforms.',
      features: [
        'Platform strategy & content planning',
        'Community management & engagement',
        'Paid social advertising campaigns',
        'Analytics & performance reporting',
        'Influencer partnership coordination'
      ],
      price: '$2,500/mo',
    },
    {
      slug: 'seo',
      name: 'SEO Optimization',
      icon: Search,
      iconColor: '#22C55E',
      description: 'Increase organic visibility and drive qualified traffic with data-driven search engine optimization strategies.',
      features: [
        'Technical SEO audit & implementation',
        'Keyword research & content optimization',
        'Link building & authority development',
        'Local SEO & Google Business optimization',
        'Monthly ranking reports & insights'
      ],
      price: '$2,500/mo',
    },
    {
      slug: 'content',
      name: 'Content Marketing',
      icon: PenTool,
      iconColor: '#F97316',
      description: 'Engage your audience with compelling content that educates, entertains, and converts across all channels.',
      features: [
        'Content strategy & editorial calendar',
        'Blog writing & thought leadership',
        'Video scripts & multimedia content',
        'Infographics & visual storytelling',
        'Content distribution & amplification'
      ],
      price: '$2,500/mo',
    },
    {
      slug: 'ppc',
      name: 'PPC Advertising',
      icon: Target,
      iconColor: '#DC2626',
      description: 'Maximize ROI with precision-targeted paid advertising campaigns across Google, Facebook, and LinkedIn.',
      features: [
        'Google Ads campaign management',
        'Facebook & Instagram ad campaigns',
        'LinkedIn B2B advertising',
        'Retargeting & remarketing strategies',
        'A/B testing & conversion optimization'
      ],
      price: '$2,500/mo',
    },
    {
      slug: 'branding',
      name: 'Brand Strategy',
      icon: Lightbulb,
      iconColor: '#8B5CF6',
      description: 'Build a powerful brand identity that resonates with your target audience and differentiates you from competitors.',
      features: [
        'Brand positioning & messaging',
        'Visual identity & logo design',
        'Brand guidelines & style systems',
        'Market research & competitor analysis',
        'Brand launch & rollout strategy'
      ],
      price: '$2,500/mo',
    },
    {
      slug: 'email',
      name: 'Email Marketing',
      icon: Mail,
      iconColor: '#EC4899',
      description: 'Nurture leads and drive conversions with personalized email campaigns that deliver measurable results.',
      features: [
        'Email strategy & list segmentation',
        'Template design & copywriting',
        'Automated drip campaigns',
        'A/B testing & optimization',
        'Performance analytics & reporting'
      ],
      price: '$2,500/mo',
    },
  ];

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
      </section>

      {/* Main Content */}
      <section className={styles.mainSection}>
        <div className={styles.contentLayout}>
          <div className={styles.servicesGrid}>
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div key={service.slug} className={styles.serviceCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.iconBox} style={{ background: `${service.iconColor}15`, color: service.iconColor }}>
                      <Icon size={24} />
                    </div>
                    <h3 className={styles.serviceName}>{service.name}</h3>
                    <p className={styles.serviceDesc}>{service.description}</p>
                  </div>
                  
                  <ul className={styles.featureList}>
                    {service.features.map((f, idx) => (
                      <li key={idx} className={styles.featureItem}>
                        <div className={styles.checkIcon}>
                           <Check size={12} strokeWidth={4} />
                        </div>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={styles.cardFooter}>
                    <Button variant="primary" fullWidth className={styles.priceBtn}>
                       Starting at {service.price}
                    </Button>
                    <Link href={`/services/${service.slug}`} className={styles.learnMore}>
                       Learn More
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Sidebar */}
          <aside className={styles.sidebar}>
             <div className={styles.helpBox}>
                <div className={styles.helpIconTop}><HelpCircle size={32} /></div>
                <h3 className={styles.helpTitle}>Need Help Choosing?</h3>
                <p className={styles.helpText}>Our experts can guide you to the perfect solution</p>
                
                <form className={styles.sidebarForm}>
                   <input type="text" placeholder="Your Name" className={styles.sideInput} />
                   <input type="email" placeholder="Your Email" className={styles.sideInput} />
                   <input type="tel" placeholder="Phone Number" className={styles.sideInput} />
                   <textarea placeholder="Tell us about your project" className={styles.sideTextarea}></textarea>
                   <Button variant="primary" fullWidth className={styles.sideBtn}>Get Expert Advice</Button>
                </form>

                <div className={styles.callSupport}>
                   <Phone size={14} />
                   <span>Or call us at <strong>1-800-DIGITAL</strong></span>
                </div>
             </div>

             <div className={styles.sidebarStats}>
                <div className={styles.statLine}>
                   <BarChart2 size={24} color="#06B6D4" />
                   <div>
                      <strong>250+</strong>
                      <span>Projects Delivered</span>
                   </div>
                </div>
                <div className={styles.statLine}>
                   <TrendingUp size={24} color="#22C55E" />
                   <div>
                      <strong>180%</strong>
                      <span>Average ROI</span>
                   </div>
                </div>
                <div className={styles.statLine}>
                   <Star size={24} color="#F97316" fill="#F97316" />
                   <div>
                      <strong>4.9/5</strong>
                      <span>Client Rating</span>
                   </div>
                </div>
             </div>
          </aside>
        </div>
      </section>

      {/* Trust Pagination Mockup */}
      <div className={styles.paginationDots}>
         <span></span>
         <span className={styles.dotActive}></span>
         <span></span>
      </div>
    </div>
  );
}
