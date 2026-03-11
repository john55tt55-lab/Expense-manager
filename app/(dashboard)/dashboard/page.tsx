'use client';

import React, { useEffect, useState } from 'react';
import { OverviewCard } from '@/components/dashboard/OverviewCard';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { AddTransactionModal } from '@/components/transactions/AddTransactionModal';
import { Wallet, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './page.module.css';

interface SummaryData {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSummary = async () => {
    try {
      const res = await fetch('/api/dashboard/summary');
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (err) {
      console.error('Failed to fetch summary:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard Overview</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add Transaction
        </Button>
      </div>
      
      <div className={styles.overviewGrid}>
        <OverviewCard 
          title="Total Balance" 
          amount={data?.totalBalance || 0} 
          icon={<Wallet size={24} />}
          color="primary"
        />
        <OverviewCard 
          title="Total Income" 
          amount={data?.totalIncome || 0} 
          icon={<TrendingUp size={24} />}
          color="success"
        />
        <OverviewCard 
          title="Total Expenses" 
          amount={data?.totalExpenses || 0} 
          icon={<TrendingDown size={24} />}
          color="danger"
        />
      </div>
      
      <div className={styles.dashboardGrid}>
        <DashboardCharts />
        <RecentTransactions />
      </div>

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onTransactionAdded={fetchSummary}
      />
    </div>
  );
}
