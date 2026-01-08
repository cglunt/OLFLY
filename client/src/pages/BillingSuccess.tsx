import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BillingSuccess() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLocation("/launch");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [setLocation]);

  return (
    <main className="min-h-screen bg-[#0c0c1d] text-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#6d45d2] to-[#db2faa] flex items-center justify-center"
        >
          <CheckCircle size={48} className="text-white" />
        </motion.div>

        <h1 className="text-3xl font-bold mb-4">Welcome to Plus!</h1>
        
        <p className="text-white/60 mb-8">
          Your subscription is now active. You have full access to all Plus features including progress analytics, symptom journal, and custom scent library.
        </p>

        <Button
          onClick={() => setLocation("/launch")}
          className="bg-gradient-to-r from-[#6d45d2] to-[#db2faa] hover:opacity-90 text-white font-bold rounded-full px-8 py-3"
          data-testid="button-continue-to-app"
        >
          Continue to app
          <ArrowRight size={16} className="ml-2" />
        </Button>

        <p className="text-white/40 text-sm mt-6">
          Redirecting automatically in 5 seconds...
        </p>
      </motion.div>
    </main>
  );
}
