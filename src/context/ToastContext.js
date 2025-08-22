import React, { createContext, useContext, useState, useCallback } from "react";
import RetroToast from "../components/RetroToast";

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    retroMode: false,
  });

  const showToast = useCallback((message, retroMode = false) => {
    setToast({ show: true, message, retroMode });
  }, []);

  const closeToast = useCallback(() => {
    setToast((t) => ({ ...t, show: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <RetroToast
        message={toast.message}
        show={toast.show}
        onClose={closeToast}
        retroMode={toast.retroMode}
      />
    </ToastContext.Provider>
  );
}
