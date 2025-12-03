import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { getStoredData, saveStoredData, DEFAULT_SCENTS } from "@/lib/data";
import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight, Play, RotateCcw, Check, Volume2, VolumeX, Wind } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Phase = "intro" | "breathe" | "smell" | "rest" | "rate" | "outro";

export default function Training() {
  const [data, setData] = useState(getStoredData());
  const [, setLocation] = useLocation();
  
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentScentIndex, setCurrentScentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [currentRating, setCurrentRating] = useState(5);
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const activeScent = data.scents[currentScentIndex] || DEFAULT_SCENTS[0];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer Logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      handleTimerComplete();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    if (phase === "breathe") {
      startSmellPhase();
    } else if (phase === "smell") {
      setPhase("rate");
    } else if (phase === "rest") {
      startSmellPhase();
    }
  };

  const startSession = () => {
    setPhase("breathe");
    setTimeLeft(5); // 5 seconds breathing prep
    setIsActive(true);
  };

  const startSmellPhase = () => {
    setPhase("smell");
    setTimeLeft(20); // 20 seconds smelling
    setIsActive(true);
  };

  const submitRating = () => {
    const newRatings = { ...ratings, [activeScent.id]: currentRating };
    setRatings(newRatings);
    
    if (currentScentIndex < data.scents.length - 1) {
      setCurrentScentIndex(prev => prev + 1);
      setPhase("rest");
      setTimeLeft(10); // Shortened rest for prototype (normally 60s-5m)
      setIsActive(true);
      setCurrentRating(5); // Reset slider
    } else {
      completeSession(newRatings);
    }
  };

  const completeSession = (finalRatings: Record<string, number>) => {
    setPhase("outro");
    const newLog = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      completed: true,
      scentRatings: finalRatings
    };
    
    const newData = {
      ...data,
      logs: [newLog, ...data.logs],
      settings: {
        ...data.settings,
        streak: data.settings.streak + 1,
        lastSessionDate: new Date().toISOString()
      }
    };
    saveStoredData(newData);
    setData(newData);
  };

  // Format time mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progress = ((currentScentIndex) / data.scents.length) * 100;

  return (
    <Layout>
      {phase === "intro" && (
        <div className="h-full flex flex-col p-6">
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Wind className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Training Session</h1>
            <p className="text-muted-foreground max-w-xs">
              Find a quiet space. You will smell {data.scents.length} scents for 20 seconds each.
            </p>
            
            <div className="bg-secondary/50 p-4 rounded-xl w-full max-w-xs text-left space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Your Scents</h3>
              <div className="space-y-2">
                {data.scents.map((scent: any, i: number) => (
                  <div key={scent.id} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-white border border-border flex items-center justify-center text-xs font-medium">
                      {i + 1}
                    </div>
                    <span className="text-sm font-medium">{scent.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-4 mt-auto pt-6">
            <Button className="w-full h-14 text-lg rounded-full shadow-lg shadow-primary/20" onClick={startSession}>
              Start Session
            </Button>
            <div className="flex justify-center">
              <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setAudioEnabled(!audioEnabled)}>
                {audioEnabled ? <Volume2 className="mr-2 h-4 w-4" /> : <VolumeX className="mr-2 h-4 w-4" />}
                {audioEnabled ? "Audio On" : "Audio Off"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {phase === "breathe" && (
        <div className="h-full flex flex-col items-center justify-center p-6 text-center">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-64 h-64 rounded-full bg-primary/20 flex items-center justify-center mb-8"
          >
            <div className="w-48 h-48 rounded-full bg-primary/30 flex items-center justify-center">
              <span className="text-4xl font-bold text-primary-foreground">{timeLeft}</span>
            </div>
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Relax & Breathe</h2>
          <p className="text-muted-foreground">Take deep, slow breaths...</p>
        </div>
      )}

      {phase === "smell" && (
        <div className="absolute inset-0 z-50 flex flex-col overflow-hidden bg-black">
           {/* Progress Bar */}
           <div className="absolute top-0 left-0 w-full h-1 bg-white/20 z-50">
            <div className="h-full bg-white transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>

          {/* Full Screen Background Image */}
          <div className="absolute inset-0 z-0">
             <img 
                src={activeScent.image} 
                alt={activeScent.name} 
                className="w-full h-full object-cover animate-in fade-in duration-1000 scale-105"
              />
             {/* Gradient Overlays for readability */}
             <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 flex flex-col h-full p-6 text-white pb-32">
            
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
               <h2 className="text-5xl font-bold tracking-tight drop-shadow-md">{activeScent.name}</h2>
               <p className="text-white/90 text-lg font-medium drop-shadow-sm">Focus gently on the scent...</p>
               
               <div className="py-8">
                 <span className="font-mono text-8xl font-bold tracking-widest drop-shadow-2xl">{formatTime(timeLeft)}</span>
               </div>
            </div>

            <div className="mt-auto">
              <Button 
                variant="secondary" 
                className="w-full rounded-full h-16 text-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border-white/20 border shadow-2xl transition-all active:scale-95" 
                onClick={() => { setIsActive(false); setPhase("rate"); }}
              >
                Skip Timer
              </Button>
            </div>
          </div>
        </div>
      )}

      {phase === "rest" && (
        <div className="h-full flex flex-col items-center justify-center p-6 text-center bg-secondary/30">
          <div className="w-24 h-24 rounded-full border-4 border-muted flex items-center justify-center mb-6">
             <span className="text-2xl font-mono text-muted-foreground">{formatTime(timeLeft)}</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">Rest & Reset</h2>
          <p className="text-muted-foreground max-w-xs">Clear your nose. Drink some water if needed.</p>
          <p className="text-sm text-primary font-medium mt-4">Next: {data.scents[currentScentIndex]?.name}</p>
          
           <Button variant="ghost" className="mt-8" onClick={startSmellPhase}>
              Start Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
      )}

      {phase === "rate" && (
        <div className="h-full flex flex-col p-6">
           <div className="flex-1 flex flex-col items-center justify-center space-y-8">
            <img 
              src={activeScent.image} 
              alt={activeScent.name} 
              className="w-32 h-32 object-cover rounded-2xl shadow-md mb-4"
            />
            
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">How strong was it?</h2>
              <p className="text-muted-foreground">Rate the intensity of {activeScent.name}</p>
            </div>

            <div className="w-full max-w-xs space-y-6">
              <div className="flex justify-between text-sm font-medium text-muted-foreground">
                <span>None</span>
                <span className="text-primary font-bold text-lg">{currentRating}</span>
                <span>Strong</span>
              </div>
              <Slider 
                defaultValue={[5]} 
                max={10} 
                step={1} 
                value={[currentRating]} 
                onValueChange={(val) => setCurrentRating(val[0])}
                className="py-4"
              />
            </div>
           </div>

           <div className="mt-auto">
             <Button className="w-full h-14 rounded-full text-lg" onClick={submitRating}>
               Continue
             </Button>
           </div>
        </div>
      )}

      {phase === "outro" && (
        <div className="h-full flex flex-col items-center justify-center p-6 text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6"
          >
            <Check className="h-12 w-12" />
          </motion.div>
          
          <h1 className="text-3xl font-bold mb-2">Session Complete!</h1>
          <p className="text-muted-foreground mb-8">You're making progress every day.</p>
          
          <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-8">
            <div className="bg-secondary/50 p-4 rounded-xl">
              <p className="text-xs text-muted-foreground">Streak</p>
              <p className="text-xl font-bold">{data.settings.streak} days</p>
            </div>
             <div className="bg-secondary/50 p-4 rounded-xl">
              <p className="text-xs text-muted-foreground">Scents</p>
              <p className="text-xl font-bold">{data.scents.length}</p>
            </div>
          </div>

          <div className="w-full space-y-3">
            <Button className="w-full h-12 rounded-full" onClick={() => setLocation("/")}>
              Back Home
            </Button>
             <Button variant="ghost" className="w-full" onClick={() => setLocation("/progress")}>
              View Progress
            </Button>
          </div>
        </div>
      )}
    </Layout>
  );
}
