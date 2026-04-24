'use client';

import { useState } from 'react';
import { Download, CheckCircle2 } from 'lucide-react';
import styles from './page.module.css';

export default function PortalExportPage() {
  const [format, setFormat] = useState('csv');
  const [period, setPeriod] = useState('last_30_days');
  const [isExporting, setIsExporting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setSuccess(false);
    
    // Simulate API export generation
    setTimeout(() => {
      setIsExporting(false);
      setSuccess(true);
      
      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Export Data</h1>
        <p className={styles.sub}>Download your campaign metrics and analytics data for external use.</p>
      </div>

      <div className={styles.card}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Select Data to Export</label>
          <div className={styles.checkboxList}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" defaultChecked /> Campaign Performance (Clicks, Impressions, Spend)
            </label>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" defaultChecked /> Goal Completions & Conversions
            </label>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" defaultChecked /> Audience Demographics
            </label>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" /> Traffic Sources & Referrals
            </label>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Date Range</label>
          <select 
            className={styles.dateSelect}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="last_7_days">Last 7 Days</option>
            <option value="last_30_days">Last 30 Days</option>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="q1">Q1 2026</option>
            <option value="year_to_date">Year to Date</option>
            <option value="all_time">All Time</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Export Format</label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input 
                type="radio" 
                name="format" 
                value="csv" 
                checked={format === 'csv'}
                onChange={() => setFormat('csv')}
              /> 
              CSV (.csv)
            </label>
            <label className={styles.radioLabel}>
              <input 
                type="radio" 
                name="format" 
                value="xlsx" 
                checked={format === 'xlsx'}
                onChange={() => setFormat('xlsx')}
              /> 
              Excel (.xlsx)
            </label>
          </div>
        </div>

        <button 
          className={styles.exportBtn} 
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? (
            'Generating File...'
          ) : (
            <><Download size={18} /> Export Data</>
          )}
        </button>

        {success && (
          <div className={styles.successMessage}>
            <CheckCircle2 size={18} />
            Export generated successfully! Your download should begin automatically.
          </div>
        )}
      </div>
    </div>
  );
}
