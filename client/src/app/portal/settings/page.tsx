'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function PortalSettingsPage() {
  const [activeTab, setActiveTab] = useState('Profile');

  const tabs = ['Profile', 'Account', 'Notifications', 'Security', 'Billing'];

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
              <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                <div className={styles.avatarSection}>
                  <div className={styles.avatar}>JD</div>
                  <div className={styles.avatarActions}>
                    <button className={styles.uploadBtn}>Upload New Photo</button>
                    <button className={styles.removeBtn}>Remove</button>
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formField}>
                    <label>First Name</label>
                    <input defaultValue="John" className={styles.input} />
                  </div>
                  <div className={styles.formField}>
                    <label>Last Name</label>
                    <input defaultValue="Doe" className={styles.input} />
                  </div>
                  <div className={styles.formField}>
                    <label>Email Address</label>
                    <input defaultValue="john@company.com" className={styles.input} />
                  </div>
                  <div className={styles.formField}>
                    <label>Phone Number</label>
                    <input defaultValue="+1 (555) 000-0000" className={styles.input} />
                  </div>
                  <div className={styles.formFieldFull}>
                    <label>Company Website</label>
                    <input defaultValue="https://company.com" className={styles.input} />
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button type="submit" className={styles.saveBtn}>Save Changes</button>
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
