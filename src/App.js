/**
 * @fileoverview Main application component for Creator Camp Map
 * @author Bart Tynior
 * @version 1.0.0
 * @date 2025-08-25
 */

import { lazy, Suspense } from 'react';

// Lazy load the main globe component for better performance
const FanDemandGlobe = lazy(() => import('./components/FanDemandGlobe'));

/**
 * Main App component that serves as the entry point for the Creator Camp Map application.
 *
 * Implements code splitting with lazy loading and provides a retro-styled loading fallback.
 * The component uses React Suspense to handle the loading state while the main
 * FanDemandGlobe component is being loaded.
 *
 * @component
 * @returns {JSX.Element} The main application with loading fallback
 *
 * @example
 * ```javascript
 * // Used in index.js
 * ReactDOM.render(<App />, document.getElementById('root'));
 * ```
 */
export default function App() {
  return (
    <>
      <Suspense
        fallback={
          <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-green-400 font-mono">
            <div className="mb-4 text-4xl animate-pulse">CREATOR CAMP</div>
            <div className="flex space-x-2 mb-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-150"></span>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-300"></span>
            </div>
            <div className="text-lg tracking-widest animate-blink">LOADING...</div>
            <style>
              {`
                @keyframes blink {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.3; }
                }
                .animate-blink {
                  animation: blink 1s steps(2, start) infinite;
                }
              `}
            </style>
          </div>
        }
      >
        <FanDemandGlobe />
      </Suspense>
    </>
  );
}
