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

// Asset imports (will be replaced with generated ones)
import welcomeImg from '@assets/generated_images/dark_abstract_neon_breathing_illustration.png';
import clockImg from '@assets/generated_images/dark_abstract_neon_clock_illustration.png';
import journeyImg from '@assets/generated_images/dark_abstract_neon_journey_path_illustration.png';
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
    enter: { x: 100, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden font-sans">
       {/* Background Glows */}
       <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
       <div className="absolute bottom-[-20%] right-[-20%] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="flex-1 flex flex-col z-10 max-w-md mx-auto w-full p-6">
        <div className="flex justify-between items-center mb-8 pt-4">
            {step > 1 && (
                <Button variant="ghost" size="sm" onClick={() => setStep(s => s - 1)} className="text-muted-foreground hover:text-white">
                    Back
                </Button>
            )}
            <div className="flex gap-1 ml-auto">
                {[1,2,3,4,5,6].map(i => (
                    <div key={i} className={`h-1 rounded-full transition-all ${i === step ? 'w-6 bg-primary' : 'w-2 bg-white/10'}`} />
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
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col text-center items-center"
                >
                    <div className="w-64 h-64 mb-8 relative">
                        <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
                        <img src={welcomeImg} alt="Welcome" className="w-full h-full object-contain relative z-10 animate-in zoom-in duration-1000" />
                    </div>
                    
                    <h1 className="text-4xl font-heading font-bold mb-4 text-white">Welcome to Olfi</h1>
                    <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                        A gentle path to rebuilding your sense of smell.
                    </p>
                    
                    <Card className="bg-secondary/50 border-white/5 mb-8">
                        <CardContent className="p-4 text-sm text-white/80">
                            Olfi guides you through short daily scent sessions that support your smell recovery. Most people begin to notice gradual changes with consistent practice.
                        </CardContent>
                    </Card>

                    <div className="mt-auto w-full space-y-4">
                        <Button size="lg" className="w-full rounded-full h-14 text-lg bg-gradient-primary text-white shadow-lg shadow-primary/30" onClick={nextStep}>
                            Get Started
                        </Button>
                        <p className="text-xs text-muted-foreground">How Olfi Works</p>
                        <p className="text-xs font-medium text-primary pt-4">Small steps create meaningful progress.</p>
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
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col"
                >
                    <h2 className="text-3xl font-heading font-bold mb-6 text-white">Your daily practice</h2>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {[
                            { name: "Clove", img: cloveImg },
                            { name: "Lemon", img: lemonImg },
                            { name: "Eucalyptus", img: eucalyptusImg },
                            { name: "Rose", img: roseImg }
                        ].map((scent) => (
                            <div key={scent.name} className="bg-secondary rounded-2xl p-4 flex flex-col items-center gap-2 border border-white/5">
                                <div className="w-12 h-12 rounded-full overflow-hidden">
                                    <img src={scent.img} className="w-full h-full object-cover" alt={scent.name} />
                                </div>
                                <span className="text-sm font-medium text-white">{scent.name}</span>
                            </div>
                        ))}
                    </div>

                    <p className="text-muted-foreground mb-6">
                        You will smell four scents in short timed sessions. These simple routines help reconnect your nose and your brain.
                    </p>

                    <ul className="space-y-4 mb-8">
                        {[
                            "Twenty seconds per scent",
                            "Two sessions each day",
                            "Calm guidance from start to finish",
                            "Track progress over time"
                        ].map((point, i) => (
                            <li key={i} className="flex items-center gap-3 text-white/90">
                                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                    <Check size={14} />
                                </div>
                                {point}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-auto w-full">
                        <Button size="lg" className="w-full rounded-full h-14 text-lg bg-gradient-primary text-white" onClick={nextStep}>
                            Next
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
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col items-center"
                >
                     <div className="w-48 h-48 mb-6 relative">
                        <img src={clockImg} alt="Clock" className="w-full h-full object-contain" />
                    </div>

                    <h2 className="text-3xl font-heading font-bold mb-4 text-white text-center">Your daily rhythm</h2>
                    <p className="text-muted-foreground text-center mb-8">
                        Morning and evening reminders help you stay consistent. You can adjust your schedule at any time.
                    </p>

                    <div className="w-full space-y-6 bg-secondary/30 p-6 rounded-3xl border border-white/5">
                         <div className="flex items-center justify-between">
                            <Label className="text-white font-medium">Enable Reminders</Label>
                            <Switch checked={remindersEnabled} onCheckedChange={setRemindersEnabled} />
                        </div>
                        
                        {remindersEnabled && (
                            <>
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Morning</Label>
                                    <div className="relative">
                                        <Input 
                                            type="time" 
                                            value={morningTime} 
                                            onChange={(e) => setMorningTime(e.target.value)}
                                            className="bg-secondary border-white/10 text-white h-14 text-lg rounded-xl pl-10"
                                        />
                                        <Clock className="absolute left-3 top-4 text-primary h-5 w-5" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Evening</Label>
                                    <div className="relative">
                                        <Input 
                                            type="time" 
                                            value={eveningTime} 
                                            onChange={(e) => setEveningTime(e.target.value)}
                                            className="bg-secondary border-white/10 text-white h-14 text-lg rounded-xl pl-10"
                                        />
                                        <Clock className="absolute left-3 top-4 text-accent h-5 w-5" />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="mt-auto w-full pt-8">
                        <Button size="lg" className="w-full rounded-full h-14 text-lg bg-white text-background hover:bg-white/90" onClick={nextStep}>
                            Continue
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
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col"
                >
                    <h2 className="text-3xl font-heading font-bold mb-4 text-white">Customize your scents</h2>
                    <p className="text-muted-foreground mb-8">
                        Use the four classic scents or add your own familiar smells. Personal scents can help strengthen sensory pathways.
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {[
                            { name: "Clove", img: cloveImg, active: true },
                            { name: "Lemon", img: lemonImg, active: true },
                            { name: "Eucalyptus", img: eucalyptusImg, active: true },
                            { name: "Rose", img: roseImg, active: true },
                            { name: "Add Custom", icon: Plus, active: false },
                            { name: "Add Custom", icon: Plus, active: false }
                        ].map((item, i) => (
                            <div key={i} className={`aspect-square rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border transition-all ${item.active ? 'bg-secondary border-primary/50' : 'bg-secondary/30 border-dashed border-white/10 opacity-60'}`}>
                                {item.img ? (
                                    <div className="w-12 h-12 rounded-full overflow-hidden">
                                        <img src={item.img} className="w-full h-full object-cover" alt={item.name} />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                        <item.icon className="text-white" />
                                    </div>
                                )}
                                <span className="text-xs font-medium text-white">{item.name}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto w-full space-y-3">
                        <Button size="lg" className="w-full rounded-full h-14 text-lg bg-gradient-primary text-white" onClick={nextStep}>
                            Add My Scents
                        </Button>
                        <Button variant="ghost" className="w-full text-muted-foreground" onClick={nextStep}>
                            Skip for now
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
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col items-center text-center"
                >
                    <div className="w-full h-48 mb-8 relative rounded-2xl overflow-hidden">
                        <img src={journeyImg} alt="Journey" className="w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                    </div>

                    <h2 className="text-3xl font-heading font-bold mb-4 text-white">Recovery takes time</h2>
                    <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                        Most people recover gradually. Olfi provides tools that help you notice small improvements and understand your progress.
                    </p>

                    <div className="w-full bg-secondary/30 p-6 rounded-3xl border border-white/5 text-left space-y-4">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                <Activity size={20} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold">Track Symptoms</h4>
                                <p className="text-sm text-muted-foreground">Log changes in intensity and clarity.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0">
                                <Wind size={20} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold">Daily Training</h4>
                                <p className="text-sm text-muted-foreground">Build consistency with guided sessions.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto w-full pt-8">
                        <Button size="lg" className="w-full rounded-full h-14 text-lg bg-white text-background hover:bg-white/90" onClick={nextStep}>
                            Start My First Session
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
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col items-center justify-center text-center"
                >
                    <div className="w-32 h-32 rounded-full bg-gradient-primary flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(200,50,255,0.4)] animate-pulse">
                        <Check size={64} className="text-white" />
                    </div>

                    <h2 className="text-4xl font-heading font-bold mb-6 text-white">You are ready</h2>
                    <p className="text-muted-foreground text-xl mb-12 leading-relaxed max-w-xs mx-auto">
                        Stay consistent, trust the process, and let Olfi guide your restoration.
                    </p>
                    
                    <div className="w-full space-y-4">
                        <Button size="lg" className="w-full rounded-full h-16 text-xl bg-gradient-primary text-white shadow-lg shadow-primary/40" onClick={completeOnboarding}>
                            Begin Training
                        </Button>
                         <p className="text-sm text-muted-foreground">Your first session begins whenever you are ready.</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}
