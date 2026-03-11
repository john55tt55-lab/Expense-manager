'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import styles from './AddTransactionModal.module.css';

interface Category {
  id: string;
  name: string;
  type: string;
}

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionAdded?: () => void;
}

export const AddTransactionModal = ({ isOpen, onClose, onTransactionAdded }: AddTransactionModalProps) => {
  const router = useRouter();
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch categories when modal opens
  useEffect(() => {
    if (isOpen) {
      fetch('/api/categories')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setCategories(data);
            // set default category based on type
            const filtered = data.filter(c => c.type === type);
            if (filtered.length > 0 && !categoryId) {
              setCategoryId(filtered[0].id);
            }
          }
        })
        .catch(err => console.error("Failed to load categories", err));
    }
  }, [isOpen]); // We purposefully omit type/categoryId to only fetch once, but we update default on type change below

  useEffect(() => {
    const filtered = categories.filter(c => c.type === type);
    if (filtered.length > 0) {
      setCategoryId(filtered[0].id);
    } else {
      setCategoryId('');
    }
  }, [type, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          amount: parseFloat(amount),
          category_id: categoryId,
          date,
          notes
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add transaction');
      }

      // Reset form
      setAmount('');
      setNotes('');
      onClose();
      if (onTransactionAdded) onTransactionAdded();
      router.refresh(); // Refresh Next.js server components if needed
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCategories = categories.filter(c => c.type === type);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Transaction">
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.errorAlert}>{error}</div>}

        <div className={styles.typeSelector}>
          <button 
            type="button" 
            className={`${styles.typeBtn} ${type === 'expense' ? styles.activeExpense : ''}`}
            onClick={() => setType('expense')}
          >
            Expense
          </button>
          <button 
            type="button" 
            className={`${styles.typeBtn} ${type === 'income' ? styles.activeIncome : ''}`}
            onClick={() => setType('income')}
          >
            Income
          </button>
        </div>

        <Input
          label="Amount"
          type="number"
          step="0.01"
          min="0.01"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
        />

        <div className={styles.inputGroup}>
          <label className={styles.label}>Category</label>
          <select 
            className={styles.select}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="" disabled>Select category</option>
            {filteredCategories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <Input
          label="Date"
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <div className={styles.inputGroup}>
          <label className={styles.label}>Notes (Optional)</label>
          <textarea 
            className={styles.textarea}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add a note..."
            rows={3}
          />
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Save Transaction
          </Button>
        </div>
      </form>
    </Modal>
  );
};
