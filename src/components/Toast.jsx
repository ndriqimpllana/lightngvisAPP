import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import './Toast.css';

const DURATION = 3200; // ms before auto-dismiss

const ToastItem = ({ toast, onRemove }) => {
  const [exiting, setExiting] = useState(false);

  const dismiss = () => {
    setExiting(true);
    setTimeout(() => onRemove(toast.id), 280);
  };

  useEffect(() => {
    const t = setTimeout(dismiss, DURATION);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`toast ${exiting ? 'toast--exit' : ''}`}>
      {toast.img && (
        <img src={toast.img} alt={toast.title} className="toast__img" />
      )}
      <div className="toast__body">
        <span className="toast__label">Added to cart</span>
        <span className="toast__title">{toast.title}</span>
      </div>
      <button className="toast__close" onClick={dismiss} aria-label="Dismiss">✕</button>
    </div>
  );
};

const Toast = () => {
  const { toasts, removeToast } = useCart();

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

export default Toast;
