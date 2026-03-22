import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, ArrowRight, HelpCircle, FileText, Droplet, FlaskConical } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { useAuth } from "@/lib/useAuth";
import { ALL_SCENTS } from "@/lib/data";
import { useQueryClient } from "@tanstack/react-query";
import { playNotification } from "@/lib/sounds";

const TERMS_VERSION = "1.1";

import topToddImg from '@assets/Top_Todd@2x_1767069623167.png';
import topMiaImg from '@assets/Top_Mia@2x_1767069623167.png';
import lowerGinaImg from '@assets/Lower_Gina@2x_1767069623166.png';
import lowerLiuImg from '@assets/Lower_Liu@2x_1767069623166.png';
import scentPrepImg from '@assets/scent-preparation.png';
import restBoyImg from '@assets/rest-boy.png';
import restGirlImg from '@assets/rest-girl.png';

const QUIZ_QUESTIONS = [
  {
    question: "Do you have trouble smelling everyday things like food or flowers?",
    options: ["Yes, definitely", "Sometimes", "No, but I want to improve"],
  },
  {
    question: "Has your sense of smell changed after an illness or injury?",
    options: ["Yes", "I think so", "No, but I want to improve"],
  },
];

export default function Onboarding() {
  const { user: firebaseUser } = useAuth();
  const { user, updateUserAsync } = useCurrentUser(firebaseUser?.displayName || undefined);
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [illnessDate, setIllnessDate] = useState({ month: '', year: '' });
  const [showIllnessDateForm, setShowIllnessDateForm] = useState(false);
  const [morningTime, setMorningTime] = useState("08:00");
  const [eveningTime, setEveningTime] = useState("20:00");
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(() => {
    return localStorage.getItem("termsAccepted") === "true" && 
           localStorage.getItem("termsVersion") === TERMS_VERSION;
  });
  
  const queryKey = ["currentUser", firebaseUser?.displayName || undefined];

  const totalSteps = 6;
  const defaultScents = ALL_SCENTS.filter(s => s.isDefault);

  const nextStep = () => setStep(s => s + 1);
  
  const handleQuizAnswer = (answer: string) => {
    const newAnswers = [...quizAnswers, answer];
    setQuizAnswers(newAnswers);
    
    // Q2 (illness/injury) — if user says yes, capture onset date
    if (quizStep === 1 && (answer === "Yes" || answer === "I think so")) {
      setShowIllnessDateForm(true);
      return;
    }
    
    if (quizStep < QUIZ_QUESTIONS.length - 1) {
      setQuizStep(q => q + 1);
    } else {
      nextStep();
    }
  };

  const handleIllnessDateContinue = () => {
    if (illnessDate.month || illnessDate.year) {
      localStorage.setItem('olflyIllnessOnset', JSON.stringify(illnessDate));
    }
    setShowIllnessDateForm(false);
    if (quizStep < QUIZ_QUESTIONS.length - 1) {
      setQuizStep(q => q + 1);
    } else {
      nextStep();
    }
  };
  
  const completeOnboarding = async () => {
    if (!user) return;
    
    localStorage.setItem("termsAccepted", "true");
    localStorage.setItem("termsAcceptedAt", new Date().toISOString());
    localStorage.setItem("termsVersion", TERMS_VERSION);
    
    try {
      const updatedUser = await updateUserAsync({
        hasOnboarded: true,
        remindersEnabled: remindersEnabled,
        morningTime: morningTime,
        eveningTime: eveningTime,
      });
      
      queryClient.setQueryData(queryKey, updatedUser);
      playNotification(user?.soundEnabled !== false);
      setLocation("/launch");
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    }
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
      
      <div className="relative z-10 flex-1 flex flex-col max-w-md mx-auto w-full h-full min-h-screen px-6 py-4 md:px-8 md:py-6">
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
                    <div className="mt-8 md:mt-12">
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
                        {showIllnessDateForm ? (
                          <motion.div key="illness-date" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <div className="flex justify-center mb-4">
                              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#6d45d2] to-[#db2faa] flex items-center justify-center shadow-lg shadow-[#ac41c3]/30">
                                <Clock size={36} className="text-white" />
                              </div>
                            </div>
                            <h3 className="text-xl font-bold text-center mb-2 leading-tight">When did this happen?</h3>
                            <p className="text-white/60 text-sm text-center mb-6">Knowing when your smell changed helps us estimate how far along your recovery may be.</p>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                              <div>
                                <label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">Month</label>
                                <select
                                  value={illnessDate.month}
                                  onChange={e => setIllnessDate(d => ({ ...d, month: e.target.value }))}
                                  className="w-full bg-[#0c0c1d] border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-[#ac41c3] appearance-none"
                                >
                                  <option value="">Month</option>
                                  {['January','February','March','April','May','June','July','August','September','October','November','December'].map((m, i) => (
                                    <option key={m} value={String(i + 1)}>{m}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">Year</label>
                                <select
                                  value={illnessDate.year}
                                  onChange={e => setIllnessDate(d => ({ ...d, year: e.target.value }))}
                                  className="w-full bg-[#0c0c1d] border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-[#ac41c3] appearance-none"
                                >
                                  <option value="">Year</option>
                                  {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i).map(y => (
                                    <option key={y} value={String(y)}>{y}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <Button onClick={handleIllnessDateContinue} className="w-full h-12 rounded-2xl bg-[#ac41c3] text-white hover:bg-[#9e3bb3] font-bold mb-3">
                              Continue
                            </Button>
                            <button onClick={handleIllnessDateContinue} className="w-full text-center text-white/40 text-sm hover:text-white/60 transition-colors">
                              Skip this question
                            </button>
                          </motion.div>
                        ) : (
                          <>
                            <div className="flex justify-center mb-4">
                              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#6d45d2] to-[#db2faa] flex items-center justify-center shadow-lg shadow-[#ac41c3]/30">
                                <HelpCircle size={56} className="text-white" />
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
                          </>
                        )}
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
                    <h2 className="text-3xl md:text-4xl font-bold mb-3">Smell training<br/>really works</h2>

                    <p className="text-white/70 text-base leading-relaxed mb-4">
                        Research shows daily scent training rebuilds neural pathways. Just 20 seconds per scent, twice a day.
                    </p>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {defaultScents.map((scent, i) => (
                            <motion.div
                                key={scent.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="h-20 rounded-xl overflow-hidden relative"
                            >
                                {scent.image && (
                                    <img
                                        src={scent.image}
                                        alt={scent.name}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-2">
                                    <span className="text-sm font-bold text-white">{scent.name}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <Block className="mb-4 bg-[#3b1645]">
                        <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Each session</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-[#0c0c1d] rounded-xl p-2 text-center">
                            <p className="text-[#ac41c3] font-bold text-sm">Breathe</p>
                            <p className="text-white/50 text-xs">Calm in</p>
                          </div>
                          <div className="text-white/30">›</div>
                          <div className="flex-1 bg-[#0c0c1d] rounded-xl p-2 text-center">
                            <p className="text-[#ac41c3] font-bold text-sm">Smell</p>
                            <p className="text-white/50 text-xs">20 seconds</p>
                          </div>
                          <div className="text-white/30">›</div>
                          <div className="flex-1 bg-[#0c0c1d] rounded-xl p-2 text-center">
                            <p className="text-[#ac41c3] font-bold text-sm">Rest</p>
                            <p className="text-white/50 text-xs">Repeat</p>
                          </div>
                        </div>
                    </Block>

                    <Block className="mb-4">
                        <h3 className="font-bold text-white text-sm mb-3">Prepare your scents beforehand:</h3>
                        <div className="space-y-2">
                            {[
                                "Use small glass jars with lids.",
                                "Place a cotton ball inside each jar.",
                                "Add a few drops of essential oil.",
                                "Close the lid to keep the scent fresh.",
                            ].map((tip, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                    <div className="w-6 h-6 rounded-full bg-[#ac41c3]/20 text-[#ac41c3] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">{i + 1}</div>
                                    <p className="text-white/70 text-sm">{tip}</p>
                                </div>
                            ))}
                        </div>
                    </Block>

                    <div className="mt-auto space-y-3 pb-4 md:pb-0">
                        <Button
                            onClick={nextStep}
                            className="w-full h-14 md:h-16 rounded-[2rem] bg-[#ac41c3] text-white hover:bg-[#9e3bb3] text-base md:text-lg font-bold shadow-lg shadow-[#ac41c3]/20"
                            data-testid="button-scents-ready"
                        >
                            I'm ready
                        </Button>
                        <button
                            onClick={() => setLocation("/legal/safety")}
                            className="w-full text-center text-white/50 text-sm hover:text-white/70 transition-colors"
                        >
                            View safety tips
                        </button>
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
                    className="flex-1 flex flex-col py-4"
                >
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#6d45d2] to-[#db2faa] flex items-center justify-center">
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Quick note<br/>before you begin</h2>
                    
                    <Block className="mb-6">
                        <p className="text-white/80 text-base leading-relaxed">
                            Olfly provides educational and wellness support only. It does not provide medical advice, 
                            diagnosis, or treatment. If you have questions about symptoms or your health, talk with 
                            a qualified healthcare professional.
                        </p>
                    </Block>
                    
                    <div className="flex items-start gap-3 mb-6 px-2">
                        <Checkbox 
                            id="terms"
                            checked={termsAccepted}
                            onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                            className="mt-1 border-white/30 data-[state=checked]:bg-[#ac41c3] data-[state=checked]:border-[#ac41c3]"
                            data-testid="checkbox-terms"
                        />
                        <label htmlFor="terms" className="text-white/70 text-sm leading-relaxed cursor-pointer">
                            I understand Olfly is for educational and wellness support only and not medical advice.
                        </label>
                    </div>
                    
                    <div className="mt-auto space-y-3 pb-4 md:pb-0">
                        <Button 
                            onClick={nextStep}
                            disabled={!termsAccepted}
                            className="w-full h-14 md:h-16 rounded-[2rem] bg-[#ac41c3] text-white hover:bg-[#9e3bb3] text-base md:text-lg font-bold shadow-lg shadow-[#ac41c3]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            data-testid="button-agree-continue"
                        >
                            I agree and continue
                        </Button>
                        <button 
                            onClick={() => setLocation("/legal/terms")}
                            className="w-full text-center text-white/50 text-sm hover:text-white/70 transition-colors"
                            data-testid="link-view-terms"
                        >
                            View full terms
                        </button>
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
                        className="fixed bottom-0 right-0 w-[100vw] md:w-[50vw] object-contain z-0 pointer-events-none"
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
                        <div className="mt-6">
                            <p className="text-white font-bold text-lg mb-1">"Welcome to the Sniff Squad."</p>
                            <p className="text-white/40 text-sm">Let's begin the great smell comeback.</p>
                        </div>
                    </div>
                    
                    <div className="flex-1" />
                    
                    <div className="w-full pb-4 md:pb-0 relative z-10">
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
