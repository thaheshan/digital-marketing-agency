import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import styles from './page.module.css';

export default function ThankYouPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <Sparkles size={48} className={styles.icon} />
        </div>
        
        <h1>You're One Step Closer to <span className={styles.highlight}>Growth</span></h1>
        
        <p className={styles.message}>
          Thank you for reaching out to DigitalPulse Agency. We've received your details and one of our growth specialists will be in touch within 24 hours to discuss your project.
        </p>

        <div className={styles.nextSteps}>
          <h3>What happens next?</h3>
          <ul className={styles.stepsList}>
            <li><strong>1. Discovery Call</strong> — A brief 15 min chat to understand your goals.</li>
            <li><strong>2. Custom Strategy</strong> — We'll build a tailored plan for your business.</li>
            <li><strong>3. Execution</strong> — We launch campaigns that drive measurable results.</li>
          </ul>
        </div>

        <div className={styles.actions}>
          <Link href="/portfolio" className={styles.primaryBtn}>
            View Our Case Studies <ArrowRight size={18} />
          </Link>
          <Link href="/" className={styles.secondaryBtn}>
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
