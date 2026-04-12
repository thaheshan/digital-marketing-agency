'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  Briefcase,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
  Zap,
  BarChart3,
  Rocket
} from 'lucide-react';
import { RegistrationLayout } from '@/components/auth/RegistrationLayout';
import { StepIndicator } from '@/components/auth/StepIndicator';
import { OtpInput } from '@/components/auth/OtpInput';
import { Button } from '@/components/common/Button/Button';
import styles from './page.module.css';

const STEPS = [
  { id: 1, label: 'Account' },
  { id: 2, label: 'Details' },
  { id: 3, label: 'Business' },
  { id: 4, label: 'Password' },
  { id: 5, label: 'Verify' }
];

export default function ClientRegisterWizard() {
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    accountType: 'business',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    website: '',
    industry: '',
    password: '',
    confirmPassword: '',
    terms: false
  });

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 6));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  // --- RENDERS ---

  const renderStepHeader = (icon: any, title: string, sub: string) => {
    const Icon = icon;
    return (
      <header className={styles.wizardHeader}>
        <div className={styles.iconCircle}>
          <Icon size={36} color="#06B6D4" />
        </div>
        <h2 className={styles.wizardTitle}>{title}</h2>
        <p className={styles.wizardSub}>{sub}</p>
      </header>
    );
  };

  const renderStep1 = () => (
    <div className={styles.stepContent}>
      {renderStepHeader(User, 'Create Your Account', 'Choose the account type that best fits your needs.')}
      
      <div className={styles.selectionGrid}>
        <div 
          className={`${styles.selectCard} ${formData.accountType === 'individual' ? styles.selected : ''}`}
          onClick={() => updateForm('accountType', 'individual')}
        >
          <div className={styles.cardHeader}>
            <div className={styles.cardIconBox}><User size={24} color="#06B6D4" /></div>
            <div className={styles.radio}><div className={styles.radioInner} /></div>
          </div>
          <h3>Individual / Freelancer</h3>
          <p>Perfect for solo entrepreneurs and freelancers managing their own marketing.</p>
          <ul className={styles.cardBenefits}>
            <li><CheckCircle2 size={14} /> Personal dashboard</li>
            <li><CheckCircle2 size={14} /> Up to 3 active campaigns</li>
            <li><CheckCircle2 size={14} /> Basic analytics</li>
          </ul>
        </div>

        <div 
          className={`${styles.selectCard} ${formData.accountType === 'business' ? styles.selected : ''}`}
          onClick={() => updateForm('accountType', 'business')}
        >
          <div className={styles.cardHeader}>
            <div className={styles.cardIconBox}><Building2 size={24} color="#F97316" /></div>
            <div className={styles.popBadge}>MOST POPULAR</div>
            <div className={styles.radio}><div className={styles.radioInner} /></div>
          </div>
          <h3>Business / Company</h3>
          <p>Ideal for small to medium businesses and growing companies.</p>
          <ul className={styles.cardBenefits}>
            <li><CheckCircle2 size={14} /> Team collaboration</li>
            <li><CheckCircle2 size={14} /> Unlimited campaigns</li>
            <li><CheckCircle2 size={14} /> Advanced ROI tracking</li>
          </ul>
        </div>
      </div>

      <Button variant="primary" size="large" fullWidth onClick={nextStep} className={styles.continueBtn}>
        Continue <ArrowRight size={18} />
      </Button>
      <div className={styles.footerLinks}>
        Already have an account? <Link href="/portal/login">Sign in</Link>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className={styles.stepContent}>
      {renderStepHeader(Mail, 'Tell Us About Yourself', 'We\'ll use this info to personalize your experience.')}
      <div className={styles.formGrid}>
        <div className={styles.formRow}>
          <div className={styles.field}>
            <label>First Name <span className={styles.required}>*</span></label>
            <div className={styles.inputWrap}>
              <User size={18} className={styles.fieldIcon} />
              <input value={formData.firstName} onChange={e => updateForm('firstName', e.target.value)} placeholder="John" required />
            </div>
          </div>
          <div className={styles.field}>
            <label>Last Name <span className={styles.required}>*</span></label>
            <div className={styles.inputWrap}>
              <input value={formData.lastName} onChange={e => updateForm('lastName', e.target.value)} placeholder="Doe" required />
            </div>
          </div>
        </div>

        <div className={styles.field}>
          <label>Email Address <span className={styles.required}>*</span></label>
          <div className={styles.inputWrap}>
            <Mail size={18} className={styles.fieldIcon} />
            <input type="email" value={formData.email} onChange={e => updateForm('email', e.target.value)} placeholder="john@company.com" required />
          </div>
        </div>

        <div className={styles.field}>
          <label>Phone Number</label>
          <div className={styles.inputWrap}>
            <Phone size={18} className={styles.fieldIcon} />
            <input value={formData.phone} onChange={e => updateForm('phone', e.target.value)} placeholder="+1 (555) 123-4567" />
          </div>
        </div>
      </div>

      <Button variant="primary" size="large" fullWidth onClick={nextStep} className={styles.continueBtn}>
        Continue <ArrowRight size={18} />
      </Button>
    </div>
  );

  const renderStep3 = () => (
    <div className={styles.stepContent}>
      {renderStepHeader(Briefcase, 'Your Business Info', 'Help us understand your marketing goals.')}
      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label>Company Name <span className={styles.required}>*</span></label>
          <div className={styles.inputWrap}>
            <Building2 size={18} className={styles.fieldIcon} />
            <input value={formData.companyName} onChange={e => updateForm('companyName', e.target.value)} placeholder="Marketing Agency Inc." required />
          </div>
        </div>

        <div className={styles.field}>
          <label>Website URL <span className={styles.optional}>Optional</span></label>
          <div className={styles.inputWrap}>
            <Globe size={18} className={styles.fieldIcon} />
            <input value={formData.website} onChange={e => updateForm('website', e.target.value)} placeholder="https://www.yourwebsite.com" />
          </div>
        </div>

        <div className={styles.field}>
          <label>Industry <span className={styles.required}>*</span></label>
          <div className={styles.inputWrap}>
            <TrendingUp size={18} className={styles.fieldIcon} />
            <select 
              className={styles.select}
              value={formData.industry} 
              onChange={e => updateForm('industry', e.target.value)}
            >
              <option value="">Select your industry</option>
              {['Tech & SaaS', 'Fashion & Beauty', 'Food & Beverage', 'Real Estate', 'Education', 'Financial Services'].map(i => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <Button variant="primary" size="large" fullWidth onClick={nextStep} className={styles.continueBtn}>
        Continue <ArrowRight size={18} />
      </Button>
    </div>
  );

  const renderStep4 = () => (
    <div className={styles.stepContent}>
      {renderStepHeader(Lock, 'Secure Your Workspace', 'Almost there! Set a password for your account.')}
      
      <div className={styles.field}>
        <label>Password</label>
        <div className={styles.inputWrap}>
          <Lock size={18} className={styles.fieldIcon} />
          <input 
            type={showPass ? 'text' : 'password'}
            placeholder="Create a strong password"
            value={formData.password}
            onChange={e => updateForm('password', e.target.value)}
          />
          <button className={styles.eyeBtn} onClick={() => setShowPass(!showPass)}>
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <div className={styles.requirements}>
          {[
            { id: 'len', text: 'At least 8 characters', met: formData.password.length >= 8 },
            { id: 'up', text: 'One uppercase letter', met: /[A-Z]/.test(formData.password) },
            { id: 'num', text: 'One number', met: /[0-9]/.test(formData.password) }
          ].map(req => (
            <div key={req.id} className={`${styles.reqItem} ${req.met ? styles.reqMet : ''}`}>
              {req.met ? <CheckCircle2 size={14} /> : <div className={styles.bullet} />}
              {req.text}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.field}>
        <label>Confirm Password</label>
        <div className={styles.inputWrap}>
          <Lock size={18} className={styles.fieldIcon} />
          <input 
            type="password"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={e => updateForm('confirmPassword', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.terms}>
        <input 
          type="checkbox" 
          id="terms" 
          checked={formData.terms} 
          onChange={e => updateForm('terms', e.target.checked)} 
        />
        <label htmlFor="terms">
          I agree to the <Link href="#">Terms of Service</Link> and <Link href="#">Privacy Policy</Link>.
        </label>
      </div>

      <Button variant="primary" size="large" fullWidth onClick={nextStep} className={styles.continueBtn}>
        Create Account <ArrowRight size={18} />
      </Button>
    </div>
  );

  const renderStep5 = () => (
    <div className={styles.stepContent}>
      {renderStepHeader(Mail, 'Verify Your Email', `We've sent a 6-digit verification code to ${formData.email || 'your email'}.`)}
      
      <OtpInput onComplete={(code) => console.log(code)} />

      <div className={styles.resend}>
        Didn&apos;t receive the code? <button>Resend in 0:53</button>
      </div>

      <Button variant="primary" size="large" fullWidth onClick={nextStep} className={styles.continueBtn}>
        Verify & Create Account <CheckCircle size={18} />
      </Button>

      <div className={styles.securityNote}>
        <ShieldCheck size={16} /> Your information is secure and encrypted
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className={styles.stepContent}>
      <header className={styles.welcomeHeader}>
        <div className={styles.successIcon}><CheckCircle2 size={40} color="#fff" /></div>
        <h1 className={styles.welcomeTitle}>Welcome Aboard! 🎉</h1>
        <p className={styles.welcomeSub}>Hi {formData.firstName}, your account is ready! Let&apos;s get you started on your marketing journey.</p>
      </header>

      <div className={styles.actionSection}>
        <h3>Let&apos;s Get You Started</h3>
        <p>Complete these quick steps to maximize your results</p>
        <div className={styles.actionGrid}>
          <div className={styles.actionBox}>
            <div className={styles.stepNum}>1</div>
            <div className={styles.actionIcon}><User size={20} color="#06B6D4" /></div>
            <h4>Complete Profile</h4>
            <span>2 minutes</span>
          </div>
          <div className={styles.actionBox}>
            <div className={styles.stepNum}>2</div>
            <div className={styles.actionIcon}><Zap size={20} color="#22C55E" /></div>
            <h4>Connect Account</h4>
            <span>5 minutes</span>
          </div>
          <div className={styles.actionBox}>
            <div className={styles.stepNum}>3</div>
            <div className={styles.actionIcon}><Rocket size={20} color="#F97316" /></div>
            <h4>First Campaign</h4>
            <span>10 minutes</span>
          </div>
        </div>
      </div>

      <div className={styles.getBox}>
        <div className={styles.getLabel}>What You Get</div>
        <div className={styles.getGrid}>
          <div><BarChart3 size={18} /> 24/7 Analytics</div>
          <div><Users size={18} /> Expert Manager</div>
          <div><Zap size={18} /> AI Optimization</div>
          <div><ShieldCheck size={18} /> 100% Security</div>
        </div>
      </div>

      <Link href="/portal/dashboard" style={{ textDecoration: 'none' }}>
        <Button variant="primary" size="large" fullWidth className={styles.continueBtn}>
          Go to Dashboard <ArrowRight size={18} />
        </Button>
      </Link>
    </div>
  );

  return (
    <RegistrationLayout
      leftTitle="Start Your Marketing Journey"
      leftSubtitle="Join hundreds of businesses growing with our marketing solutions."
      benefits={[
        "Real-Time Campaign Tracking",
        "Dedicated Support Manager",
        "Quick Under 5-min Setup",
        "Enterprise-Grade Security"
      ]}
    >
      <div className={styles.wizardContainer}>
        {step < 5 && (
          <>
            <StepIndicator steps={STEPS} currentStep={step} />
          </>
        )}

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}
        {step === 6 && renderStep6()}

        {step > 1 && step < 5 && (
          <button className={styles.backLink} onClick={prevStep}>
            <ArrowLeft size={16} /> Back
          </button>
        )}
        
        {step < 5 && <div className={styles.stepCounter}>Step {step} of 5</div>}
      </div>
    </RegistrationLayout>
  );
}
