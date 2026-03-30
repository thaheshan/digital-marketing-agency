import styles from './page.module.css';
import Link from 'next/link';
import { Button } from '@/components/common/Button/Button';

export const metadata = {
  title: 'About Us | Digital Marketing Agency',
  description: 'Learn about our mission, team, and the values that drive exceptional marketing results for our clients.',
};

const stats = [
  { value: '250+', label: 'Projects Delivered' },
  { value: '180%', label: 'Average ROI' },
  { value: '4.9★', label: 'Client Rating' },
  { value: '8yrs', label: 'Industry Experience' },
];

const values = [
  { icon: '🎯', title: 'Results-Driven', desc: 'Every campaign is built around measurable outcomes. We define KPIs before we start, and we hold ourselves accountable to them.' },
  { icon: '🤝', title: 'Client-Centric', desc: 'You get a dedicated account manager from day one. Transparent communication, regular reporting, no hidden surprises.' },
  { icon: '🧪', title: 'Data-Led', desc: 'We test, iterate, and optimise constantly. Every decision is backed by data, not gut feelings.' },
  { icon: '🚀', title: 'Innovation-First', desc: 'We adopt emerging platforms and technologies early, so your brand stays ahead of the curve.' },
];

const team = [
  { name: 'Amara Singh', role: 'CEO & Strategy Director', emoji: '👩‍💼', color: 'linear-gradient(135deg, #0F172A, #06B6D4)' },
  { name: 'Marcus Chen', role: 'Head of SEO & Content', emoji: '👨‍💻', color: 'linear-gradient(135deg, #1E293B, #22C55E)' },
  { name: 'Priya Nair', role: 'Social Media Lead', emoji: '👩‍🎨', color: 'linear-gradient(135deg, #0F172A, #F97316)' },
  { name: 'James Okafor', role: 'PPC & Analytics Manager', emoji: '👨‍📊', color: 'linear-gradient(135deg, #1E293B, #8B5CF6)' },
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>We Turn Brands Into Growth Engines</h1>
          <p className={styles.heroSub}>A results-obsessed digital marketing agency with 8+ years of proven track record and 250+ successful campaigns.</p>
          <div className={styles.heroCtas}>
            <Link href="/contact"><Button variant="primary" size="large">Work With Us</Button></Link>
            <Link href="/portfolio"><Button variant="outline" size="medium">See Our Work</Button></Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.statsSection}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            {stats.map(s => (
              <div key={s.label} className={styles.statCard}>
                <div className={styles.statValue}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className={styles.missionSection}>
        <div className={styles.container}>
          <div className={styles.missionGrid}>
            <div className={styles.missionText}>
              <p className={styles.overline}>Our Mission</p>
              <h2 className={styles.missionTitle}>Empowering Businesses to Grow Through Intelligent Marketing</h2>
              <p className={styles.missionDesc}>We believe every business deserves access to world-class marketing. Founded in 2016, we've helped companies of all sizes — from funded startups to established enterprises — achieve breakthrough growth through tailored digital strategies.</p>
              <p className={styles.missionDesc}>Our approach combines creative storytelling with rigorous data analysis. We don't just run campaigns; we build sustainable growth systems that compound over time.</p>
            </div>
            <div className={styles.missionVisual}>
              <div className={styles.missionCard}>
                <div className={styles.missionTimelineItem}><div className={styles.year}>2016</div><p>Founded with a team of 3, focused on SEO</p></div>
                <div className={styles.missionTimelineItem}><div className={styles.year}>2018</div><p>Expanded to full-service digital marketing</p></div>
                <div className={styles.missionTimelineItem}><div className={styles.year}>2021</div><p>Launched AI-powered analytics platform</p></div>
                <div className={styles.missionTimelineItem}><div className={styles.year}>2024</div><p>250+ clients, $50M+ in revenue generated</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={styles.valuesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>What We Stand For</h2>
            <p className={styles.sectionSub}>The principles that guide every strategy, campaign, and client relationship.</p>
          </div>
          <div className={styles.valuesGrid}>
            {values.map(v => (
              <div key={v.title} className={styles.valueCard}>
                <div className={styles.valueIcon}>{v.icon}</div>
                <h4 className={styles.valueTitle}>{v.title}</h4>
                <p className={styles.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className={styles.teamSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Meet the Team</h2>
            <p className={styles.sectionSub}>Strategists, creatives, and analysts who live and breathe digital marketing.</p>
          </div>
          <div className={styles.teamGrid}>
            {team.map(m => (
              <div key={m.name} className={styles.teamCard}>
                <div className={styles.teamAvatar} style={{ background: m.color }}>
                  <span className={styles.teamEmoji}>{m.emoji}</span>
                </div>
                <h5 className={styles.teamName}>{m.name}</h5>
                <p className={styles.teamRole}>{m.role}</p>
                <div className={styles.teamLinks}>
                  <a href="#" className={styles.teamLink}>in</a>
                  <a href="#" className={styles.teamLink}>tw</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>Ready to Start Your Growth Journey?</h2>
          <p className={styles.ctaSub}>Let&apos;s build a strategy tailored to your business goals.</p>
          <Link href="/contact"><Button variant="primary" size="large">Get a Free Consultation</Button></Link>
        </div>
      </section>
    </div>
  );
}
