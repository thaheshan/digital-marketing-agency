'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { usePortfolioStore } from '@/store/portfolioStore';
import styles from './page.module.css';

export default function CaseStudyOverview() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const { items } = usePortfolioStore();
  const item = items.find(i => i.id.toString() === slug || i.slug === slug);

  // If item not found (or while loading), show fallback. 
  // We mock a highly detailed fallback project as in screenshot for id=5.
  const project = item || {
    id: 5,
    title: 'Social Media Growth Campaign',
    category: 'Social Media Marketing',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
    description: 'A comprehensive social media campaign designed to increase brand awareness and drive engagement for a leading e-commerce platform. Our strategic approach combined organic content with targeted paid advertising across multiple platforms to achieve exceptional results within a 90-day period.',
    challenge: "The client struggled with low engagement rates and minimal brand visibility on social platforms. Their content wasn't resonating with their target audience, and they needed a strategic overhaul to compete in a saturated market.",
    solution: "We developed a multi-platform content strategy focusing on authentic storytelling and user-generated content. Combined with data-driven paid campaigns targeting high-intent audiences, we created a cohesive brand presence that resonated with their ideal customers.",
    metrics: {
      engagement: '287%',
      followers: '45K',
      conversion: '4.8%',
      revenue: '$2.1M'
    },
    technologies: ['Facebook Ads', 'Instagram', 'LinkedIn', 'Google Analytics', 'Hootsuite', 'Canva']
  };

  const thumbnails = [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1543286386-7f8a3ae1f94e?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&q=80&w=400'
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

      {/* Main Split Layout */}
      <div className={styles.mainLayout}>
        
        {/* Left Column: Image Gallery */}
        <div className={styles.imageSection}>
          <div className={styles.mainImageWrapper}>
            <img src={project.image} alt={project.title} className={styles.mainImage} referrerPolicy="no-referrer" />
          </div>
          <div className={styles.thumbnailGrid}>
            {thumbnails.map((thumb, idx) => (
              <div key={idx} className={styles.thumbnailWrapper}>
                <img src={thumb} alt="thumbnail" className={styles.thumbnail} referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Case Details */}
        <div className={styles.detailsSection}>
          <h2 className={styles.projectTitle}>{project.title}</h2>
          <span className={styles.categoryBadge}>{project.category}</span>
          
          <p className={styles.abstract}>{project.description}</p>

          <h3 className={styles.sectionTitle}>The Challenge</h3>
          <p className={styles.sectionText}>{project.challenge}</p>

          <h3 className={styles.sectionTitle}>Our Solution</h3>
          <p className={styles.sectionText}>{project.solution}</p>

          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <span className={styles.metricValue}>{project.metrics.engagement}</span>
              <span className={styles.metricLabel}>Engagement Increase</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricValue}>{project.metrics.followers}</span>
              <span className={styles.metricLabel}>New Followers</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricValue}>{project.metrics.conversion}</span>
              <span className={styles.metricLabel}>Conversion Rate</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricValue}>{project.metrics.revenue}</span>
              <span className={styles.metricLabel}>Revenue Generated</span>
            </div>
          </div>

          <div className={styles.technologies}>
            <div className={styles.techTitle}>Technologies Used</div>
            <div className={styles.techGrid}>
              {project.technologies.map(tech => (
                <span key={tech} className={styles.techItem}>{tech}</span>
              ))}
            </div>
          </div>

          <div className={styles.actionGroup}>
            <Link href={`/portfolio/${slug}/full`} className={styles.btnDark}>
              View Full Case Study
            </Link>
            <Link href="/contact" className={styles.btnOutline}>
              Contact Us
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
