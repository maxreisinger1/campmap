import { lazy, Suspense } from "react";

const FanDemandGlobe = lazy(() => import("./components/FanDemandGlobe"));

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center">
          Loading…
        </div>
      }
    >
      <FanDemandGlobe />
    </Suspense>
  );
}
