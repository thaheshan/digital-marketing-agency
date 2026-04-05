'use client';

import { useState } from 'react';
import { Plus, MoreHorizontal, Shield, Edit2, Activity } from 'lucide-react';
import styles from './page.module.css';

const MOCK_TEAM = [
  { id: 't1', name: 'Priya Nanthakumar', email: 'admin@digitalpulse.com', role: 'Admin', status: 'Active', lastActive: '2 hours ago', initials: 'PN' },
  { id: 't2', name: 'Tom Bradley', email: 'tom@digitalpulse.com', role: 'Content Manager', status: 'Active', lastActive: '30 min ago', initials: 'TB' },
  { id: 't3', name: 'Sarah Keane', email: 'sarah.k@digitalpulse.com', role: 'Account Manager', status: 'Active', lastActive: '1 hour ago', initials: 'SK' },
  { id: 't4', name: 'Marcus Chen', email: 'marcus@digitalpulse.com', role: 'Account Manager', status: 'Active', lastActive: '3 hours ago', initials: 'MC' },
  { id: 't5', name: 'James Owens', email: 'james.o@digitalpulse.com', role: 'Analyst', status: 'Inactive', lastActive: '5 days ago', initials: 'JO' },
];

const ROLE_COLORS: Record<string, string> = {
  Admin: '#0f172a',
  'Content Manager': '#06B6D4',
  'Account Manager': '#22C55E',
  Analyst: '#F97316',
};

const ROLE_PERMS: Record<string, string[]> = {
  Admin: ['All access · Full system control'],
  'Content Manager': ['Portfolio CMS', 'Blog editor', 'Testimonials', 'AI tools'],
  'Account Manager': ['Client accounts', 'Campaigns', 'Reports', 'Messages'],
  Analyst: ['Analytics viewing', 'Campaign data', 'Report export'],
};

export default function AdminTeamPage() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('');

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Team Management</h1>
          <p className={styles.pageSub}>{MOCK_TEAM.filter(t => t.status === 'Active').length} active members</p>
        </div>
        <button className={styles.addBtn} onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Invite Member
        </button>
      </div>

      {/* Role permissions overview */}
      <div className={styles.rolesRow}>
        {Object.entries(ROLE_PERMS).map(([role, perms]) => (
          <div key={role} className={styles.roleCard}>
            <div className={styles.roleHeader}>
              <Shield size={15} color={ROLE_COLORS[role]} />
              <span style={{ color: ROLE_COLORS[role] }}>{role}</span>
            </div>
            <ul className={styles.permList}>
              {perms.map(p => <li key={p}>{p}</li>)}
            </ul>
          </div>
        ))}
      </div>

      {/* Team table */}
      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Member</th>
              <th>Role</th>
              <th>Permissions</th>
              <th>Status</th>
              <th>Last Active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {MOCK_TEAM.map(member => (
              <tr key={member.id} className={styles.tr}>
                <td>
                  <div className={styles.memberCell}>
                    <div className={styles.avatar} style={{ background: ROLE_COLORS[member.role] + '20', color: ROLE_COLORS[member.role] }}>
                      {member.initials}
                    </div>
                    <div>
                      <strong>{member.name}</strong>
                      <span>{member.email}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={styles.roleChip} style={{ background: ROLE_COLORS[member.role] + '15', color: ROLE_COLORS[member.role] }}>
                    {member.role}
                  </span>
                </td>
                <td>
                  <div className={styles.permTags}>
                    {ROLE_PERMS[member.role].slice(0, 2).map(p => (
                      <span key={p} className={styles.permTag}>{p}</span>
                    ))}
                    {ROLE_PERMS[member.role].length > 2 && <span className={styles.permMore}>+{ROLE_PERMS[member.role].length - 2}</span>}
                  </div>
                </td>
                <td>
                  <span className={`${styles.statusDot} ${member.status === 'Active' ? styles.active : styles.inactive}`}>
                    {member.status}
                  </span>
                </td>
                <td className={styles.lastActive}>{member.lastActive}</td>
                <td>
                  <div className={styles.rowMenu} onClick={() => setOpenMenu(openMenu === member.id ? null : member.id)}>
                    <MoreHorizontal size={16} />
                    {openMenu === member.id && (
                      <div className={styles.dropdown}>
                        <button className={styles.ddItem}><Edit2 size={13} /> Edit Role</button>
                        <button className={styles.ddItem}><Activity size={13} /> View Activity</button>
                        <button className={`${styles.ddItem} ${styles.ddRemove}`}>Remove</button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Member modal */}
      {showAdd && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Invite Team Member</h3>
            <p className={styles.modalSub}>An invite email will be sent with login instructions.</p>
            <div className={styles.modalForm}>
              <div className={styles.field}>
                <label>Full Name</label>
                <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Jane Smith" className={styles.input} />
              </div>
              <div className={styles.field}>
                <label>Work Email</label>
                <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="jane@digitalpulse.com" className={styles.input} />
              </div>
              <div className={styles.field}>
                <label>Role</label>
                <select value={newRole} onChange={e => setNewRole(e.target.value)} className={styles.select}>
                  <option value="">Select role</option>
                  <option>Content Manager</option>
                  <option>Account Manager</option>
                  <option>Analyst</option>
                </select>
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setShowAdd(false)}>Cancel</button>
              <button className={styles.sendBtn} onClick={() => setShowAdd(false)} disabled={!newName || !newEmail || !newRole}>
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
