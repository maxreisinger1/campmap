import { lazy, Suspense } from "react";

const FanDemandGlobe = lazy(() => import("./components/FanDemandGlobe"));

export default function App() {
  return (
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
  );
}
