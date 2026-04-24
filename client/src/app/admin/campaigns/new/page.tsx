'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Target, Rocket, DollarSign, Calendar } from 'lucide-react';
import { api } from '@/lib/api';
import styles from '../page.module.css'; // Reusing styles

export default function NewCampaignPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState('');
  const [clients, setClients] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await api.get('/admin/clients');
        setClients(data);
      } catch (err) {
        console.error('Failed to fetch clients');
      }
    };
    fetchClients();
  }, []);

  const handleLaunch = async () => {
    setIsSubmitting(true);
    try {
      await api.post('/admin/campaigns/create', {
        name,
        clientId,
        status: 'live',
      });
      setStep(3); // Success step
      setTimeout(() => router.push('/admin/campaigns'), 2500);
    } catch (err) {
      alert('Failed to launch campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <Link href="/admin/campaigns" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Campaigns
        </Link>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', marginTop: '16px' }}>Launch New Campaign</h1>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#06b6d4' }}>
              <Target size={24} />
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Step 1: Campaign Fundamentals</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>Campaign Name</label>
              <input 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Q2 Meta Retargeting Blitz" 
                style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>Select Client</label>
              <select 
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              >
                <option value="">Select a client...</option>
                {clients.map(c => (
                  <option key={c.id} value={c.userId}>{c.companyName}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={() => setStep(2)}
              disabled={!name || !clientId}
              style={{ background: '#0f172a', color: '#fff', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer', opacity: (!name || !clientId) ? 0.5 : 1 }}
            >
              Continue to Budgeting
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#F97316' }}>
              <DollarSign size={24} />
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Step 2: Budget & Goals</h2>
            </div>

            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
              <p style={{ color: '#64748b', fontSize: '14px' }}>Budgeting tools and AI Forecasting are simulated for this demo.</p>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
               <button 
                onClick={() => setStep(1)}
                style={{ flex: 1, background: '#fff', color: '#0f172a', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontWeight: 700, cursor: 'pointer' }}
              >
                Back
              </button>
              <button 
                onClick={handleLaunch}
                disabled={isSubmitting}
                style={{ flex: 2, background: '#06b6d4', color: '#fff', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSubmitting ? 'Launching...' : (
                  <>
                    <Rocket size={18} style={{ marginRight: '8px', display: 'inline' }} /> Launch Campaign
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ 
              width: '80px', height: '80px', borderRadius: '50%', background: '#dcfce7', 
              color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px auto', animation: 'scaleUp 0.5s ease-out'
            }}>
              <Rocket size={40} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Campaign Launched!</h2>
            <p style={{ color: '#64748b', fontSize: '16px' }}>Redirecting you to the dashboard...</p>
            
            <style>{`
              @keyframes scaleUp {
                0% { transform: scale(0.5); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}
