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
  ChevronRight,
  Calculator
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
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800', 
      stats: '312% ROI · 1.2M Reach'
    },
    { 
      id: 2, 
      title: 'Fitness App Launch', 
      category: 'Mobile Marketing', 
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800', 
      stats: '150k Installs · 18% CTR'
    },
    { 
      id: 3, 
      title: 'Restaurant Chain Rebrand', 
      category: 'Brand Strategy', 
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800', 
      stats: '45% Revenue Jump'
    },
    { 
      id: 4, 
      title: 'Tech Startup Growth', 
      category: 'B2B Marketing', 
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800', 
      stats: '220% Lead Growth · 3x Pipeline'
    },
    { 
      id: 5, 
      title: 'Beauty Brand Awareness', 
      category: 'Social Media', 
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800', 
      stats: '2.5M Impressions · 9% Engagement'
    },
    { 
      id: 6, 
      title: 'Real Estate Digital Push', 
      category: 'PPC Advertising', 
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800', 
      stats: '180% ROI · 540 Qualified Leads'
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
              <h1 className={styles.heroHeadline}>
                Transform Your <br />
                Digital Presence
              </h1>
              <h2 className={styles.heroSubheadlineMain}>
                ROI-Driven Marketing That Delivers Results
              </h2>
              <p className={styles.heroDescription}>
                We combine data-driven strategy with creative excellence to help businesses grow their online presence and achieve measurable success.
              </p>
              <div className={styles.heroCtas}>
                <Link href="/register">
                  <Button variant="primary" size="medium" className={styles.mainCta}>Get Started</Button>
                </Link>
                <Button variant="outline" size="medium" className={styles.secondaryCta}>How We Work</Button>
              </div>
            </div>
            <div className={styles.heroRight}>
               <div className={styles.imageContainer}>
                   <img 
                    src="/home-img.png" 
                    alt="Digital Presence Analytics" 
                    className={styles.heroImage}
                  />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={styles.servicesSection} id="services">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionUpper}>Our Services</span>
            <h2 className={styles.sectionTitle}>What We Offer</h2>
            <p className={styles.sectionDescription}>Transform your company&apos;s potential with tailored digital marketing solutions that drive growth and results.</p>
          </div>
          <div className={styles.servicesGrid}>
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div key={idx} className={styles.serviceCard}>
                  <div className={styles.iconWrap}>
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
      <section className={styles.portfolioSection} id="portfolio">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={`${styles.sectionUpper} ${styles.sectionUpperOrange}`}>Portfolio</span>
            <h2 className={styles.sectionTitle}>Our Success Stories</h2>
            <p className={styles.sectionDescription}>Success stories from brands we&apos;ve helped grow</p>
          </div>
          <div className={styles.portfolioGrid}>
            {portfolio.map((item) => (
              <div key={item.id} className={styles.portfolioCard}>
                <div className={styles.portfolioImageWrap}>
                   <img src={item.image} alt={item.title} className={styles.portfolioImage} />
                </div>
                <div className={styles.portfolioContent}>
                   <span className={styles.portfolioCategory}>{item.category}</span>
                   <h4 className={styles.portfolioTitle}>{item.title}</h4>
                   <p className={styles.portfolioStats}>{item.stats}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.portfolioFooter}>
            <div className={styles.roiCtaCard}>
              <div className={styles.roiCtaContent}>
                <h3 className={styles.roiCtaTitle}>Ready to see your own growth?</h3>
                <p className={styles.roiCtaDesc}>Use our proprietary ROI calculator to estimate the potential revenue growth for your business.</p>
              </div>
              <Link href="/roi-calculator">
                <Button variant="primary" size="large" className={styles.roiButton}>
                  <Calculator size={20} className={styles.ctaIcon} />
                  Calculate Your ROI
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonialsSection}>
          <div className={styles.container}>
             <div className={styles.sectionHeader}>
                <span className={styles.sectionUpper}>Testimonials</span>
                <h2 className={styles.sectionTitle}>What Our Clients Say</h2>
                <p className={styles.sectionDescription}>Don&apos;t just take our word for it</p>
             </div>
             <div className={styles.testimonialsGrid}>
                {testimonials.map((t, idx) => (
                   <div key={idx} className={styles.testimonialCard}>
                      <div className={styles.stars}>
                         {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} fill="#F97316" color="#F97316" />)}
                      </div>
                      <p className={styles.testimonialText}>&ldquo;{t.text}&rdquo;</p>
                      <div className={styles.testimonialAuthor}>
                         <div className={styles.authorAvatar}>
                            <img src={`https://i.pravatar.cc/150?u=${t.name}`} alt={t.name} />
                         </div>
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
            <h2 className={styles.ctaTitle}>Ready to Grow Your Business?</h2>
            <p className={styles.ctaDescription}>Let&apos;s build a performance marketing strategy that delivers measurable results for your business.</p>
            <div className={styles.ctaRow}>
               <Button variant="primary" size="large" className={styles.ctaPrimary}>Schedule Free Consultation</Button>
               <Button variant="outline" size="large" className={styles.ctaSecondary}>View Pricing</Button>
            </div>
         </div>
      </section>

    </div>
  );
}

// Simple internal icon for layout
function TrendingUp({ size, color }: { size: number, color: string }) {
   return <BarChart2 size={size} color={color} style={{ transform: 'rotate(-45deg)' }} />
}
