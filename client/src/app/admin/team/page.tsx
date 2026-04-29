'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  UserPlus, Mail, Phone, MoreVertical, ShieldCheck, UserCheck, 
  X, Trash2, Edit3, Loader2, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { api } from '@/lib/api';
import styles from './page.module.css';

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  staffProfile?: {
    jobTitle?: string;
    department?: string;
    bio?: string;
  };
}

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<TeamMember | null>(null);
  const [showProfileModal, setShowProfileModal] = useState<TeamMember | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'staff',
    jobTitle: '',
    department: 'Operations'
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchTeam = async () => {
    try {
      const data = await api.get<TeamMember[]>('/admin/team');
      setTeam(data);
    } catch (error) {
      console.error('Failed to fetch team');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post<any>('/admin/team', formData);
      setToast({ type: 'success', message: 'Team member added successfully!' });
      setShowAddModal(false);
      resetForm();
      fetchTeam();
    } catch (error: any) {
      setToast({ type: 'error', message: error.message || 'Failed to add member' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditModal) return;
    setSubmitting(true);
    try {
      await api.put<any>(`/admin/team/${showEditModal.id}`, formData);
      setToast({ type: 'success', message: 'Team member updated successfully!' });
      setShowEditModal(null);
      resetForm();
      fetchTeam();
    } catch (error: any) {
      setToast({ type: 'error', message: error.message || 'Failed to update member' });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'staff',
      jobTitle: '',
      department: 'Operations'
    });
  };

  const openEditModal = (member: TeamMember) => {
    setFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      password: '', // Don't edit password here
      role: member.role,
      jobTitle: member.staffProfile?.jobTitle || '',
      department: member.staffProfile?.department || 'Operations'
    });
    setShowEditModal(member);
    setDropdownOpen(null);
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;
    try {
      await api.delete<any>(`/admin/team/${id}`);
      setToast({ type: 'success', message: 'Member removed successfully' });
      fetchTeam();
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to remove member' });
    }
    setDropdownOpen(null);
  };

  const closeToast = () => setToast(null);

  return (
    <div className={styles.page}>
      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`} onClick={closeToast}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Agency Team</h1>
          <p className={styles.sub}>Manage your agency staff, monitor availability, and assign project loads.</p>
        </div>
        <button className={styles.addBtn} onClick={() => { resetForm(); setShowAddModal(true); }}>
          <UserPlus size={18} />
          <span>Add Member</span>
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <Loader2 size={32} className={styles.spin} />
          <p>Fetching team data...</p>
        </div>
      ) : (
        <div className={styles.teamGrid}>
          {team.map(member => (
            <div key={member.id} className={styles.memberCard}>
              <div className={styles.cardTop}>
                 <div className={styles.avatarLarge}>
                   {member.firstName[0]}{member.lastName[0]}
                   <div className={`${styles.statusDot} ${styles.online}`} />
                 </div>
                 <div className={styles.moreContainer}>
                   <button 
                     className={styles.moreBtn} 
                     onClick={() => setDropdownOpen(dropdownOpen === member.id ? null : member.id)}
                   >
                     <MoreVertical size={16} />
                   </button>
                   {dropdownOpen === member.id && (
                     <div className={styles.dropdownMenu} ref={dropdownRef}>
                        <button className={styles.dropdownItem} onClick={() => { setShowProfileModal(member); setDropdownOpen(null); }}>
                          <UserCheck size={14} /> View Profile
                        </button>
                        <button className={styles.dropdownItem} onClick={() => openEditModal(member)}>
                          <Edit3 size={14} /> Edit Details
                        </button>
                        <button 
                          className={`${styles.dropdownItem} ${styles.danger}`}
                          onClick={() => handleDeleteMember(member.id)}
                        >
                          <Trash2 size={14} /> Remove Member
                        </button>
                     </div>
                   )}
                 </div>
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
                 <a href={`mailto:${member.email}`} className={styles.actionBtn} title="Email"><Mail size={16} /></a>
                 <button className={styles.actionBtn} title="Call"><Phone size={16} /></button>
                 <button 
                   className={styles.primaryAction}
                   onClick={() => setShowProfileModal(member)}
                 >
                   View Profile
                 </button>
              </div>
            </div>
          ))}
          {team.length === 0 && (
            <div className={styles.emptyState}>No staff members found in database.</div>
          )}
        </div>
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>Add Team Member</h2>
                <p className={styles.modalSub}>Create a new agency staff account.</p>
              </div>
              <button className={styles.closeBtn} onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddMember}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>First Name</label>
                  <input 
                    className={styles.input} 
                    required 
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Last Name</label>
                  <input 
                    className={styles.input} 
                    required 
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email Address</label>
                <input 
                  type="email" 
                  className={styles.input} 
                  required 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Initial Password</label>
                <input 
                  type="password" 
                  className={styles.input} 
                  placeholder="Leave blank for default"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Job Title</label>
                  <input 
                    className={styles.input} 
                    required 
                    placeholder="e.g. SEO Specialist"
                    value={formData.jobTitle}
                    onChange={e => setFormData({...formData, jobTitle: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Department</label>
                  <select 
                    className={styles.input}
                    value={formData.department}
                    onChange={e => setFormData({...formData, department: e.target.value})}
                  >
                    <option>Operations</option>
                    <option>Leadership</option>
                    <option>Content</option>
                    <option>Creative</option>
                    <option>Marketing</option>
                    <option>Advertising</option>
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Access Level</label>
                <select 
                  className={styles.input}
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                >
                  <option value="staff">Staff (Standard)</option>
                  <option value="admin">Admin (Full Access)</option>
                </select>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className={styles.submitBtn} disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Member Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {showEditModal && (
        <div className={styles.modalOverlay} onClick={() => setShowEditModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>Edit Team Member</h2>
                <p className={styles.modalSub}>Update details for {showEditModal.firstName}.</p>
              </div>
              <button className={styles.closeBtn} onClick={() => setShowEditModal(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditMember}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>First Name</label>
                  <input 
                    className={styles.input} 
                    required 
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Last Name</label>
                  <input 
                    className={styles.input} 
                    required 
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email Address</label>
                <input 
                  type="email" 
                  className={styles.input} 
                  required 
                  disabled
                  value={formData.email}
                />
                <span style={{ fontSize: 11, color: '#94a3b8' }}>Email cannot be changed.</span>
              </div>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Job Title</label>
                  <input 
                    className={styles.input} 
                    required 
                    value={formData.jobTitle}
                    onChange={e => setFormData({...formData, jobTitle: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Department</label>
                  <select 
                    className={styles.input}
                    value={formData.department}
                    onChange={e => setFormData({...formData, department: e.target.value})}
                  >
                    <option>Operations</option>
                    <option>Leadership</option>
                    <option>Content</option>
                    <option>Creative</option>
                    <option>Marketing</option>
                    <option>Advertising</option>
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Access Level</label>
                <select 
                  className={styles.input}
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                >
                  <option value="staff">Staff (Standard)</option>
                  <option value="admin">Admin (Full Access)</option>
                </select>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowEditModal(null)}>Cancel</button>
                <button type="submit" className={styles.submitBtn} disabled={submitting}>
                  {submitting ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className={styles.modalOverlay} onClick={() => setShowProfileModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.profileHeader}>
                <div className={styles.profileAvatar}>
                  {showProfileModal.firstName[0]}{showProfileModal.lastName[0]}
                </div>
                <div className={styles.profileInfo}>
                  <h2>{showProfileModal.firstName} {showProfileModal.lastName}</h2>
                  <p>{showProfileModal.staffProfile?.jobTitle || 'Team Member'}</p>
                </div>
              </div>
              <button className={styles.closeBtn} onClick={() => setShowProfileModal(null)}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.profileDetailGrid}>
              <div className={styles.detailItem}>
                <label>Email</label>
                <p>{showProfileModal.email}</p>
              </div>
              <div className={styles.detailItem}>
                <label>Department</label>
                <p>{showProfileModal.staffProfile?.department || 'Operations'}</p>
              </div>
              <div className={styles.detailItem}>
                <label>Access Level</label>
                <p style={{ textTransform: 'capitalize' }}>{showProfileModal.role}</p>
              </div>
              <div className={styles.detailItem}>
                <label>Status</label>
                <p style={{ color: '#10b981' }}>Active</p>
              </div>
            </div>

            {showProfileModal.staffProfile?.bio && (
              <div className={styles.formGroup} style={{ marginTop: 24 }}>
                <label className={styles.label}>Biography</label>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{showProfileModal.staffProfile.bio}</p>
              </div>
            )}

            <div className={styles.modalActions}>
              <button 
                className={styles.submitBtn} 
                onClick={() => setShowProfileModal(null)}
                style={{ flex: 1 }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
