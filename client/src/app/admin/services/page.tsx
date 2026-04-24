'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Globe, Zap, Target, Search, MoreVertical, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';
import styles from './page.module.css';

export default function AgencyServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await api.get<any[]>('/admin/services');
        setServices(data || []);
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Agency Services</h1>
          <p className={styles.sub}>Manage service offerings, monitor vertical profitability, and update pricing tiers.</p>
        </div>
        <Link href="/admin/services/new" className={styles.addBtn}>
          <Plus size={18} />
          <span>Add Service</span>
        </Link>
      </div>

      <div className={styles.grid}>
        {loading ? (
          <div className={styles.loading}>Loading services...</div>
        ) : services.length === 0 ? (
          <div className={styles.empty}>No services found. Add your first one!</div>
        ) : (
          services.map(service => {
            const Icon = Globe; // Default icon
            const color = '#3b82f6';
            return (
              <div key={service.id} className={styles.serviceCard}>
                 <div className={styles.cardTop}>
                    <div className={styles.iconBox} style={{ background: `${color}15`, color }}>
                       <Icon size={24} />
                    </div>
                    <span className={styles.statusBadge}>{service.isPublished ? 'Live' : 'Draft'}</span>
                 </div>
                 <h3 className={styles.serviceName}>{service.name}</h3>
                 <p className={styles.category}>{service.tagline}</p>
                 
                 <div className={styles.stats}>
                    <div className={styles.statItem}>
                       <span className={styles.statLabel}>Pricing From</span>
                       <span className={styles.statValue}>£{service.priceFromPence / 100}</span>
                    </div>
                    <div className={styles.statItem}>
                       <span className={styles.statLabel}>Projects Done</span>
                       <span className={styles.statValue}>{service.projectsCompleted}</span>
                    </div>
                 </div>
                 
                 <div className={styles.cardFooter}>
                    <button className={styles.manageBtn}>Configure Service</button>
                    <button className={styles.moreBtn}><MoreVertical size={16} /></button>
                 </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
