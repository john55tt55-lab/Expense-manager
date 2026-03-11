import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { TransactionList } from '@/components/transactions/TransactionList';
import styles from '@/app/(dashboard)/dashboard/page.module.css';

export const RecentTransactions = () => {
  return (
    <Card className={styles.recentCard}>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent style={{ padding: 0 }}>
        <TransactionList limit={5} showFilters={false} />
      </CardContent>
    </Card>
  );
};
