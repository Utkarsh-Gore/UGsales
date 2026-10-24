import { useState, useEffect, useCallback, createContext, useContext } from "react";

// Toast Context for global use across admin
const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

function ToastItem({ toast, onRemove }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const iconMap = {
    success: "fa-check",
    error: "fa-xmark",
    info: "fa-info",
    warning: "fa-exclamation",
  };

  return (
    <div className={`admin-toast ${toast.type} ${exiting ? "toast-exit" : ""}`} style={{ position: "relative" }}>
      <div className="admin-toast-icon">
        <i className={`fa-solid ${iconMap[toast.type] || "fa-info"}`}></i>
      </div>
      <div className="admin-toast-content">
        <div className="admin-toast-title">{toast.title}</div>
        {toast.message && <div className="admin-toast-message">{toast.message}</div>}
      </div>
      <button
        className="admin-toast-close"
        onClick={() => {
          setExiting(true);
          setTimeout(() => onRemove(toast.id), 300);
        }}
      >
        ×
      </button>
      <div className="admin-toast-progress"></div>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, title, message = "") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, title, message }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (title, message) => addToast("success", title, message),
    error: (title, message) => addToast("error", title, message),
    info: (title, message) => addToast("info", title, message),
    warning: (title, message) => addToast("warning", title, message),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="admin-toast-container">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
