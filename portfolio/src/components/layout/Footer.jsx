// src/components/layout/Footer.js
import React from 'react';
import LoadingSpinner from '@/components/loaders/LoadingSpinner'; // Import
import styles from './Footer.module.css'; // Assuming you have CSS Modules for Footer

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>© 2025 Floria Leger. All rights reserved.</p>
      {/* Add the small spinner */}
      <div className={styles.footerAnimation}>
        <LoadingSpinner size="small" />
      </div>
    </footer>
  );
}


