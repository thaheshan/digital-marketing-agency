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
  MessageCircle,
  BarChart2,
  FileText,
  MousePointer2,
  Share2,
  ShieldCheck,
  Star
} from 'lucide-react';
import { Button } from '@/components/common/Button/Button';

const serviceData: Record<string, any> = {
  'social-media': {
    title: 'Social Media Marketing',
    subtitle: 'Build meaningful connections and drive measurable results across all major social platforms.',
    heroImage: '/hero_dashboard_mockup_1774897876378.png',
    stats: [
       { label: 'Avg. ROI', value: '250%', icon: TrendingUp },
       { label: 'Follower Growth', value: '180%', icon: Users },
       { label: 'Platform Satisfaction', value: '4.9/5', icon: Star }
    ],
    included: [
       'Custom Content Strategy',
       'Daily Community Management',
       'Monthly Performance Reports',
       'Paid Social Campaign Setup',
       'Professional Graphic Design',
       'Multi-Platform Scheduling',
       'Influencer Outreach Strategy',
       'Sentiment & Competitor Analysis'
    ],
    process: [
       { step: 1, title: 'Discovery & Strategy', desc: 'We dive deep into your brand, audience, and goals to build a winning social roadmap.' },
       { step: 2, title: 'Content Planning & Creation', desc: 'Our creative team crafts engaging, viral-ready content tailored for each platform.' },
       { step: 3, title: 'Campaign Launch & Management', desc: 'We handle the posting, engagement, and paid ad management to maximize reach.' },
       { step: 4, title: 'Monitoring & Optimization', desc: 'Real-time tracking allows us to pivot and optimize campaigns for peak performance.' },
       { step: 5, title: 'Reporting & Strategy Refinement', desc: 'Monthly deep-dives into data to refine our approach for even better results.' }
    ],
    plans: [
       { name: 'Basic', price: '2,500', features: ['3 Platforms', '12 Posts/mo', 'Basic Reporting'] },
       { name: 'Industrial', price: '5,000', features: ['5 Platforms', '24 Posts/mo', 'Full Ad Management', 'Premium Reporting'], popular: true },
       { name: 'Enterprise', price: '8,000+', features: ['Unlimited Platforms', 'Daily Posting', 'Dedicated Account Manager', 'Custom Analytics'] }
    ]
  },
  // SEO, PPC, etc. follow similar structures...
};

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const content = serviceData[slug] || serviceData['social-media']; // Default for demo

  return (
    <div className={styles.page}>
      {/* Detail Hero */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroLayout}>
             <div className={styles.heroLeft}>
                <nav className={styles.breadcrumb}>
                  <Link href="/services">Services</Link>
                  <ChevronRight size={14} />
                  <span>{content.title}</span>
                </nav>
                <h1 className={styles.title}>{content.title}</h1>
                <p className={styles.subtitle}>{content.subtitle}</p>
                <div className={styles.heroBtns}>
                   <Button variant="primary" size="large">Start Your Campaign</Button>
                   <div className={styles.shareIcon}><Share2 size={24} /></div>
                </div>
             </div>
             
             <div className={styles.heroRight}>
                <div className={styles.statsCardGrid}>
                   {content.stats.map((s: any, idx: number) => {
                      const Icon = s.icon;
                      return (
                         <div key={idx} className={styles.statMiniCard}>
                            <div className={styles.statIcon}><Icon size={20} /></div>
                            <div className={styles.statInfo}>
                               <strong>{s.value}</strong>
                               <span>{s.label}</span>
                            </div>
                         </div>
                      );
                   })}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Overview & Checklist */}
      <section className={styles.overview}>
         <div className={styles.container}>
            <div className={styles.overviewGrid}>
               <div className={styles.visualCol}>
                  <img src={content.heroImage} alt={content.title} className={styles.overviewImg} />
                  <div className={styles.floatBox}>
                     <ShieldCheck size={24} color="#06B6D4" />
                     <span>100% Data-Driven Implementation</span>
                  </div>
               </div>
               <div className={styles.checklistCol}>
                  <h2 className={styles.sectionTitle}>What's Included</h2>
                  <div className={styles.checkGrid}>
                     {content.included.map((item: string, idx: number) => (
                        <div key={idx} className={styles.checkItem}>
                           <div className={styles.checkCircle}><Check size={14} strokeWidth={4} /></div>
                           <span>{item}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Process Section */}
      <section className={styles.processSection}>
         <div className={styles.container}>
            <div className={styles.sectionHeader}>
               <span className={styles.sectionUpper}>Workflow</span>
               <h2 className={styles.sectionTitle}>Our Process</h2>
            </div>
            <div className={styles.processTimeline}>
               {content.process.map((p: any) => (
                  <div key={p.step} className={styles.processCard}>
                     <div className={styles.stepNum}>{p.step}</div>
                     <div className={styles.processContent}>
                        <h4>{p.title}</h4>
                        <p>{p.desc}</p>
                        <Link href="/contact" className={styles.stepLink}>Section Details →</Link>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Pricing Section */}
      <section className={styles.pricingSection}>
         <div className={styles.container}>
            <div className={styles.pricingHeader}>
               <h2 className={styles.sectionTitle}>Choose Your Plan</h2>
               <p>Select the perfect package for your business goals.</p>
            </div>
            <div className={styles.pricingGrid}>
               {content.plans.map((plan: any, idx: number) => (
                  <div key={idx} className={`${styles.priceCard} ${plan.popular ? styles.priceCardPopular : ''}`}>
                     {plan.popular && <div className={styles.popularBadge}>MOST POPULAR</div>}
                     <div className={styles.priceHeader}>
                        <h4 className={styles.planName}>{plan.name}</h4>
                        <div className={styles.planPrice}>
                           <span className={styles.currency}>$</span>
                           <strong>{plan.price}</strong>
                           <span className={styles.period}>/mo</span>
                        </div>
                     </div>
                     <ul className={styles.planFeatures}>
                        {plan.features.map((f: string, i: number) => (
                           <li key={i}><Check size={14} /> {f}</li>
                        ))}
                     </ul>
                     <Button variant={plan.popular ? 'primary' : 'outline'} fullWidth className={styles.planBtn}>
                        Select Plan
                     </Button>
                  </div>
               ))}
            </div>
            
            <div className={styles.readyCard}>
               <div>
                  <h3>Ready to Get Started?</h3>
                  <p>Book a free strategy session with our team.</p>
               </div>
               <Button variant="primary" className={styles.readyBtn}>Get Started Now</Button>
            </div>
         </div>
      </section>

      {/* Benefits / KPIs */}
      <section className={styles.benefitsSection}>
         <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Key Benefits</h2>
            <div className={styles.benefitsGrid}>
               <div className={styles.benefitCard} style={{ background: '#F0FDF4' }}>
                  <TrendingUp size={32} color="#15803D" />
                  <h4>Increased Brand Awareness</h4>
                  <p>Reach thousands of potential customers through smart targeting.</p>
               </div>
               <div className={styles.benefitCard} style={{ background: '#FFF7ED' }}>
                  <MousePointer2 size={32} color="#C2410C" />
                  <h4>Engaged Community</h4>
                  <p>Build real relationships with your audience through active management.</p>
               </div>
               <div className={styles.benefitCard} style={{ background: '#F0FDFA' }}>
                  <Zap size={32} color="#0D9488" />
                  <h4>Targeted Advertising</h4>
                  <p>Precision-targeted ads that deliver high-value leads at a lower cost.</p>
               </div>
               <div className={styles.benefitCard} style={{ background: '#F5F3FF' }}>
                  <TrendingUp size={32} color="#7C3AED" />
                  <h4>Measurable ROI</h4>
                  <p>Track every dollar spent and see the direct impact on your bottom line.</p>
               </div>
            </div>
         </div>
      </section>
      
    </div>
  );
}
