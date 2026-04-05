'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Minus, Send } from 'lucide-react';
import { useEnquiryStore } from '@/store';
import styles from './ChatbotWidget.module.css';

type BotStep = 'greeting' | 'service' | 'budget' | 'timeline' | 'email' | 'done';

const SERVICES = ['Social Media Marketing', 'SEO Optimization', 'PPC Advertising', 'Content Marketing', 'Email Marketing', 'Other'];
const BUDGETS = ['Under £500/mo', '£500–£1,000/mo', '£1,000–£2,500/mo', '£2,500–£5,000/mo', '£5,000+/mo'];
const TIMELINES = ['ASAP', 'Within 1 month', '1–3 months', '3–6 months', 'Just exploring'];

interface Message {
  from: 'bot' | 'user';
  text: string;
}

const BOT_INTROS: Record<BotStep, string> = {
  greeting: "Hi there! 👋 I'm the DigitalPulse assistant. What's your name?",
  service: 'Great to meet you! Which service are you most interested in?',
  budget: 'Perfect choice. What monthly budget are you working with?',
  timeline: 'Understood. What is your timeline to get started?',
  email: "Excellent! Last question — what's your email so we can send you a tailored proposal?",
  done: "Thanks! 🎉 A member of our team will be in touch within 24 hours. You can also call us at +44 20 1234 5678.",
};

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [minimised, setMinimised] = useState(false);
  const [step, setStep] = useState<BotStep>('greeting');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [userData, setUserData] = useState({ name: '', service: '', budget: '', timeline: '', email: '' });
  const [showOptions, setShowOptions] = useState(false);
  const [autoShown, setAutoShown] = useState(false);
  const { addEnquiry } = useEnquiryStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-open after 30s
  useEffect(() => {
    const t = setTimeout(() => {
      if (!autoShown) { setOpen(true); setAutoShown(true); }
    }, 30000);
    return () => clearTimeout(t);
  }, [autoShown]);

  // Send initial greeting when first opened
  useEffect(() => {
    if (open && messages.length === 0) {
      setTimeout(() => {
        setMessages([{ from: 'bot', text: BOT_INTROS.greeting }]);
      }, 400);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (step === 'service' || step === 'budget' || step === 'timeline') {
      setTimeout(() => setShowOptions(true), 600);
    } else {
      setShowOptions(false);
    }
  }, [step]);

  const addMsg = (from: 'bot' | 'user', text: string) => {
    setMessages(m => [...m, { from, text }]);
  };

  const botReply = (nextStep: BotStep, delay = 700) => {
    setTimeout(() => {
      addMsg('bot', BOT_INTROS[nextStep]);
      setStep(nextStep);
    }, delay);
  };

  const handleSend = (val?: string) => {
    const text = val ?? inputVal.trim();
    if (!text) return;
    setInputVal('');
    addMsg('user', text);
    setShowOptions(false);

    const next = (ns: BotStep, newData: Partial<typeof userData>) => {
      setUserData(d => ({ ...d, ...newData }));
      botReply(ns);
    };

    switch (step) {
      case 'greeting': next('service', { name: text }); break;
      case 'service': next('budget', { service: text }); break;
      case 'budget': next('timeline', { budget: text }); break;
      case 'timeline': next('email', { timeline: text }); break;
      case 'email': {
        const finalData = { ...userData, email: text };
        setUserData(finalData);
        botReply('done');
        // Save to store
        addEnquiry({
          name: finalData.name,
          email: finalData.email,
          company: '',
          phone: '',
          service: finalData.service,
          budget: finalData.budget,
          message: `Timeline: ${finalData.timeline}`,
          source: 'Chatbot',
          chatLog: messages.map(m => ({ from: m.from, text: m.text, time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) })),
          pageVisits: [],
        });
        break;
      }
      default: break;
    }
  };

  const getOptions = () => {
    if (step === 'service') return SERVICES;
    if (step === 'budget') return BUDGETS;
    if (step === 'timeline') return TIMELINES;
    return [];
  };

  if (!open) {
    return (
      <button className={styles.trigger} onClick={() => setOpen(true)} aria-label="Open chat">
        <MessageCircle size={24} />
        <span className={styles.triggerPulse} />
        <span className={styles.triggerLabel}>Chat with us</span>
      </button>
    );
  }

  return (
    <div className={`${styles.widget} ${minimised ? styles.minimised : ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerAvatar}>DP</div>
          <div>
            <strong>DigitalPulse</strong>
            <div className={styles.onlineStatus}><span className={styles.onlineDot} />Online</div>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.headerBtn} onClick={() => setMinimised(!minimised)}>
            <Minus size={15} />
          </button>
          <button className={styles.headerBtn} onClick={() => setOpen(false)}>
            <X size={15} />
          </button>
        </div>
      </div>

      {!minimised && (
        <>
          {/* Messages */}
          <div className={styles.messages}>
            {messages.map((m, i) => (
              <div key={i} className={`${styles.msg} ${m.from === 'bot' ? styles.botMsg : styles.userMsg}`}>
                <div className={styles.bubble}>{m.text}</div>
              </div>
            ))}
            {showOptions && (
              <div className={styles.options}>
                {getOptions().map(o => (
                  <button key={o} className={styles.optionBtn} onClick={() => handleSend(o)}>{o}</button>
                ))}
              </div>
            )}
            {step === 'done' && (
              <div className={styles.doneActions}>
                <a href="/contact" className={styles.contactLink}>📞 Book a Call</a>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          {step !== 'done' && !showOptions && (
            <div className={styles.inputRow}>
              <input
                ref={inputRef}
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder={step === 'email' ? 'your@email.com' : 'Type your answer...'}
                className={styles.chatInput}
              />
              <button className={styles.sendBtn} onClick={() => handleSend()} disabled={!inputVal.trim()}>
                <Send size={15} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
