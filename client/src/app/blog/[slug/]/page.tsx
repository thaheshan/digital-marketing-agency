'use client';

import { useParams } from 'next/navigation';
import styles from './page.module.css';
import Link from 'next/link';

const blogPosts: Record<string, any> = {
  'seo-trends-2026': {
    title: 'Top SEO Trends for 2026: AI & Search Intent',
    category: 'SEO',
    date: 'Mar 25, 2026',
    author: 'Marcus Chen',
    authorRole: 'SEO Specialist',
    heroIcon: '🤖',
    content: `
      Search Engine Optimization is evolving faster than ever. In 2026, the focus has shifted from keyword density to true AI-driven search intent. 
      Google's latest algorithm updates prioritize content that provides a comprehensive, high-value answer to complex user queries.
      
      ## 1. AI-Powered Search Overviews
      The rise of SGE (Search Generative Experience) means your content must be structured for both humans and AI models. 
      Structured data and clear, authoritative headings are no longer optional.

      ## 2. The Era of Topical Authority
      Gone are the days of ranking for a single keyword. You must now prove you are an authority on a broad topic. 
      This is achieved through deep, interconnected content clusters that cover every sub-niche of your primary service.

      ## 3. User Experience & Core Web Vitals
      Speed and stability remain critical. 2026 sees a renewed focus on visual stability and interactive latency. 
      If your site isn't fast, it doesn't matter how good your content is.
    `,
    related: [
       { title: 'The Power of Content Clusters', slug: 'content-clusters' },
       { title: 'Technical SEO Audit Guide', slug: 'technical-seo-guide' }
    ]
  },
  'social-engagement-strategies': {
     title: 'Social Engagement Strategies for B2B Growth',
     category: 'Social Media',
     date: 'Mar 20, 2026',
     author: 'Sarah Kim',
     authorRole: 'Account Manager',
     heroIcon: '📱',
     content: `
       B2B marketing on social media is no longer just about whitepapers and corporate announcements. 
       In 2026, employee advocacy and authentic video content are the primary drivers of engagement on LinkedIn and beyond.

       ## 1. Humanizing the Brand
       People buy from people. Showcase the team behind the products. 
       Videos of your specialists solving real-world problems will outperform corporate slickness every time.

       ## 2. Leveraging Video in B2B
       Vertical video isn't just for Gen Z. Short-form, educational video content is dominating B2B feeds. 
       Focus on "how-to" snippets and quick perspective takes.
     `,
     related: [
        { title: 'Choosing the Right Platforms', slug: 'platform-strategy' },
        { title: 'Influencer Marketing for SaaS', slug: 'influencer-saas' }
     ]
  }
};

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const post = blogPosts[slug] || {
    title: 'Marketing Insights & Strategy',
    category: 'General',
    date: 'Mar 30, 2026',
    author: 'Agency Team',
    authorRole: 'Marketing Experts',
    heroIcon: '💡',
    content: `
      Welcome to our latest marketing insight. We share regular updates on the digital landscape to help you scale your business.
      
      ## Stay Ahead of the Curve
      The digital world changes daily. Our experts analyze the latest data and trends to provide you with actionable strategies.
      
      ## Continuous Optimization
      The key to success is constant testing and refinement. Use these insights to improve your campaigns and drive better ROI.
    `,
    related: []
  };

  return (
    <div className={styles.page}>
      <article className={styles.article}>
        {/* Post Header */}
        <header className={styles.header}>
          <div className={styles.container}>
             <span className={styles.badge}>{post.category}</span>
             <h1 className={styles.title}>{post.title}</h1>
             <div className={styles.meta}>
                <div className={styles.author}>
                   <div className={styles.avatar}>{post.author[0]}</div>
                   <div>
                      <strong>{post.author}</strong>
                      <span>{post.authorRole}</span>
                   </div>
                </div>
                <div className={styles.date}>{post.date}</div>
             </div>
          </div>
        </header>

        {/* Hero Visual */}
        <section className={styles.visual}>
           <div className={styles.container}>
              <div className={styles.heroBox}>{post.heroIcon}</div>
           </div>
        </section>

        {/* Content Body */}
        <section className={styles.content}>
           <div className={styles.container}>
              <div className={styles.contentGrid}>
                 <div className={styles.body} dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}></div>
                 
                 <aside className={styles.sidebar}>
                    <div className={styles.sidebarBox}>
                       <h3>Related Posts</h3>
                       <div className={styles.relatedList}>
                          {post.related.length > 0 ? post.related.map((r: any) => (
                             <Link key={r.slug} href={`/blog/${r.slug}`} className={styles.relatedItem}>
                                {r.title}
                             </Link>
                          )) : (
                             <p>More insights coming soon.</p>
                          )}
                       </div>
                    </div>

                    <div className={styles.newsletter}>
                       <h3>Stay Updated</h3>
                       <p>Get the latest marketing trends delivered to your inbox.</p>
                       <input placeholder="Email Address" className={styles.subInput} />
                       <button className={styles.subBtn}>Subscribe</button>
                    </div>
                 </aside>
              </div>
           </div>
        </section>
      </article>

      {/* Blog CTA */}
      <section className={styles.blogCta}>
         <div className={styles.container}>
            <div className={styles.ctaCard}>
               <h2>Ready to apply these insights?</h2>
               <p>Our team is ready to help you implement advanced strategies for your brand.</p>
               <Link href="/contact" className={styles.primary}>Get Started →</Link>
            </div>
         </div>
      </section>
    </div>
  );
}
