'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ArrowRight, 
  Briefcase, 
  Mail, 
  Phone, 
  User, 
  Hash, 
  Shield, 
  Layers,
  Palette,
  Users,
  Code2,
  BarChart2,
  PenTool,
  ClipboardList,
  Building2,
  Calendar,
  UserCheck,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  Loader2,
  Home,
  CheckCircle,
  HelpCircle,
  Megaphone,
  Wrench,
  FolderOpen,
  Star
} from 'lucide-react';
import { RegistrationLayout } from '@/components/auth/RegistrationLayout';
import { StepIndicator } from '@/components/auth/StepIndicator';
import { OtpInput } from '@/components/auth/OtpInput';
import { Button } from '@/components/common/Button/Button';
import styles from './page.module.css';

const STEPS = [
  { id: 1, label: 'Details' },
  { id: 2, label: 'Role' },
  { id: 3, label: 'Password' },
  { id: 4, label: 'Verify' }
];

const ROLES = [
  { value: 'account_manager', icon: Users, title: 'Account Manager', desc: 'Manage client relationships', color: '#06B6D4', bg: '#ECFEFF' },
  { value: 'designer', icon: Palette, title: 'Designer', desc: 'Creative and visual work', color: '#8B5CF6', bg: '#F5F3FF' },
  { value: 'developer', icon: Code2, title: 'Developer', desc: 'Technical implementation', color: '#0891B2', bg: '#ECFEFF' },
  { value: 'analyst', icon: BarChart2, title: 'Analyst', desc: 'Data and performance', color: '#F59E0B', bg: '#FFFBEB' },
  { value: 'copywriter', icon: PenTool, title: 'Copywriter', desc: 'Content and messaging', color: '#22C55E', bg: '#DCFCE7' },
  { value: 'project_manager', icon: ClipboardList, title: 'Project Manager', desc: 'Delivery and timelines', color: '#DC2626', bg: '#FEF2F2' },
];

const DEPARTMENTS = [
  { value: 'creative', label: 'Creative & Design' },
  { value: 'accounts', label: 'Account Management' },
  { value: 'tech', label: 'Technology & Development' },
  { value: 'strategy', label: 'Strategy & Analytics' },
  { value: 'content', label: 'Content & Copywriting' },
  { value: 'ops', label: 'Operations & Admin' },
];

export default function StaffRegisterWizard() {
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    employeeId: '',
    department: '',
    role: '',
    startDate: '',
    manager: '',
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
        <div className={styles.staffBadge}>
          <Shield size={14} />
          <span>Staff Portal</span>
        </div>
      </header>
    );
  };

  const renderStep1 = () => (
    <div className={styles.stepContent}>
      {renderStepHeader(Briefcase, 'Create Your Staff Account', 'Enter your employee details to get started.')}
      <div className={styles.formGrid}>
        <div className={styles.formRow}>
          <div className={styles.field}>
            <label>First Name</label>
            <div className={styles.inputWrap}>
              <User size={18} className={styles.fieldIcon} />
              <input 
                placeholder="Alex" 
                value={formData.firstName}
                onChange={e => updateForm('firstName', e.target.value)}
              />
            </div>
          </div>
          <div className={styles.field}>
            <label>Last Name</label>
            <div className={styles.inputWrap}>
              <input 
                placeholder="Morgan" 
                value={formData.lastName}
                onChange={e => updateForm('lastName', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.field}>
          <label>Work Email Address</label>
          <div className={styles.inputWrap}>
            <Mail size={18} className={styles.fieldIcon} />
            <input 
              type="email" 
              placeholder="alex@digitalpulse.com" 
              value={formData.email}
              onChange={e => updateForm('email', e.target.value)}
            />
          </div>
          <p className={styles.helper}>Use your official agency email address</p>
        </div>

        <div className={styles.field}>
          <label>Phone Number <span className={styles.optional}>Optional</span></label>
          <div className={styles.inputWrap}>
            <Phone size={18} className={styles.fieldIcon} />
            <input 
              placeholder="+1 (555) 000-0000" 
              value={formData.phone}
              onChange={e => updateForm('phone', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label>Employee ID <span className={styles.optional}>Optional</span></label>
          <div className={styles.inputWrap}>
            <Hash size={18} className={styles.fieldIcon} />
            <input 
              placeholder="e.g. EMP-00123" 
              value={formData.employeeId}
              onChange={e => updateForm('employeeId', e.target.value)}
            />
          </div>
          <p className={styles.helper}>Found on your contract or HR portal</p>
        </div>
      </div>
      <Button variant="primary" size="large" fullWidth onClick={nextStep} className={styles.continueBtn}>
        Continue <ArrowRight size={18} />
      </Button>
      <div className={styles.footerLinks}>
        Already have an account? <Link href="/portal/login">Sign in here</Link>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className={styles.stepContent}>
      {renderStepHeader(Layers, 'Your Role & Department', 'Select your department and role within the agency.')}
      
      <div className={styles.field}>
        <label>Department</label>
        <div className={styles.inputWrap}>
          <Building2 size={18} className={styles.fieldIcon} />
          <select 
            className={styles.select}
            value={formData.department}
            onChange={e => updateForm('department', e.target.value)}
          >
            <option value="">Select your department</option>
            {DEPARTMENTS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>
      </div>

      <div className={styles.roleLabel}>Job Role</div>
      <div className={styles.roleGrid}>
        {ROLES.map(role => {
          const Icon = role.icon;
          const isSelected = formData.role === role.value;
          return (
            <div 
              key={role.value} 
              className={`${styles.roleCard} ${isSelected ? styles.roleSelected : ''}`}
              onClick={() => updateForm('role', role.value)}
            >
              <div 
                className={styles.roleIcon} 
                style={{ backgroundColor: isSelected ? role.color : role.bg, color: isSelected ? '#fff' : role.color }}
              >
                <Icon size={24} />
              </div>
              <h4>{role.title}</h4>
              <p>{role.desc}</p>
            </div>
          );
        })}
      </div>

      <div className={styles.formRow}>
        <div className={styles.field}>
          <label>Start Date <span className={styles.optional}>Optional</span></label>
          <div className={styles.inputWrap}>
            <Calendar size={18} className={styles.fieldIcon} />
            <input 
              type="date"
              value={formData.startDate}
              onChange={e => updateForm('startDate', e.target.value)}
            />
          </div>
        </div>
        <div className={styles.field}>
          <label>Reporting Manager <span className={styles.optional}>Optional</span></label>
          <div className={styles.inputWrap}>
            <UserCheck size={18} className={styles.fieldIcon} />
            <input 
              placeholder="e.g. Sarah J."
              value={formData.manager}
              onChange={e => updateForm('manager', e.target.value)}
            />
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
      {renderStepHeader(Lock, 'Secure Your Account', 'Create a strong password to protect your staff account.')}
      
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
        {/* Strength Meter */}
        <div className={styles.strengthContainer}>
          <div className={styles.strengthBars}>
            {[1, 2, 3, 4].map(n => (
              <div key={n} className={`${styles.strengthBar} ${formData.password.length >= n*2 ? styles.activeStrength : ''}`} />
            ))}
          </div>
          <span className={styles.strengthText}>
            {formData.password.length < 3 ? 'Weak' : formData.password.length < 6 ? 'Fair' : 'Strong'}
          </span>
        </div>
      </div>

      <div className={styles.field}>
        <label>Confirm Password</label>
        <div className={styles.inputWrap}>
          <Lock size={18} className={styles.fieldIcon} />
          <input 
            type="password"
            placeholder="Repeat your password"
            value={formData.confirmPassword}
            onChange={e => updateForm('confirmPassword', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.requirements}>
        {[
          { id: 'len', text: 'At least 8 characters', met: formData.password.length >= 8 },
          { id: 'up', text: 'One uppercase letter', met: /[A-Z]/.test(formData.password) },
          { id: 'num', text: 'One number', met: /[0-9]/.test(formData.password) },
          { id: 'spec', text: 'One special character', met: /[!@#$%^&*]/.test(formData.password) }
        ].map(req => (
          <div key={req.id} className={`${styles.reqItem} ${req.met ? styles.reqMet : ''}`}>
            {req.met ? <CheckCircle2 size={14} /> : <div className={styles.bullet} />}
            {req.text}
          </div>
        ))}
      </div>

      <div className={styles.terms}>
        <input 
          type="checkbox" 
          id="terms" 
          checked={formData.terms} 
          onChange={e => updateForm('terms', e.target.checked)} 
        />
        <label htmlFor="terms">
          I agree to the <Link href="#">Terms of Service</Link>, <Link href="#">Privacy Policy</Link> and <Link href="#">Staff Code of Conduct</Link>.
        </label>
      </div>

      <Button variant="primary" size="large" fullWidth onClick={nextStep} className={styles.continueBtn}>
        Create Staff Account <ArrowRight size={18} />
      </Button>
    </div>
  );

  const renderStep4 = () => (
    <div className={styles.stepContent}>
      <header className={styles.wizardHeader}>
        <div className={styles.iconPulse}>
          <div className={styles.pulseRing} />
          <div className={styles.iconCircle}>
            <Mail size={36} color="#06B6D4" />
          </div>
        </div>
        <h2 className={styles.wizardTitle}>Check Your Work Email</h2>
        <p className={styles.wizardSub}>
          We sent a 6-digit verification code to <br />
          <strong>{formData.email || 'alex@digitalpulse.com'}</strong>
        </p>
      </header>

      <OtpInput length={6} onComplete={(code) => console.log('OTP:', code)} />

      <Button variant="primary" size="large" fullWidth onClick={nextStep} className={styles.continueBtn}>
        Verify Email <CheckCircle size={18} />
      </Button>

      <div className={styles.resend}>
        Didn&apos;t receive it? <button>Resend code</button>
        <span className={styles.timer}>Resend in 0:59</span>
      </div>

      <div className={styles.securityNotice}>
        <Shield size={16} />
        This code expires in 10 minutes for your security.
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className={styles.stepContent}>
      <header className={styles.wizardHeader}>
        <div className={styles.iconPulseAmber}>
          <div className={styles.pulseRingAmber} />
          <div className={styles.iconCircleAmber}>
            <Clock size={40} color="#D97706" />
          </div>
        </div>
        <h2 className={styles.wizardTitle}>Account Pending Approval</h2>
        <p className={styles.wizardSub}>
          Your account has been created and is awaiting admin approval. You&apos;ll receive an email once your access is activated.
        </p>
      </header>

      <div className={styles.timeline}>
        {[
          { icon: CheckCircle2, title: 'Email Verified', sub: 'Work email confirmed', state: 'done' },
          { icon: Loader2, title: 'Admin Review', sub: 'Details being reviewed', state: 'active' },
          { icon: Shield, title: 'Access Granted', sub: 'Login confirmation pending', state: 'next' }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className={`${styles.timelineItem} ${styles[item.state]}`}>
              <div className={styles.timelineIcon}>
                <Icon size={20} className={item.state === 'active' ? styles.spinning : ''} />
              </div>
              <div className={styles.timelineInfo}>
                <div className={styles.timelineTitle}>
                  {item.title}
                  {item.state === 'active' && <span className={styles.progressBadge}>In Progress</span>}
                </div>
                <div className={styles.timelineSub}>{item.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.infoBox}>
        <TrendingUp size={20} />
        <div>
          <h4>What happens next?</h4>
          <ul>
            <li>Admin team reviews details within 1 day</li>
            <li>Login credentials sent via email</li>
            <li>Access set based on role and department</li>
          </ul>
        </div>
      </div>

      <Button variant="primary" size="large" fullWidth onClick={nextStep} className={styles.continueBtn}>
        Return to Homepage <Home size={18} />
      </Button>
    </div>
  );

  const renderStep6 = () => (
    <div className={styles.stepContent}>
      <div className={styles.confetti}>🎉</div>
      <header className={styles.wizardHeader}>
        <div className={styles.iconCircleSuccess}>
          <CheckCircle2 size={48} color="#22C55E" />
        </div>
        <h2 className={styles.wizardTitle}>Welcome to the Team, {formData.firstName || 'Alex'}!</h2>
        <p className={styles.wizardSub}>
          Your staff account is active. You now have access to your agency tools and client portfolios.
        </p>
      </header>

      <div className={styles.badgeRow}>
        <div className={styles.badgeCyan}>Account Manager</div>
        <div className={styles.badgePurple}>Digital Strategy</div>
        <div className={styles.badgeGreen}>Staff Access</div>
      </div>

      <div className={styles.quickActions}>
        <h3>Where would you like to start?</h3>
        <div className={styles.actionGrid}>
          <div className={styles.actionCard}>
            <FolderOpen size={24} color="#06B6D4" />
            <h4>Client Portfolios</h4>
            <p>Manage client work</p>
          </div>
          <div className={styles.actionCard}>
            <BarChart2 size={24} color="#8B5CF6" />
            <h4>Generate Reports</h4>
            <p>Build analytics</p>
          </div>
          <div className={styles.actionCard}>
            <Wrench size={24} color="#22C55E" />
            <h4>Internal Tools</h4>
            <p>Agency resources</p>
          </div>
        </div>
      </div>

      <Link href="/admin/dashboard" style={{ width: '100%', textDecoration: 'none' }}>
        <Button variant="primary" size="large" fullWidth className={styles.continueBtn}>
          Go to Staff Dashboard <ArrowRight size={18} />
        </Button>
      </Link>
    </div>
  );

  return (
    <RegistrationLayout>
      <div className={styles.wizardContainer}>
        {step < 5 && (
          <>
            <button className={styles.backBtn} onClick={prevStep} disabled={step === 1}>
              <ArrowLeft size={18} /> {step === 1 ? 'Back to selection' : 'Back'}
            </button>
            <StepIndicator steps={STEPS} currentStep={step} />
          </>
        )}

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}
        {step === 6 && renderStep6()}

        {step < 5 && <div className={styles.stepCounter}>Step {step} of 4</div>}
      </div>

      <button className={styles.helpFab}>
        <HelpCircle size={20} />
        <span>Need help?</span>
      </button>
    </RegistrationLayout>
  );
}
