'use client';

import React, { useState } from 'react';
import { Save, Globe, Shield, Bell, Zap, Sliders, Briefcase } from 'lucide-react';
import styles from './page.module.css';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('General');

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Agency Settings</h1>
          <p className={styles.sub}>Configure global agency defaults, security policies, and integrations.</p>
        </div>
        <button className={styles.saveBtn}>
          <Save size={18} />
          <span>Save Changes</span>
        </button>
      </div>

      <div className={styles.container}>
        <aside className={styles.sidebar}>
          {['General', 'Branding', 'Integrations', 'Security', 'Billing Plans'].map(tab => (
            <button 
              key={tab} 
              className={`${styles.tabBtn} ${activeTab === tab ? styles.active : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'General' && <Sliders size={18} />}
              {tab === 'Branding' && <Zap size={18} />}
              {tab === 'Integrations' && <Globe size={18} />}
              {tab === 'Security' && <Shield size={18} />}
              {tab === 'Billing Plans' && <Briefcase size={18} />}
              <span>{tab}</span>
            </button>
          ))}
        </aside>

        <main className={styles.content}>
          {activeTab === 'General' && (
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>General Agency Information</h2>
              <div className={styles.fieldGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>Agency Name</label>
                  <input className={styles.input} defaultValue="Digital Pulse Marketing" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Primary Contact Email</label>
                  <input className={styles.input} defaultValue="hello@digitalpulse.com" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Default Currency</label>
                  <select className={styles.input}>
                    <option>GBP (£)</option>
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Timezone</label>
                  <select className={styles.input}>
                    <option>London (GMT+0)</option>
                    <option>New York (EST)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Branding' && (
            <div className={styles.formSection}>
               <h2 className={styles.sectionTitle}>Visual Identity</h2>
               <div className={styles.brandingPreview}>
                  <div className={styles.logoSlot}>
                     <div className={styles.logoBox}>DP</div>
                     <button className={styles.uploadBtn}>Change Logo</button>
                  </div>
                  <div className={styles.colorSlot}>
                     <label className={styles.label}>Brand Primary Color</label>
                     <div className={styles.colorPicker}>
                        <div className={styles.colorDot} style={{ background: '#06b6d4' }} />
                        <input className={styles.input} defaultValue="#06b6d4" />
                     </div>
                  </div>
               </div>
            </div>
          )}
          
          <div className={styles.bottomActions}>
             <p className={styles.hint}>All system logs are audited for security purposes. Last updated: 2h ago</p>
          </div>
        </main>
      </div>
    </div>
  );
}
