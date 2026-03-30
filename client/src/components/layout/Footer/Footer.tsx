'use client';

import Link from 'next/link';
import styles from './Footer.module.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Services: [
      { name: 'Social Media Marketing', href: '/services/social-media' },
      { name: 'SEO Optimization', href: '/services/seo' },
      { name: 'Content Marketing', href: '/services/content' },
      { name: 'PPC Advertising', href: '/services/ppc' },
      { name: 'Brand Strategy', href: '/services/branding' },
      { name: 'Email Marketing', href: '/services/email' },
    ],
    Company: [
      { name: 'About Us', href: '/about' },
      { name: 'Portfolio', href: '/portfolio' },
      { name: 'Testimonials', href: '/testimonials' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
    ],
    Tools: [
      { name: 'ROI Calculator', href: '/roi-calculator' },
      { name: 'Website Audit Tool', href: '/audit-tool' },
      { name: 'Pricing Calculator', href: '/pricing' },
    ],
    Legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
    ],
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          {/* Brand Column */}
          <div className={styles.brandColumn}>
            <Link href="/" className={styles.logoText}>
              Digital<span className={styles.logoAccent}>Agency</span>
            </Link>
            <p className={styles.brandDesc}>
              ROI-driven digital marketing solutions that accelerate business growth and transform digital presence.
            </p>
            <div className={styles.socialLinks}>
              {['LinkedIn', 'Twitter', 'Facebook', 'Instagram'].map((s) => (
                <a key={s} href="#" className={styles.socialLink} aria-label={s}>
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className={styles.linkColumn}>
              <h6 className={styles.columnTitle}>{category}</h6>
              <ul className={styles.linkList}>
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className={styles.footerLink}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.bottomSection}>
          <p className={styles.copyright}>
            © {currentYear} DigitalAgency. All rights reserved.
          </p>
          <p className={styles.madeWith}>
            Crafted with ❤️ for marketing excellence
          </p>
        </div>
      </div>
    </footer>
  );
};
