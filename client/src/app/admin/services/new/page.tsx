'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import styles from './page.module.css';

export default function NewServicePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!name || !tagline) return;
    setIsSubmitting(true);
    try {
      const res = await api.post<any>('/admin/services/create', {
        name,
        tagline,
        description,
        priceFromPence: parseInt(price) * 100
      });
      if (res.success) {
        router.push('/admin/services');
      }
    } catch (err) {
      console.error('Failed to create service:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link href="/admin/services" className={styles.backLink}>
          <ArrowLeft size={16} /> Services
        </Link>
        <div className={styles.topActions}>
          <button 
            className={styles.publishBtn} 
            onClick={handleCreate}
            disabled={isSubmitting || !name || !tagline}
          >
            <Save size={16} /> {isSubmitting ? 'Creating...' : 'Create Service'}
          </button>
        </div>
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>New Agency Service</h1>
        <p className={styles.sub}>Define a new high-impact service offering for your agency.</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.mainCol}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Basic Information</h2>
            <div className={styles.field}>
              <label className={styles.label}>Service Name *</label>
              <input 
                className={styles.input} 
                placeholder="e.g. Content Strategy & SEO" 
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Tagline *</label>
              <input 
                className={styles.input} 
                placeholder="e.g. Elevate your brand's digital authority" 
                value={tagline}
                onChange={e => setTagline(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Description</label>
              <textarea 
                className={styles.textarea} 
                placeholder="Describe the value proposition and core deliverables..." 
                rows={6}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.sideCol}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Pricing</h2>
            <div className={styles.field}>
              <label className={styles.label}>Starting Price (£)</label>
              <div className={styles.priceInputWrapper}>
                <span className={styles.currencySymbol}>£</span>
                <input 
                  type="number" 
                  className={styles.priceInput} 
                  placeholder="999" 
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                />
              </div>
            </div>
            <p className={styles.priceHint}>This is the "Starting from" price shown on your public pricing page.</p>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Visibility</h2>
            <div className={styles.statusInfo}>
              <div className={styles.statusDot} />
              <span>Published instantly on save</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
