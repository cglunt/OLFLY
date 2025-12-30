import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ALL_SCENTS, AVATAR_IMAGE, Scent } from "@/lib/data";
import { useLocation } from "wouter";
import { Play, Pause, SkipForward, HelpCircle, ChevronLeft, RotateCcw, Sparkles, Award, Star, Info, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";

const MOTIVATION_MESSAGES = {
  breathe: [
    "Take a deep, calming breath...",
    "Clear your mind...",
    "Prepare your senses...",
  ],
  smell: [
    "Focus on what you smell...",
    "Notice any subtle sensations...",
    "You're doing great!",
  ],
  rest: [
    "Excellent! Take a moment...",
    "Reset your senses...",
    "Your neurons are reconnecting...",
  ],
  completion: [
    "Amazing work! Every session helps your brain heal.",
    "You're building new neural pathways!",
    "Consistency is key - you're doing it!",
    "Your dedication is inspiring!",
    "One step closer to full recovery!",
  ],
  milestone: {
    3: "3-day streak! You're building momentum!",
    7: "One week strong! Your neurons are thanking you!",
    14: "Two weeks! You're a smell training champion!",
    30: "One month! Incredible dedication!",
    60: "Two months! Your persistence is paying off!",
    90: "Three months! You're a true warrior!",
  },
};
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserScents, createSession } from "@/lib/api";

type Phase = "intro" | "breathe" | "smell" | "rest" | "rate" | "outro";

export default function Training() {
  const { user, updateUserAsync } = useCurrentUser();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  
  const [phase, setPhase] = useState<Phase>("intro");
  const [showHelp, setShowHelp] = useState(false);
  const [currentScentIndex, setCurrentScentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [currentRating, setCurrentRating] = useState(5);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [completionMessage, setCompletionMessage] = useState("");
  const [finalStreak, setFinalStreak] = useState(0);
  const [showSafetyNote, setShowSafetyNote] = useState(false);
  const [phaseMotivation, setPhaseMotivation] = useState("");

  const getMotivationMessage = (phaseType: 'breathe' | 'smell' | 'rest') => {
    const messages = MOTIVATION_MESSAGES[phaseType];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getMilestoneMessage = (streak: number): string | null => {
    const milestones = MOTIVATION_MESSAGES.milestone;
    const milestone = Object.keys(milestones)
      .map(Number)
      .sort((a, b) => b - a)
      .find(m => streak >= m);
    return milestone ? milestones[milestone as keyof typeof milestones] : null;
  };

  // Fetch user's active scents
  const { data: userScents = [] } = useQuery({
    queryKey: ["userScents", user?.id],
    queryFn: () => getUserScents(user!.id),
    enabled: !!user,
  });

  const activeScentIds = userScents.map(s => s.scentId);
  const sessionScents = ALL_SCENTS.filter((s: Scent) => activeScentIds.includes(s.id));
  
  // Default scents for users with no selections
  const defaultScents = ALL_SCENTS.filter((s: Scent) => ['clove', 'lemon', 'eucalyptus', 'rose'].includes(s.id));
  const trainingScents = sessionScents.length > 0 ? sessionScents : defaultScents;
  const activeScent = trainingScents[currentScentIndex] || trainingScents[0];
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const totalDuration = phase === "breathe" ? 5 : phase === "smell" ? 20 : phase === "rest" ? 10 : 0;

  const createSessionMutation = useMutation({
    mutationFn: createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions", user?.id] });
    },
  });

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
      setPhaseMotivation("");
    } else if (phase === "rest") {
      startSmellPhase();
    }
  };

  const startSession = () => {
    setPhase("breathe");
    setTimeLeft(5);
    setIsActive(true);
    setPhaseMotivation(getMotivationMessage('breathe'));
  };

  const startSmellPhase = () => {
    setPhase("smell");
    setTimeLeft(20);
    setIsActive(true);
    setPhaseMotivation(getMotivationMessage('smell'));
  };

  const startRestPhase = () => {
    setPhase("rest");
    setTimeLeft(10);
    setIsActive(true);
    setPhaseMotivation(getMotivationMessage('rest'));
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const submitRating = () => {
    const newRatings = { ...ratings, [activeScent.id]: currentRating };
    setRatings(newRatings);
    
    if (currentScentIndex < trainingScents.length - 1) {
      setCurrentScentIndex(prev => prev + 1);
      startRestPhase();
      setCurrentRating(5);
    } else {
      completeSession(newRatings);
    }
  };

  const completeSession = async (finalRatings: Record<string, number>) => {
    if (!user) return;

    setPhase("outro");
    setPhaseMotivation("");
    
    // Save session to backend
    await createSessionMutation.mutateAsync({
      userId: user.id,
      completed: true,
      scentRatings: finalRatings,
    });

    // Calculate new streak
    const today = new Date().toISOString().split('T')[0];
    const lastSessionDate = user.lastSessionDate ? new Date(user.lastSessionDate).toISOString().split('T')[0] : null;
    
    let newStreak = user.streak;
    if (!lastSessionDate || lastSessionDate !== today) {
      newStreak = user.streak + 1;
    }

    // Update user and get the actual updated streak from the server response
    const updatedUser = await updateUserAsync({
      streak: newStreak,
      lastSessionDate: new Date().toISOString(),
    } as any);

    // Use the actual streak from the server response
    const actualStreak = updatedUser?.streak ?? newStreak;
    setFinalStreak(actualStreak);
    
    const milestoneMsg = getMilestoneMessage(actualStreak);
    const randomCompletion = MOTIVATION_MESSAGES.completion[Math.floor(Math.random() * MOTIVATION_MESSAGES.completion.length)];
    setCompletionMessage(milestoneMsg || randomCompletion);
  };

  // Show loading state while fetching user
  if (!user) {
    return (
      <div className="relative min-h-screen w-screen overflow-hidden bg-[#0c0c1d] flex items-center justify-center">
        <p className="text-white/70">Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-[#0c0c1d]">
      {/* Background Gradient / Image Overlay */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute inset-0 bg-[#0c0c1d] z-10" />
        {phase === "smell" && activeScent?.image && (
             <img 
                src={activeScent.image} 
                className="w-full h-full object-cover opacity-20 animate-in fade-in duration-1000 grayscale mix-blend-overlay" 
                alt="Background Scent"
             />
        )}
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-between min-h-screen py-10 px-6">
        
        {/* Header */}
        <header className="w-full flex justify-between items-center mt-2">
           <Button variant="ghost" size="icon" onClick={() => setLocation("/")} className="hover:bg-white/10 rounded-full text-white" data-testid="button-back">
             <ChevronLeft className="h-6 w-6" />
           </Button>
           <h2 className="text-sm font-bold tracking-widest uppercase text-white/80">
             {phase === 'intro' ? 'Start' : 'Session'}
           </h2>
           
           <Dialog open={showHelp} onOpenChange={setShowHelp}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full" data-testid="button-help">
                  <HelpCircle className="h-6 w-6" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#3b1645] border-white/10 text-white max-w-[90vw] md:max-w-md rounded-[2rem]">
                 <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">How to Sniff</DialogTitle>
                    <DialogDescription className="text-white/70">Follow this technique for best results.</DialogDescription>
                 </DialogHeader>
                 <div className="space-y-4 py-4">
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#ac41c3]/20 text-[#ac41c3] flex items-center justify-center font-bold shrink-0">1</div>
                        <p className="text-sm leading-relaxed text-white/70">Bring the scent within an inch of your nose. Do not touch your nose.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#ac41c3]/20 text-[#ac41c3] flex items-center justify-center font-bold shrink-0">2</div>
                        <p className="text-sm leading-relaxed text-white/70">Take <strong>slow, natural sniffs</strong> for about 15-20 seconds. Avoid aggressive sniffing.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#ac41c3]/20 text-[#ac41c3] flex items-center justify-center font-bold shrink-0">3</div>
                        <p className="text-sm leading-relaxed text-white/70">Actively try to <strong>recall the smell</strong> and form a mental connection.</p>
                    </div>
                 </div>
                 <Button className="w-full rounded-xl h-12 bg-white text-[#0c0c1d] hover:bg-white/90 font-bold" onClick={() => setShowHelp(false)}>
                    Got it
                 </Button>
              </DialogContent>
           </Dialog>
        </header>

        {/* Central Content */}
        <div className="flex flex-col items-center w-full max-w-md flex-1 justify-center gap-8">
          
           {/* Image / Avatar Circle */}
           <div className="relative">
               {phase === "intro" && (
                  <div className="w-48 h-48 rounded-full border-4 border-[#3b1645] shadow-xl overflow-hidden bg-[#3b1645] p-1">
                     <div className="w-full h-full rounded-full bg-black/20 flex items-center justify-center overflow-hidden">
                        <img src={AVATAR_IMAGE} className="w-full h-full object-cover opacity-90" />
                     </div>
                  </div>
               )}
               {phase === "outro" && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative"
                  >
                    <div className="w-48 h-48 rounded-full bg-gradient-to-r from-[#6d45d2] to-[#db2faa] flex items-center justify-center shadow-xl">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full"
                        style={{ background: "conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.1) 25%, transparent 50%)" }}
                      />
                      <Award size={64} className="text-white drop-shadow-lg" />
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ delay: 0.3 }}
                      className="absolute -top-2 -right-2 bg-[#db2faa] rounded-full p-2"
                    >
                      <Star size={20} className="text-white fill-white" />
                    </motion.div>
                  </motion.div>
               )}
               {phase !== "intro" && phase !== "outro" && (
                  <div className="relative w-[280px] h-[280px] flex items-center justify-center">
                       {/* Progress Ring */}
                       {(phase === "breathe" || phase === "smell" || phase === "rest") && (
                          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 300 300">
                            {/* Track */}
                            <circle cx="150" cy="150" r={130} stroke="rgba(255,255,255,0.1)" strokeWidth="10" fill="none" />
                            {/* Progress */}
                            <circle
                              cx="150"
                              cy="150"
                              r={130}
                              stroke="#ac41c3" 
                              strokeWidth="10"
                              fill="none"
                              strokeDasharray={2 * Math.PI * 130}
                              strokeDashoffset={2 * Math.PI * 130 - ((totalDuration - timeLeft) / totalDuration) * (2 * Math.PI * 130)}
                              strokeLinecap="round"
                              className="transition-all duration-1000 ease-linear"
                            />
                          </svg>
                       )}

                       {activeScent && (
                       <motion.div 
                        key={activeScent.id}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-56 h-56 rounded-full overflow-hidden border-8 border-[#0c0c1d] shadow-2xl z-10 bg-white"
                       >
                        {activeScent.image && <img src={activeScent.image} className="w-full h-full object-cover" />}
                       </motion.div>
                       )}
                  </div>
               )}
           </div>

           {/* Text Info */}
           <div className="text-center space-y-3">
             <h1 className="text-4xl font-bold text-white tracking-tight" data-testid="text-phase-title">
               {phase === "intro" ? "Daily Practice" : 
                phase === "outro" ? "Session Complete!" : 
                activeScent?.name || ""}
             </h1>
             <p className="text-xl text-white/70 font-medium tracking-wide max-w-xs" data-testid="text-phase-subtitle">
               {phase === "intro" ? "Ready to start?" : 
                phase === "breathe" ? "Breathe In Slowly" : 
                phase === "smell" ? "Inhale Scent" : 
                phase === "rest" ? "Rest & Reset" : 
                phase === "rate" ? formatTime(timeLeft) :
                phase === "outro" ? completionMessage : ""}
             </p>
             {phase === "outro" && finalStreak > 0 && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.5 }}
                 className="flex items-center justify-center gap-2 mt-4"
               >
                 <Sparkles size={18} className="text-[#ac41c3]" />
                 <span className="text-[#ac41c3] font-medium">{finalStreak} day streak!</span>
                 <Sparkles size={18} className="text-[#ac41c3]" />
               </motion.div>
             )}
             {(phase === "breathe" || phase === "smell" || phase === "rest") && phaseMotivation && (
               <motion.p
                 key={phaseMotivation}
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="text-[#ac41c3] text-sm font-medium mt-2"
                 data-testid="text-motivation"
               >
                 {phaseMotivation}
               </motion.p>
             )}
           </div>

           {/* Phase Specific Controls */}
           {phase === "rate" && (
              <div className="w-full bg-[#3b1645] p-6 rounded-2xl shadow-md animate-in slide-in-from-bottom-5 fade-in">
                <div className="flex justify-between items-center mb-6">
                    <label className="text-white text-sm font-bold tracking-wider uppercase">Intensity</label>
                    <span className="text-3xl font-bold text-[#ac41c3]" data-testid="text-rating">{currentRating}/10</span>
                </div>
                <Slider 
                    defaultValue={[5]} 
                    max={10} 
                    step={1} 
                    value={[currentRating]} 
                    onValueChange={(val) => setCurrentRating(val[0])}
                    className="py-2 mb-8"
                    data-testid="slider-rating"
                />
                <Button size="lg" className="w-full bg-gradient-to-r from-[#6d45d2] to-[#db2faa] text-white rounded-xl h-14 font-bold text-lg shadow-md" onClick={submitRating} data-testid="button-submit-rating">
                  Submit Rating
                </Button>
              </div>
           )}

           {/* Timer Controls */}
           {(phase === "breathe" || phase === "smell" || phase === "rest") && (
               <div className="flex items-center gap-8 mt-4">
                 <Button variant="ghost" size="icon" className="h-14 w-14 rounded-full bg-[#3b1645] text-white/70 hover:text-white hover:bg-[#4a1c57]" onClick={() => {
                    if (phase === 'breathe') startSmellPhase();
                    else if (phase === 'smell') setPhase('rate');
                    else if (phase === 'rest') startSmellPhase();
                 }} data-testid="button-restart">
                   <RotateCcw className="h-6 w-6" />
                 </Button>
                 
                 <Button 
                   size="icon" 
                   className="h-24 w-24 rounded-full bg-gradient-to-r from-[#6d45d2] to-[#db2faa] text-white hover:scale-105 transition-all shadow-lg shadow-[#ac41c3]/20"
                   onClick={toggleTimer}
                   data-testid="button-play-pause"
                 >
                   {isActive ? <Pause className="h-10 w-10 fill-current" /> : <Play className="h-10 w-10 fill-current pl-1" />}
                 </Button>

                 <Button variant="ghost" size="icon" className="h-14 w-14 rounded-full bg-[#3b1645] text-white/70 hover:text-white hover:bg-[#4a1c57]" onClick={() => {
                    setIsActive(false);
                    if (phase === 'breathe') startSmellPhase();
                    else if (phase === 'smell') { setPhase('rate'); setPhaseMotivation(''); }
                    else if (phase === 'rest') startSmellPhase();
                 }} data-testid="button-skip">
                   <SkipForward className="h-6 w-6" />
                 </Button>
               </div>
           )}

           {phase === "intro" && (
               <>
                 <Button size="lg" className="w-full rounded-xl h-16 text-lg font-bold bg-gradient-to-r from-[#6d45d2] to-[#db2faa] text-white hover:opacity-90 shadow-lg mt-4" onClick={startSession} data-testid="button-start-training">
                   Start Training
                 </Button>
                 <button 
                   onClick={() => setShowSafetyNote(!showSafetyNote)}
                   className="flex items-center justify-center gap-2 text-white/50 text-sm mt-4 mx-auto hover:text-white/70 transition-colors"
                   data-testid="button-safety-note"
                 >
                   <Info size={14} />
                   <span>Safety note</span>
                   {showSafetyNote ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                 </button>
                 {showSafetyNote && (
                   <motion.div 
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     className="bg-[#3b1645] rounded-xl p-4 mt-2"
                   >
                     <p className="text-white/70 text-sm leading-relaxed">
                       Use essential oils with care. Do not ingest oils. Avoid direct skin contact unless diluted. 
                       Keep oils away from children and pets. Stop use if irritation occurs.
                     </p>
                   </motion.div>
                 )}
               </>
           )}
           
           {phase === "outro" && (
               <Button size="lg" className="w-full rounded-xl h-16 text-lg font-bold bg-gradient-to-r from-[#6d45d2] to-[#db2faa] text-white hover:opacity-90 shadow-lg mt-4" onClick={() => setLocation("/")} data-testid="button-finish-session">
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
