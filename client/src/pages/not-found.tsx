import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0c0c1d]">
      <div className="text-center px-6 max-w-sm">
        <p className="text-5xl mb-4">🌿</p>
        <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-white/60 text-sm mb-6">
          Sorry, we couldn't find what you were looking for.
        </p>
        <button
          onClick={() => setLocation("/")}
          className="px-5 py-2 rounded-full bg-[#6d45d2] text-white text-sm font-medium hover:bg-[#5b36b0] transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
