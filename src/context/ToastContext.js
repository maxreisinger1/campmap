/**
 * @fileoverview Toast notification context and provider for application-wide messaging
 * @author Creator Camp Team
 * @version 1.0.0
 */

import { createContext, useContext, useState, useCallback } from "react";
import RetroToast from "../components/RetroToast";

/**
 * React context for managing toast notifications across the application.
 * @type {React.Context}
 */
const ToastContext = createContext();

/**
 * Custom hook for accessing toast notification functionality.
 *
 * Provides access to the showToast function from any component within
 * the ToastProvider tree.
 *
 * @function useToast
 * @returns {Object} Toast context value
 * @returns {Function} returns.showToast - Function to display a toast message
 *
 * @example
 * ```javascript
 * function MyComponent() {
 *   const { showToast } = useToast();
 *
 *   const handleSuccess = () => {
 *     showToast("Operation successful!", false);
 *   };
 * }
 * ```
 */
export function useToast() {
  return useContext(ToastContext);
}

/**
 * Provider component for toast notification context.
 *
 * Manages toast state and provides showToast functionality to child components.
 * Renders the RetroToast component and handles show/hide logic with automatic
 * cleanup.
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Provider with toast functionality
 *
 * @example
 * ```javascript
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 * ```
 */
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
