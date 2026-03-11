import React from 'react';
import styles from './Card.module.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <div className={`${styles.card} ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className, ...props }: CardProps) => {
  return (
    <div className={`${styles.header} ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className, ...props }: CardProps) => {
  return (
    <h3 className={`${styles.title} ${className || ''}`} {...props}>
      {children}
    </h3>
  );
};

export const CardContent = ({ children, className, ...props }: CardProps) => {
  return (
    <div className={`${styles.content} ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className, ...props }: CardProps) => {
  return (
    <div className={`${styles.footer} ${className || ''}`} {...props}>
      {children}
    </div>
  );
};
