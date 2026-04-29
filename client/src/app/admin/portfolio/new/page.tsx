'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Sparkles, RefreshCw } from 'lucide-react';
import { usePortfolioStore } from '@/store';
import { api } from '@/lib/api';
import { ContentScorePanel } from '@/components/admin/ContentScorePanel/ContentScorePanel';
import styles from './page.module.css';

const SERVICES = ['Social Media Marketing', 'SEO Optimization', 'PPC Advertising', 'Content Marketing', 'Email Marketing', 'Brand Strategy'];
const CHANNELS = ['Instagram', 'Facebook', 'TikTok', 'Google Ads', 'LinkedIn', 'Email', 'YouTube', 'Twitter/X', 'Bing Ads', 'Blog/SEO'];

const AI_VARIATIONS = [
  {
    tone: 'Professional',
    text: (data: Record<string, string>) =>
      `Our ${data.serviceCategory} campaign for ${data.clientName} delivered exceptional results across ${data.channels}. Over the ${data.dateRange} campaign period, we achieved ${data.impressions} total impressions, driving ${data.conversions} qualified conversions at a CPA of ${data.cpa}. The campaign generated a ${data.roi} ROI, demonstrating the effectiveness of our data-driven approach. Through strategic audience segmentation and continuous creative optimisation, we consistently outperformed industry benchmarks, establishing ${data.clientName} as a leader in the ${data.clientIndustry} space.`,
  },
  {
    tone: 'Creative',
    text: (data: Record<string, string>) =>
      `When ${data.clientName} wanted to make waves in the ${data.clientIndustry} market, we knew exactly how to deliver. Our ${data.serviceCategory} strategy harnessed the power of ${data.channels}, turning heads and driving real results. The numbers speak for themselves: ${data.impressions} impressions, ${data.conversions} conversions, and a ${data.roi} ROI that made the boardroom smile. Over ${data.dateRange}, we didn't just run a campaign — we built a movement that connected the brand with the right audiences at exactly the right moment.`,
  },
  {
    tone: 'Data-Driven',
    text: (data: Record<string, string>) =>
      `Campaign performance analysis for ${data.clientName} (${data.dateRange}): Deployed ${data.serviceCategory} strategy across ${data.channels}. Key metrics — Impressions: ${data.impressions} | Clicks: ${data.clicks} | CTR: ${data.ctr} | Conversions: ${data.conversions} | CPA: ${data.cpa} | ROI: ${data.roi}. The campaign achieved a ${data.roi} return on investment, with conversion rates exceeding initial projections by 23%. Continuous A/B testing across ad creatives and landing pages drove progressive CPA reduction throughout the campaign lifecycle.`,
  },
];

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function NewPortfolioPage() {
  const router = useRouter();
  const { addItem } = usePortfolioStore();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<any[]>([]);

  // Step 1 state
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientIndustry, setClientIndustry] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState('');
  const [metrics, setMetrics] = useState({ impressions: '', clicks: '', ctr: '', conversions: '', cpa: '', roi: '' });
  
  const DEFAULT_SERVICES = [
    { id: 'seo', name: 'SEO Optimization' },
    { id: 'ppc', name: 'PPC Advertising' },
    { id: 'social', name: 'Social Media Marketing' },
    { id: 'content', name: 'Content Marketing' },
    { id: 'email', name: 'Email Marketing' },
    { id: 'brand', name: 'Brand Strategy' },
    { id: 'web-dev', name: 'Web Development' },
    { id: 'app-dev', name: 'Mobile App Development' },
    { id: 'cro', name: 'Conversion Rate Optimization' },
    { id: 'ai-automation', name: 'AI & Automation' },
    { id: 'influencer', name: 'Influencer Marketing' },
    { id: 'video', name: 'Video Production' },
    { id: 'pr', name: 'Digital PR' },
    { id: 'amazon', name: 'Amazon Marketing' },
    { id: 'analytics', name: 'Data & Analytics' }
  ];

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await api.get<any[]>('/admin/services');
        setServices(data.length > 0 ? data : DEFAULT_SERVICES);
      } catch (err) {
        console.error('Failed to load services:', err);
        setServices(DEFAULT_SERVICES);
      }
    };
    loadServices();
  }, []);
  
  // Step 2 state (Simulated)
  const [files, setFiles] = useState<{name: string, size: string, progress: number}[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Step 3 state
  const [generating, setGenerating] = useState(false);
  const [variations, setVariations] = useState<{ tone: string; text: string }[]>([]);
  const [selectedVariation, setSelectedVariation] = useState<number | null>(null);
  const [editedDescription, setEditedDescription] = useState('');

  const toggleChannel = (ch: string) => {
    setSelectedChannels(s => s.includes(ch) ? s.filter(c => c !== ch) : [...s, ch]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    simulateUpload(selected);
  };

  const simulateUpload = (newFiles: File[]) => {
    setIsUploading(true);
    const added = newFiles.map(f => ({ 
      name: f.name, 
      size: (f.size / 1024 / 1024).toFixed(1) + 'MB', 
      progress: 0 
    }));
    
    setFiles(prev => [...prev, ...added]);

    // Simulate progress
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setFiles(prev => prev.map(f => ({ ...f, progress: p > 100 ? 100 : p })));
      if (p >= 100) {
        clearInterval(interval);
        setIsUploading(false);
      }
    }, 200);
  };

  const generateDescriptions = async () => {
    setGenerating(true);
    try {
      const data = {
        title, clientName, clientIndustry, 
        serviceCategory: services.find(s => s.id === serviceId)?.name || 'General Marketing',
        channels: selectedChannels.join(', '), dateRange,
        ...metrics,
      };
      
      const res = await api.post<any>('/portfolio/draft/generate-description', data);
      setVariations(res.options || []);
      setSelectedVariation(null);
      setEditedDescription('');
    } catch (e) {
      console.error("Error generating descriptions:", e);
    } finally {
      setGenerating(false);
    }
  };

  const selectVariation = (idx: number) => {
    setSelectedVariation(idx);
    setEditedDescription(variations[idx].text);
  };

  const handlePublish = async (status: 'published' | 'draft') => {
    try {
      const res = await api.post<any>('/admin/portfolio/create', {
        title,
        clientName,
        description: editedDescription,
        status,
        serviceId
      });
      if (res.success) {
        router.push('/admin/portfolio');
      }
    } catch (err) {
      console.error('Failed to create portfolio item:', err);
    }
  };

  const step1Valid = title && clientName && serviceId && selectedChannels.length > 0;

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link href="/admin/portfolio" className={styles.backLink}>
          <ArrowLeft size={16} /> Portfolio
        </Link>
        <h1 className={styles.pageTitle}>Add Portfolio Item</h1>
      </div>

      {/* Steps indicator */}
      <div className={styles.stepsRow}>
        {['Campaign Info', 'Media Upload', 'AI Description'].map((label, i) => {
          const n = i + 1;
          return (
            <div key={n} className={`${styles.stepItem} ${step >= n ? styles.stepDone : ''} ${step === n ? styles.stepActive : ''}`}>
              <div className={styles.stepNum}>
                {step > n ? <Check size={14} /> : n}
              </div>
              <span>{label}</span>
              {i < 2 && <div className={styles.stepLine} />}
            </div>
          );
        })}
      </div>

      <div className={styles.mainArea}>
        <div className={styles.formArea}>
          {/* Step 1 */}
          {step === 1 && (
            <div className={styles.card}>
              <h2 className={styles.cardHeading}>Campaign Information</h2>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>Campaign Title *</label>
                  <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Spring Social Media Blitz" className={styles.input} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Client Name *</label>
                  <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="e.g. StyleCo UK" className={styles.input} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Client Industry</label>
                  <input value={clientIndustry} onChange={e => setClientIndustry(e.target.value)} placeholder="e.g. E-commerce / Fashion" className={styles.input} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Service Category *</label>
                  <select value={serviceId} onChange={e => setServiceId(e.target.value)} className={styles.select}>
                    <option value="">Select service</option>
                    {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className={`${styles.field} ${styles.fullWidth}`}>
                  <label className={styles.label}>Date Range</label>
                  <input value={dateRange} onChange={e => setDateRange(e.target.value)} placeholder="e.g. Jan 2026 – Mar 2026" className={styles.input} />
                </div>
              </div>

              <div className={styles.field} style={{ marginTop: 16 }}>
                <label className={styles.label}>Channels Used *</label>
                <div className={styles.channelGrid}>
                  {CHANNELS.map(ch => (
                    <button key={ch} type="button"
                      className={`${styles.channelBtn} ${selectedChannels.includes(ch) ? styles.channelActive : ''}`}
                      onClick={() => toggleChannel(ch)}>
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              <h3 className={styles.subHeading}>Key Metrics</h3>
              <div className={styles.metricsGrid}>
                {Object.entries(metrics).map(([key, val]) => (
                  <div key={key} className={styles.field}>
                    <label className={styles.label}>{key.toUpperCase()}</label>
                    <input value={val}
                      onChange={e => setMetrics(m => ({ ...m, [key]: e.target.value }))}
                      placeholder={key === 'impressions' ? '2.4M' : key === 'ctr' ? '2.01%' : key === 'cpa' ? '£13.21' : key === 'roi' ? '312%' : ''}
                      className={styles.input} />
                  </div>
                ))}
              </div>

              <div className={styles.stepActions}>
                <button className={styles.nextBtn} onClick={() => setStep(2)} disabled={!step1Valid}>
                  Next: Media Upload <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className={styles.card}>
              <h2 className={styles.cardHeading}>Media Upload</h2>
              
              <div 
                className={styles.dropzone}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  simulateUpload(Array.from(e.dataTransfer.files));
                }}
              >
                <div className={styles.dropzoneInner}>
                  <div className={styles.dropIcon}>📁</div>
                  <p className={styles.dropText}>Drag and drop images here</p>
                  <span className={styles.dropSub}>PNG, JPG, WebP up to 10MB each</span>
                  <label className={styles.browseBtn}>
                    Browse Files
                    <input type="file" multiple hidden onChange={handleFileSelect} accept="image/*" />
                  </label>
                </div>
              </div>

              {files.length > 0 && (
                <div className={styles.fileList}>
                  {files.map((file, idx) => (
                    <div key={idx} className={styles.fileItem}>
                      <div className={styles.fileInfo}>
                        <span className={styles.fileName}>{file.name}</span>
                        <span className={styles.fileSize}>{file.size}</span>
                      </div>
                      <div className={styles.progressTrack}>
                        <div className={styles.progressBar} style={{ width: `${file.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <p className={styles.dropHint}>For demo purposes, images are simulated. In production this connects to your S3/Cloudinary storage.</p>
              <div className={styles.stepActions}>
                <button className={styles.backStepBtn} onClick={() => setStep(1)}><ArrowLeft size={16} /> Back</button>
                <button className={styles.nextBtn} onClick={() => { setStep(3); generateDescriptions(); }}>
                  Next: AI Description <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className={styles.card}>
              <div className={styles.aiHeader}>
                <h2 className={styles.cardHeading}>AI Description Generator</h2>
                <button className={styles.regenBtn} onClick={generateDescriptions} disabled={generating}>
                  <RefreshCw size={14} className={generating ? styles.spinning : ''} />
                  {generating ? 'Generating...' : 'Regenerate'}
                </button>
              </div>

              {generating ? (
                <div className={styles.loadingState}>
                  <div className={styles.loadingSpinner} />
                  <p>Generating 3 AI descriptions…</p>
                </div>
              ) : (
                <>
                  <div className={styles.variationsGrid}>
                    {variations.map((v, i) => (
                      <div key={i}
                        className={`${styles.variationCard} ${selectedVariation === i ? styles.variationSelected : ''}`}
                        onClick={() => selectVariation(i)}>
                        <div className={styles.variationTone}>
                          <Sparkles size={13} /> {v.tone}
                        </div>
                        <p className={styles.variationText}>{v.text}</p>
                        {selectedVariation === i && <span className={styles.selectedMark}><Check size={12} /> Selected</span>}
                      </div>
                    ))}
                  </div>

                  {selectedVariation !== null && (
                    <div className={styles.editArea}>
                      <label className={styles.label}>Edit Description</label>
                      <textarea
                        className={styles.textarea}
                        rows={7}
                        value={editedDescription}
                        onChange={e => setEditedDescription(e.target.value)}
                      />
                    </div>
                  )}
                </>
              )}

              <div className={styles.stepActions}>
                <button className={styles.backStepBtn} onClick={() => setStep(2)}><ArrowLeft size={16} /> Back</button>
                <button className={styles.draftBtn} onClick={() => handlePublish('draft')}>Save as Draft</button>
                <button className={styles.publishBtn} onClick={() => handlePublish('published')}
                  disabled={!editedDescription}>
                  ✓ Publish Item
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content Score panel (step 3 only) */}
        {step === 3 && (
          <div className={styles.scoreArea}>
            <ContentScorePanel 
              text={editedDescription} 
              serviceCategory={services.find(s => s.id === serviceId)?.name || 'General'} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
