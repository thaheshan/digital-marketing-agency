'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import styles from './page.module.css';

export default function CaseStudyOverview() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await api.get<any>(`/portfolio/public/${slug}`);
        if(res.item) {
          const item = res.item;
          setProject({
            id: item.id,
            title: item.title,
            category: item.serviceCategory,
            image: item.images?.[0]?.url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
            description: item.description || 'A comprehensive digital marketing campaign designed to increase brand awareness and drive engagement.',
            challenge: item.challengeText || 'The client struggled with low engagement rates and minimal brand visibility on social platforms.',
            solution: item.solutionText || 'We developed a multi-platform content strategy focusing on authentic storytelling and data-driven targeted paid campaigns.',
            metrics: {
              engagement: item.metrics?.find((m: any) => m.metricLabel === 'Engagement')?.metricValue || '287%',
              followers: item.metrics?.find((m: any) => m.metricLabel.includes('Follow'))?.metricValue || '45K',
              conversion: item.metrics?.find((m: any) => m.metricLabel.includes('Conversion'))?.metricValue || '4.8%',
              revenue: item.metrics?.find((m: any) => m.metricLabel.includes('Revenue'))?.metricValue || '$2.1M'
            },
            technologies: ['Strategy', 'Analytics', 'Paid Ads']
          });
        }
      } catch (err) {
        console.error('Failed to load portfolio item, using generic fallback:', err);
        setProject({
          id: slug,
          title: 'Growth Marketing Campaign',
          category: 'Digital Marketing',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
          description: 'A comprehensive campaign designed to increase brand awareness and drive engagement for the client. Our strategic approach combined organic content with targeted paid advertising across multiple platforms to achieve exceptional results.',
          challenge: "The client struggled with low engagement rates and minimal brand visibility in a highly competitive market.",
          solution: "We developed a multi-platform content strategy focusing on authentic storytelling. Combined with data-driven paid campaigns targeting high-intent audiences, we created a cohesive brand presence.",
          metrics: {
            engagement: '200%',
            followers: '15K',
            conversion: '3.2%',
            revenue: '$1.0M'
          },
          technologies: ['Google Analytics', 'Data Studio', 'Advertising']
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchProject();
  }, [slug]);

  if(isLoading) return <div style={{padding: '100px', textAlign: 'center'}}>Loading Case Study...</div>;
  if(!project) return <div style={{padding: '100px', textAlign: 'center'}}>Project not found</div>;

  const thumbnails = [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1543286386-7f8a3ae1f94e?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&q=80&w=400'
  ];

  return (
    <div className={styles.page}>
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

      <div className={styles.mainLayout}>
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
            <div className={styles.techTitle}>Key Focus Areas</div>
            <div className={styles.techGrid}>
              {project.technologies.map((tech: string) => (
                <span key={tech} className={styles.techItem}>{tech}</span>
              ))}
            </div>
          </div>

          <div className={styles.actionGroup}>
            <Link href="/roi-calculator" className={styles.btnRoi}>
              Calculate Your Potential ROI
            </Link>
            <Link href="/contact" className={styles.btnDark}>
              Request Similar Campaign
            </Link>
            <Link href="/services" className={styles.btnOutline}>
              View All Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
