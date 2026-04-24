'use client';

import React from 'react';
import { Mail, Phone, Globe, ShieldCheck } from 'lucide-react';

export default function FinancialReportTemplate() {
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ background: '#fff', color: '#0f172a', fontFamily: 'Inter, sans-serif', padding: '0', margin: '0' }}>
      {/* Cover Page */}
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px', borderLeft: '20px solid #06b6d4', pageBreakAfter: 'always' }}>
        <p style={{ fontSize: '14px', fontWeight: 700, color: '#06b6d4', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>Executive Financial Review</p>
        <h1 style={{ fontSize: '64px', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, marginBottom: '24px' }}>Agency Performance & <br/>Financial Summary</h1>
        <div style={{ width: '80px', height: '4px', background: '#0f172a', marginBottom: '40px' }} />
        <div style={{ display: 'flex', gap: '40px' }}>
           <div>
             <p style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Date Prepared</p>
             <p style={{ fontSize: '18px', fontWeight: 700 }}>{date}</p>
           </div>
           <div>
             <p style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Prepared By</p>
             <p style={{ fontSize: '18px', fontWeight: 700 }}>Priya Nanthakumar</p>
           </div>
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px', fontWeight: 800 }}>Digital <span style={{ color: '#06b6d4' }}>Pulse</span></span>
            <span style={{ color: '#e2e8f0' }}>|</span>
            <span style={{ fontSize: '14px', color: '#64748b' }}>Confidential Proprietary Data</span>
        </div>
      </div>

      {/* Page 2: Executive Summary */}
      <div style={{ padding: '60px', pageBreakAfter: 'always' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
           <h2 style={{ fontSize: '24px', fontWeight: 800 }}>01. Executive Summary</h2>
           <span style={{ fontSize: '14px', color: '#94a3b8' }}>FY2026 Q2 Performance</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '60px' }}>
            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px' }}>
                <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '8px' }}>TOTAL REVENUE</p>
                <p style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a' }}>£284,500</p>
                <p style={{ fontSize: '13px', color: '#10b981', fontWeight: 700 }}>+14.2% vs Last Quarter</p>
            </div>
            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px' }}>
                <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '8px' }}>CLIENT RETENTION</p>
                <p style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a' }}>98.4%</p>
                <p style={{ fontSize: '13px', color: '#10b981', fontWeight: 700 }}>Exceeding Industry Standard</p>
            </div>
            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px' }}>
                <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '8px' }}>AVG CAMPAIGN ROI</p>
                <p style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a' }}>3.2x</p>
                <p style={{ fontSize: '13px', color: '#10b981', fontWeight: 700 }}>Optimised Cross-Channel</p>
            </div>
        </div>

        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Performance Overview</h3>
        <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.8, marginBottom: '32px' }}>
            The current fiscal period has demonstrated strong growth across all core agency verticals. Our transition to an AI-augmented marketing stack has resulted in a 23% reduction in operational overhead while increasing client campaign efficiency. The revenue pipeline remains robust with £142k in projected earnings for the upcoming quarter.
        </p>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '40px' }}>
           <thead>
             <tr style={{ textAlign: 'left', borderBottom: '2px solid #0f172a' }}>
                <th style={{ padding: '12px', fontSize: '12px', fontWeight: 800 }}>SERVICE LINE</th>
                <th style={{ padding: '12px', fontSize: '12px', fontWeight: 800 }}>REVENUE</th>
                <th style={{ padding: '12px', fontSize: '12px', fontWeight: 800 }}>GROWTH</th>
                <th style={{ padding: '12px', fontSize: '12px', fontWeight: 800 }}>MARGIN</th>
             </tr>
           </thead>
           <tbody>
             <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px', fontSize: '14px' }}>Search Engine Optimisation</td>
                <td style={{ padding: '12px', fontSize: '14px', fontWeight: 600 }}>£94,000</td>
                <td style={{ padding: '12px', fontSize: '14px', color: '#10b981' }}>+8%</td>
                <td style={{ padding: '12px', fontSize: '14px' }}>62%</td>
             </tr>
             <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px', fontSize: '14px' }}>Paid Search & Social</td>
                <td style={{ padding: '12px', fontSize: '14px', fontWeight: 600 }}>£120,500</td>
                <td style={{ padding: '12px', fontSize: '14px', color: '#10b981' }}>+18%</td>
                <td style={{ padding: '12px', fontSize: '14px' }}>45%</td>
             </tr>
             <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px', fontSize: '14px' }}>Content Strategy</td>
                <td style={{ padding: '12px', fontSize: '14px', fontWeight: 600 }}>£70,000</td>
                <td style={{ padding: '12px', fontSize: '14px', color: '#10b981' }}>+12%</td>
                <td style={{ padding: '12px', fontSize: '14px' }}>74%</td>
             </tr>
           </tbody>
        </table>
      </div>

      <style jsx global>{`
        @media print {
          body { -webkit-print-color-adjust: exact; }
          @page { margin: 0; size: A4; }
        }
      `}</style>
    </div>
  );
}
