'use client';

import { useState, useEffect } from 'react';
import { Plus, MessageSquare, Phone, Mail, Clock, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import styles from './page.module.css';

export default function PortalSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await api.get<{ tickets: any[] }>('/portal/support');
        setTickets(res.tickets || []);
      } catch (err) {
        console.error('Failed to fetch tickets');
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Client Support</h1>
          <p className={styles.sub}>Need help? Open a ticket or contact your dedicated account manager.</p>
        </div>
        <button className={styles.newTicketBtn}>
          <Plus size={20} /> Open New Ticket
        </button>
      </header>

      <section className={styles.section}>
        {loading ? (
          <div className={styles.loading}>
            <Loader2 className={styles.spinner} />
            <span>Loading support cases...</span>
          </div>
        ) : (
          <div className={styles.ticketList}>
            {tickets.map((ticket) => (
              <div key={ticket.id} className={styles.ticketCard}>
                <div className={styles.ticketMain}>
                  <div className={styles.ticketTitle}>{ticket.subject}</div>
                  <div className={styles.ticketMeta}>
                    <span>#{ticket.id.slice(0, 8)}</span>
                    <span>•</span>
                    <span>{ticket.category || 'General'}</span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} /> {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <span className={`${styles.statusPill} ${ticket.status === 'open' ? styles.statusOpen :
                    ticket.status === 'pending' ? styles.statusPending : styles.statusClosed
                  }`}>
                  {ticket.status}
                </span>
              </div>
            ))}
            {tickets.length === 0 && (
              <div className={styles.emptyState}>No active support tickets. We're here to help if you need us!</div>
            )}
          </div>
        )}
      </section>

      <div className={styles.contactGrid}>
        <div className={styles.contactCard}>
          <div className={styles.contactIcon}><Phone size={24} /></div>
          <div>
            <div className={styles.contactTitle}>Direct Support Line</div>
            <div className={styles.contactValue}>+44 20 7946 0958</div>
          </div>
        </div>
        <div className={styles.contactCard}>
          <div className={styles.contactIcon}><Mail size={24} /></div>
          <div>
            <div className={styles.contactTitle}>Email Support</div>
            <div className={styles.contactValue}>support@digitalpulse.agency</div>
          </div>
        </div>
      </div>
    </div>
  );
}
