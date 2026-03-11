'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import styles from './AddCategoryModal.module.css';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryAdded?: () => void;
}

const COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', 
  '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'
];

export const AddCategoryModal = ({ isOpen, onClose, onCategoryAdded }: AddCategoryModalProps) => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [color, setColor] = useState(COLORS[0]);
  const [budgetLimit, setBudgetLimit] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          type,
          color,
          budget_limit: budgetLimit ? parseFloat(budgetLimit) : null
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add category');
      }

      // Reset form
      setName('');
      setBudgetLimit('');
      onClose();
      if (onCategoryAdded) onCategoryAdded();
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Category">
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.errorAlert}>{error}</div>}

        <div className={styles.typeSelector}>
          <button 
            type="button" 
            className={`${styles.typeBtn} ${type === 'expense' ? styles.activeType : ''}`}
            onClick={() => setType('expense')}
          >
            Expense
          </button>
          <button 
            type="button" 
            className={`${styles.typeBtn} ${type === 'income' ? styles.activeType : ''}`}
            onClick={() => setType('income')}
          >
            Income
          </button>
        </div>

        <Input
          label="Category Name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Groceries"
        />

        <div className={styles.inputGroup}>
          <label className={styles.label}>Color</label>
          <div className={styles.colorGrid}>
            {COLORS.map(c => (
              <button
                key={c}
                type="button"
                className={`${styles.colorBtn} ${color === c ? styles.selectedColor : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
                aria-label={`Select color ${c}`}
              />
            ))}
          </div>
        </div>

        {type === 'expense' && (
          <Input
            label="Monthly Budget Limit (Optional)"
            type="number"
            step="0.01"
            min="0"
            value={budgetLimit}
            onChange={(e) => setBudgetLimit(e.target.value)}
            placeholder="0.00"
          />
        )}

        <div className={styles.actions}>
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Add Category
          </Button>
        </div>
      </form>
    </Modal>
  );
};
