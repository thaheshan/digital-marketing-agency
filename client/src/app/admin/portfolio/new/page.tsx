'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Sparkles, RefreshCw } from 'lucide-react';
import { usePortfolioStore } from '@/store';
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

  // Step 1 state
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientIndustry, setClientIndustry] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState('');
  const [metrics, setMetrics] = useState({ impressions: '', clicks: '', ctr: '', conversions: '', cpa: '', roi: '' });

  // Step 3 state
  const [generating, setGenerating] = useState(false);
  const [variations, setVariations] = useState<{ tone: string; text: string }[]>([]);
  const [selectedVariation, setSelectedVariation] = useState<number | null>(null);
  const [editedDescription, setEditedDescription] = useState('');

  const toggleChannel = (ch: string) => {
    setSelectedChannels(s => s.includes(ch) ? s.filter(c => c !== ch) : [...s, ch]);
  };

  const generateDescriptions = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1800));
    const data = {
      title, clientName, clientIndustry, serviceCategory,
      channels: selectedChannels.join(', '), dateRange,
      ...metrics,
    };
    const generated = AI_VARIATIONS.map(v => ({ tone: v.tone, text: v.text(data) }));
    setVariations(generated);
    setSelectedVariation(null);
    setEditedDescription('');
    setGenerating(false);
  };

  const selectVariation = (idx: number) => {
    setSelectedVariation(idx);
    setEditedDescription(variations[idx].text);
  };

  const handlePublish = (status: 'published' | 'draft') => {
    const scoreText = editedDescription || '';
    addItem({
      title, clientName, clientIndustry, serviceCategory,
      channels: selectedChannels, dateRange, metrics,
      images: [], featuredImage: '',
      description: editedDescription,
      status,
      slug: slugify(title),
      tags: [serviceCategory, clientIndustry],
    });
    router.push('/admin/portfolio');
  };

  const step1Valid = title && clientName && serviceCategory && selectedChannels.length > 0;

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
                  <select value={serviceCategory} onChange={e => setServiceCategory(e.target.value)} className={styles.select}>
                    <option value="">Select service</option>
                    {SERVICES.map(s => <option key={s}>{s}</option>)}
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
              <div className={styles.dropzone}>
                <div className={styles.dropzoneInner}>
                  <div className={styles.dropIcon}>📁</div>
                  <p className={styles.dropText}>Drag and drop images here</p>
                  <span className={styles.dropSub}>PNG, JPG, WebP up to 10MB each</span>
                  <button className={styles.browseBtn}>Browse Files</button>
                </div>
              </div>
              <p className={styles.dropHint}>For demo purposes, images are simulated. In production this connects to your file storage.</p>
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
            <ContentScorePanel text={editedDescription} serviceCategory={serviceCategory} />
          </div>
        )}
      </div>
    </div>
  );
}
