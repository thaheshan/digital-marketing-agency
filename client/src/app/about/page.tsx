import { Users, Target, Zap, ShieldCheck } from 'lucide-react';
import styles from './page.module.css';

const team = [
  { name: 'Sarah Chen', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400' },
  { name: 'Marcus Johnson', role: 'Head of Growth', image: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&q=80&w=400' },
  { name: 'Elena Rodriguez', role: 'Creative Director', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400' },
  { name: 'David Kim', role: 'Technical SEO Lead', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400' }
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>We grow brands through <span className={styles.highlight}>data and creativity</span>.</h1>
          <p>DigitalPulse is a full-service digital marketing agency built for ambitious businesses ready to scale.</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className={styles.missionSection}>
        <div className={styles.missionGrid}>
          <div className={styles.missionText}>
            <h2>Our Mission</h2>
            <p>To eliminate the guesswork from digital marketing. We believe that every marketing dollar should be accountable, and every campaign should drive measurable ROI. We merge cutting-edge technology with human creativity to deliver strategies that actually work.</p>
          </div>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>$50M+</h3>
              <p>Client Revenue Generated</p>
            </div>
            <div className={styles.statCard}>
              <h3>95%</h3>
              <p>Client Retention Rate</p>
            </div>
            <div className={styles.statCard}>
              <h3>120+</h3>
              <p>Active Campaigns</p>
            </div>
            <div className={styles.statCard}>
              <h3>15+</h3>
              <p>Industry Awards</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={styles.valuesSection}>
        <h2 className={styles.sectionTitle}>Our Core Values</h2>
        <div className={styles.valuesGrid}>
          <div className={styles.valueCard}>
            <div className={styles.valueIcon}><Target size={24} /></div>
            <h3>Results-Obsessed</h3>
            <p>We don't care about vanity metrics. We focus exclusively on the numbers that impact your bottom line.</p>
          </div>
          <div className={styles.valueCard}>
            <div className={styles.valueIcon}><ShieldCheck size={24} /></div>
            <h3>Radical Transparency</h3>
            <p>Full access to your data, honest reporting, and zero hidden fees. You always know exactly what we're doing.</p>
          </div>
          <div className={styles.valueCard}>
            <div className={styles.valueIcon}><Zap size={24} /></div>
            <h3>Agile Execution</h3>
            <p>The digital landscape changes daily. We move fast, test constantly, and adapt strategies in real-time.</p>
          </div>
          <div className={styles.valueCard}>
            <div className={styles.valueIcon}><Users size={24} /></div>
            <h3>True Partnership</h3>
            <p>We operate as an extension of your team, immersing ourselves deeply into your business model and goals.</p>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className={styles.teamSection}>
        <h2 className={styles.sectionTitle}>Meet the Leadership</h2>
        <div className={styles.teamGrid}>
          {team.map((member, idx) => (
            <div key={idx} className={styles.teamCard}>
              <img src={member.image} alt={member.name} className={styles.teamImage} />
              <div className={styles.teamInfo}>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>Ready to meet the team?</h2>
        <p>Schedule a discovery call to see if we're the right fit for your next big project.</p>
        <a href="/contact" className={styles.ctaBtn}>Get in Touch</a>
      </section>
    </div>
  );
}
