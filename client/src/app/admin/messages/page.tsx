'use client';

import { useState } from 'react';
import styles from './page.module.css';

const allConversations = [
  { id: 1, client: 'RetailCo', contact: 'John Doe', lastMsg: 'Great, see you in tomorrow\'s call.', time: '2h ago', unread: false, avatar: 'JD' },
  { id: 2, client: 'TechFlow', contact: 'Marcus Chen', lastMsg: 'The keyword list was updated in the drive.', time: '5h ago', unread: true, avatar: 'MC' },
  { id: 3, client: 'FashionFirst', contact: 'Emily N.', lastMsg: 'I\'ll approve the invoices by EOD.', time: '1d ago', unread: false, avatar: 'EN' },
  { id: 4, client: 'HealthPlus', contact: 'Dr. Priya Nair', lastMsg: 'Can we schedule an audit for next week?', time: '2d ago', unread: true, avatar: 'PN' },
  { id: 5, client: 'GrowthMet', contact: 'David Okonkwo', lastMsg: 'Sent over the Q2 projections.', time: '3d ago', unread: false, avatar: 'DO' },
];

export default function AdminMessagesPage() {
  const [activeId, setActiveId] = useState(2);
  const activeChat = allConversations.find(c => c.id === activeId) || allConversations[0];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Client Communication</h1>
          <p className={styles.sub}>Central hub for all client chat and support requests.</p>
        </div>
        <button className={styles.newChatBtn}>+ New Message</button>
      </div>

      <div className={styles.layout}>
        {/* Contact List */}
        <div className={styles.sidebar}>
          <div className={styles.searchBar}>
             <span>🔍</span>
             <input placeholder="Search clients..." className={styles.searchInput} />
          </div>
          <div className={styles.convList}>
            {allConversations.map(c => (
              <div 
                key={c.id} 
                className={`${styles.convItem} ${activeId === c.id ? styles.convActive : ''}`}
                onClick={() => setActiveId(c.id)}
              >
                <div className={styles.avatarSmall}>{c.avatar}</div>
                <div className={styles.convInfo}>
                  <div className={styles.convTop}>
                    <span className={styles.clientLabel}>{c.client}</span>
                    <span className={styles.time}>{c.time}</span>
                  </div>
                  <div className={styles.contactName}>{c.contact}</div>
                  <div className={styles.previewMsg}>{c.lastMsg}</div>
                </div>
                {c.unread && <span className={styles.unreadDot}></span>}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className={styles.chatArea}>
           <div className={styles.chatHeader}>
              <div className={styles.avatarLarge}>{activeChat.avatar}</div>
              <div className={styles.clientMeta}>
                 <span className={styles.clientTitle}>{activeChat.client}</span>
                 <span className={styles.contactSub}>{activeChat.contact} · Online</span>
              </div>
              <div className={styles.headerIcons}>
                 <button className={styles.actionBtn}>📞</button>
                 <button className={styles.actionBtn}>⚙️</button>
              </div>
           </div>

           <div className={styles.messagesContainer}>
              <div className={styles.msgIn}>
                 <div className={styles.bubbleIn}>
                    <p>Hi team, I've just updated the keyword list in the shared drive for the Q2 SEO strategy. Could you take a look when you have a moment?</p>
                    <span className={styles.msgTime}>10:42 AM</span>
                 </div>
              </div>
              <div className={styles.msgOut}>
                 <div className={styles.bubbleOut}>
                    <p>Thanks Marcus! We'll review them this afternoon and incorporate them into the final strategy document. We have our call tomorrow to finalize everything.</p>
                    <span className={styles.msgTime}>11:05 AM</span>
                 </div>
              </div>
              <div className={styles.msgIn}>
                 <div className={styles.bubbleIn}>
                    <p>The keyword list was updated in the drive.</p>
                    <span className={styles.msgTime}>2:15 PM</span>
                 </div>
              </div>
           </div>

           <div className={styles.chatFooter}>
              <button className={styles.attachBtn}>📎</button>
              <input placeholder="Type a message to Marcus..." className={styles.chatInput} />
              <button className={styles.sendBtn}>Send</button>
           </div>
        </div>
      </div>
    </div>
  );
}
