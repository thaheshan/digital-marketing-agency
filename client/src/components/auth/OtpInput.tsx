'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './OtpInput.module.css';

interface OtpInputProps {
  length?: number;
  onComplete: (code: string) => void;
  error?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({ length = 6, onComplete, error }) => {
  const [code, setCode] = useState<string[]>(new Array(length).fill(''));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);

    // Auto advance
    if (value && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    if (newCode.every(digit => digit !== '')) {
      onComplete(newCode.join(''));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <div className={styles.container}>
      {code.map((digit, idx) => (
        <input
          key={idx}
          ref={el => { inputs.current[idx] = el; }}
          type="text"
          maxLength={1}
          value={digit}
          onChange={e => handleChange(e, idx)}
          onKeyDown={e => handleKeyDown(e, idx)}
          className={`${styles.input} ${error ? styles.error : ''} ${digit ? styles.filled : ''}`}
        />
      ))}
    </div>
  );
};
