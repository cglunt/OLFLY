import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { getStoredData, saveStoredData, DEFAULT_SCENTS, AVATAR_IMAGE } from "@/lib/data";
import { useLocation } from "wouter";
import { ArrowLeft, Play, Pause, SkipForward, HelpCircle, ChevronLeft, RotateCcw, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";

type Phase = "intro" | "breathe" | "smell" | "rest" | "rate" | "outro";

export default function Training() {
  const [data, setData] = useState(getStoredData());
  const [, setLocation] = useLocation();
  
  const [phase, setPhase] = useState<Phase>("intro");
  const [showHelp, setShowHelp] = useState(false);
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
    <div className="relative min-h-screen w-screen overflow-hidden bg-[#05050A]">
      {/* Background Gradient / Image Overlay */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 to-[#05050A] z-10" />
        {phase === "smell" && (
             <img 
                src={activeScent.image} 
                className="w-full h-full object-cover opacity-30 animate-in fade-in duration-1000" 
                alt="Background Scent"
             />
        )}
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-between min-h-screen py-10 px-6">
        
        {/* Header */}
        <header className="w-full flex justify-between items-center mt-2">
           <Button variant="ghost" size="icon" onClick={() => setLocation("/")} className="hover:bg-white/10 rounded-full text-white">
             <ChevronLeft className="h-6 w-6" />
           </Button>
           <h2 className="text-sm font-bold tracking-widest uppercase text-white/80">
             {phase === 'intro' ? 'Start' : 'Session'}
           </h2>
           
           <Dialog open={showHelp} onOpenChange={setShowHelp}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                  <HelpCircle className="h-6 w-6" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1A1A2E] border-white/10 text-white max-w-[90vw] md:max-w-md rounded-[2rem]">
                 <DialogHeader>
                    <DialogTitle className="text-xl font-bold">How to Sniff</DialogTitle>
                    <DialogDescription className="text-white/60">Follow this technique for best results.</DialogDescription>
                 </DialogHeader>
                 <div className="space-y-4 py-4">
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold shrink-0">1</div>
                        <p className="text-sm leading-relaxed">Bring the scent within an inch of your nose. Do not touch your nose.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold shrink-0">2</div>
                        <p className="text-sm leading-relaxed">Take <strong>slow, natural sniffs</strong> for about 15-20 seconds. Avoid aggressive sniffing.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold shrink-0">3</div>
                        <p className="text-sm leading-relaxed">Actively try to <strong>recall the smell</strong> and form a mental connection.</p>
                    </div>
                 </div>
                 <Button className="w-full rounded-full h-12 bg-white text-black hover:bg-white/90 font-bold" onClick={() => setShowHelp(false)}>
                    Got it
                 </Button>
              </DialogContent>
           </Dialog>
        </header>

        {/* Central Content */}
        <div className="flex flex-col items-center w-full max-w-md flex-1 justify-center gap-8">
          
           {/* Image / Avatar Circle */}
           <div className="relative">
               {phase === "intro" || phase === "outro" ? (
                  <div className="w-40 h-40 rounded-full border-4 border-white/10 shadow-2xl overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600 p-1">
                     <div className="w-full h-full rounded-full bg-black/20 flex items-center justify-center overflow-hidden">
                        <img src={AVATAR_IMAGE} className="w-full h-full object-cover opacity-90" />
                     </div>
                  </div>
               ) : (
                  <div className="relative w-[280px] h-[280px] flex items-center justify-center">
                       {/* Progress Ring */}
                       {(phase === "breathe" || phase === "smell" || phase === "rest") && (
                          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 300 300">
                            {/* Track */}
                            <circle cx="150" cy="150" r={130} stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                            {/* Progress */}
                            <circle
                              cx="150"
                              cy="150"
                              r={130}
                              stroke="#d946ef" // Fuchsia-500
                              strokeWidth="8"
                              fill="none"
                              strokeDasharray={2 * Math.PI * 130}
                              strokeDashoffset={2 * Math.PI * 130 - ((totalDuration - timeLeft) / totalDuration) * (2 * Math.PI * 130)}
                              strokeLinecap="round"
                              className="transition-all duration-1000 ease-linear drop-shadow-[0_0_15px_rgba(217,70,239,0.6)]"
                            />
                          </svg>
                       )}

                       <motion.div 
                        key={activeScent.id}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-48 h-48 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl z-10"
                       >
                        <img src={activeScent.image} className="w-full h-full object-cover" />
                       </motion.div>
                  </div>
               )}
           </div>

           {/* Text Info */}
           <div className="text-center space-y-2">
             <h1 className="text-4xl font-bold text-white tracking-tight">
               {phase === "intro" ? "Daily Practice" : 
                phase === "outro" ? "Completed" : 
                activeScent.name}
             </h1>
             <p className="text-lg text-white/60 font-medium tracking-wide">
               {phase === "intro" ? "Ready to start?" : 
                phase === "breathe" ? "Breathe In Slowly" : 
                phase === "smell" ? "Inhale Scent" : 
                phase === "rest" ? "Rest & Reset" : 
                formatTime(timeLeft)}
             </p>
           </div>

           {/* Phase Specific Controls */}
           {phase === "rate" && (
              <div className="w-full bg-purple-950/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 animate-in slide-in-from-bottom-5 fade-in">
                <div className="flex justify-between items-center mb-4">
                    <label className="text-white/80 text-xs font-bold tracking-wider uppercase">Intensity</label>
                    <span className="text-2xl font-bold text-purple-300">{currentRating}/10</span>
                </div>
                <Slider 
                    defaultValue={[5]} 
                    max={10} 
                    step={1} 
                    value={[currentRating]} 
                    onValueChange={(val) => setCurrentRating(val[0])}
                    className="py-2 mb-6"
                />
                <Button size="lg" className="w-full bg-white text-black hover:bg-white/90 rounded-full h-12 font-bold" onClick={submitRating}>
                  Submit Rating
                </Button>
              </div>
           )}

           {/* Timer Controls */}
           {(phase === "breathe" || phase === "smell" || phase === "rest") && (
               <div className="flex items-center gap-8 mt-4">
                 <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20" onClick={() => {
                    if (phase === 'breathe') startSmellPhase();
                    else if (phase === 'smell') setPhase('rate');
                    else if (phase === 'rest') startSmellPhase();
                 }}>
                   <RotateCcw className="h-5 w-5" />
                 </Button>
                 
                 <Button 
                   size="icon" 
                   className="h-20 w-20 rounded-full bg-purple-600 text-white hover:bg-purple-500 shadow-[0_0_30px_rgba(147,51,234,0.5)] hover:scale-105 transition-all"
                   onClick={toggleTimer}
                 >
                   {isActive ? <Pause className="h-8 w-8 fill-current" /> : <Play className="h-8 w-8 fill-current pl-1" />}
                 </Button>

                 <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20" onClick={() => {
                    setIsActive(false);
                    if (phase === 'breathe') startSmellPhase();
                    else if (phase === 'smell') setPhase('rate');
                    else if (phase === 'rest') startSmellPhase();
                 }}>
                   <SkipForward className="h-5 w-5" />
                 </Button>
               </div>
           )}

           {phase === "intro" && (
               <Button size="lg" className="w-full rounded-full h-16 text-lg font-bold bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-600/30 mt-4" onClick={startSession}>
                 Start Training
               </Button>
           )}
           
           {phase === "outro" && (
               <Button size="lg" className="w-full rounded-full h-16 text-lg font-bold bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-600/30 mt-4" onClick={() => setLocation("/")}>
                 Finish Session
               </Button>
           )}

        </div>

        {/* Bottom Spacer for alignment */}
        <div className="h-6"></div>
      </div>
    </div>
  );
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}
