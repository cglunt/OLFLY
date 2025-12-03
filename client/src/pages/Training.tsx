import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { getStoredData, saveStoredData, DEFAULT_SCENTS, AVATAR_IMAGE } from "@/lib/data";
import { useLocation } from "wouter";
import { ArrowLeft, Play, Pause, SkipForward, Heart, ChevronLeft, RotateCcw } from "lucide-react";
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

  const overlay = phase === "smell" ? (
    <div className="absolute inset-0 w-full h-full z-0">
       <img 
         src={activeScent.image} 
         className="w-full h-full object-cover opacity-20 animate-in fade-in duration-1000" 
         alt="Background Scent"
       />
       <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background/80" />
    </div>
  ) : null;

  return (
    <Layout backgroundOverlay={overlay}>
      <div className="h-full flex flex-col bg-transparent relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="absolute bottom-[-20%] right-[-20%] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Header */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
           <Button variant="ghost" size="icon" onClick={() => setLocation("/")} className="hover:bg-white/10 rounded-full text-white">
             <ChevronLeft className="h-6 w-6" />
           </Button>
           <h2 className="text-sm font-bold tracking-widest uppercase text-muted-foreground">
             {phase === 'intro' ? 'Start' : 'Session'}
           </h2>
           <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
             <Heart className="h-6 w-6" />
           </Button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8 md:space-y-12 mt-8 relative z-10 min-h-[600px]">
          
          {/* Central Progress Circle - Cyberpunk Style */}
          <div className="relative w-[260px] h-[260px] md:w-[300px] md:h-[300px] flex items-center justify-center shrink-0">
            {/* Static Background Ring */}
            {(phase === "breathe" || phase === "smell" || phase === "rest") && (
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 300 300">
                <circle
                  cx="150"
                  cy="150"
                  r={radius}
                  stroke="hsl(var(--secondary))"
                  strokeWidth="12"
                  fill="transparent"
                  strokeLinecap="round"
                />
                {/* Gradient Active Ring */}
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(280, 80%, 60%)" />
                    <stop offset="100%" stopColor="hsl(320, 90%, 60%)" />
                  </linearGradient>
                </defs>
                <circle
                  cx="150"
                  cy="150"
                  r={radius}
                  stroke="url(#progressGradient)"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-linear drop-shadow-[0_0_10px_rgba(200,50,255,0.5)]"
                />
              </svg>
            )}

            {/* Inner Content */}
            <div className="text-center z-10 flex flex-col items-center justify-center gap-4">
               {phase === "intro" || phase === "outro" ? (
                  <div className="w-36 h-36 md:w-40 md:h-40 rounded-full bg-gradient-primary p-1 shadow-lg shadow-primary/30 animate-in zoom-in duration-700">
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                       <img src={AVATAR_IMAGE} className="w-full h-full object-cover opacity-80" />
                    </div>
                  </div>
               ) : (
                  <motion.div 
                    key={activeScent.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-36 h-36 md:w-40 md:h-40 relative rounded-full overflow-hidden shadow-2xl shadow-primary/20"
                  >
                    <img src={activeScent.image} className="w-full h-full object-cover" />
                  </motion.div>
               )}
            </div>
          </div>

          {/* Text Info */}
          <div className="text-center space-y-1">
             <h1 className="text-3xl md:text-4xl font-heading font-bold text-white tracking-tight">
               {phase === "intro" ? "Daily Practice" : 
                phase === "outro" ? "Completed" : 
                activeScent.name}
             </h1>
             <p className="text-base md:text-lg text-muted-foreground font-medium">
               {phase === "intro" ? "Ready to start?" : 
                phase === "breathe" ? "Breathe In Slowly" : 
                phase === "smell" ? "Inhale Scent" : 
                phase === "rest" ? "Rest & Reset" : 
                formatTime(timeLeft)}
             </p>
          </div>

          {/* Controls */}
          <div className="w-full max-w-xs pb-6">
             {phase === "intro" && (
               <Button size="lg" className="w-full rounded-full h-14 md:h-16 text-base md:text-lg bg-gradient-primary hover:opacity-90 shadow-lg shadow-primary/40 border-none text-white" onClick={startSession}>
                 Start Training
               </Button>
             )}

             {(phase === "breathe" || phase === "smell" || phase === "rest") && (
               <div className="flex items-center justify-center gap-6 md:gap-8">
                 <Button variant="ghost" size="icon" className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-secondary text-muted-foreground hover:text-white hover:bg-white/10" onClick={() => {
                    if (phase === 'breathe') startSmellPhase();
                    else if (phase === 'smell') setPhase('rate');
                    else if (phase === 'rest') startSmellPhase();
                 }}>
                   <RotateCcw className="h-5 w-5 md:h-6 md:w-6" />
                 </Button>
                 
                 <Button 
                   size="icon" 
                   className="h-16 w-16 md:h-20 md:w-20 rounded-full shadow-[0_0_30px_rgba(200,50,255,0.4)] bg-gradient-primary text-white hover:scale-105 transition-all border-4 border-background"
                   onClick={toggleTimer}
                 >
                   {isActive ? <Pause className="h-6 w-6 md:h-8 md:w-8 fill-current" /> : <Play className="h-6 w-6 md:h-8 md:w-8 fill-current pl-1" />}
                 </Button>

                 <Button variant="ghost" size="icon" className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-secondary text-muted-foreground hover:text-white hover:bg-white/10" onClick={() => {
                    setIsActive(false);
                    if (phase === 'breathe') startSmellPhase();
                    else if (phase === 'smell') setPhase('rate');
                    else if (phase === 'rest') startSmellPhase();
                 }}>
                   <SkipForward className="h-5 w-5 md:h-6 md:w-6" />
                 </Button>
               </div>
             )}

             {phase === "rate" && (
               <div className="space-y-6 md:space-y-8 animate-in slide-in-from-bottom-10 fade-in duration-500 bg-secondary/50 p-5 md:p-6 rounded-3xl border border-white/5">
                  <div className="flex justify-between items-center px-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase">Intensity</span>
                    <span className="text-xl md:text-2xl font-bold text-primary">{currentRating}/10</span>
                  </div>
                 <Slider 
                    defaultValue={[5]} 
                    max={10} 
                    step={1} 
                    value={[currentRating]} 
                    onValueChange={(val) => setCurrentRating(val[0])}
                    className="py-2"
                  />
                  <Button size="lg" className="w-full rounded-full h-14 bg-white text-background hover:bg-white/90 font-bold text-base md:text-lg" onClick={submitRating}>
                    Submit Rating
                  </Button>
               </div>
             )}

             {phase === "outro" && (
               <Button size="lg" className="w-full rounded-full h-14 md:h-16 text-base md:text-lg bg-gradient-primary text-white shadow-lg shadow-primary/30" onClick={() => setLocation("/")}>
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
