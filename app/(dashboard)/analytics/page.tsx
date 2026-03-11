'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import styles from '../dashboard/page.module.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarElement);

interface AnalyticsData {
  expenseByCategory: { name: string; total: number; color: string; id: string }[];
  monthlyData: { month: string; income: number; expense: number }[];
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return <div className={styles.container}>Loading analytics...</div>;
  }

  if (!analytics || (analytics.expenseByCategory.length === 0 && analytics.monthlyData.length === 0)) {
    return (
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Analytics</h1>
        </div>
        <Card>
          <CardContent style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Not enough data to display analytics yet.
          </CardContent>
        </Card>
      </div>
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

  const barData = {
    labels: analytics.monthlyData.map((m) => m.month),
    datasets: [
      {
        label: 'Income',
        data: analytics.monthlyData.map((m) => m.income),
        backgroundColor: 'rgba(16, 185, 129, 0.8)', // success-color
      },
      {
        label: 'Expense',
        data: analytics.monthlyData.map((m) => m.expense),
        backgroundColor: 'rgba(239, 68, 68, 0.8)', // danger-color
      }
    ],
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Analytics & Reports</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent style={{ height: '350px', padding: '1rem' }}>
            {analytics.monthlyData.length > 0 ? (
              <Bar 
                data={barData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: { beginAtZero: true }
                  }
                }} 
              />
            ) : (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>No data available</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent style={{ height: '350px', padding: '1rem' }}>
            {analytics.expenseByCategory.length > 0 ? (
              <Doughnut 
                data={doughnutData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'right' as const }
                  },
                  cutout: '60%'
                }} 
              />
            ) : (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>No data available</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
