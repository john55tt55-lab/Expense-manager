'use client';

import React, { useState } from 'react';
import { TransactionList } from '@/components/transactions/TransactionList';
import { AddTransactionModal } from '@/components/transactions/AddTransactionModal';
import { Button } from '@/components/ui/Button';
import { Plus, Download } from 'lucide-react';
import styles from '../dashboard/page.module.css';

export default function TransactionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTransactionAdded = () => {
    window.dispatchEvent(new Event('refresh-transactions'));
  };

  const handleExport = () => {
    window.open('/api/export', '_blank');
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Transactions</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" onClick={handleExport}>
            <Download size={18} style={{ marginRight: '0.5rem' }} /> Export CSV
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add Transaction
          </Button>
        </div>
      </div>

      <TransactionList showFilters={true} />

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onTransactionAdded={handleTransactionAdded}
      />
    </div>
  );
}
