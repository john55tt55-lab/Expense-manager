import React, { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, isLoading, children, ...props }, ref) => {
    const classNames = [
      styles.button,
      styles[variant],
      styles[size],
      fullWidth ? styles.fullWidth : '',
      isLoading ? styles.loading : '',
      className || ''
    ].filter(Boolean).join(' ');

    return (
      <button ref={ref} className={classNames} disabled={isLoading || props.disabled} {...props}>
        {isLoading ? <span className={styles.spinner}></span> : null}
        <span className={isLoading ? styles.hiddenText : ''}>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
