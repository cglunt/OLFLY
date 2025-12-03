import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Check, Clock, Sparkles, Activity, Zap, ArrowRight } from "lucide-react";
import { getStoredData, saveStoredData } from "@/lib/data";

// App Logo
import appLogo from '@assets/Blue_Modern_Minimalist_Circle_Letter_O_Business_Consulting_Log_1764747163301.png';
import onboardingIllustration from '@assets/Blue_Modern_Minimalist_Circle_Letter_O_Business_Consulting_Log_1764747155862.png';

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
    <div className="min-h-screen w-full bg-[#0B0618] text-white flex flex-col font-sans selection:bg-purple-500/30 relative overflow-hidden">
      {/* Fix Option 3: Absolute Overlay for Background */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/10 via-[#0B0618] to-[#0B0618]" />
      </div>
      
      {/* Content Wrapper - Fix Option 2: Ensure parent containers do not shrink */}
      <div className="relative z-10 flex-1 flex flex-col max-w-md mx-auto w-full h-full min-h-screen p-4 md:p-6">
        {/* Header / Progress */}
        <div className="flex justify-between items-center mb-6 md:mb-8 pt-2 md:pt-4 shrink-0">
             {step > 1 ? (
                <button onClick={() => setStep(s => s - 1)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <ArrowRight className="rotate-180 text-white/70" size={20} />
                </button>
            ) : <div className="w-10" />}
            
            <div className="flex gap-2">
                {[1,2,3,4,5,6].map(i => (
                    <div key={i} className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${i === step ? 'w-6 md:w-8 bg-purple-500' : 'w-2 bg-white/10'}`} />
                ))}
            </div>
             <div className="w-10" /> 
        </div>

        <AnimatePresence mode="wait">
            {/* SCREEN 1: Welcome */}
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
                    <div className="mt-4 mb-8 md:mb-auto">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="w-64 h-64 md:w-72 md:h-72 mx-auto mb-8"
                        >
                            <img src={onboardingIllustration} alt="Olfly Illustration" className="w-full h-full object-contain" />
                        </motion.div>

                        <h1 className="text-4xl md:text-5xl font-bold mb-4 md:mb-6 tracking-tight leading-[1.1] text-center">
                            Wake up your<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">super sniffer.</span>
                        </h1>
                        
                        <div className="space-y-6">
                             <p className="text-xl font-medium text-white/90">
                                Welcome to Olfly, your gentle guide for smell recovery.
                             </p>
                             <p className="text-white/60 leading-relaxed text-base md:text-lg">
                                You bring the nose. We bring the timers, the reminders, and the encouragement. Together we will help your scent skills make their comeback tour.
                             </p>
                        </div>
                    </div>
                    
                    <div className="mt-auto pb-4 md:pb-0">
                        <Button 
                            onClick={nextStep}
                            className="w-full h-14 md:h-16 rounded-[2rem] bg-white text-black hover:bg-white/90 text-base md:text-lg font-bold shadow-lg shadow-white/5 transition-all hover:scale-[1.02] active:scale-95"
                        >
                            Let’s begin
                        </Button>
                    </div>
                </motion.div>
            )}

            {/* SCREEN 2: What You Will Do */}
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
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Your daily<br/>sniff training</h2>
                    
                    <div className="space-y-6 mb-8">
                         <p className="text-white/70 text-lg leading-relaxed">
                            Get ready to smell four scents like it is your new morning ritual.
                         </p>
                         <p className="text-white/70 text-lg leading-relaxed">
                            This is not about perfect sniffing. It is about consistent sniffing. Think of it as physical therapy for your nose.
                         </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
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
                                className="bg-[#1A1A2E] aspect-square rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-5 flex flex-col justify-between border border-white/5 relative overflow-hidden group"
                            >
                                <div className={`absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 ${scent.color} opacity-10 rounded-bl-full transition-opacity group-hover:opacity-20`} />
                                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${scent.color} flex items-center justify-center text-black font-bold shadow-lg text-sm md:text-base`}>
                                    {scent.name[0]}
                                </div>
                                <span className="text-base md:text-lg font-medium">{scent.name}</span>
                            </motion.div>
                        ))}
                    </div>

                    <Block className="mt-auto mb-6 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/20">
                         <div className="text-center space-y-2">
                            <p className="text-lg font-bold text-purple-300">“Twenty seconds per scent. You got this.”</p>
                            <p className="text-sm text-white/40">Your nose is cheering for you already.</p>
                         </div>
                    </Block>

                    <div className="pb-4 md:pb-0">
                        <Button 
                            onClick={nextStep}
                            className="w-full h-14 md:h-16 rounded-[2rem] bg-purple-600 text-white hover:bg-purple-500 text-base md:text-lg font-bold shadow-lg shadow-purple-600/20"
                        >
                            Next
                        </Button>
                    </div>
                </motion.div>
            )}

            {/* SCREEN 3: Set Your Training Times */}
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
                    <div className="mb-6 md:mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Pick your<br/>sniff schedule</h2>
                        <p className="text-white/70 text-lg leading-relaxed">
                            Choose the times when you want Olfly to gently tap you on the shoulder and say “Time to sniff things again.”
                        </p>
                    </div>

                    <Block className="mb-6 space-y-4 md:space-y-6">
                         <div className="flex items-center justify-between">
                            <span className="text-lg md:text-xl font-bold">Reminders</span>
                            <Switch checked={remindersEnabled} onCheckedChange={setRemindersEnabled} className="data-[state=checked]:bg-purple-500" />
                        </div>
                        
                        {remindersEnabled && (
                            <div className="grid gap-3 md:gap-4 animate-in slide-in-from-top-2 fade-in">
                                <div className="bg-black/20 rounded-2xl p-3 md:p-4 flex items-center justify-between border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-yellow-500/10 rounded-xl text-yellow-500">
                                            <Clock size={18} className="md:w-5 md:h-5" />
                                        </div>
                                        <span className="font-medium text-white/80 text-sm md:text-base">Morning</span>
                                    </div>
                                    <input 
                                        type="time" 
                                        value={morningTime}
                                        onChange={(e) => setMorningTime(e.target.value)}
                                        className="bg-transparent text-right font-bold text-lg md:text-xl focus:outline-none text-white w-auto"
                                    />
                                </div>
                                
                                <div className="bg-black/20 rounded-2xl p-3 md:p-4 flex items-center justify-between border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500">
                                            <Clock size={18} className="md:w-5 md:h-5" />
                                        </div>
                                        <span className="font-medium text-white/80 text-sm md:text-base">Evening</span>
                                    </div>
                                    <input 
                                        type="time" 
                                        value={eveningTime}
                                        onChange={(e) => setEveningTime(e.target.value)}
                                        className="bg-transparent text-right font-bold text-lg md:text-xl focus:outline-none text-white w-auto"
                                    />
                                </div>
                            </div>
                        )}
                    </Block>

                    <div className="mt-auto mb-6 text-center space-y-2">
                        <p className="text-white/60 italic">“Morning sniff or evening sniff. Or both. Your nose decides.”</p>
                    </div>
                    
                    <div className="pb-4 md:pb-0">
                         <Button 
                            onClick={nextStep}
                            className="w-full h-14 md:h-16 rounded-[2rem] bg-white text-black hover:bg-white/90 text-base md:text-lg font-bold shadow-lg shadow-white/5"
                        >
                            Next
                        </Button>
                    </div>
                </motion.div>
            )}

            {/* SCREEN 4: Build Your Scent Set */}
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
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Classic scents or<br/>your own favorites</h2>
                    
                    <div className="space-y-6 mb-8">
                         <p className="text-white/70 text-lg leading-relaxed">
                            Start with lemon, rose, clove, and eucalyptus. Or add your own familiar scents.
                         </p>
                         <p className="text-white/70 text-lg leading-relaxed">
                            Your shampoo, your lotion, your favorite candle. If it is safe to sniff, it can join the team.
                         </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 mb-6">
                        {[
                            { name: "Classic Kit", items: "Clove, Lemon, Eucalyptus, Rose", active: true },
                            { name: "Custom Kit", items: "Create your own set", active: false },
                        ].map((kit, i) => (
                             <motion.div 
                                key={i}
                                className={`p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border transition-all flex items-center justify-between ${kit.active ? 'bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-500/50' : 'bg-[#1A1A2E] border-white/5 opacity-50'}`}
                            >
                                <div>
                                    <h3 className="text-lg md:text-xl font-bold mb-1">{kit.name}</h3>
                                    <p className="text-xs md:text-sm text-white/60">{kit.items}</p>
                                </div>
                                {kit.active && (
                                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
                                        <Check size={14} className="md:w-4 md:h-4" strokeWidth={3} />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                    
                    <div className="mt-auto mb-6 bg-purple-500/10 rounded-2xl p-4 text-center border border-purple-500/20">
                        <p className="text-purple-300 font-bold">“Give your scents their moment to shine.”</p>
                    </div>

                    <div className="pb-4 md:pb-0">
                        <Button 
                            onClick={nextStep}
                            className="w-full h-14 md:h-16 rounded-[2rem] bg-purple-600 text-white hover:bg-purple-500 text-base md:text-lg font-bold shadow-lg shadow-purple-600/20"
                        >
                            Next
                        </Button>
                    </div>
                </motion.div>
            )}

            {/* SCREEN 5: Understand Your Journey */}
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
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Progress is not<br/>always obvious</h2>
                    
                    <div className="space-y-6 mb-8">
                         <p className="text-white/70 text-lg leading-relaxed">
                            Smell recovery can take time. That is normal.
                         </p>
                         <p className="text-white/70 text-lg leading-relaxed">
                            Olfly will help you spot small improvements, even the ones you might miss.
                         </p>
                    </div>
                    
                    <Block className="flex-1 mb-6 relative overflow-hidden flex flex-col min-h-[240px]">
                         <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
                         
                         <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center space-y-6">
                             <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                                <Activity size={32} className="text-white" />
                             </div>
                             <div>
                                 <h3 className="text-xl font-bold text-white mb-2">“Slow progress is still progress.”</h3>
                                 <p className="text-white/50 text-sm">Your brain is literally rewiring.<br/>How cool is that.</p>
                             </div>
                         </div>
                    </Block>

                    <div className="pb-4 md:pb-0">
                        <Button 
                            onClick={nextStep}
                            className="w-full h-14 md:h-16 rounded-[2rem] bg-white text-black hover:bg-white/90 text-base md:text-lg font-bold shadow-lg shadow-white/5"
                        >
                            Start my first session
                        </Button>
                    </div>
                </motion.div>
            )}

            {/* SCREEN 6: Final Encouragement */}
             {step === 6 && (
                <motion.div
                    key="step6"
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4 }}
                    className="flex-1 flex flex-col justify-center py-8"
                >
                    <div className="text-center mb-8 md:mb-12">
                        <div className="flex justify-center mb-8">
                            <img src={appLogo} alt="Olfly Logo" className="h-20 md:h-24 object-contain" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Your nose<br/>is ready.</h2>
                        <div className="space-y-4 max-w-xs mx-auto">
                            <p className="text-white/80 text-lg">
                                You have got this. Olfly is with you every day.
                            </p>
                            <p className="text-white/60 text-base">
                                Stay consistent. Stay patient. Sniff bravely.
                            </p>
                        </div>
                    </div>
                    
                    <div className="mt-auto w-full space-y-6 pb-4 md:pb-0">
                        <div className="text-center">
                            <p className="text-purple-400 font-bold text-lg mb-2">“Welcome to the Sniff Squad.”</p>
                            <p className="text-white/40 text-sm">Let’s begin the great smell comeback.</p>
                        </div>
                        
                        <Button 
                            onClick={completeOnboarding}
                            className="w-full h-16 md:h-20 rounded-[2.5rem] bg-white text-black hover:bg-white/90 text-lg md:text-xl font-bold shadow-xl shadow-white/10 transition-transform hover:scale-[1.02]"
                        >
                            Begin training
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}

