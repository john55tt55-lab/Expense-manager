'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import styles from './CategoryList.module.css';

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  budget_limit: number | null;
}

interface CategoryListProps {
  type: 'expense' | 'income';
}

export const CategoryList = ({ type }: CategoryListProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.filter((c: Category) => c.type === type));
      }
    } catch (err) {
      console.error('Failed to fetch categories', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    const handleRefresh = () => fetchCategories();
    window.addEventListener('refresh-categories', handleRefresh);
    return () => window.removeEventListener('refresh-categories', handleRefresh);
  }, [type]);

  if (isLoading) {
    return <div className={styles.emptyState}>Loading categories...</div>;
  }

  if (categories.length === 0) {
    return <div className={styles.emptyState}>No categories found.</div>;
  }

  return (
    <div className={styles.grid}>
      {categories.map((c) => (
        <Card key={c.id} className={styles.card}>
          <CardContent className={styles.content}>
            <div className={styles.avatar} style={{ backgroundColor: `${c.color}20`, color: c.color }}>
              <div className={styles.colorDot} style={{ backgroundColor: c.color }}></div>
            </div>
            <div className={styles.info}>
              <h4 className={styles.name}>{c.name}</h4>
              {c.budget_limit && (
                <div className={styles.budget}>Budget: ${c.budget_limit.toFixed(2)} / month</div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
