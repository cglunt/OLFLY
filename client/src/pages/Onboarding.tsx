import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Clock, ArrowRight, HelpCircle } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { ALL_SCENTS } from "@/lib/data";

import topToddImg from '@assets/Top_Todd_1767067979878.png';
import lowerGinaImg from '@assets/Lower_Gina_1767067979877.png';
import lowerLiuImg from '@assets/Lower_Liu_1767067979878.png';

const QUIZ_QUESTIONS = [
  {
    question: "Do you have trouble smelling everyday things like food or flowers?",
    options: ["Yes, definitely", "Sometimes", "Not sure"],
  },
  {
    question: "Has your sense of smell changed after an illness or injury?",
    options: ["Yes", "I think so", "No, but I want to improve"],
  },
  {
    question: "Do scents sometimes smell different or strange to you?",
    options: ["Yes, things smell wrong", "Occasionally", "Not really"],
  },
];

export default function Onboarding() {
  const { user, updateUser } = useCurrentUser();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [morningTime, setMorningTime] = useState("08:00");
  const [eveningTime, setEveningTime] = useState("20:00");
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  const totalSteps = 6;
  const defaultScents = ALL_SCENTS.filter(s => s.isDefault);

  const nextStep = () => setStep(s => s + 1);
  
  const handleQuizAnswer = (answer: string) => {
    const newAnswers = [...quizAnswers, answer];
    setQuizAnswers(newAnswers);
    
    if (quizStep < QUIZ_QUESTIONS.length - 1) {
      setQuizStep(q => q + 1);
    } else {
      nextStep();
    }
  };
  
  const completeOnboarding = async () => {
    if (!user) return;
    
    updateUser({
      hasOnboarded: true,
      remindersEnabled: remindersEnabled,
      morningTime: morningTime,
      eveningTime: eveningTime,
    });
    
    setLocation("/");
  };

  const variants = {
    enter: { x: 20, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 }
  };

  const Block = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`bg-[#3b1645] rounded-[2rem] p-6 border border-white/5 shadow-xl ${className}`}
    >
        {children}
    </motion.div>
  );

  return (
    <div className="min-h-screen w-full bg-[#0c0c1d] text-white flex flex-col font-sans selection:bg-[#ac41c3]/30 relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#6d45d2]/10 via-[#0c0c1d] to-[#0c0c1d]" />
      </div>
      
      <div className="relative z-10 flex-1 flex flex-col max-w-md mx-auto w-full h-full min-h-screen p-4 md:p-6">
        <div className="flex justify-between items-center mb-6 md:mb-8 pt-2 md:pt-4 shrink-0">
             {step > 1 ? (
                <button onClick={() => setStep(s => s - 1)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <ArrowRight className="rotate-180 text-white/70" size={20} />
                </button>
            ) : <div className="w-10" />}
            
            <div className="flex gap-2">
                {Array.from({ length: totalSteps }).map((_, i) => (
                    <div key={i} className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${i + 1 === step ? 'w-6 md:w-8 bg-purple-500' : 'w-2 bg-white/10'}`} />
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
                    <div className="mt-2">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="w-80 h-80 md:w-96 md:h-96 mx-auto mb-4"
                        >
                            <img src={topToddImg} alt="Welcome" className="w-full h-full object-contain" />
                        </motion.div>

                        <h1 className="text-4xl md:text-5xl font-bold mb-4 md:mb-6 tracking-tight leading-[1.1] text-center">
                            Wake up your<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6d45d2] to-[#db2faa]">super sniffer.</span>
                        </h1>
                        
                        <div className="space-y-4 mb-6">
                             <p className="text-xl font-medium text-white/90">
                                Welcome to Olfly, your gentle guide for smell recovery.
                             </p>
                             <p className="text-white/60 leading-relaxed text-base md:text-lg">
                                You bring the nose. We bring the timers, the reminders, and the encouragement.
                             </p>
                        </div>
                        
                        <Button 
                            onClick={nextStep}
                            className="w-full h-14 md:h-16 rounded-[2rem] bg-white text-black hover:bg-white/90 text-base md:text-lg font-bold shadow-lg shadow-white/5 transition-all hover:scale-[1.02] active:scale-95"
                            data-testid="button-begin"
                        >
                            Let's begin
                        </Button>
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
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Quick check-in</h2>
                    <p className="text-white/70 text-lg leading-relaxed mb-6">
                        Let's understand where you're at with your sense of smell.
                    </p>
                    
                    <Block className="flex-1 flex flex-col justify-center mb-4">
                        <div className="flex justify-center mb-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#6d45d2] to-[#db2faa] flex items-center justify-center shadow-lg shadow-[#ac41c3]/30">
                                <HelpCircle size={28} className="text-white" />
                            </div>
                        </div>
                        <div className="text-center mb-6">
                            <span className="text-white/40 text-sm uppercase tracking-wider">Question {quizStep + 1} of {QUIZ_QUESTIONS.length}</span>
                        </div>
                        
                        <h3 className="text-xl md:text-2xl font-bold text-center mb-6 leading-tight">
                            {QUIZ_QUESTIONS[quizStep].question}
                        </h3>
                        
                        <div className="space-y-3">
                            {QUIZ_QUESTIONS[quizStep].options.map((option, i) => (
                                <motion.button
                                    key={option}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => handleQuizAnswer(option)}
                                    className="w-full p-4 rounded-xl bg-[#0c0c1d] border border-white/10 text-left text-white hover:border-[#ac41c3] hover:bg-[#ac41c3]/10 transition-all"
                                    data-testid={`quiz-option-${i}`}
                                >
                                    {option}
                                </motion.button>
                            ))}
                        </div>
                    </Block>
                    
                    <div className="text-center pb-4">
                        <p className="text-white/40 text-sm">Your answers help us personalize your experience</p>
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
                    className="flex-1 flex flex-col"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Smell training<br/>really works</h2>
                    
                    <div className="space-y-4 mb-6">
                         <p className="text-white/70 text-lg leading-relaxed">
                            Research shows daily scent training helps rebuild neural pathways for smell.
                         </p>
                         <p className="text-white/70 text-lg leading-relaxed">
                            Just 20 seconds per scent, twice a day. That's all it takes.
                         </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                        {defaultScents.map((scent, i) => (
                            <motion.div 
                                key={scent.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="aspect-square rounded-[1.5rem] md:rounded-[2rem] overflow-hidden relative group"
                            >
                                {scent.image && (
                                    <img 
                                        src={scent.image} 
                                        alt={scent.name}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <span className="text-base md:text-lg font-bold text-white">{scent.name}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <Block className="mb-6 bg-[#3b1645]">
                         <div className="text-center space-y-2">
                            <p className="text-lg font-bold text-white">"Twenty seconds per scent. You got this."</p>
                            <p className="text-sm text-white/40">Your nose is cheering for you already.</p>
                         </div>
                    </Block>

                    <div className="mt-auto pb-4 md:pb-0">
                        <Button 
                            onClick={nextStep}
                            className="w-full h-14 md:h-16 rounded-[2rem] bg-[#ac41c3] text-white hover:bg-[#9e3bb3] text-base md:text-lg font-bold shadow-lg shadow-[#ac41c3]/20"
                            data-testid="button-next-step3"
                        >
                            Next
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
                    className="flex-1 flex flex-col relative overflow-hidden"
                >
                    <motion.img 
                        src={lowerGinaImg} 
                        alt="" 
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 0.9 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="fixed bottom-0 right-0 w-[32rem] md:w-[40rem] object-contain z-0 pointer-events-none"
                    />
                    
                    <div className="mb-4 relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Pick your<br/>sniff schedule</h2>
                        <p className="text-white/70 text-lg leading-relaxed">
                            Choose when you want Olfly to remind you to train.
                        </p>
                    </div>

                    <Block className="mb-4 space-y-4 md:space-y-6 relative z-10">
                         <div className="flex items-center justify-between">
                            <span className="text-lg md:text-xl font-bold">Reminders</span>
                            <Switch checked={remindersEnabled} onCheckedChange={setRemindersEnabled} className="data-[state=checked]:bg-[#ac41c3]" />
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
                                        data-testid="input-morning-time"
                                    />
                                </div>
                                
                                <div className="bg-black/20 rounded-2xl p-3 md:p-4 flex items-center justify-between border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-[#ac41c3]/10 rounded-xl text-[#ac41c3]">
                                            <Clock size={18} className="md:w-5 md:h-5" />
                                        </div>
                                        <span className="font-medium text-white/80 text-sm md:text-base">Evening</span>
                                    </div>
                                    <input 
                                        type="time" 
                                        value={eveningTime}
                                        onChange={(e) => setEveningTime(e.target.value)}
                                        className="bg-transparent text-right font-bold text-lg md:text-xl focus:outline-none text-white w-auto"
                                        data-testid="input-evening-time"
                                    />
                                </div>
                            </div>
                        )}
                    </Block>

                    <div className="text-center mb-2 relative z-10">
                        <p className="text-white/60 italic">"Morning sniff or evening sniff. Or both."</p>
                    </div>
                    
                    <div className="flex-1" />
                    
                    <div className="pb-4 md:pb-0 relative z-10">
                         <Button 
                            onClick={nextStep}
                            className="w-full h-14 md:h-16 rounded-[2rem] bg-white text-black hover:bg-white/90 text-base md:text-lg font-bold shadow-lg shadow-white/5"
                            data-testid="button-next-step4"
                        >
                            Next
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
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Progress takes<br/>patience</h2>
                    
                    <div className="space-y-6 mb-8">
                         <p className="text-white/70 text-lg leading-relaxed">
                            Smell recovery can take weeks or months. That's completely normal.
                         </p>
                         <p className="text-white/70 text-lg leading-relaxed">
                            Olfly tracks your progress so you can see even small improvements.
                         </p>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
                        <motion.h3 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
                        >
                            "Slow progress<br/>is still progress."
                        </motion.h3>
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="text-white/50 text-lg mt-6"
                        >
                            Your brain is literally rewiring.
                        </motion.p>
                    </div>

                    <div className="pb-4 md:pb-0 mt-auto">
                        <Button 
                            onClick={nextStep}
                            className="w-full h-14 md:h-16 rounded-[2rem] bg-[#ac41c3] text-white hover:bg-[#9e3bb3] text-base md:text-lg font-bold shadow-lg shadow-[#ac41c3]/20"
                            data-testid="button-next-step5"
                        >
                            Almost done
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
                    className="flex-1 flex flex-col py-4 relative overflow-hidden"
                >
                    <motion.img 
                        src={lowerLiuImg} 
                        alt="" 
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 0.9 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="fixed bottom-0 right-0 w-72 md:w-96 object-contain z-0 pointer-events-none"
                    />
                    
                    <div className="text-center mb-6 relative z-10">
                        <div className="flex justify-center mb-6">
                            <Logo size="xl" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Your nose<br/>is ready.</h2>
                        <div className="space-y-3 max-w-xs mx-auto">
                            <p className="text-white/80 text-lg">
                                You've got this. Olfly is with you every day.
                            </p>
                            <p className="text-white/60 text-base">
                                Stay consistent. Stay patient. Sniff bravely.
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex-1" />
                    
                    <div className="w-full space-y-4 pb-4 md:pb-0 relative z-10">
                        <div className="text-center">
                            <p className="text-white font-bold text-lg mb-1">"Welcome to the Sniff Squad."</p>
                            <p className="text-white/40 text-sm">Let's begin the great smell comeback.</p>
                        </div>
                        
                        <Button 
                            onClick={completeOnboarding}
                            className="w-full h-16 md:h-20 rounded-[2.5rem] bg-white text-black hover:bg-white/90 text-lg md:text-xl font-bold shadow-xl shadow-white/10 transition-transform hover:scale-[1.02]"
                            data-testid="button-begin-training"
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
