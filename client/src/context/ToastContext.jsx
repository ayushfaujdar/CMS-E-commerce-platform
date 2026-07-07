import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const show = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2600);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast && <div className="toast">{toast}</div>}
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext);
