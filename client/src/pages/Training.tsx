import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { getStoredData, saveStoredData, DEFAULT_SCENTS, AVATAR_IMAGE } from "@/lib/data";
import { useLocation } from "wouter";
import { ArrowLeft, Play, Pause, SkipForward, Heart, ChevronLeft } from "lucide-react";
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
  const [currentRating, setCurrentRating] = useState(5);
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const activeScent = data.scents[currentScentIndex] || DEFAULT_SCENTS[0];
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const totalDuration = phase === "breathe" ? 5 : phase === "smell" ? 20 : phase === "rest" ? 10 : 0;

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
    setTimeLeft(5);
    setIsActive(true);
  };

  const startSmellPhase = () => {
    setPhase("smell");
    setTimeLeft(20);
    setIsActive(true);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const submitRating = () => {
    const newRatings = { ...ratings, [activeScent.id]: currentRating };
    setRatings(newRatings);
    
    if (currentScentIndex < data.scents.length - 1) {
      setCurrentScentIndex(prev => prev + 1);
      setPhase("rest");
      setTimeLeft(10);
      setIsActive(true);
      setCurrentRating(5);
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

  // Calculate circle progress
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - ((totalDuration - timeLeft) / totalDuration) * circumference;

  return (
    <Layout>
      <div className="h-full flex flex-col bg-[#F9F4ED] relative">
        {/* Top Header */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
           <Button variant="ghost" size="icon" onClick={() => setLocation("/")} className="hover:bg-transparent">
             <ChevronLeft className="h-6 w-6 text-foreground" />
           </Button>
           <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-500 hover:bg-transparent">
             <Heart className="h-6 w-6" />
           </Button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-12 mt-8">
          
          {/* Circular Player / Image */}
          <div className="relative w-[280px] h-[280px] flex items-center justify-center">
            {/* Progress Ring */}
            {(phase === "breathe" || phase === "smell" || phase === "rest") && (
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                <circle
                  cx="140"
                  cy="140"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="transparent"
                  className="text-muted"
                />
                <circle
                  cx="140"
                  cy="140"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="text-primary transition-all duration-1000 ease-linear"
                />
              </svg>
            )}

            {/* Central Image Container */}
            <div className="w-60 h-60 rounded-full bg-white shadow-sm overflow-hidden flex items-center justify-center relative z-10 p-8">
              <div className={`absolute inset-0 opacity-20 ${activeScent.color}`} />
              <motion.img 
                key={phase === "intro" ? "intro" : activeScent.image}
                src={phase === "intro" || phase === "outro" ? AVATAR_IMAGE : activeScent.image} 
                alt="Visual" 
                className="w-full h-full object-contain"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Text Info */}
          <div className="text-center space-y-2">
            <h3 className="text-primary font-medium uppercase tracking-widest text-xs">
              {phase === "intro" ? "Preparation" : 
               phase === "breathe" ? "Breathe In" : 
               phase === "smell" ? "Focus" : 
               phase === "rate" ? "Evaluation" :
               phase === "rest" ? "Rest" : "Complete"}
            </h3>
            <h1 className="font-heading text-4xl font-bold text-foreground">
              {phase === "intro" ? "Scent Training" : 
               phase === "outro" ? "Great Job!" : 
               activeScent.name}
            </h1>
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm pt-2">
              {phase === "rate" ? (
                <span className="text-foreground font-medium">Rate intensity below</span>
              ) : (
                <>
                  <span>Full body</span>
                  <span>•</span>
                  <span>Relaxing</span>
                  <span>•</span>
                  <span>{formatTime(timeLeft)}</span>
                </>
              )}
            </div>
          </div>

          {/* Controls Area */}
          <div className="w-full max-w-xs">
             {phase === "intro" && (
               <Button size="lg" className="w-full rounded-full h-14 text-lg shadow-lg shadow-primary/20" onClick={startSession}>
                 Start Session
               </Button>
             )}

             {(phase === "breathe" || phase === "smell" || phase === "rest") && (
               <div className="flex items-center justify-center gap-8">
                 <Button variant="ghost" size="icon" className="h-12 w-12 text-muted-foreground" onClick={() => {
                    // Skip logic
                    if (phase === 'breathe') startSmellPhase();
                    else if (phase === 'smell') setPhase('rate');
                    else if (phase === 'rest') startSmellPhase();
                 }}>
                   <SkipForward className="h-8 w-8 rotate-180" /> {/* Using rotate for rewind icon look */}
                 </Button>
                 
                 <Button 
                   size="icon" 
                   className="h-20 w-20 rounded-full shadow-xl bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all"
                   onClick={toggleTimer}
                 >
                   {isActive ? <Pause className="h-8 w-8 fill-current" /> : <Play className="h-8 w-8 fill-current pl-1" />}
                 </Button>

                 <Button variant="ghost" size="icon" className="h-12 w-12 text-muted-foreground" onClick={() => {
                    setIsActive(false);
                    if (phase === 'breathe') startSmellPhase();
                    else if (phase === 'smell') setPhase('rate');
                    else if (phase === 'rest') startSmellPhase();
                 }}>
                   <SkipForward className="h-8 w-8" />
                 </Button>
               </div>
             )}

             {phase === "rate" && (
               <div className="space-y-6 animate-in slide-in-from-bottom-10 fade-in duration-500">
                 <Slider 
                    defaultValue={[5]} 
                    max={10} 
                    step={1} 
                    value={[currentRating]} 
                    onValueChange={(val) => setCurrentRating(val[0])}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">
                    <span>None</span>
                    <span>Strong</span>
                  </div>
                  <Button size="lg" className="w-full rounded-full h-14" onClick={submitRating}>
                    Submit Rating
                  </Button>
               </div>
             )}

             {phase === "outro" && (
               <Button size="lg" className="w-full rounded-full h-14 text-lg" onClick={() => setLocation("/")}>
                 Finish
               </Button>
             )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}
