import Link from 'next/link';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import styles from './page.module.css';
import { Button } from '@/components/common/Button/Button';

// Dummy content generator based on slug
const getPostData = (slug: string) => {
  // Formats slug to Title Case
  const formattedTitle = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: formattedTitle || 'The Future of Digital Marketing in 2026',
    category: 'Industry Insights',
    readTime: '8 min',
    date: 'April 14, 2026',
    image: 'https://picsum.photos/seed/' + (slug || 'marketing') + '/1200/800',
    content: `
      <p>The landscape of digital marketing is evolving at an unprecedented pace. As we navigate through 2026, artificial intelligence, hyper-personalization, and augmented reality are no longer just buzzwords—they are the core pillars of successful marketing strategies. Early adopters of these methodologies are securing dominant market positions, leaving traditional campaigns struggling to maintain relevance.</p>
      
      <h2>1. The Rise of Predictive Personalization</h2>
      <p>Gone are the days of segment-based marketing. Today's consumers expect experiences tailored not just to what they have done, but what they are highly likely to do next. Predictive algorithms are now capable of mapping individual customer journeys with staggering accuracy.</p>
      <p>By analyzing thousands of micro-interactions across your platform, machine learning models can predict the precise moment a user is ready to convert. Instead of blasting your entire mailing list with generic offers, companies are now sending highly individualized messaging at the exact time an individual is statistically most likely to purchase.</p>
      
      <blockquote>
        "Brands that fail to adopt predictive AI will find themselves speaking to audiences that have already moved on. The future belongs to those who anticipate needs before they arise."
      </blockquote>

      <h2>2. Voice Search Optimization 2.0</h2>
      <p>With smart speakers and voice assistants natively integrated into modern vehicles, wearables, and home appliances, voice queries now account for over 45% of standard local searches. However, optimizing for voice requires a massive shift from traditional keyword stuffing to Natural Language Processing (NLP) integration.</p>
      <ul>
        <li><strong>Conversational Keywords:</strong> Users do not type "best pizza new york." They ask, "Where is the best pizza place open right now near me?" Targeting long-tail interrogative questions is now mandatory.</li>
        <li><strong>Zero-Click Searches:</strong> Structuring data perfectly so Google’s AI summary simply reads your answer aloud without requiring the user to click your link.</li>
        <li><strong>Localized Context:</strong> Voice searches are inherently local. Providing immediate, actionable local business data ensures you capture the voice traffic.</li>
      </ul>

      <h2>3. Immersive Commerce via AR</h2>
      <p>Augmented reality (AR) has officially transitioned from a social media novelty to a core e-commerce conversion driver. Retailers and B2B platforms alike are leveraging AR technology to allow customers to preview products in their own physical spaces.</p>
      <p>Current data indicates that online stores offering AR integration are seeing a <strong>35% reduction in product return rates</strong> and a massive 200% boost in average session duration. When customers can visualize an item's scale and appearance in real-time, purchase confidence skyrockets.</p>
      
      <h2>4. The Post-Cookie Era Strategies</h2>
      <p>With the final death of third-party cookies, marketers are being forced to rebuild their tracking architectures from the ground up. First-party data collection strategies have become the most valuable asset a company can own.</p>
      <p>Developing interactive quizzes, high-value gated content, and loyalty programs that encourage users to willingly hand over their zero-party data is no longer optional. The companies thriving right now are the ones that own their audience rather than renting it from massive ad networks.</p>

      <h2>Conclusion</h2>
      <p>Staying ahead in digital marketing means embracing the convergence of technology and human psychology. The tools are more sophisticated than ever, but the end goal remains exactly the same: delivering genuine, undeniable value to the customer precisely when they need it most. 2026 will reward the brands that are bold enough to innovate, and punish those relying on the playbooks of yesterday.</p>
    `
  };
};

// In Next.js 15/16, params is a Promise
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = getPostData(resolvedParams.slug);

  return (
    <div className={styles.page}>
      
      {/* \u2500\u2500 Hero Banner \u2500\u2500 */}
      <section className={styles.heroBanner}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb}>
            <Link href="/blog">Blog</Link>
            <ChevronRight size={14} />
            <span>{post.category}</span>
          </nav>
          <h1 className={styles.heroTitle}>{post.title}</h1>
          <div className={styles.heroMeta}>
            <span className={styles.metaItem}><Calendar size={16} /> {post.date}</span>
            <span className={styles.metaItem}><Clock size={16} /> {post.readTime} read</span>
          </div>
        </div>
      </section>

      {/* \u2500\u2500 Image Cover \u2500\u2500 */}
      <section className={styles.coverSection}>
        <div className={styles.coverImageWrapper}>
          <img 
            src={post.image} 
            alt={post.title} 
            className={styles.coverImage} 
            referrerPolicy="no-referrer" 
          />
        </div>
      </section>

      {/* \u2500\u2500 Article Content \u2500\u2500 */}
      <section className={styles.contentSection}>
        <article 
          className={styles.articleBody} 
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
        
        {/* CTA Footer */}
        <div className={styles.articleFooter}>
          <h3 className={styles.footerTitle}>Ready to elevate your strategy?</h3>
          <p className={styles.footerText}>Let our experts analyze your current positioning and discover new growth avenues.</p>
          <Button variant="primary" size="large">Get a Free Consultation</Button>
        </div>
      </section>

    </div>
  );
}
