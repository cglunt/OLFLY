import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowRight, Check, Clock, Wind, Activity, Plus } from "lucide-react";
import { getStoredData, saveStoredData } from "@/lib/data";

// New Modern Minimalist Assets
import logoImg from '@assets/generated_images/modern_minimalist_circular_logo_symbol_for_olfi.png';
import breathImg from '@assets/generated_images/abstract_minimal_breath_visualization.png';
import rhythmImg from '@assets/generated_images/abstract_minimal_daily_rhythm_visualization.png';
import collectionImg from '@assets/generated_images/abstract_minimal_scent_collection_visualization.png';
import journeyImg from '@assets/generated_images/abstract_minimal_recovery_journey_visualization.png';

// Scent Assets
import cloveImg from '@assets/generated_images/close-up_of_dried_cloves.png';
import lemonImg from '@assets/generated_images/close-up_of_fresh_lemon.png';
import eucalyptusImg from '@assets/generated_images/close-up_of_eucalyptus_leaves.png';
import roseImg from '@assets/generated_images/close-up_of_a_pink_rose.png';

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
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden font-sans">
       {/* Modern Abstract Background Elements */}
       <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
       <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex-1 flex flex-col z-10 max-w-md mx-auto w-full p-6">
        <div className="flex justify-between items-center mb-6 pt-2">
            {step > 1 ? (
                <Button variant="ghost" size="sm" onClick={() => setStep(s => s - 1)} className="text-muted-foreground hover:text-white -ml-2">
                    Back
                </Button>
            ) : <div />}
            <div className="flex gap-1.5">
                {[1,2,3,4,5,6].map(i => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-primary shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'w-2 bg-white/10'}`} />
                ))}
            </div>
        </div>

        <AnimatePresence mode="wait">
            {step === 1 && (
                <motion.div
                    key="step1"
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex-1 flex flex-col text-center items-center"
                >
                    <div className="w-40 h-40 mb-10 relative mt-8">
                        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                        <img src={logoImg} alt="Olfi Logo" className="w-full h-full object-contain relative z-10 drop-shadow-2xl" />
                    </div>
                    
                    <h1 className="text-5xl font-heading font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 tracking-tight">OLFI</h1>
                    <p className="text-muted-foreground text-xl mb-10 leading-relaxed max-w-xs mx-auto">
                        A gentle path to rebuilding your sense of smell.
                    </p>
                    
                    <div className="mt-auto w-full space-y-6">
                        <Button size="lg" className="w-full rounded-full h-16 text-lg bg-white text-black hover:bg-white/90 shadow-xl shadow-white/10 font-bold tracking-wide transition-transform active:scale-95" onClick={nextStep}>
                            Get Started
                        </Button>
                        <p className="text-sm font-medium text-white/40">Small steps create meaningful progress.</p>
                    </div>
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
                    <h2 className="text-3xl font-heading font-bold mb-2 text-white">Your daily practice</h2>
                    <p className="text-muted-foreground mb-8">Reconnect your nose and brain.</p>
                    
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent blur-xl" />
                        <div className="grid grid-cols-2 gap-4 relative z-10">
                            {[
                                { name: "Clove", img: cloveImg },
                                { name: "Lemon", img: lemonImg },
                                { name: "Eucalyptus", img: eucalyptusImg },
                                { name: "Rose", img: roseImg }
                            ].map((scent, i) => (
                                <motion.div 
                                    key={scent.name} 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white/5 backdrop-blur-sm rounded-3xl p-4 flex flex-col items-center gap-3 border border-white/10 hover:bg-white/10 transition-colors"
                                >
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg">
                                        <img src={scent.img} className="w-full h-full object-cover" alt={scent.name} />
                                    </div>
                                    <span className="text-sm font-medium text-white/90">{scent.name}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <ul className="space-y-4 mb-8 bg-secondary/30 p-6 rounded-3xl border border-white/5">
                        {[
                            "Twenty seconds per scent",
                            "Two sessions each day",
                            "Track progress over time"
                        ].map((point, i) => (
                            <li key={i} className="flex items-center gap-3 text-white/80">
                                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                    <Check size={14} strokeWidth={3} />
                                </div>
                                {point}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-auto w-full">
                        <Button size="lg" className="w-full rounded-full h-16 text-lg bg-gradient-primary text-white shadow-lg shadow-primary/25" onClick={nextStep}>
                            Continue
                        </Button>
                    </div>
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
                    className="flex-1 flex flex-col items-center"
                >
                     <div className="w-56 h-56 mb-8 relative">
                        <img src={rhythmImg} alt="Rhythm" className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]" />
                    </div>

                    <h2 className="text-3xl font-heading font-bold mb-4 text-white text-center">Daily rhythm</h2>
                    <p className="text-muted-foreground text-center mb-10 max-w-xs mx-auto">
                        Set reminders to build a consistent habit.
                    </p>

                    <div className="w-full space-y-6 bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/10">
                         <div className="flex items-center justify-between">
                            <Label className="text-white font-medium text-lg">Enable Reminders</Label>
                            <Switch checked={remindersEnabled} onCheckedChange={setRemindersEnabled} />
                        </div>
                        
                        {remindersEnabled && (
                            <div className="grid gap-4 pt-2 animate-in slide-in-from-top-2 fade-in">
                                <div className="space-y-2">
                                    <Label className="text-primary/80 text-xs uppercase tracking-widest font-bold pl-1">Morning</Label>
                                    <div className="relative group">
                                        <Input 
                                            type="time" 
                                            value={morningTime} 
                                            onChange={(e) => setMorningTime(e.target.value)}
                                            className="bg-black/20 border-white/10 text-white h-16 text-xl rounded-2xl pl-12 focus:border-primary/50 transition-colors"
                                        />
                                        <Clock className="absolute left-4 top-5 text-primary h-6 w-6 opacity-70 group-focus-within:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-accent/80 text-xs uppercase tracking-widest font-bold pl-1">Evening</Label>
                                    <div className="relative group">
                                        <Input 
                                            type="time" 
                                            value={eveningTime} 
                                            onChange={(e) => setEveningTime(e.target.value)}
                                            className="bg-black/20 border-white/10 text-white h-16 text-xl rounded-2xl pl-12 focus:border-accent/50 transition-colors"
                                        />
                                        <Clock className="absolute left-4 top-5 text-accent h-6 w-6 opacity-70 group-focus-within:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-auto w-full pt-8">
                        <Button size="lg" className="w-full rounded-full h-16 text-lg bg-white text-background hover:bg-white/90 shadow-xl" onClick={nextStep}>
                            Next Step
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
                    <div className="w-full h-40 mb-6 relative rounded-3xl overflow-hidden">
                        <img src={collectionImg} alt="Collection" className="w-full h-full object-cover opacity-80 mix-blend-screen" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
                    </div>

                    <h2 className="text-3xl font-heading font-bold mb-3 text-white">Your Scents</h2>
                    <p className="text-muted-foreground mb-8">
                        We'll start with the classics. You can add personal scents later.
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-8">
                        {[
                            { name: "Clove", img: cloveImg, active: true },
                            { name: "Lemon", img: lemonImg, active: true },
                            { name: "Eucalyptus", img: eucalyptusImg, active: true },
                            { name: "Rose", img: roseImg, active: true },
                            { name: "Custom", icon: Plus, active: false },
                            { name: "Custom", icon: Plus, active: false }
                        ].map((item, i) => (
                            <div key={i} className={`aspect-[4/3] rounded-2xl p-3 flex flex-col items-center justify-center gap-2 border transition-all ${item.active ? 'bg-white/10 border-white/10' : 'bg-white/5 border-dashed border-white/5 opacity-40'}`}>
                                {item.img ? (
                                    <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm">
                                        <img src={item.img} className="w-full h-full object-cover" alt={item.name} />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                        {item.icon && <item.icon className="text-white w-5 h-5" />}
                                    </div>
                                )}
                                <span className="text-xs font-medium text-white">{item.name}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto w-full space-y-3">
                        <Button size="lg" className="w-full rounded-full h-16 text-lg bg-gradient-primary text-white shadow-lg shadow-primary/20" onClick={nextStep}>
                            Confirm Collection
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
                    className="flex-1 flex flex-col items-center text-center"
                >
                    <div className="w-full h-64 mb-8 relative rounded-[2.5rem] overflow-hidden bg-black/20 border border-white/5">
                        <img src={journeyImg} alt="Journey" className="w-full h-full object-cover opacity-90" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
                             <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20 backdrop-blur-md">Insight</span>
                        </div>
                    </div>

                    <h2 className="text-3xl font-heading font-bold mb-4 text-white">Recovery takes time</h2>
                    <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                        Olfi helps you notice small improvements. Consistency is key.
                    </p>

                    <div className="mt-auto w-full pt-8">
                        <Button size="lg" className="w-full rounded-full h-16 text-lg bg-white text-background hover:bg-white/90 shadow-xl" onClick={nextStep}>
                            I'm Ready
                        </Button>
                    </div>
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
                    className="flex-1 flex flex-col items-center justify-center text-center"
                >
                    <div className="w-40 h-40 rounded-full bg-gradient-primary p-[2px] mb-8 shadow-[0_0_60px_rgba(168,85,247,0.5)] animate-pulse">
                         <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                            <div className="w-32 h-32 rounded-full bg-gradient-primary flex items-center justify-center">
                                <Check size={64} className="text-white drop-shadow-md" strokeWidth={3} />
                            </div>
                         </div>
                    </div>

                    <h2 className="text-4xl font-heading font-bold mb-6 text-white">You are all set</h2>
                    <p className="text-muted-foreground text-xl mb-12 leading-relaxed max-w-xs mx-auto">
                        Your first session begins whenever you are ready.
                    </p>
                    
                    <div className="w-full space-y-4">
                        <Button size="lg" className="w-full rounded-full h-16 text-xl bg-gradient-primary text-white shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform" onClick={completeOnboarding}>
                            Begin Training
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}

