'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import styles from './DashboardCharts.module.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler);

interface AnalyticsData {
  expenseByCategory: { name: string; total: number; color: string; id: string }[];
  monthlyData: { month: string; income: number; expense: number }[];
}

export const DashboardCharts = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    window.addEventListener('refresh-transactions', fetchAnalytics);
    return () => window.removeEventListener('refresh-transactions', fetchAnalytics);
  }, []);

  if (isLoading) {
    return (
      <Card className={styles.container}>
        <CardContent className={styles.loadingState}>Loading charts...</CardContent>
      </Card>
    );
  }

  if (!analytics || (analytics.expenseByCategory.length === 0 && analytics.monthlyData.length === 0)) {
    return (
      <Card className={styles.container}>
        <CardHeader>
          <CardTitle>Spending Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={styles.emptyState}>
            Add some transactions to see your analytics.
          </div>
        </CardContent>
      </Card>
    );
  }

  const doughnutData = {
    labels: analytics.expenseByCategory.map((c) => c.name),
    datasets: [
      {
        data: analytics.expenseByCategory.map((c) => c.total),
        backgroundColor: analytics.expenseByCategory.map((c) => c.color),
        borderWidth: 0,
      },
    ],
  };

  const hasExpenses = analytics.expenseByCategory.length > 0;

  return (
    <Card className={styles.container}>
      <CardHeader>
        <CardTitle>Expense Distribution</CardTitle>
      </CardHeader>
      <CardContent className={styles.chartWrapper}>
        {hasExpenses ? (
          <div className={styles.doughnutContainer}>
            <Doughnut 
              data={doughnutData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right' as const,
                    labels: { color: 'var(--text-secondary)' }
                  }
                },
                cutout: '70%'
              }} 
            />
          </div>
        ) : (
          <div className={styles.emptyState}>No expenses yet.</div>
        )}
      </CardContent>
    </Card>
  );
};
