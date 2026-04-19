import { Star, Quote } from 'lucide-react';
import styles from './page.module.css';

const testimonials = [
  {
    id: 1,
    quote: "DigitalPulse completely transformed our approach to online marketing. Their data-driven strategy increased our booked appointments by 215% in just six months.",
    author: "Sarah Jenkins",
    role: "Marketing Director at HealthFirst",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    metrics: "215% Increase in Leads"
  },
  {
    id: 2,
    quote: "The ROI we've seen from their SEO and content marketing campaigns is staggering. They don't just chase traffic; they chase revenue.",
    author: "David Chen",
    role: "CEO of TechGrowth",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    metrics: "$1.2M Attributed Revenue"
  },
  {
    id: 3,
    quote: "What sets them apart is their transparency. The dashboard gives us real-time insights, and their team is always proactively suggesting optimizations.",
    author: "Elena Rodriguez",
    role: "Founder of StyleBrand",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    metrics: "45% Lower CPA"
  },
  {
    id: 4,
    quote: "We were struggling to scale our paid ad campaigns without seeing diminishing returns. DigitalPulse cracked the code and helped us expand into two new markets.",
    author: "Marcus Thompson",
    role: "VP of Sales, EcoHome",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    metrics: "3x ROAS"
  },
  {
    id: 5,
    quote: "The chatbot implementation alone saved our customer service team 40 hours a week while capturing leads we previously would have lost.",
    author: "Rebecca Liu",
    role: "Operations Manager",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    metrics: "40 hrs/wk Saved"
  },
  {
    id: 6,
    quote: "A true partner in our growth. They immersed themselves in our industry and delivered a comprehensive strategy that touched every point of the customer journey.",
    author: "James Wilson",
    role: "Managing Partner",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    metrics: "180% YOY Growth"
  }
];

export default function TestimonialsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Client <span className={styles.highlight}>Success Stories</span></h1>
          <p>Don't just take our word for it. Explore how we've helped ambitious brands scale their digital presence and dominate their markets.</p>
        </div>
      </header>

      <section className={styles.gridSection}>
        <div className={styles.grid}>
          {testimonials.map((t) => (
            <div key={t.id} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.rating}>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" color="#f59e0b" />
                  ))}
                </div>
                <div className={styles.metricBadge}>{t.metrics}</div>
              </div>
              
              <div className={styles.quoteBox}>
                <Quote size={32} className={styles.quoteIcon} />
                <p>"{t.quote}"</p>
              </div>

              <div className={styles.authorArea}>
                <img src={t.image} alt={t.author} className={styles.avatar} />
                <div>
                  <strong>{t.author}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2>Ready to be our next success story?</h2>
          <p>Let's build a custom growth strategy tailored to your exact business goals.</p>
          <a href="/contact" className={styles.ctaBtn}>Start Your Journey</a>
        </div>
      </section>
    </div>
  );
}
