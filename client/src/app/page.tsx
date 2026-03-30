import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { Button } from "@/components/common/Button/Button";
import { 
  Share2, 
  Search, 
  Target, 
  Edit3, 
  Mail, 
  BarChart2, 
  MessageCircle, 
  Star,
  ChevronRight
} from 'lucide-react';

export default function Home() {
  const services = [
    {
      title: "Social Media Marketing",
      description: "Build engaged communities and drive conversions through strategic social campaigns.",
      icon: Share2,
      color: "#06B6D4"
    },
    {
      title: "SEO Optimization",
      description: "Increase organic visibility and drive qualified traffic with data-driven search strategies.",
      icon: Search,
      color: "#22C55E"
    },
    {
      title: "PPC Advertising",
      description: "Maximize ROI with precision-targeted paid campaigns across Google and Meta.",
      icon: Target,
      color: "#F97316"
    },
    {
      title: "Content Marketing",
      description: "Compelling storytelling that resonates with your audience and establishes authority.",
      icon: Edit3,
      color: "#8B5CF6"
    },
    {
      title: "Email Marketing",
      description: "Nurture leads and drive conversions with personalized, automated email sequences.",
      icon: Mail,
      color: "#EC4899"
    },
    {
      title: "Analytics & Reporting",
      description: "Gain actionable insights with comprehensive real-time performance tracking.",
      icon: BarChart2,
      color: "#0F172A"
    },
  ];

  const portfolio = [
    { 
      id: 1, 
      title: 'Fashion Retailer Campaign', 
      category: 'E-commerce', 
      image: '/hero_dashboard_mockup_1774897876378.png', // Fallback to generated asset path if served
      stats: '312% ROI · 1.2M Reach'
    },
    { 
      id: 2, 
      title: 'Fitness App Launch', 
      category: 'Mobile Marketing', 
      image: '/hero_dashboard_mockup_1774897876378.png', 
      stats: '150k Installs · 18% CTR'
    },
    { 
      id: 3, 
      title: 'Restaurant Chain Rebrand', 
      category: 'Brand Strategy', 
      image: '/hero_dashboard_mockup_1774897876378.png', 
      stats: '45% Revenue Jump'
    },
  ];

  const testimonials = [
    {
      name: "Marcus J.",
      role: "CEO, TechGrowth",
      text: "DigitalPulse transformed our online presence. Our lead volume has tripled in just 3 months.",
      rating: 5
    },
    {
      name: "Sarah L.",
      role: "Marketing Director, Bloom",
      text: "The data-driven approach they take is refreshing. We finally know exactly where our ROI is coming from.",
      rating: 5
    },
    {
       name: "David K.",
       role: "Founder, PeakPerformance",
       text: "Incredible team, incredible results. Best marketing investment we've ever made.",
       rating: 5
    }
  ];

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroLayout}>
            <div className={styles.heroLeft}>
              <div className={styles.badge}>ROI-Focused Digital Agency</div>
              <h1 className={styles.heroHeadline}>
                Transform Your <br />
                <span className={styles.textAccent}>Digital Presence</span>
              </h1>
              <p className={styles.heroSubheadline}>
                We combine data-driven strategy with award-winning creative to deliver marketing that actually grows your business.
              </p>
              <div className={styles.heroCtas}>
                <Button variant="primary" size="large" className={styles.mainCta}>Get Started</Button>
                <Button variant="outline" size="large" className={styles.secondaryCta}>View Our Work</Button>
              </div>
              <div className={styles.heroTrust}>
                 <div className={styles.trustAvatars}>
                    <div className={styles.avatar}></div>
                    <div className={styles.avatar}></div>
                    <div className={styles.avatar}></div>
                 </div>
                 <span>Trusted by 250+ global brands</span>
              </div>
            </div>
            <div className={styles.heroRight}>
               <div className={styles.imageContainer}>
                  {/* Note: In a real app, we'd use the proper path or public URL */}
                   <img 
                    src="/hero_dashboard_mockup_1774897876378.png" 
                    alt="Dashboard Analytics Mockup" 
                    className={styles.heroImage}
                  />
                  <div className={styles.floatStat}>
                     <TrendingUp color="#06B6D4" size={20} />
                     <div>
                        <strong>+184%</strong>
                        <span>Avg. Conversion Lift</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={styles.servicesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionUpper}>Our Services</span>
            <h2 className={styles.sectionTitle}>What We Offer</h2>
            <p className={styles.sectionDescription}>Strategic digital solutions designed to outperform your competition.</p>
          </div>
          <div className={styles.servicesGrid}>
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div key={idx} className={styles.serviceCard}>
                  <div className={styles.iconWrap} style={{ background: `${service.color}15`, color: service.color }}>
                    <Icon size={24} />
                  </div>
                  <h4 className={styles.serviceTitle}>{service.title}</h4>
                  <p className={styles.serviceDesc}>{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className={styles.portfolioSection}>
        <div className={styles.container}>
          <div className={styles.headerRow}>
            <div className={styles.sectionHeader}>
               <span className={styles.sectionUpper}>Portfolio</span>
               <h2 className={styles.sectionTitle}>Our Success Stories</h2>
            </div>
            <Link href="/portfolio" className={styles.viewMoreLink}>
               View All Projects <ChevronRight size={16} />
            </Link>
          </div>
          <div className={styles.portfolioGrid}>
            {portfolio.map((item) => (
              <div key={item.id} className={styles.portfolioCard}>
                <div className={styles.portfolioImageWrap}>
                   <img src={item.image} alt={item.title} className={styles.portfolioImage} />
                   <span className={styles.portfolioBadge}>{item.category}</span>
                </div>
                <div className={styles.portfolioContent}>
                   <h4 className={styles.portfolioTitle}>{item.title}</h4>
                   <p className={styles.portfolioStats}>{item.stats}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonialsSection}>
          <div className={styles.container}>
             <div className={styles.sectionHeader}>
                <span className={styles.sectionUpper}>Testimonials</span>
                <h2 className={styles.sectionTitle}>What Our Clients Say</h2>
             </div>
             <div className={styles.testimonialsGrid}>
                {testimonials.map((t, idx) => (
                   <div key={idx} className={styles.testimonialCard}>
                      <div className={styles.stars}>
                         {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} fill="#F97316" color="#F97316" />)}
                      </div>
                      <p className={styles.testimonialText}>"{t.text}"</p>
                      <div className={styles.testimonialAuthor}>
                         <div className={styles.authorAvatar}>{t.name[0]}</div>
                         <div>
                            <strong>{t.name}</strong>
                            <span>{t.role}</span>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
      </section>

      {/* Footer CTA */}
      <section className={styles.footerCta}>
         <div className={styles.container}>
            <div className={styles.ctaCard}>
               <h2>Ready to Grow Your Business?</h2>
               <p>Let's build a performance marketing strategy that delivers measurable results.</p>
               <div className={styles.ctaRow}>
                  <Button variant="primary" size="large" className={styles.ctaPrimary}>Schedule Free Consultation</Button>
                  <Button variant="outline" size="large" className={styles.ctaSecondary}>View Pricing</Button>
               </div>
            </div>
         </div>
      </section>

      {/* Floating Chatbot */}
      <div className={styles.chatbotBtn}>
         <MessageCircle size={28} />
      </div>
    </div>
  );
}

// Simple internal icon for layout
function TrendingUp({ size, color }: { size: number, color: string }) {
   return <BarChart2 size={size} color={color} style={{ transform: 'rotate(-45deg)' }} />
}
