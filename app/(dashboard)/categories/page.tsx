'use client';

import React, { useState } from 'react';
import { CategoryList } from '@/components/categories/CategoryList';
import { AddCategoryModal } from '@/components/categories/AddCategoryModal';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import styles from '../dashboard/page.module.css';
import catStyles from './page.module.css';

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');

  const handleCategoryAdded = () => {
    window.dispatchEvent(new Event('refresh-categories'));
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Categories & Budgets</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add Category
        </Button>
      </div>

      <div className={catStyles.tabs}>
        <button 
          className={`${catStyles.tab} ${activeTab === 'expense' ? catStyles.activeTab : ''}`}
          onClick={() => setActiveTab('expense')}
        >
          Expense Categories
        </button>
        <button 
          className={`${catStyles.tab} ${activeTab === 'income' ? catStyles.activeTab : ''}`}
          onClick={() => setActiveTab('income')}
        >
          Income Categories
        </button>
      </div>

      <div className={catStyles.tabContent}>
        <CategoryList type={activeTab} />
      </div>

      <AddCategoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCategoryAdded={handleCategoryAdded}
      />
    </div>
  );
}
