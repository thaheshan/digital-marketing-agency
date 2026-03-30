'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, Menu, X, ArrowRight } from 'lucide-react';
import styles from './Navbar.module.css';
import { Button } from '../../common/Button/Button';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'About', href: '/about' },
    { name: 'ROI Calculator', href: '/roi-calculator' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">
             <div className={styles.logoIcon}>
                <TrendingUp size={22} color="#06B6D4" strokeWidth={3} />
             </div>
             <span className={styles.logoText}>Digital<span className={styles.logoAccent}>Pulse</span></span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          <ul className={styles.navLinks}>
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className={styles.navLink}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/portal/login" className={styles.portalLink}>Client Portal</Link>
          <Button variant="primary" size="medium" className={styles.headerBtn}>
             Get Started <ArrowRight size={16} />
          </Button>
        </nav>

        {/* Mobile menu button */}
        <button 
          className={styles.mobileMenuBtn} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Slide-in Menu */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.mobileContent}>
          <ul className={styles.mobileNavLinks}>
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  href={link.href} 
                  className={styles.mobileNavLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className={styles.mobileFooter}>
             <Button variant="primary" fullWidth size="large">Get Started</Button>
             <Link href="/portal/login" className={styles.portalLinkMob}>Client Portal</Link>
          </div>
        </div>
      </div>
    </header>
  );
};
