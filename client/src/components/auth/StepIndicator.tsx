'use client';

import React from 'react';
import { Check } from 'lucide-react';
import styles from './StepIndicator.module.css';

interface Step {
  id: number;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className={styles.container}>
      {steps.map((step, idx) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;

        return (
          <React.Fragment key={step.id}>
            <div className={styles.stepWrapper}>
              <div 
                className={`
                  ${styles.circle} 
                  ${isCompleted ? styles.completed : ''} 
                  ${isActive ? styles.active : ''}
                `}
              >
                {isCompleted ? <Check size={14} /> : step.id}
              </div>
              <span className={`${styles.label} ${isActive ? styles.activeLabel : ''}`}>
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`${styles.line} ${isCompleted ? styles.completedLine : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
