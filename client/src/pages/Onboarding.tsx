import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Check, Clock, Wind, Activity, Plus, ArrowRight, User, Sparkles, Zap } from "lucide-react";
import { getStoredData, saveStoredData } from "@/lib/data";

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [morningTime, setMorningTime] = useState("08:00");
  const [eveningTime, setEveningTime] = useState("20:00");
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  const nextStep = () => setStep(s => s + 1);
  
  const completeOnboarding = () => {
    const data = getStoredData();
    const newData = {
      ...data,
      settings: {
        ...data.settings,
        hasOnboarded: true,
        reminders: {
            enabled: remindersEnabled,
            morning: morningTime,
            evening: eveningTime
        }
      }
    };
    saveStoredData(newData);
    setLocation("/");
  };

  const variants = {
    enter: { x: 20, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 }
  };

  // Helper component for the "Block" style
  const Block = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4, ease: "easeOut" }}
        className={`bg-[#1A1A2E] rounded-[2rem] p-6 border border-white/5 shadow-xl ${className}`}
    >
        {children}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#05050A] text-white flex flex-col font-sans selection:bg-purple-500/30">
      {/* Flat Gradient Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-[#05050A] to-[#05050A] pointer-events-none" />
      
      <div className="flex-1 flex flex-col z-10 max-w-md mx-auto w-full p-6 relative">
        {/* Header / Progress */}
        <div className="flex justify-between items-center mb-8 pt-4">
             {step > 1 ? (
                <button onClick={() => setStep(s => s - 1)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <ArrowRight className="rotate-180 text-white/70" size={20} />
                </button>
            ) : <div className="w-10" />}
            
            <div className="flex gap-2">
                {[1,2,3,4,5,6].map(i => (
                    <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-purple-500' : 'w-2 bg-white/10'}`} />
                ))}
            </div>
             <div className="w-10" /> 
        </div>

        <AnimatePresence mode="wait">
            {step === 1 && (
                <motion.div
                    key="step1"
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4 }}
                    className="flex-1 flex flex-col"
                >
                    <div className="mt-4 mb-auto">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-8 shadow-lg shadow-purple-500/20"
                        >
                            <div className="w-12 h-12 rounded-full border-[3px] border-white/20 flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full bg-white" />
                            </div>
                        </motion.div>

                        <h1 className="text-5xl font-bold mb-6 tracking-tight leading-[1.1]">
                            Hello,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Future Self.</span>
                        </h1>
                        
                        <Block className="mb-6" delay={0.2}>
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-purple-500/10 text-purple-400">
                                    <Sparkles size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-1">Restore</h3>
                                    <p className="text-white/60 leading-relaxed">
                                        A guided journey to rebuild your sense of smell through neuroplasticity.
                                    </p>
                                </div>
                            </div>
                        </Block>
                    </div>
                    
                    <Button 
                        onClick={nextStep}
                        className="w-full h-16 rounded-[2rem] bg-white text-black hover:bg-white/90 text-lg font-bold shadow-lg shadow-white/5 transition-all hover:scale-[1.02] active:scale-95"
                    >
                        Get Started
                    </Button>
                </motion.div>
            )}

            {step === 2 && (
                <motion.div
                    key="step2"
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4 }}
                    className="flex-1 flex flex-col"
                >
                    <h2 className="text-4xl font-bold mb-2">Daily<br/>Practice</h2>
                    <p className="text-white/50 text-lg mb-8">Reconnect nose and brain.</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {[
                            { name: "Clove", color: "bg-orange-500" },
                            { name: "Lemon", color: "bg-yellow-500" },
                            { name: "Eucalyptus", color: "bg-teal-500" },
                            { name: "Rose", color: "bg-pink-500" }
                        ].map((scent, i) => (
                            <motion.div 
                                key={scent.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-[#1A1A2E] aspect-square rounded-[2rem] p-5 flex flex-col justify-between border border-white/5 relative overflow-hidden group"
                            >
                                <div className={`absolute top-0 right-0 w-24 h-24 ${scent.color} opacity-10 rounded-bl-full transition-opacity group-hover:opacity-20`} />
                                <div className={`w-10 h-10 rounded-full ${scent.color} flex items-center justify-center text-black font-bold shadow-lg`}>
                                    {scent.name[0]}
                                </div>
                                <span className="text-lg font-medium">{scent.name}</span>
                            </motion.div>
                        ))}
                    </div>

                    <Block className="mt-auto mb-6 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/20">
                         <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">Format</div>
                                <div className="text-xl font-bold">2x Daily</div>
                            </div>
                            <div className="w-px h-10 bg-white/10" />
                            <div className="space-y-1">
                                <div className="text-xs font-bold text-pink-400 uppercase tracking-wider">Duration</div>
                                <div className="text-xl font-bold">20s / Scent</div>
                            </div>
                        </div>
                    </Block>

                    <Button 
                        onClick={nextStep}
                        className="w-full h-16 rounded-[2rem] bg-purple-600 text-white hover:bg-purple-500 text-lg font-bold shadow-lg shadow-purple-600/20"
                    >
                        Continue
                    </Button>
                </motion.div>
            )}

            {step === 3 && (
                <motion.div
                    key="step3"
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4 }}
                    className="flex-1 flex flex-col"
                >
                    <div className="mb-8">
                        <h2 className="text-4xl font-bold mb-2">Set Your<br/>Rhythm</h2>
                        <p className="text-white/50 text-lg">Consistency creates results.</p>
                    </div>

                    <Block className="mb-6 space-y-6">
                         <div className="flex items-center justify-between">
                            <span className="text-xl font-bold">Reminders</span>
                            <Switch checked={remindersEnabled} onCheckedChange={setRemindersEnabled} className="data-[state=checked]:bg-purple-500" />
                        </div>
                        
                        {remindersEnabled && (
                            <div className="grid gap-4 animate-in slide-in-from-top-2 fade-in">
                                <div className="bg-black/20 rounded-2xl p-4 flex items-center justify-between border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-yellow-500/10 rounded-xl text-yellow-500">
                                            <Clock size={20} />
                                        </div>
                                        <span className="font-medium text-white/80">Morning</span>
                                    </div>
                                    <input 
                                        type="time" 
                                        value={morningTime}
                                        onChange={(e) => setMorningTime(e.target.value)}
                                        className="bg-transparent text-right font-bold text-xl focus:outline-none text-white w-auto"
                                    />
                                </div>
                                
                                <div className="bg-black/20 rounded-2xl p-4 flex items-center justify-between border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500">
                                            <Clock size={20} />
                                        </div>
                                        <span className="font-medium text-white/80">Evening</span>
                                    </div>
                                    <input 
                                        type="time" 
                                        value={eveningTime}
                                        onChange={(e) => setEveningTime(e.target.value)}
                                        className="bg-transparent text-right font-bold text-xl focus:outline-none text-white w-auto"
                                    />
                                </div>
                            </div>
                        )}
                    </Block>
                    
                    <div className="mt-auto">
                         <Button 
                            onClick={nextStep}
                            className="w-full h-16 rounded-[2rem] bg-white text-black hover:bg-white/90 text-lg font-bold shadow-lg shadow-white/5"
                        >
                            Set Schedule
                        </Button>
                    </div>
                </motion.div>
            )}

            {step === 4 && (
                <motion.div
                    key="step4"
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4 }}
                    className="flex-1 flex flex-col"
                >
                    <h2 className="text-4xl font-bold mb-2">Your<br/>Collection</h2>
                    <p className="text-white/50 text-lg mb-8">Start with the classics.</p>

                    <div className="grid grid-cols-1 gap-3 mb-8">
                        {[
                            { name: "Classic Kit", items: "Clove, Lemon, Eucalyptus, Rose", active: true },
                            { name: "Custom Kit", items: "Create your own set", active: false },
                        ].map((kit, i) => (
                             <motion.div 
                                key={i}
                                className={`p-6 rounded-[2rem] border transition-all flex items-center justify-between ${kit.active ? 'bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-500/50' : 'bg-[#1A1A2E] border-white/5 opacity-50'}`}
                            >
                                <div>
                                    <h3 className="text-xl font-bold mb-1">{kit.name}</h3>
                                    <p className="text-sm text-white/60">{kit.items}</p>
                                </div>
                                {kit.active && (
                                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
                                        <Check size={16} strokeWidth={3} />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 mb-8">
                         {[
                            "bg-orange-500",
                            "bg-yellow-500",
                            "bg-teal-500",
                            "bg-pink-500"
                        ].map((color, i) => (
                            <div key={i} className={`aspect-square rounded-2xl ${color} opacity-80`} />
                        ))}
                    </div>

                    <div className="mt-auto">
                        <Button 
                            onClick={nextStep}
                            className="w-full h-16 rounded-[2rem] bg-purple-600 text-white hover:bg-purple-500 text-lg font-bold shadow-lg shadow-purple-600/20"
                        >
                            Confirm
                        </Button>
                    </div>
                </motion.div>
            )}

            {step === 5 && (
                <motion.div
                    key="step5"
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4 }}
                    className="flex-1 flex flex-col"
                >
                    <h2 className="text-4xl font-bold mb-6">Progress<br/>Takes Time</h2>
                    
                    <Block className="flex-1 mb-6 relative overflow-hidden flex flex-col">
                         <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
                         
                         <div className="relative z-10 flex-1 flex flex-col justify-between">
                             <div className="space-y-6">
                                <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                                        <Activity size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Track Intensity</h4>
                                        <p className="text-white/50 text-sm">Log strength & clarity daily</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 rounded-2xl bg-pink-500/20 flex items-center justify-center text-pink-400">
                                        <Zap size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Build Streak</h4>
                                        <p className="text-white/50 text-sm">Consistency is key</p>
                                    </div>
                                </div>
                             </div>

                             {/* Abstract Graph */}
                             <div className="h-32 w-full mt-8 relative">
                                 <div className="absolute bottom-0 left-0 right-0 h-full flex items-end gap-2 opacity-50">
                                     {[20, 40, 35, 50, 45, 60, 75, 70, 90].map((h, i) => (
                                         <div key={i} className="flex-1 bg-purple-500 rounded-t-md" style={{ height: `${h}%` }} />
                                     ))}
                                 </div>
                                 {/* Overlay Line */}
                                 <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                                     <path d="M0,120 Q40,100 80,80 T160,60 T240,40 T320,10" fill="none" stroke="#d946ef" strokeWidth="4" strokeLinecap="round" className="drop-shadow-[0_0_10px_rgba(217,70,239,0.5)]" />
                                     <circle cx="320" cy="10" r="6" fill="#d946ef" className="drop-shadow-[0_0_10px_rgba(217,70,239,0.8)]" />
                                     <rect x="280" y="-25" width="80" height="28" rx="8" fill="white" />
                                     <text x="320" y="-8" textAnchor="middle" fill="black" fontSize="12" fontWeight="bold">Goal</text>
                                 </svg>
                             </div>
                         </div>
                    </Block>

                    <Button 
                        onClick={nextStep}
                        className="w-full h-16 rounded-[2rem] bg-white text-black hover:bg-white/90 text-lg font-bold shadow-lg shadow-white/5"
                    >
                        Understood
                    </Button>
                </motion.div>
            )}

             {step === 6 && (
                <motion.div
                    key="step6"
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4 }}
                    className="flex-1 flex flex-col justify-center"
                >
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 shadow-[0_0_50px_rgba(168,85,247,0.4)] mb-8">
                            <Check size={48} className="text-white" strokeWidth={4} />
                        </div>
                        <h2 className="text-5xl font-bold mb-4">You are<br/>Ready.</h2>
                        <p className="text-white/50 text-xl">Let's begin your journey.</p>
                    </div>
                    
                    <div className="mt-auto w-full space-y-4">
                        <Button 
                            onClick={completeOnboarding}
                            className="w-full h-20 rounded-[2.5rem] bg-white text-black hover:bg-white/90 text-xl font-bold shadow-xl shadow-white/10 transition-transform hover:scale-[1.02]"
                        >
                            Start First Session
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}

