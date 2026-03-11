import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import styles from './DashboardLayout.module.css';

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.mainWrapper}>
        <Navbar />
        <main className={styles.mainContent}>
          <div className={styles.container}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
