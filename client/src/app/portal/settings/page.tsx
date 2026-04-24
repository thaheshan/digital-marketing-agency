'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import styles from './page.module.css';

export default function PortalSettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('Profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    websiteUrl: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: '',
        websiteUrl: '',
      });
    }
  }, [user]);

  const tabs = ['Profile', 'Account', 'Notifications', 'Security', 'Billing'];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);
    try {
      await api.patch('/portal/profile', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        websiteUrl: formData.websiteUrl,
      });
      setSaveStatus('Profile updated successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      setSaveStatus('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Portal Settings</h1>
          <p className={styles.sub}>Update your profile, manage account security, and configure notifications.</p>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Sidebar Tabs */}
        <aside className={styles.tabsList}>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`${styles.tabBtn} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <div className={styles.contentCard}>
          {activeTab === 'Profile' && (
            <div className={styles.section}>
              <h3>Public Profile</h3>
              <p>How the agency sees your account.</p>
              <form className={styles.form} onSubmit={handleSave}>
                <div className={styles.avatarSection}>
                  <div className={styles.avatar}>{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
                  <div className={styles.avatarActions}>
                    <button type="button" className={styles.uploadBtn}>Upload New Photo</button>
                    <button type="button" className={styles.removeBtn}>Remove</button>
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formField}>
                    <label>First Name</label>
                    <input 
                      value={formData.firstName} 
                      onChange={e => setFormData({...formData, firstName: e.target.value})}
                      className={styles.input} 
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>Last Name</label>
                    <input 
                      value={formData.lastName} 
                      onChange={e => setFormData({...formData, lastName: e.target.value})}
                      className={styles.input} 
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>Email Address</label>
                    <input value={formData.email} disabled className={styles.input} />
                  </div>
                  <div className={styles.formField}>
                    <label>Phone Number</label>
                    <input 
                      value={formData.phone} 
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      placeholder="+1 (555) 000-0000" 
                      className={styles.input} 
                    />
                  </div>
                  <div className={styles.formFieldFull}>
                    <label>Company Website</label>
                    <input 
                      value={formData.websiteUrl} 
                      onChange={e => setFormData({...formData, websiteUrl: e.target.value})}
                      placeholder="https://company.com" 
                      className={styles.input} 
                    />
                  </div>
                </div>

                {saveStatus && <div style={{ marginBottom: '16px', color: saveStatus.includes('successfully') ? '#22C55E' : '#EF4444' }}>{saveStatus}</div>}

                <div className={styles.formActions}>
                  <button type="submit" className={styles.saveBtn} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className={styles.section}>
              <h3>Email Notifications</h3>
              <p>Choose when you want to be notified by the agency.</p>
              <div className={styles.notificationList}>
                {[
                  { title: 'New Report Ready', desc: 'When your monthly performance report is available.', default: true },
                  { title: 'Campaign Milestone', desc: 'When a campaign reaches its key target or budget goal.', default: true },
                  { title: 'Direct Messages', desc: 'When your account manager sends you a message.', default: true },
                  { title: 'Invoices & Billing', desc: 'Important updates regarding your subscription and billing.', default: false },
                  { title: 'Agency News', desc: 'New service launches and general agency updates.', default: false },
                ].map((notif) => (
                  <div key={notif.title} className={styles.notifItem}>
                    <div className={styles.notifInfo}>
                      <span className={styles.notifTitle}>{notif.title}</span>
                      <span className={styles.notifDesc}>{notif.desc}</span>
                    </div>
                    <label className={styles.switch}>
                      <input type="checkbox" defaultChecked={notif.default} />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                ))}
              </div>
              <div className={styles.formActions}>
                <button className={styles.saveBtn}>Update Preferences</button>
              </div>
            </div>
          )}

          {activeTab !== 'Profile' && activeTab !== 'Notifications' && (
             <div className={styles.placeholder}>
                <span>⚙️</span>
                <h3>{activeTab} Settings</h3>
                <p>Advanced configuration for {activeTab.toLowerCase()} is coming soon.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
