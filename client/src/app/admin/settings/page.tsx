'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Save, Globe, Shield, Zap, Sliders, Briefcase,
  CheckCircle2, AlertCircle, Loader2, Eye, EyeOff,
  Key, Lock, Clock, Phone, Link, Hash, CreditCard,
  RefreshCw, Plug, Mail
} from 'lucide-react';
import { api } from '@/lib/api';
import styles from './page.module.css';

type SettingsGroup = 'general' | 'branding' | 'integrations' | 'security' | 'billing';

const TABS: { id: SettingsGroup; label: string; icon: React.ElementType }[] = [
  { id: 'general',      label: 'General',       icon: Sliders    },
  { id: 'branding',     label: 'Branding',      icon: Zap        },
  { id: 'integrations', label: 'Integrations',  icon: Globe      },
  { id: 'security',     label: 'Security',      icon: Shield     },
  { id: 'billing',      label: 'Billing Plans', icon: Briefcase  },
];

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {children}
      {hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}

function SecretInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className={styles.secretWrap}>
      <input
        type={show ? 'text' : 'password'}
        className={styles.input}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || '••••••••••••••••'}
      />
      <button type="button" className={styles.eyeBtn} onClick={() => setShow(!show)}>
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div className={styles.toggleRow}>
      <span className={styles.toggleLabel}>{label}</span>
      <button
        type="button"
        className={`${styles.toggle} ${checked ? styles.toggleOn : ''}`}
        onClick={() => onChange(!checked)}
        aria-label={label}
      >
        <div className={styles.toggleThumb} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsGroup>('general');
  const [settings, setSettings] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [lastSaved, setLastSaved] = useState<string>('');

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get('/admin/settings');
      setSettings(data.settings || {});
      setLastSaved(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
    } catch {
      showToast('error', 'Failed to load settings from server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const get = (key: string) => settings[activeTab]?.[key] ?? '';
  const set = (key: string, val: string) => {
    setSettings(prev => ({
      ...prev,
      [activeTab]: { ...(prev[activeTab] || {}), [key]: val }
    }));
  };
  const getBool = (key: string) => settings[activeTab]?.[key] === 'true';
  const setBool = (key: string, val: boolean) => set(key, String(val));

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/admin/settings', { group: activeTab, values: settings[activeTab] || {} });
      showToast('success', `${TABS.find(t => t.id === activeTab)?.label} settings saved successfully!`);
      setLastSaved(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
    } catch {
      showToast('error', 'Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${styles[`toast_${toast.type}`]}`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{toast.msg}</span>
        </div>
      )}

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Agency Settings</h1>
          <p className={styles.sub}>Configure global agency defaults, security policies, and integrations.</p>
        </div>
        <div className={styles.headerActions}>
          {lastSaved && <span className={styles.lastSaved}><Clock size={14} /> Last saved: {lastSaved}</span>}
          <button className={styles.refreshBtn} onClick={fetchSettings} title="Reload from server">
            <RefreshCw size={16} />
          </button>
          <button className={styles.saveBtn} onClick={handleSave} disabled={saving || loading}>
            {saving ? <Loader2 size={18} className={styles.spin} /> : <Save size={18} />}
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      <div className={styles.container}>
        <aside className={styles.sidebar}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </aside>

        <main className={styles.content}>
          {loading ? (
            <div className={styles.loadingState}>
              <Loader2 size={32} className={styles.spin} />
              <p>Loading settings...</p>
            </div>
          ) : (
            <>
              {/* ── GENERAL ── */}
              {activeTab === 'general' && (
                <div className={styles.formSection}>
                  <h2 className={styles.sectionTitle}>General Agency Information</h2>
                  <div className={styles.fieldGrid}>
                    <Field label="Agency Name">
                      <input className={styles.input} value={get('agency_name')} onChange={e => set('agency_name', e.target.value)} placeholder="Digital Pulse Marketing" />
                    </Field>
                    <Field label="Primary Contact Email">
                      <input className={styles.input} type="email" value={get('contact_email')} onChange={e => set('contact_email', e.target.value)} placeholder="hello@digitalpulse.com" />
                    </Field>
                    <Field label="Support Phone">
                      <div className={styles.iconInput}><Phone size={16} /><input className={styles.input} value={get('support_phone')} onChange={e => set('support_phone', e.target.value)} placeholder="+44 20 1234 5678" /></div>
                    </Field>
                    <Field label="Website URL">
                      <div className={styles.iconInput}><Link size={16} /><input className={styles.input} value={get('website_url')} onChange={e => set('website_url', e.target.value)} placeholder="https://digitalpulse.agency" /></div>
                    </Field>
                    <Field label="Default Currency">
                      <select className={styles.input} value={get('currency')} onChange={e => set('currency', e.target.value)}>
                        <option value="GBP">GBP (£)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="AED">AED (د.إ)</option>
                      </select>
                    </Field>
                    <Field label="Timezone">
                      <select className={styles.input} value={get('timezone')} onChange={e => set('timezone', e.target.value)}>
                        <option value="Europe/London">London (GMT+0)</option>
                        <option value="America/New_York">New York (EST)</option>
                        <option value="America/Los_Angeles">Los Angeles (PST)</option>
                        <option value="Asia/Dubai">Dubai (GST+4)</option>
                        <option value="Asia/Singapore">Singapore (SGT+8)</option>
                        <option value="Australia/Sydney">Sydney (AEDT+11)</option>
                      </select>
                    </Field>
                  </div>
                </div>
              )}

              {/* ── BRANDING ── */}
              {activeTab === 'branding' && (
                <div className={styles.formSection}>
                  <h2 className={styles.sectionTitle}>Visual Identity & Branding</h2>
                  <div className={styles.brandingPreview}>
                    <div className={styles.logoSlot}>
                      <div className={styles.logoBox} style={{ background: get('primary_color') || '#0f172a' }}>DP</div>
                      <div>
                        <p className={styles.label}>Agency Logotype</p>
                        <button className={styles.uploadBtn}>Upload Logo</button>
                      </div>
                    </div>
                  </div>
                  <div className={styles.fieldGrid} style={{ marginTop: 32 }}>
                    <Field label="Brand Primary Color" hint="Used for buttons, highlights, and key UI elements.">
                      <div className={styles.colorPicker}>
                        <input type="color" className={styles.colorSwatch} value={get('primary_color') || '#06b6d4'} onChange={e => set('primary_color', e.target.value)} />
                        <input className={styles.input} value={get('primary_color')} onChange={e => set('primary_color', e.target.value)} placeholder="#06b6d4" />
                      </div>
                    </Field>
                    <Field label="Brand Accent Color" hint="Used for secondary actions and highlights.">
                      <div className={styles.colorPicker}>
                        <input type="color" className={styles.colorSwatch} value={get('accent_color') || '#f97316'} onChange={e => set('accent_color', e.target.value)} />
                        <input className={styles.input} value={get('accent_color')} onChange={e => set('accent_color', e.target.value)} placeholder="#f97316" />
                      </div>
                    </Field>
                    <Field label="Agency Tagline">
                      <input className={styles.input} value={get('tagline')} onChange={e => set('tagline', e.target.value)} placeholder="Digital Growth, Delivered." />
                    </Field>
                    <Field label="Favicon URL">
                      <input className={styles.input} value={get('favicon_url')} onChange={e => set('favicon_url', e.target.value)} placeholder="https://example.com/favicon.ico" />
                    </Field>
                  </div>
                </div>
              )}

              {/* ── INTEGRATIONS ── */}
              {activeTab === 'integrations' && (
                <div className={styles.formSection}>
                  <h2 className={styles.sectionTitle}>Third-Party Integrations</h2>
                  <p className={styles.sectionSub}>Connect your external tools. API keys are encrypted at rest.</p>

                  <div className={styles.integrationGroup}>
                    <div className={styles.integrationGroupTitle}><Globe size={16} /> Analytics & Tracking</div>
                    <div className={styles.fieldGrid}>
                      <Field label="Google Analytics Measurement ID" hint="e.g. G-XXXXXXXXXX">
                        <div className={styles.iconInput}><Hash size={16} /><input className={styles.input} value={get('google_analytics_id')} onChange={e => set('google_analytics_id', e.target.value)} placeholder="G-XXXXXXXXXX" /></div>
                      </Field>
                      <Field label="Google Ads Conversion ID" hint="e.g. AW-XXXXXXXXXX">
                        <div className={styles.iconInput}><Hash size={16} /><input className={styles.input} value={get('google_ads_id')} onChange={e => set('google_ads_id', e.target.value)} placeholder="AW-XXXXXXXXXX" /></div>
                      </Field>
                      <Field label="Meta (Facebook) Pixel ID">
                        <div className={styles.iconInput}><Hash size={16} /><input className={styles.input} value={get('meta_pixel_id')} onChange={e => set('meta_pixel_id', e.target.value)} placeholder="XXXXXXXXXXXXXXXX" /></div>
                      </Field>
                      <Field label="HubSpot Portal ID">
                        <div className={styles.iconInput}><Hash size={16} /><input className={styles.input} value={get('hubspot_portal_id')} onChange={e => set('hubspot_portal_id', e.target.value)} placeholder="12345678" /></div>
                      </Field>
                    </div>
                  </div>

                  <div className={styles.integrationGroup}>
                    <div className={styles.integrationGroupTitle}><Mail size={16} /> Email & Notifications</div>
                    <div className={styles.fieldGrid}>
                      <Field label="Mailchimp API Key">
                        <SecretInput value={get('mailchimp_api_key')} onChange={v => set('mailchimp_api_key', v)} placeholder="xxxxxxxx-us1" />
                      </Field>
                      <Field label="SendGrid API Key">
                        <SecretInput value={get('sendgrid_api_key')} onChange={v => set('sendgrid_api_key', v)} placeholder="SG.XXXXXXXXXX" />
                      </Field>
                      <Field label="Slack Webhook URL" hint="Receive agency alerts in Slack.">
                        <input className={styles.input} value={get('slack_webhook_url')} onChange={e => set('slack_webhook_url', e.target.value)} placeholder="https://hooks.slack.com/services/..." />
                      </Field>
                    </div>
                  </div>

                  <div className={styles.integrationGroup}>
                    <div className={styles.integrationGroupTitle}><CreditCard size={16} /> Payments</div>
                    <div className={styles.fieldGrid}>
                      <Field label="Stripe Publishable Key" hint="Safe to expose — used in the browser.">
                        <div className={styles.iconInput}><Key size={16} /><input className={styles.input} value={get('stripe_publishable_key')} onChange={e => set('stripe_publishable_key', e.target.value)} placeholder="pk_live_XXXXXXXXXX" /></div>
                      </Field>
                    </div>
                  </div>
                </div>
              )}

              {/* ── SECURITY ── */}
              {activeTab === 'security' && (
                <div className={styles.formSection}>
                  <h2 className={styles.sectionTitle}>Security & Access Control</h2>
                  <p className={styles.sectionSub}>Control authentication, session management, and audit policies.</p>

                  <div className={styles.securityCards}>
                    <div className={styles.secCard}>
                      <div className={styles.secCardHeader}><Lock size={18} color="#8b5cf6" /> Authentication</div>
                      <div className={styles.fieldGrid}>
                        <Field label="Minimum Password Length">
                          <input type="number" className={styles.input} min="6" max="32" value={get('password_min_length')} onChange={e => set('password_min_length', e.target.value)} />
                        </Field>
                        <Field label="Max Failed Login Attempts">
                          <input type="number" className={styles.input} min="3" max="20" value={get('max_failed_logins')} onChange={e => set('max_failed_logins', e.target.value)} />
                        </Field>
                      </div>
                      <Toggle checked={getBool('two_fa_required')} onChange={v => setBool('two_fa_required', v)} label="Require Two-Factor Authentication (2FA) for all admin users" />
                    </div>

                    <div className={styles.secCard}>
                      <div className={styles.secCardHeader}><Clock size={18} color="#f59e0b" /> Session Management</div>
                      <div className={styles.fieldGrid}>
                        <Field label="Session Timeout (minutes)" hint="Users are auto-logged out after inactivity.">
                          <input type="number" className={styles.input} min="5" max="480" value={get('session_timeout_minutes')} onChange={e => set('session_timeout_minutes', e.target.value)} />
                        </Field>
                      </div>
                    </div>

                    <div className={styles.secCard}>
                      <div className={styles.secCardHeader}><Shield size={18} color="#10b981" /> Audit & Compliance</div>
                      <Toggle checked={getBool('audit_log_enabled')} onChange={v => setBool('audit_log_enabled', v)} label="Enable full system audit logging for all admin actions" />
                      <Field label="IP Allowlist" hint="Comma-separated IPs. Leave blank to allow all.">
                        <input className={styles.input} value={get('ip_whitelist')} onChange={e => set('ip_whitelist', e.target.value)} placeholder="192.168.1.1, 10.0.0.0/24" />
                      </Field>
                    </div>
                  </div>
                </div>
              )}

              {/* ── BILLING PLANS ── */}
              {activeTab === 'billing' && (
                <div className={styles.formSection}>
                  <h2 className={styles.sectionTitle}>Billing Plans & Pricing</h2>
                  <p className={styles.sectionSub}>Configure default plan pricing and invoice settings for new clients.</p>
                  <div className={styles.planGrid}>
                    <div className={styles.planCard}>
                      <div className={styles.planName}>Starter</div>
                      <div className={styles.planDesc}>For new and small businesses</div>
                      <Field label="Monthly Price (£ pence)">
                        <input type="number" className={styles.input} value={get('starter_price_pence')} onChange={e => set('starter_price_pence', e.target.value)} />
                      </Field>
                      <div className={styles.planPreview}>£{((parseInt(get('starter_price_pence') || '99900') / 100)).toFixed(2)}/mo</div>
                    </div>
                    <div className={styles.planCard} style={{ borderColor: '#06b6d4' }}>
                      <div className={styles.planName} style={{ color: '#06b6d4' }}>Growth</div>
                      <div className={styles.planDesc}>Most popular for scaling teams</div>
                      <Field label="Monthly Price (£ pence)">
                        <input type="number" className={styles.input} value={get('growth_price_pence')} onChange={e => set('growth_price_pence', e.target.value)} />
                      </Field>
                      <div className={styles.planPreview}>£{((parseInt(get('growth_price_pence') || '299900') / 100)).toFixed(2)}/mo</div>
                    </div>
                    <div className={styles.planCard} style={{ borderColor: '#f59e0b' }}>
                      <div className={styles.planName} style={{ color: '#f59e0b' }}>Enterprise</div>
                      <div className={styles.planDesc}>Custom pricing for large accounts</div>
                      <Field label="Monthly Price (£ pence, 0 = Custom)">
                        <input type="number" className={styles.input} value={get('enterprise_price_pence')} onChange={e => set('enterprise_price_pence', e.target.value)} />
                      </Field>
                      <div className={styles.planPreview}>Custom Quote</div>
                    </div>
                  </div>

                  <div className={styles.fieldGrid} style={{ marginTop: 32 }}>
                    <Field label="Trial Period (Days)">
                      <input type="number" className={styles.input} value={get('trial_days')} onChange={e => set('trial_days', e.target.value)} />
                    </Field>
                    <Field label="Default Payment Terms (Days)">
                      <input type="number" className={styles.input} value={get('default_payment_terms')} onChange={e => set('default_payment_terms', e.target.value)} />
                    </Field>
                    <Field label="Invoice Number Prefix" hint='e.g. "INV" → INV-001'>
                      <input className={styles.input} value={get('invoice_prefix')} onChange={e => set('invoice_prefix', e.target.value)} placeholder="INV" />
                    </Field>
                  </div>
                </div>
              )}

              <div className={styles.bottomActions}>
                <p className={styles.auditNote}>
                  All system changes are audited for security compliance. Last synced: {lastSaved || '—'}
                </p>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
