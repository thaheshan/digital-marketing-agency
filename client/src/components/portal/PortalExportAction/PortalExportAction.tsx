'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Download, ClipboardList, FileText, Activity, Info, X } from 'lucide-react';
import styles from './PortalExportAction.module.css';

interface PortalExportActionProps {
  title: string;
  data: any;
  onExportPDF?: () => void;
  onExportCSV?: () => void;
}

export const PortalExportAction: React.FC<PortalExportActionProps> = ({ 
  title, 
  data, 
  onExportPDF, 
  onExportCSV 
}) => {
  const [showExport, setShowExport] = useState(false);
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [exporting, setExporting] = useState<string | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setShowExport(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const handleExportClick = (type: 'CSV' | 'PDF') => {
    setShowExport(false);
    setShowPreview(type);
  };

  const confirmDownload = () => {
    const type = showPreview;
    if (!type) return;
    
    if (type === 'PDF') {
      setShowPreview(null);
      if (onExportPDF) onExportPDF();
      else window.print();
      return;
    }

    setExporting(type);
    setShowPreview(null);

    setTimeout(() => {
      if (onExportCSV) onExportCSV();
      setExporting(null);
    }, 1500);
  };

  return (
    <div className={styles.exportWrapper} ref={exportRef}>
      <button 
        className={`${styles.headerBtn} ${exporting ? styles.btnLoading : ''}`} 
        onClick={() => setShowExport(!showExport)}
      >
        {exporting ? <Activity size={16} className={styles.spin} /> : <Download size={16} />}
        <span>{exporting ? `Generating ${exporting}...` : `Export ${title}`}</span>
      </button>

      {showExport && (
        <div className={styles.exportDropdown}>
          <div className={styles.exportHeader}>SELECT FORMAT</div>
          <button className={styles.exportItem} onClick={() => handleExportClick('CSV')}>
            <ClipboardList size={16} color="#06B6D4" />
            <div className={styles.exportText}>
              <div className={styles.exportTitle}>Download Excel (CSV)</div>
              <div className={styles.exportSub}>Raw data sheet for analysis</div>
            </div>
          </button>
          <button className={styles.exportItem} onClick={() => handleExportClick('PDF')}>
            <FileText size={16} color="#EF4444" />
            <div className={styles.exportText}>
              <div className={styles.exportTitle}>Premium PDF Report</div>
              <div className={styles.exportSub}>Branded executive summary</div>
            </div>
          </button>
        </div>
      )}

      {showPreview && (
        <div className={styles.modalOverlay}>
          <div className={styles.reportModal}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleGroup}>
                <FileText size={20} color="#06B6D4" />
                <div>
                  <h3 className={styles.modalTitle}>Preview: {title}</h3>
                  <p className={styles.modalSub}>Format: {showPreview === 'PDF' ? 'Premium PDF Document' : 'Excel CSV Spreadsheet'}</p>
                </div>
              </div>
              <button className={styles.closeModal} onClick={() => setShowPreview(null)}><X size={20} /></button>
            </div>

            <div className={styles.modalBody}>
               <div className={styles.previewHint}>
                  <Info size={16} /> 
                  Generating high-fidelity {showPreview} with your current filters and branding.
               </div>
               <div className={styles.previewTableMock}>
                  <div className={styles.mockHeader}>
                     <span>DigitalPulse Intelligence</span>
                     <span>Report: {title}</span>
                  </div>
                  <div className={styles.mockLine} />
                  <div className={styles.mockLine} style={{width: '60%'}} />
                  <div className={styles.mockLine} style={{width: '80%'}} />
               </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowPreview(null)}>Cancel</button>
              <button className={styles.downloadConfirmBtn} onClick={confirmDownload}>
                <Download size={16} /> Confirm & Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
