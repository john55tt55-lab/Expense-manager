'use client';

import React from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { Moon, Sun, Bell, User } from 'lucide-react';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        {/* Mobile menu toggle would go here */}
      </div>

      <div className={styles.right}>
        <button className={styles.iconBtn} onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        
        <button className={styles.iconBtn} aria-label="Notifications">
          <Bell size={20} />
          <span className={styles.badge}>3</span>
        </button>

        <div className={styles.divider}></div>

        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            <User size={18} />
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Demo User</span>
            <span className={styles.userRole}>Free Plan</span>
          </div>
        </div>
      </div>
    </header>
  );
};
