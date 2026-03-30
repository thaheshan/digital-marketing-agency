'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('Agency');

  const tabs = ['Agency', 'Staff', 'Services', 'Integrations', 'Security'];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>System Settings</h1>
          <p className={styles.sub}>Configure agency branding, manage staff access, and system integrations.</p>
        </div>
      </div>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          {tabs.map(tab => (
            <button 
              key={tab} 
              className={`${styles.tabBtn} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </aside>

        <div className={styles.content}>
          {activeTab === 'Agency' && (
            <div className={styles.section}>
              <h3>Agency Branding</h3>
              <p>Customize how your agency appears to clients in the portal.</p>
              
              <div className={styles.form}>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Agency Name</label>
                    <input defaultValue="DigitalFlow Agency" className={styles.input} />
                  </div>
                  <div className={styles.field}>
                    <label>Support Email</label>
                    <input defaultValue="hello@digitalflow.com" className={styles.input} />
                  </div>
                </div>

                <div className={styles.field}>
                    <label>Agency Logo</label>
                    <div className={styles.logoUpload}>
                        <div className={styles.logoPreview}>DF</div>
                        <button className={styles.uploadBtn}>Change Logo</button>
                    </div>
                </div>

                <div className={styles.field}>
                  <label>Primary Brand Color</label>
                  <div className={styles.colorPicker}>
                    <input type="color" defaultValue="#06B6D4" className={styles.colorInput} />
                    <span className={styles.colorHex}>#06B6D4 (Cyan)</span>
                  </div>
                </div>

                <div className={styles.actions}>
                  <button className={styles.saveBtn}>Save Agency Settings</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Staff' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <div>
                  <h3>Staff & Permissions</h3>
                  <p>Manage access for your account managers and specialists.</p>
                </div>
                <button className={styles.addBtn}>+ Invite Staff</button>
              </div>

              <div className={styles.staffTable}>
                 <table className={styles.table}>
                    <thead>
                       <tr>
                          <th>Staff Member</th>
                          <th>Role</th>
                          <th>Accounts</th>
                          <th>Status</th>
                          <th>Action</th>
                       </tr>
                    </thead>
                    <tbody>
                       {[
                         { name: 'Sarah Kim', role: 'Senior Account Manager', accounts: 12, status: 'Active', initials: 'SK' },
                         { name: 'Marcus Chen', role: 'SEO Specialist', accounts: 8, status: 'Active', initials: 'MC' },
                         { name: 'Priya Nair', role: 'PPC Lead', accounts: 15, status: 'Active', initials: 'PN' },
                         { name: 'James Okafor', role: 'Content Strategist', accounts: 6, status: 'Away', initials: 'JO' },
                       ].map(staff => (
                         <tr key={staff.name}>
                           <td>
                              <div className={styles.staffCell}>
                                 <div className={styles.staffAvatar}>{staff.initials}</div>
                                 <span className={styles.staffName}>{staff.name}</span>
                              </div>
                           </td>
                           <td>{staff.role}</td>
                           <td className={styles.center}>{staff.accounts}</td>
                           <td><span className={`${styles.status} ${staff.status === 'Active' ? styles.active : styles.away}`}>{staff.status}</span></td>
                           <td><button className={styles.editBtn}>Edit</button></td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
            </div>
          )}

          {activeTab !== 'Agency' && activeTab !== 'Staff' && (
             <div className={styles.placeholder}>
                <span>🛠️</span>
                <h3>{activeTab} Management</h3>
                <p>System module for {activeTab.toLowerCase()} is being initialized.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
