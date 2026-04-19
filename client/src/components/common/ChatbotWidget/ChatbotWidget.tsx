'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
import { api } from '@/lib/api';
import styles from './ChatbotWidget.module.css';

interface Message {
  id: string;
  from: 'bot' | 'user';
  text: string;
  time: string;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Start session
      startSession();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startSession = async () => {
    setIsTyping(true);
    try {
      const pageContext = window.location.pathname;
      const res = await api.post<any>('/chatbot/session', { pageContext });

      setSessionId(res.session_id);
      setMessages([{
        id: Date.now().toString(),
        from: 'bot',
        text: res.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setQuickReplies(res.quick_replies || []);
    } catch (e) {
      console.error(e);
      setMessages([{
        id: Date.now().toString(),
        from: 'bot',
        text: 'Hello! How can we help you today?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || !sessionId) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      from: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setQuickReplies([]);
    setIsTyping(true);

    try {
      const pageContext = window.location.pathname;
      const res = await api.post<any>('/chatbot/session', {
        sessionId,
        message: text,
        pageContext
      });

      const botReply: Message = {
        id: (Date.now() + 1).toString(),
        from: 'bot',
        text: res.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botReply]);
      setQuickReplies(res.quick_replies || []);
    } catch (e) {
      console.error(e);
      const errReply: Message = {
        id: (Date.now() + 1).toString(),
        from: 'bot',
        text: 'Sorry, I am having trouble connecting. Could you use our contact form?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errReply]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatText = (text: string) => {
    // Basic bold formatting **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  if (!isOpen) {
    return (
      <button className={styles.fab} onClick={() => setIsOpen(true)} aria-label="Open chat">
        <MessageSquare size={24} />
      </button>
    );
  }

  return (
    <div className={`${styles.widget} ${isMinimized ? styles.minimized : ''}`}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <div className={styles.avatar}>
            <Bot size={20} />
          </div>
          <div>
            <h3>DigitalPulse Assistant</h3>
            <span className={styles.status}>Online</span>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button onClick={() => setIsMinimized(!isMinimized)} aria-label="Minimize chat">
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button onClick={() => setIsOpen(false)} aria-label="Close chat">
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className={styles.messages}>
            {messages.map(msg => (
              <div key={msg.id} className={`${styles.messageWrapper} ${msg.from === 'bot' ? styles.botWrapper : styles.userWrapper}`}>
                {msg.from === 'bot' && <div className={styles.msgAvatar}><Bot size={14} /></div>}
                <div className={`${styles.message} ${msg.from === 'bot' ? styles.botMessage : styles.userMessage}`}>
                  <p>{formatText(msg.text)}</p>
                  <span className={styles.time}>{msg.time}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className={`${styles.messageWrapper} ${styles.botWrapper}`}>
                <div className={styles.msgAvatar}><Bot size={14} /></div>
                <div className={`${styles.message} ${styles.botMessage} ${styles.typingMsg}`}>
                  <div className={styles.typingIndicator}>
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {quickReplies.length > 0 && !isTyping && (
            <div className={styles.quickReplies}>
              {quickReplies.map((qr, i) => (
                <button key={i} onClick={() => handleSend(qr)} className={styles.qrBtn}>
                  {qr}
                </button>
              ))}
            </div>
          )}

          <div className={styles.inputArea}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend(input)}
              placeholder="Type your message..."
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim()}
              className={styles.sendBtn}
            >
              <Send size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
