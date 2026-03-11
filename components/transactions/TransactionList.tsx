'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { ArrowUpRight, ArrowDownLeft, Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import styles from './TransactionList.module.css';

interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  notes: string;
  category_name: string;
  category_color: string;
}

interface TransactionListProps {
  limit?: number;
  showFilters?: boolean;
}

export const TransactionList = ({ limit, showFilters = false }: TransactionListProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const url = limit ? `/api/transactions?limit=${limit}` : '/api/transactions';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (err) {
      console.error('Failed to fetch transactions', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // Expose a global event listener to allow other components to trigger a refresh
    const handleRefresh = () => fetchTransactions();
    window.addEventListener('refresh-transactions', handleRefresh);
    return () => window.removeEventListener('refresh-transactions', handleRefresh);
  }, [limit]);

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.notes?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.category_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatAmount = (amount: number, type: string) => {
    const prefix = type === 'income' ? '+' : '-';
    return `${prefix}$${amount.toFixed(2)}`;
  };

  return (
    <div className={styles.container}>
      {showFilters && (
        <div className={styles.filters}>
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expense Only</option>
          </select>
        </div>
      )}

      <Card className={styles.card}>
        <CardContent className={styles.content}>
          {isLoading ? (
            <div className={styles.emptyState}>Loading transactions...</div>
          ) : filteredTransactions.length === 0 ? (
            <div className={styles.emptyState}>No transactions found.</div>
          ) : (
            <ul className={styles.list}>
              {filteredTransactions.map(t => (
                <li key={t.id} className={styles.item}>
                  <div className={styles.itemLeft}>
                    <div 
                      className={styles.iconWrapper} 
                      style={{ backgroundColor: `${t.category_color}1a`, color: t.category_color }}
                    >
                      {t.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                    </div>
                    <div>
                      <div className={styles.categoryName}>{t.category_name}</div>
                      <div className={styles.dateAndNotes}>
                        {formatDate(t.date)} {t.notes ? `• ${t.notes}` : ''}
                      </div>
                    </div>
                  </div>
                  <div className={`${styles.amount} ${t.type === 'income' ? styles.income : styles.expense}`}>
                    {formatAmount(t.amount, t.type)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
