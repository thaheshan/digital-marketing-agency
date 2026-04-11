'use client';

import Link from 'next/link';
import { Mail, Phone, Star, Share2 } from 'lucide-react';
import styles from './Footer.module.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Services: [
      { name: 'Social Media Marketing', href: '/services/social-media' },
      { name: 'SEO Optimization', href: '/services/seo' },
      { name: 'PPC Advertising', href: '/services/ppc' },
      { name: 'Content Marketing', href: '/services/content' },
      { name: 'Email Marketing', href: '/services/email' },
    ],
    Company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Team', href: '/team' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press Release', href: '/press' },
      { name: 'FAQ', href: '/faq' },
    ],
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          {/* Brand Column */}
          <div className={styles.brandColumn}>
            <Link href="/" className={styles.logoText}>
              Digital<span className={styles.logoAccent}>Pulse</span>
            </Link>
            <p className={styles.brandDesc}>
              We transform company&apos;s potential with tailored digital marketing solutions.
            </p>
            <div className={styles.socialLinks}>
               <a href="#" className={styles.socialIcon}>
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
               </a>
               <a href="#" className={styles.socialIcon}>
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
               </a>
               <a href="#" className={styles.socialIcon}>
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
               </a>
               <a href="#" className={styles.socialIcon}>
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
               </a>
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

          {/* Contact Column */}
          <div className={styles.linkColumn}>
            <h6 className={styles.columnTitle}>Contact</h6>
            <ul className={styles.contactList}>
               <li>
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                 <span>Address</span>
               </li>
               <li><Phone size={16} /> <span>(123) 456-7890</span></li>
               <li><Mail size={16} /> <span>info@digitalpulse.com</span></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottomSection}>
          <p className={styles.copyright}>
            © {currentYear} DigitalPulse. All rights reserved.
          </p>
          <div className={styles.bottomLinks}>
             <Link href="/privacy">Privacy Policy</Link>
             <Link href="/terms">Terms of Service</Link>
             <Link href="/cookies">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
