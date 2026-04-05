'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Phone, Mail, UserCheck, Archive, ExternalLink } from 'lucide-react';
import { useEnquiryStore } from '@/store';
import styles from './page.module.css';

export default function EnquiryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { enquiries, updateStatus, convertToClient } = useEnquiryStore();
  const enquiry = enquiries.find(e => e.id === id);
  const [converting, setConverting] = useState(false);
  const [converted, setConverted] = useState(false);

  if (!enquiry) {
    return (
      <div className={styles.notFound}>
        <p>Enquiry not found.</p>
        <Link href="/admin/enquiries" className={styles.backLink}>← Back to Enquiries</Link>
      </div>
    );
  }

  const handleConvert = async () => {
    setConverting(true);
    await new Promise(r => setTimeout(r, 800));
    convertToClient(enquiry.id);
    setConverted(true);
    setConverting(false);
  };

  const scoreBreakdown = [
    { label: 'Behaviour', value: enquiry.scoreBreakdown.behaviour, max: 40, color: '#06B6D4' },
    { label: 'Form Signals', value: enquiry.scoreBreakdown.form, max: 30, color: '#22C55E' },
    { label: 'Chatbot', value: enquiry.scoreBreakdown.chatbot, max: 20, color: '#F97316' },
    { label: 'Recency', value: enquiry.scoreBreakdown.recency, max: 10, color: '#8B5CF6' },
  ];

  const total = Object.values(enquiry.scoreBreakdown).reduce((a, b) => a + b, 0);
  const scoreColor = total >= 70 ? '#dc2626' : total >= 40 ? '#d97706' : '#94a3b8';
  const scoreLabel = total >= 70 ? 'Hot Lead' : total >= 40 ? 'Warm Lead' : 'Cold Lead';

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link href="/admin/enquiries" className={styles.backBtn}>
          <ArrowLeft size={16} /> All Enquiries
        </Link>
        <div className={styles.topActions}>
          <a href={`tel:${enquiry.phone}`} className={styles.actionBtn}>
            <Phone size={15} /> Call
          </a>
          <a href={`mailto:${enquiry.email}`} className={styles.actionBtn}>
            <Mail size={15} /> Email
          </a>
          <button className={styles.archiveBtn} onClick={() => { updateStatus(enquiry.id, 'archived'); router.push('/admin/enquiries'); }}>
            <Archive size={15} /> Archive
          </button>
          {!converted && enquiry.status !== 'converted' ? (
            <button className={styles.convertBtn} onClick={handleConvert} disabled={converting}>
              <UserCheck size={15} /> {converting ? 'Converting...' : 'Convert to Client'}
            </button>
          ) : (
            <span className={styles.convertedBadge}>✓ Converted</span>
          )}
        </div>
      </div>

      <div className={styles.grid}>
        {/* Left — Score + Info */}
        <div className={styles.leftCol}>
          {/* Lead card */}
          <div className={styles.card}>
            <div className={styles.leadHeader}>
              <div className={styles.leadAvatar}>{enquiry.name.split(' ').map(n => n[0]).join('')}</div>
              <div>
                <h2 className={styles.leadName}>{enquiry.name}</h2>
                <span className={styles.leadCompany}>{enquiry.company}</span>
              </div>
              <span className={styles.scoreRing} style={{ borderColor: scoreColor }}>
                <span style={{ color: scoreColor, fontSize: 22, fontWeight: 800 }}>{total}</span>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>/100</span>
              </span>
            </div>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}><span>Email</span><strong>{enquiry.email}</strong></div>
              <div className={styles.infoItem}><span>Phone</span><strong>{enquiry.phone || 'N/A'}</strong></div>
              <div className={styles.infoItem}><span>Service</span><strong>{enquiry.service}</strong></div>
              <div className={styles.infoItem}><span>Budget</span><strong>{enquiry.budget}</strong></div>
              <div className={styles.infoItem}><span>Source</span><strong>{enquiry.source}</strong></div>
              <div className={styles.infoItem}><span>Status</span><strong className={styles.statusLabel} style={{ color: scoreColor }}>{scoreLabel}</strong></div>
            </div>
            {enquiry.message && (
              <div className={styles.messageBox}>
                <span className={styles.msgLabel}>Message</span>
                <p>{enquiry.message}</p>
              </div>
            )}
          </div>

          {/* Score breakdown */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Score Breakdown</h3>
            <div className={styles.scoreBreakdownList}>
              {scoreBreakdown.map(s => (
                <div key={s.label} className={styles.scoreLine}>
                  <div className={styles.scoreLineTop}>
                    <span>{s.label}</span>
                    <span style={{ color: s.color, fontWeight: 700 }}>{s.value}/{s.max}</span>
                  </div>
                  <div className={styles.scoreTrack}>
                    <div className={styles.scoreFill} style={{ width: `${(s.value / s.max) * 100}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.totalScore}>
              Total score: <strong style={{ color: scoreColor }}>{total}/100</strong> — {scoreLabel}
            </div>
          </div>
        </div>

        {/* Middle — Chatbot log */}
        <div className={styles.midCol}>
          <div className={styles.card} style={{ height: '100%' }}>
            <h3 className={styles.cardTitle}>Chatbot Conversation</h3>
            {enquiry.chatLog.length === 0 ? (
              <p className={styles.emptyState}>No chatbot conversation recorded.</p>
            ) : (
              <div className={styles.chatLog}>
                {enquiry.chatLog.map((msg, i) => (
                  <div key={i} className={`${styles.chatMsg} ${msg.from === 'bot' ? styles.botMsg : styles.userMsg}`}>
                    <div className={styles.msgBubble}>{msg.text}</div>
                    <span className={styles.msgTime}>{msg.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — Page visits */}
        <div className={styles.rightCol}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Page Visit History</h3>
            <div className={styles.visitList}>
              {enquiry.pageVisits.map((v, i) => (
                <div key={i} className={styles.visitItem}>
                  <div className={styles.visitIcon}><ExternalLink size={13} /></div>
                  <div className={styles.visitInfo}>
                    <strong>{v.page}</strong>
                    <span>{v.timestamp} · {v.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Submitted</h3>
            <p className={styles.timestamp}>
              {new Date(enquiry.timestamp).toLocaleString('en-GB', {
                day: '2-digit', month: 'long', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
