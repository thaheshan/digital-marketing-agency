'use client';

import { useState } from 'react';
import styles from './page.module.css';

type Message = {
  id: number;
  sender: string;
  senderRole: string;
  avatar: string;
  preview: string;
  time: string;
  unread: boolean;
  messages: { from: 'client' | 'manager'; text: string; time: string }[];
};

const conversations: Message[] = [
  {
    id: 1, sender: 'Sarah Kim', senderRole: 'Account Manager', avatar: 'SK',
    preview: 'Your Q1 SEO report is ready for review...', time: '2h ago', unread: true,
    messages: [
      { from: 'manager', text: 'Hi John! Just wanted to let you know your Q1 SEO performance report is ready. We saw some great uplift across the board!', time: '10:30 AM' },
      { from: 'client', text: 'That\'s great to hear! What were the main highlights?', time: '10:45 AM' },
      { from: 'manager', text: 'Organic traffic is up 68% YoY, and you\'re now ranking on page 1 for 47 of your 60 target keywords. I\'ll walk you through the full report on our call tomorrow.', time: '10:52 AM' },
      { from: 'client', text: 'Brilliant — looking forward to the call. Will the report cover our upcoming Q2 strategy too?', time: '11:05 AM' },
      { from: 'manager', text: 'Absolutely! I\'ve drafted a Q2 strategy based on your top-performing content. We can discuss and finalise it tomorrow.', time: '11:10 AM' },
    ],
  },
  {
    id: 2, sender: 'Marcus Chen', senderRole: 'SEO Specialist', avatar: 'MC',
    preview: 'Keyword research for Q2 is complete...', time: '1d ago', unread: true,
    messages: [
      { from: 'manager', text: 'Hi! I\'ve finished the keyword research for Q2. Shared the sheet in reports — there are 85 new opportunities we should target.', time: 'Yesterday' },
      { from: 'client', text: 'Perfect, I\'ll take a look.', time: 'Yesterday' },
    ],
  },
  {
    id: 3, sender: 'James Okafor', senderRole: 'PPC Manager', avatar: 'JO',
    preview: 'Paused the Q1 Google Ads campaign...', time: '3d ago', unread: false,
    messages: [
      { from: 'manager', text: 'I paused the Q1 Google Ads campaign as planned. Budget utilisation was 40%. Recommending we move remaining budget to Q2 Spring campaign.', time: '3 days ago' },
    ],
  },
];

export default function PortalMessagesPage() {
  const [activeId, setActiveId] = useState<number>(1);
  const [newMsg, setNewMsg] = useState('');
  const [chatMessages, setChatMessages] = useState(conversations[0].messages);

  const active = conversations.find(c => c.id === activeId) ?? conversations[0];

  const handleSelect = (c: Message) => {
    setActiveId(c.id);
    setChatMessages(c.messages);
  };

  const handleSend = () => {
    if (!newMsg.trim()) return;
    setChatMessages(prev => [...prev, { from: 'client', text: newMsg.trim(), time: 'Just now' }]);
    setNewMsg('');
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Messages</h1>
        <p className={styles.sub}>Direct line to your marketing team</p>
      </div>

      <div className={styles.layout}>
        {/* Conversations List */}
        <div className={styles.convList}>
          {conversations.map(c => (
            <button key={c.id} className={`${styles.convItem} ${activeId === c.id ? styles.convActive : ''}`} onClick={() => handleSelect(c)}>
              <div className={styles.convAvatar}>{c.avatar}</div>
              <div className={styles.convBody}>
                <div className={styles.convTop}>
                  <span className={styles.convName}>{c.sender}</span>
                  <span className={styles.convTime}>{c.time}</span>
                </div>
                <p className={styles.convRole}>{c.senderRole}</p>
                <p className={styles.convPreview}>{c.preview}</p>
              </div>
              {c.unread && <span className={styles.unreadDot}></span>}
            </button>
          ))}
        </div>

        {/* Chat Window */}
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <div className={styles.chatAvatar}>{active.avatar}</div>
            <div>
              <strong className={styles.chatName}>{active.sender}</strong>
              <p className={styles.chatRole}>{active.senderRole}</p>
            </div>
            <div className={styles.chatStatus}><span className={styles.onlineDot}></span> Online</div>
          </div>

          <div className={styles.messages}>
            {chatMessages.map((m, i) => (
              <div key={i} className={`${styles.messageBubble} ${m.from === 'client' ? styles.bubbleClient : styles.bubbleManager}`}>
                <div className={styles.bubbleText}>{m.text}</div>
                <div className={styles.bubbleTime}>{m.time}</div>
              </div>
            ))}
          </div>

          <div className={styles.chatInput}>
            <input
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className={styles.inputField}
            />
            <button className={styles.sendBtn} onClick={handleSend}>Send ↑</button>
          </div>
        </div>
      </div>
    </div>
  );
}
