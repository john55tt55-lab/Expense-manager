import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import styles from './OverviewCard.module.css';

interface OverviewCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'success' | 'danger' | 'warning';
}

export const OverviewCard = ({ title, amount, icon, trend, color = 'primary' }: OverviewCardProps) => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

  return (
    <Card className={`${styles.card} ${styles[color]}`}>
      <CardContent className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.iconWrapper}>{icon}</div>
        </div>
        <div className={styles.body}>
          <div className={styles.amount}>{formattedAmount}</div>
          {trend && (
            <div className={`${styles.trend} ${trend.isPositive ? styles.trendPositive : styles.trendNegative}`}>
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}% from last month
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
