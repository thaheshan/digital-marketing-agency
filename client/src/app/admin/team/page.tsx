'use client';

import React, { useState, useEffect } from 'react';
import { UserPlus, Mail, Phone, MapPin, MoreVertical, ShieldCheck, UserCheck } from 'lucide-react';
import { api } from '@/lib/api';
import styles from './page.module.css';

const teamMembers = [
  { id: 1, name: 'Priya Nanthakumar', role: 'Founder & CEO', status: 'Online', dept: 'Leadership', projects: 12, email: 'priya@digitalpulse.com', avatar: 'PN' },
  { id: 2, name: 'Sarah Miller', role: 'PPC Lead', status: 'Online', dept: 'Operations', projects: 15, email: 'sarah@digitalpulse.com', avatar: 'SM' },
  { id: 3, name: 'Tom Bradley', role: 'Content Strategist', status: 'In Meeting', dept: 'Content', projects: 8, email: 'tom@digitalpulse.com', avatar: 'TB' },
  { id: 4, name: 'Nivethika N.', role: 'Account Manager', status: 'Away', dept: 'Operations', projects: 10, email: 'nive@digitalpulse.com', avatar: 'NN' },
];

export default function TeamPage() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data = await api.get('/admin/team');
        setTeam(data);
      } catch (error) {
        console.error('Failed to fetch team');
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Agency Team</h1>
          <p className={styles.sub}>Manage your agency staff, monitor availability, and assign project loads.</p>
        </div>
        <button className={styles.addBtn}>
          <UserPlus size={18} />
          <span>Add Member</span>
        </button>
      </div>

      <div className={styles.teamGrid}>
        {team.map(member => (
          <div key={member.id} className={styles.memberCard}>
            <div className={styles.cardTop}>
               <div className={styles.avatarLarge}>
                 {member.firstName[0]}{member.lastName[0]}
                 <div className={`${styles.statusDot} ${styles.online}`} />
               </div>
               <button className={styles.moreBtn}><MoreVertical size={16} /></button>
            </div>
            <div className={styles.memberInfo}>
               <h3 className={styles.memberName}>{member.firstName} {member.lastName}</h3>
               <p className={styles.memberRole}>{member.staffProfile?.jobTitle || 'Team Member'}</p>
               <div className={styles.deptBadge}>{member.staffProfile?.department || 'Operations'}</div>
            </div>
            <div className={styles.memberStats}>
               <div className={styles.stat}>
                  <span className={styles.statLabel}>Staff Role</span>
                  <span className={styles.statVal}>{member.role}</span>
               </div>
               <div className={styles.divider} />
               <div className={styles.stat}>
                  <span className={styles.statLabel}>Status</span>
                  <span className={`${styles.statusText} ${styles.onlineText}`}>Online</span>
               </div>
            </div>
            <div className={styles.cardActions}>
               <button className={styles.actionBtn} title="Email"><Mail size={16} /></button>
               <button className={styles.actionBtn} title="Call"><Phone size={16} /></button>
               <button className={styles.primaryAction}>View Profile</button>
            </div>
          </div>
        ))}
        {team.length === 0 && !loading && (
          <div className={styles.emptyState}>No staff members found in database.</div>
        )}
      </div>
    </div>
  );
}
