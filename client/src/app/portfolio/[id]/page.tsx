'use client';

import { useParams } from 'next/navigation';
import styles from './page.module.css';
import Link from 'next/link';
import { 
  Check, 
  ChevronRight, 
  TrendingUp, 
  Users, 
  Zap, 
  Target, 
  BarChart2,
  FileText,
  MousePointer2,
  Share2,
  Calendar,
  Globe,
  Star
} from 'lucide-react';
import { Button } from '@/components/common/Button/Button';

const projects: Record<string, any> = {
  '1': {
    title: 'Social Media Growth Campaign',
    category: 'E-commerce Marketing',
    client: 'DigitalPulse Retail',
    description: 'Transforming a declining social presence into a high-engagement, revenue-driving machine.',
    stats: [
       { label: 'Followers', value: '45.2k', change: '+215%', icon: Users },
       { label: 'Reach', value: '1.2M', change: '+184%', icon: Globe },
       { label: 'Engagement Rate', value: '8.4%', change: '+312%', icon: BarChart2 },
       { label: 'CTR', value: '4.8%', change: '+92%', icon: MousePointer2 }
    ],
    challenge: 'The client struggled with low organic reach and stagnant follower growth. Despite posting daily, engagement was below 1% and direct sales from social channels were negligible.',
    solution: 'We implemented a multi-channel content strategy focused on high-quality short-form video (Reels/TikTok), data-driven community management, and precision-targeted paid social ads.',
    results: [
       'Built a community of 45,000+ targeted followers in 6 months.',
       'Generated over $150k in direct revenue from social referral traffic.',
       'Increased average engagement per post by 450%.',
       'Achieved a consistent 3.5x ROAS on all paid social campaigns.'
    ],
    gallery: [
       '/hero_dashboard_mockup_1774897876378.png',
       '/hero_dashboard_mockup_1774897876378.png'
    ]
  },
  // Other projects...
};

export default function PortfolioDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const project = projects[id] || projects['1']; // Default for demo

  return (
    <div className={styles.page}>
      {/* Case Study Header */}
      <section className={styles.caseHeader}>
        <div className={styles.container}>
           <div className={styles.headerTop}>
              <div className={styles.caseBadge}>CASE STUDY</div>
              <h1 className={styles.caseTitle}>{project.title}</h1>
              <p className={styles.caseDesc}>{project.description}</p>
           </div>
           
           <div className={styles.statsBar}>
              {project.stats.map((s: any, idx: number) => {
                 const Icon = s.icon;
                 return (
                    <div key={idx} className={styles.statItem}>
                       <div className={styles.statIcon}><Icon size={20} color="#06B6D4" /></div>
                       <div className={styles.statText}>
                          <strong>{s.value}</strong>
                          <span className={styles.statLabel}>{s.label}</span>
                       </div>
                       <div className={styles.statChange}>{s.change}</div>
                    </div>
                 );
              })}
           </div>
        </div>
      </section>

      {/* Hero Visual */}
      <section className={styles.heroVisual}>
         <div className={styles.container}>
            <div className={styles.mainMockup}>
               <img src="/hero_dashboard_mockup_1774897876378.png" alt="Main Portfolio View" className={styles.heroImg} />
               <div className={styles.overlayInfo}>
                  <div className={styles.infoPill}>
                     <Calendar size={14} /> 6-Month Campaign
                  </div>
                  <div className={styles.infoPill}>
                     <Target size={14} /> Conversion Optimized
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Challenge & Solution */}
      <section className={styles.contentSection}>
         <div className={styles.container}>
            <div className={styles.contentGrid}>
               <div className={styles.textCol}>
                  <div className={styles.contentBlock}>
                     <h3 className={styles.blockTitle}>The Challenge</h3>
                     <p className={styles.blockText}>{project.challenge}</p>
                  </div>
                  
                  <div className={styles.contentBlock}>
                     <h3 className={styles.blockTitle}>Our Solution</h3>
                     <p className={styles.blockText}>{project.solution}</p>
                     
                     <ul className={styles.checkList}>
                        {project.results.map((r: string, i: number) => (
                           <li key={i}><Check size={16} color="#22C55E" /> {r}</li>
                        ))}
                     </ul>
                  </div>
               </div>
               
               <div className={styles.metaCol}>
                  <div className={styles.metaCard}>
                     <h4>Project Details</h4>
                     <div className={styles.metaItem}>
                        <span>Client</span>
                        <strong>{project.client}</strong>
                     </div>
                     <div className={styles.metaItem}>
                        <span>Category</span>
                        <strong>{project.category}</strong>
                     </div>
                     <div className={styles.metaItem}>
                        <span>Timeline</span>
                        <strong>6 Months</strong>
                     </div>
                     <div className={styles.metaItem}>
                        <span>Tools Used</span>
                        <div className={styles.toolTags}>
                           <span>Figma</span>
                           <span>Meta Business</span>
                           <span>Hootsuite</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Growth Breakdown */}
      <section className={styles.growthSection}>
         <div className={styles.container}>
            <div className={styles.growthCard}>
               <div className={styles.growthHeader}>
                  <h3>Project Performance</h3>
                  <div className={styles.growthPeriod}>Jan 2024 - Jun 2024</div>
               </div>
               <div className={styles.growthGrid}>
                  <div className={styles.growthItem}>
                     <div className={styles.growthCircle} style={{ background: '#F0FDF4' }}>
                        <TrendingUp size={32} color="#22C55E" />
                     </div>
                     <strong>450%</strong>
                     <span>Engagement Growth</span>
                  </div>
                  <div className={styles.growthItem}>
                     <div className={styles.growthCircle} style={{ background: '#F0FDFA' }}>
                        <Users size={32} color="#0D9488" />
                     </div>
                     <strong>32k+</strong>
                     <span>New Followers</span>
                  </div>
                  <div className={styles.growthItem}>
                     <div className={styles.growthCircle} style={{ background: '#FFF7ED' }}>
                        <MousePointer2 size={32} color="#C2410C" />
                     </div>
                     <strong>$150k</strong>
                     <span>Attributed Revenue</span>
                  </div>
                  <div className={styles.growthItem}>
                     <div className={styles.growthCircle} style={{ background: '#F5F3FF' }}>
                        <Target size={32} color="#7C3AED" />
                     </div>
                     <strong>3.5x</strong>
                     <span>Return on Ad Spend</span>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Related Projects */}
      <section className={styles.readyCta}>
         <div className={styles.container}>
            <div className={styles.ctaBox}>
               <h2>Ready to Achieve Similar Results?</h2>
               <p>Let's discuss how we can scale your digital presence through data-driven marketing.</p>
               <div className={styles.ctaBtns}>
                  <Button variant="primary" size="large">Schedule Strategy Session</Button>
                  <Link href="/portfolio" className={styles.backLink}>View More Projects</Link>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
